import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { createAgent } from "langchain";

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.1,
});

const responseSchema = z.object({
  title: z.string().describe("Short 3-5 word title for the RFP"),
  subject: z.string().describe("Subject line for the email"),
  body: z.string().describe("The full email body to be sent to vendors"),
  description: z.string().describe("A technical summary of the requirements for internal tracking"),
});

const systemPrompt = `You are a ProcureAI agent. Your task is to generate an RFP based on the given requirements. 
  The user will provide information about the product, quantity, and budget.
  If they don't provide a budget, assume reasonable details. 
  The final output must contain a professional email body for vendors, a title, subject line, and a technical description for internal evaluation used later to rate vendor quotes.`;

const agent = createAgent({
  model,
  responseFormat:responseSchema,
  systemPrompt,
})

export const generateRfp = async (prompt: string) => {
  const response = await agent.invoke({
    messages: [{role: "user", content: prompt}]
  });
  return response.structuredResponse;
};
