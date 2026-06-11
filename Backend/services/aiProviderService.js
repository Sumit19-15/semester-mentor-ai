import OpenAI from "openai";

const providerDefaults = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    baseURL:
      process.env.GEMINI_OPENAI_BASE_URL ||
      "https://generativelanguage.googleapis.com/v1beta/openai/",
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  },
  custom: {
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env.AI_BASE_URL,
    model: process.env.AI_MODEL,
  },
};

const getProviderConfig = () => {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
  const defaults = providerDefaults[provider] || providerDefaults.custom;

  const apiKey = process.env.AI_API_KEY || defaults.apiKey;
  const baseURL = process.env.AI_BASE_URL || defaults.baseURL;
  const model = process.env.AI_MODEL || defaults.model;

  if (!apiKey) {
    throw new Error(
      "AI API key is missing. Set AI_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY.",
    );
  }

  if (!model) {
    throw new Error("AI model is missing. Set AI_MODEL or provider model env.");
  }

  return {
    provider,
    apiKey,
    baseURL,
    model,
  };
};

const parseJsonResponse = (content) => {
  if (!content) {
    throw new Error("AI returned an empty response.");
  }

  try {
    return JSON.parse(content);
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI response was not valid JSON.");
    }
    return JSON.parse(jsonMatch[0]);
  }
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableAiError = (error) => {
  const status = error.status || error.code;
  return [429, 500, 502, 503, 504].includes(status);
};

const createChatCompletionWithRetry = async (client, request, attempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await client.chat.completions.create(request);
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

export const generateStudyPlanWithAi = async ({
  systemPrompt,
  userPrompt,
}) => {
  const config = getProviderConfig();

  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
  });

  const request = {
    model: config.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  };

  let response;
  try {
    response = await createChatCompletionWithRetry(client, request);
  } catch (error) {
    const message = error.message || "";
    if (!message.includes("response_format")) {
      throw error;
    }

    const { response_format, ...fallbackRequest } = request;
    response = await createChatCompletionWithRetry(client, fallbackRequest);
  }

  const content = response.choices?.[0]?.message?.content;

  return {
    provider: config.provider,
    model: config.model,
    result: parseJsonResponse(content),
  };
};
