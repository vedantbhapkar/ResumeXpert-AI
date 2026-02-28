import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Shield, 
  Zap, 
  Globe, 
  Mic, 
  FileText,
  Play
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex items-center justify-between bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-xl">RX</span>
          </div>
          <span className="font-bold text-2xl tracking-tight">ResumeXpert AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button 
          onClick={onGetStarted}
          className="px-6 py-2.5 bg-white text-slate-950 rounded-full font-bold text-sm hover:bg-slate-200 transition-all shadow-xl shadow-white/10"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
              AI-Powered Career Accelerator
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]">
              Optimize your resume. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Master your interview.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              ResumeXpert AI uses AIRA, our advanced recruitment assistant, to analyze your resume, optimize for ATS, and conduct realistic voice interviews.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                Start Free Analysis <ArrowRight size={20} />
              </button>
              <button className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg border border-white/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                <Play size={20} fill="currentColor" /> Watch Demo
              </button>
            </div>
          </motion.div>

          {/* App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-900/50 p-4 backdrop-blur-sm shadow-2xl">
              <img 
                src="https://picsum.photos/seed/dashboard/1200/800" 
                alt="App Dashboard" 
                className="rounded-2xl w-full border border-white/5"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-indigo-600/30 blur-3xl -z-10"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-8 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything you need to land the job</h2>
            <p className="text-slate-400 max-w-xl mx-auto">From the first upload to the final interview, AIRA is with you every step of the way.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'ATS Optimization', desc: 'Our AI scans your resume for keywords and formatting that pass through Applicant Tracking Systems.', icon: Shield },
              { title: 'Voice Interviews', desc: 'Practice with AIRA in real-time. Get feedback on your tone, content, and confidence.', icon: Mic },
              { title: 'Skill Gap Analysis', desc: 'Identify exactly what skills you are missing for your target roles and get learning paths.', icon: Zap },
              { title: 'Multi-Language', desc: 'Practice in English, Hindi, or Marathi. Perfect for global and local opportunities.', icon: Globe },
              { title: 'Smart Rewriting', desc: 'Let AI rewrite your bullet points to be more impactful and result-oriented.', icon: FileText },
              { title: 'Progress Tracking', desc: 'Watch your resume score and interview performance improve over time.', icon: Star },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/50 transition-all group">
                <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 bg-slate-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">RX</span>
            </div>
            <span className="font-bold text-xl">ResumeXpert AI</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
          <p className="text-sm text-slate-500">© 2026 ResumeXpert AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
