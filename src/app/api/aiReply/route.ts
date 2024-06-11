import { NextRequest, NextResponse } from "next/server";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("body:", body);
  const newMessages = body.newMessages;

  try {
    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      ...newMessages,
    ] as ChatCompletionMessageParam[];
    console.log("messages:", messages);
    const data = await openai.chat.completions.create({
      messages,
      model: "gpt-4o",
    });
    const replyText = data.choices[0].message.content as string;

    return NextResponse.json({
      apiText: replyText,
    });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.error();
  }
}
