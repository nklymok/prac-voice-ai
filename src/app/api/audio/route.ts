import { NextRequest, NextResponse } from "next/server";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const Bucket = process.env.AWS_BUCKET;
const s3 = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_MY_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET as string,
  },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("body:", body);
  const text = body.text as string;

  try {
    const voiceData = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
    const buffer = Buffer.from(await voiceData.arrayBuffer());
    const fileUrl = `output-${uuidv4()}.mp3`;
    await s3.send(new PutObjectCommand({ Bucket, Key: fileUrl, Body: buffer }));
    const awsPrefix =
      "https://voice-ai-bucket-prac-uni.s3.eu-central-1.amazonaws.com/";
    return NextResponse.json({ audioUrl: awsPrefix + fileUrl });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.error();
  }
}
