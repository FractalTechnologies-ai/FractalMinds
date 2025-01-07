// services/gptService.js
const OpenAIApi = require("openai");
const fs = require("fs");

const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

async function queryGPT(conversationHistory, fileContents) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You have access to the following documents: ${fileContents}`,
      },
      ...conversationHistory, // Include the conversation history here
    ],
  });
  return response.choices[0].message.content;
}

module.exports = { queryGPT };
