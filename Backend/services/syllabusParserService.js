import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({});

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

export const parseTopicsFromSyllabusFile = async ({ filePath, mimeType }) => {
  const filePart = {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType,
    },
  };

  const prompt =
    "Analyze this specific syllabus page. Extract a clean, chronological list of all the individual study topics or chapters required for this subject.";

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
            title: { type: Type.STRING },
          },
          required: ["title"],
        },
      },
    },
  });

  return JSON.parse(response.text);
};
