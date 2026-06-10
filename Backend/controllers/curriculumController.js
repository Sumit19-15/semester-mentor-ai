import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import Subject from "../models/subjectModel.js";
import Topic from "../models/topicModel.js";

const ai = new GoogleGenAI(); // It automatically uses process.env.GEMINI_API_KEY

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

    const response = await ai.models.generateContent({
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

    res
      .status(201)
      .json({
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

    const filePart = {
      inlineData: {
        data: fs.readFileSync(req.file.path).toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `Analyze this specific syllabus page. Extract a clean, chronological list of all the individual study topics or chapters required for this subject.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [filePart, prompt],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
            },
            required: ["title"],
          },
        },
      },
    });

    const topicsArray = JSON.parse(response.text);

    // Map the array to link directly to the Subject ID
    const topicsToSave = topicsArray.map((topic) => ({
      subject: subjectId,
      title: topic.title,
      completed: false, // Default tracking state
    }));

    const savedTopics = await Topic.insertMany(topicsToSave);
    fs.unlinkSync(req.file.path); // Clean up

    res
      .status(201)
      .json({
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
