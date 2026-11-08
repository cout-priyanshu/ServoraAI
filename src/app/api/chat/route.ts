import connectDb from "@/src/lib/db";
import Settings from "@/src/model/settings.model";
import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Aapke account ke valid, active chat models (in order of speed):
const VALID_CHAT_MODELS = [
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
];

export async function POST(req: NextRequest) {
  try {
    const { message, ownerId } = await req.json();

    if (!message || !ownerId) {
      return NextResponse.json(
        { message: "message and ownerId are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    await connectDb();

    const setting = await Settings.findOne({ ownerId });
    if (!setting) {
      return NextResponse.json(
        { reply: "Chatbot setup nahi hua hai. Pehle dashboard me settings save karein." },
        { status: 200, headers: corsHeaders }
      );
    }

    const businessName = setting.businessName || "our store";
    const supportEmail = setting.supportEmail || "support@example.com";
    const knowledge = setting.knowledge || "General store assistance";

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "Server error: GROQ_API_KEY is missing in .env.local" },
        { status: 500, headers: corsHeaders }
      );
    }

    const groq = new Groq({ apiKey });

    const systemPrompt = `
You are a friendly, helpful customer support assistant for "${businessName}".

KNOWLEDGE BASE:
${knowledge}

RULES:
1. Greet the customer warmly if they say hi, hello, or greet you. Welcome them to ${businessName}, and ask how you can assist them.
2. Answer questions accurately based on the KNOWLEDGE BASE.
3. If an answer is not in the knowledge base, politely ask them to contact support at ${supportEmail}.
`;

    let reply = "";
    let lastError: any = null;

    // Active models me se chat complete karo
    for (const modelName of VALID_CHAT_MODELS) {
      try {
        console.log(`--> Trying Groq chat model: ${modelName}`);
        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          model: modelName,
          temperature: 0.3,
          max_tokens: 300,
        });

        const text = completion.choices[0]?.message?.content?.trim();
        if (text) {
          reply = text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed, trying next...`, err?.message || err);
        lastError = err;
      }
    }

    if (!reply) {
      throw lastError || new Error("Failed to generate response from all models");
    }

    return NextResponse.json(
      { reply },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("--> Chat API Error:", error?.message || error);
    return NextResponse.json(
      { reply: `Server Error: ${error?.message || "Unknown error"}` },
      { status: 500, headers: corsHeaders }
    );
  }
}