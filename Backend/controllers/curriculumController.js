import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import Subject from "../models/subjectModel.js";
import Topic from "../models/topicModel.js";
import { parseTopicsFromSyllabusFile } from "../services/syllabusParserService.js";

const ai = new GoogleGenAI({}); // It automatically uses process.env.GEMINI_API_KEY

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableAiError = (error) =>
  [429, 500, 502, 503, 504].includes(error.status || error.code);

const generateContentWithRetry = async (request, attempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await ai.models.generateContent(request);
    } catch (error) {
      lastError = error;

      if (!isRetryableAiError(error) || attempt === attempts) {
        throw error;
      }

      await wait(750 * attempt);
    }
  }

  throw lastError;
};

// ==========================================
// FEATURE 1: Extract Subjects & Course Codes
// ==========================================
export const parseSubjectsFromCurriculum = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ message: "Please upload an index page image or PDF." });

    const filePart = {
      inlineData: {
        data: fs.readFileSync(req.file.path).toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `Analyze this curriculum index document. Extract a clean list of all the individual academic subjects or courses listed. Also extract their corresponding course codes if available.`;

    const response = await generateContentWithRetry({
      model: "gemini-2.5-flash",
      contents: [filePart, prompt],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              courseCode: { type: Type.STRING },
            },
            required: ["name"],
          },
        },
      },
    });

    const subjectsArray = JSON.parse(response.text);

    // Map the array to include the logged-in student's ID
    const subjectsToSave = subjectsArray.map((sub) => ({
      user: req.user._id,
      name: sub.name,
      courseCode: sub.courseCode || "",
    }));

    const savedSubjects = await Subject.insertMany(subjectsToSave);
    fs.unlinkSync(req.file.path); // Clean up the temp file

    res.status(201).json({
      message: `Added ${savedSubjects.length} subjects!`,
      subjects: savedSubjects,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res
      .status(500)
      .json({ message: "Subject parsing failed", error: error.message });
  }
};

// ==========================================
// FEATURE 2: Extract Topics for ONE Subject
// ==========================================
export const parseTopicsForSubject = async (req, res) => {
  try {
    const subjectId = req.params.subjectId; // We need to know WHICH subject these topics belong to
    if (!req.file)
      return res
        .status(400)
        .json({ message: "Please upload the syllabus page." });

    const topicsArray = await parseTopicsFromSyllabusFile({
      filePath: req.file.path,
      mimeType: req.file.mimetype,
    });

    // Map the array to link directly to the Subject ID
    const topicsToSave = topicsArray.map((topic) => ({
      user: req.user._id,
      subject: subjectId,
      title: topic.title,
      description: topic.description,
      completed: false, // Default tracking state
    }));

    const savedTopics = await Topic.insertMany(topicsToSave);
    fs.unlinkSync(req.file.path); // Clean up

    res.status(201).json({
      message: `Added ${savedTopics.length} topics!`,
      topics: savedTopics,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res
      .status(500)
      .json({ message: "Topic parsing failed", error: error.message });
  }
};
