import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ResumeAnalysis {
  strengthSummary: string;
  weaknessSummary: string;
  improvementSuggestions: string[];
  score: number;
  atsScore: number;
  extractedSkills: string[];
  missingSkills: string[];
}

export async function analyzeResume(resumeText: string, language: string = "English"): Promise<ResumeAnalysis> {
  const prompt = `Analyze the following resume text in ${language}. 
  Provide a detailed analysis including:
  1. Strength summary
  2. Weakness summary
  3. Specific improvement suggestions
  4. A resume score out of 100
  5. An ATS compatibility score out of 100
  6. Extracted skills
  7. Missing industry-relevant skills based on the profile
  
  Resume Text:
  ${resumeText}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          strengthSummary: { type: Type.STRING },
          weaknessSummary: { type: Type.STRING },
          improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          score: { type: Type.INTEGER },
          atsScore: { type: Type.INTEGER },
          extractedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["strengthSummary", "weaknessSummary", "improvementSuggestions", "score", "atsScore", "extractedSkills", "missingSkills"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function generateInterviewQuestions(resumeText: string, count: number, language: string = "English"): Promise<string[]> {
  const prompt = `Based on the following resume, generate ${count} professional interview questions in ${language}. 
  The questions should cover technical skills, projects, and experience mentioned.
  
  Resume Text:
  ${resumeText}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  return JSON.parse(response.text || "[]");
}

export async function getInterviewFeedback(questions: string[], answers: string[], language: string = "English"): Promise<{ feedback: string; score: number }> {
  const prompt = `Evaluate the following interview performance in ${language}. 
  Questions: ${JSON.stringify(questions)}
  Answers: ${JSON.stringify(answers)}
  
  Provide constructive feedback and a performance score out of 100.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feedback: { type: Type.STRING },
          score: { type: Type.INTEGER },
        },
        required: ["feedback", "score"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function getLearningRecommendations(resumeAnalysis: ResumeAnalysis, language: string = "English"): Promise<{ topics: string[]; certifications: string[]; projects: string[] }> {
  const prompt = `Based on this resume analysis, suggest learning paths in ${language}:
  Analysis: ${JSON.stringify(resumeAnalysis)}
  
  Provide:
  1. Technical topics to study
  2. Recommended certifications
  3. Project ideas to fill skill gaps`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topics: { type: Type.ARRAY, items: { type: Type.STRING } },
          certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
          projects: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["topics", "certifications", "projects"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
