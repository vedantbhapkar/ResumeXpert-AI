import React, { useState, useEffect } from 'react';
import { BookOpen, Award, Lightbulb, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { getLearningRecommendations, ResumeAnalysis } from '../services/geminiService';
import { motion } from 'motion/react';

interface LearningRecsProps {
  analysis: ResumeAnalysis | null;
}

export default function LearningRecs({ analysis }: LearningRecsProps) {
  const [recs, setRecs] = useState<{ topics: string[]; certifications: string[]; projects: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (analysis) {
      setLoading(true);
      getLearningRecommendations(analysis)
        .then(setRecs)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [analysis]);

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-6">
          <BookOpen size={40} />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Analysis Found</h2>
        <p className="text-slate-500 max-w-md">Please upload and analyze your resume first to get personalized learning recommendations.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500">AIRA is crafting your personalized learning path...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-indigo-600 p-10 rounded-3xl text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Your Personalized Learning Path</h2>
          <p className="text-indigo-100 max-w-2xl">Based on your resume analysis, we've identified key areas to help you stand out to recruiters and land your dream role.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Topics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
        >
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6">
            <Lightbulb size={24} />
          </div>
          <h3 className="text-xl font-bold mb-6">Topics to Study</h3>
          <ul className="space-y-4">
            {recs?.topics.map((topic, i) => (
              <li key={i} className="flex items-start gap-3 group">
                <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{topic}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Certifications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
        >
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-bold mb-6">Recommended Certs</h3>
          <div className="space-y-4">
            {recs?.certifications.map((cert, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all cursor-pointer group">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-bold group-hover:text-indigo-600 transition-colors">{cert}</p>
                  <ExternalLink size={14} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Project Ideas */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-6">Project Ideas</h3>
          <div className="space-y-4">
            {recs?.projects.map((proj, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-sm font-bold mb-1">{proj.split(':')[0]}</p>
                <p className="text-xs text-slate-500">{proj.split(':')[1] || 'Build a project to showcase your skills.'}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
