import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs/promises";

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
      data: (await fs.readFile(filePath)).toString("base64"),
      mimeType,
    },
  };

  // Step 1: OCR Extraction
  const extractionPrompt = "Extract and clean all the raw text from this syllabus document exactly as written, preserving structure, headings, and lists.";
  const extractionResponse = await generateContentWithRetry({
    model: "gemini-2.5-flash",
    contents: [filePart, extractionPrompt],
  });
  const extractedText = extractionResponse.text;

  const prompt = `
You are a university syllabus parser.

Extract MAJOR TOPICS (modules/units/sections), not individual concepts.

Return JSON in this format:

{
  "topics": [
    {
      "title": "string",
      "description": "string"
    }
  ]
}

RULES:

1. A topic is a major syllabus section or module.

2. If the syllabus contains section headings such as:

Introduction:
Decision Making & Looping:
Arrays & Strings:
Inheritance & Polymorphism:

then:

- title = heading
- description = all content under that heading

3. If there are NO explicit section headings and the syllabus is divided into blocks ending with:

[6 Lectures]
[8 Lectures]
[10 Lectures]

then EACH lecture block is ONE topic.

4. NEVER create separate topics from:
- semicolons
- commas
- lists of concepts
- algorithms
- examples

5. Everything before a lecture count belongs to the SAME topic.

Example:

Introduction; Intelligent Agents; Problem Formulation;
BFS; DFS; A*; Hill Climbing
[10 Lectures]

must become ONE topic.

6. For lecture-block syllabi:

- Generate a concise academic title (3-8 words).
- Put the complete syllabus block in description.
- Remove the lecture count from description.

7. Ignore:
- Course Code
- Course Name
- Credits
- L-T-P
- Prerequisites
- Course Syllabus labels
- [X Lectures]

8. The number of topics should approximately match the number of major modules/sections visible on the page.

Never create dozens of tiny topics from one module.

Return only valid JSON.
`;

  const response = await generateContentWithRetry({
    model: "gemini-2.5-flash",
    contents: [extractedText, prompt],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              required: ["title", "description"],
            },
          },
        },
        required: ["topics"],
      },
    },
  });

  const parsed = JSON.parse(response.text);

  return parsed.topics;
};
