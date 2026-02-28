export type Page = 'landing' | 'dashboard' | 'resume-analysis' | 'interview' | 'learning' | 'profile' | 'admin' | 'login';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface ResumeAnalysis {
  strengthSummary: string;
  weaknessSummary: string;
  improvementSuggestions: string[];
  score: number;
  atsScore: number;
  extractedSkills: string[];
  missingSkills: string[];
}

export interface LearningRecs {
  topics: string[];
  certifications: string[];
  projects: string[];
}
