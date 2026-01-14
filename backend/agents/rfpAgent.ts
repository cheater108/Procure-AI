import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";
import * as z from "zod";

const model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.1,
});

const responseSchema = z.object({
  body: z.string(),
  description: z.string(),
})

const agent = createAgent({
  model,
  systemPrompt: `You are an ProcureAI agent, your task is to generate a RFP based on the given requirements. 
  User will give you information will you a prompt with information about the product to purchase, the quantity and budget they have.
  If they don't have a budget, you should assume the details. The generated RFP will be mailed to product vendors so the final output should contain body of the email and description of the RFP.
  The description should contain all the required details of RFP because it will be used to score and rate the responses of RFP and recommendation.`,
  responseFormat: responseSchema,
});

export default agent;
