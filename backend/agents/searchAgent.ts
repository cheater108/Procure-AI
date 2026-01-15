import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { createAgent } from "langchain";

const model = new ChatOpenAI({
  model: "gpt-4o-search-preview",
});

const responseSchema = z.object({
  vendors: z.array(z.object({
    name: z.string().describe("Name of the vendor"),
    email: z.string().describe("Email of the vendor"),
    phone: z.string().describe("Phone number of the vendor"),
  })),
});

const systemPrompt = `You are a ProcureAI agent and has web search feature. Your task is to search the web for vendors for specific products.
  The user will give info about the product and quantity, find the best vendors for the product and return the list of vendors with thier name, email, and phone number.
  You can use web search to find the vendors. Limit the vendors to max 3 to 4 top vendors.
  .`;

const agent = createAgent({
  model,
  responseFormat:responseSchema,
  systemPrompt,
})

export const searchVendors = async (prompt: string) => {
  const response = await agent.invoke({
    messages: [{role: "user", content: prompt}]
  });
  return response.structuredResponse;
};
