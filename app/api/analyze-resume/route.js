// app/api/analyze-resume/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  const { resumeText, jobDescription } = await request.json();
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this resume for Applicant Tracking System (ATS) compatibility with the given job description...`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response
    const scoreMatch = text.match(/SCORE:\s*(\d+)/);
    const strengthsMatch = text.match(/STRENGTHS:\s*([\s\S]*?)(?=AREAS FOR IMPROVEMENT:|$)/);
    const improvementsMatch = text.match(/AREAS FOR IMPROVEMENT:\s*([\s\S]*?)(?=KEYWORD MATCHING:|$)/);
    const keywordMatch = text.match(/KEYWORD MATCHING:\s*([\s\S]*)/);

    if (scoreMatch && strengthsMatch && improvementsMatch && keywordMatch) {
      return Response.json({
        score: parseInt(scoreMatch[1]),
        strengths: strengthsMatch[1].trim(),
        improvements: improvementsMatch[1].trim(),
        keywordMatch: keywordMatch[1].trim()
      });
    } else {
      throw new Error('Unexpected response format from API');
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}