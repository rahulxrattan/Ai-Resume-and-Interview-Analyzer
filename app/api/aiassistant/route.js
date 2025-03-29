// app/api/aiassistant/route.js (API route for handling requests)

import { NextResponse } from "next/server";
import { generateResponse } from "@/actions/aichatbot";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const response = await generateResponse(prompt);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}