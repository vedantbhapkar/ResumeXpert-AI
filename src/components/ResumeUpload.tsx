import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, ArrowRight, Zap } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { analyzeResume, ResumeAnalysis } from '../services/geminiService';
import { motion } from 'motion/react';
import { 
  RadialBarChart, 
  RadialBar, 
  Legend, 
  ResponsiveContainer,
  PolarAngleAxis
} from 'recharts';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface ResumeUploadProps {
  onAnalysisComplete: (analysis: ResumeAnalysis) => void;
}

export default function ResumeUpload({ onAnalysisComplete }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setError(null);
    setAnalysis(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPdf(file);
      } else {
        // For doc/docx, we'd ideally use a library like mammoth.js
        // For now, we'll just simulate or warn
        throw new Error("Only PDF files are supported for text extraction in this demo.");
      }

      const result = await analyzeResume(text);
      setAnalysis(result);
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenText, setRewrittenText] = useState<string | null>(null);

  const handleRewrite = async () => {
    if (!analysis) return;
    setIsRewriting(true);
    try {
      const ai = new (await import('@google/genai')).GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Rewrite the following resume bullet points to be more impactful, result-oriented, and professional. Use strong action verbs.
        
        Resume Content:
        ${analysis.strengthSummary}
        ${analysis.weaknessSummary}`,
      });
      setRewrittenText(response.text || "Failed to rewrite.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsRewriting(false);
    }
  };

  const scoreData = analysis ? [
    { name: 'Resume Score', value: analysis.score, fill: '#6366f1' },
    { name: 'ATS Score', value: analysis.atsScore, fill: '#10b981' }
  ] : [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold mb-6">Upload Your Resume</h2>
          <div 
            {...getRootProps()} 
            className={`
              border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
              ${isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400'}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Upload size={32} />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {file ? file.name : "Drag & drop your resume here"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Supports PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className={`
              w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
              ${!file || isAnalyzing 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'}
            `}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing with AIRA...
              </>
            ) : (
              <>
                Analyze Resume
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* Quick Stats / Info */}
        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
            <h3 className="text-xl font-bold mb-2">Why Analyze?</h3>
            <p className="text-indigo-100 mb-6">Our AI "AIRA" checks your resume against 50+ industry standards and ATS algorithms.</p>
            <ul className="space-y-3">
              {[
                "Identify missing high-impact keywords",
                "Get formatting & structure advice",
                "Benchmark against top industry roles",
                "Prepare for personalized interviews"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-indigo-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {analysis && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 h-[300px]">
              <h3 className="text-lg font-bold mb-4">Analysis Scores</h3>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="30%" 
                  outerRadius="100%" 
                  barSize={20} 
                  data={scoreData}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                  />
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Analysis Results */}
      {analysis && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">Strengths</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{analysis.strengthSummary}</p>
            
            <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Extracted Skills</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.extractedSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold mb-4 text-amber-600 dark:text-amber-400">Improvement Areas</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{analysis.weaknessSummary}</p>
            
            <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">Missing Skills</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {analysis.missingSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>

            <h3 className="text-lg font-bold mb-3">Suggestions</h3>
            <ul className="space-y-2 mb-8">
              {analysis.improvementSuggestions.map((sug, i) => (
                <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex gap-2">
                  <span className="text-indigo-500 font-bold">•</span>
                  {sug}
                </li>
              ))}
            </ul>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-amber-500" />
                AI Resume Rewriter
              </h3>
              <p className="text-xs text-slate-500 mb-4">Let AIRA rewrite your experience for maximum impact.</p>
              
              {rewrittenText ? (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  <p className="whitespace-pre-wrap">{rewrittenText}</p>
                  <button 
                    onClick={() => setRewrittenText(null)}
                    className="mt-4 text-indigo-600 font-bold text-xs hover:underline"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRewrite}
                  disabled={isRewriting}
                  className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  {isRewriting ? <Loader2 className="animate-spin" size={16} /> : 'Rewrite Bullet Points'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
