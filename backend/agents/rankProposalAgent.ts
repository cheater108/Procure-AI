import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { createAgent } from "langchain";

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.1,
});

const responseSchema = z.object({
  score: z.number().describe("Score out of 10"),
  suggestion: z.string().describe("Suggestion on whether to go forward or not"),
});

const systemPrompt = `You are a ProcureAI agent. Your task is to score a proposal based on the given requirements. 
  The user will provide information about the product, quantity, and budget. It will be a detailed description of the procurement requirements.
  Then the user will provide the proposal submitter by the vendor, also user might attach files of proposal if vendor sent them.
  You need to score the proposal submitter based on the requirements and give two things
   - score (out of 10)
   - suggestion (how good a proposal is whether to go forward or not).
  You can be as critical as possible while scoring the proposal.`;

const agent = createAgent({
  model,
  responseFormat:responseSchema,
  systemPrompt,
})

export const rankProposal = async (prompt: string) => {
  const response = await agent.invoke({
    messages: [{role: "user", content: prompt}]
  });
  return response.structuredResponse;
};
