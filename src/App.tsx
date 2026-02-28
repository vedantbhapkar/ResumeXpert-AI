import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ResumeUpload from './components/ResumeUpload';
import InterviewSession from './components/InterviewSession';
import LearningRecs from './components/LearningRecs';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import { Page, User, ResumeAnalysis } from './types';
import { LogIn, UserPlus, ArrowRight, Loader2 } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Simple Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || email.split('@')[0] })
      });
      const userData = await res.json();
      setUser(userData);
      setCurrentPage('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'resume-analysis':
        return (
          <ResumeUpload 
            onAnalysisComplete={(analysis) => {
              setResumeAnalysis(analysis);
              // In a real app, we'd store the text too
              // For now, we'll just use the analysis to mock the interview
            }} 
          />
        );
      case 'interview':
        return <InterviewSession resumeText={resumeText || "Software Engineer with 5 years experience in React and Node.js."} />;
      case 'learning':
        return <LearningRecs analysis={resumeAnalysis} />;
      case 'profile':
        return <Profile user={user} />;
      case 'admin':
        return <AdminPanel />;
      case 'login':
        return (
          <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-10 shadow-2xl">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
                  <span className="text-white font-bold text-2xl">RX</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-slate-400">Join ResumeXpert AI today</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-5 py-4 bg-slate-800 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-5 py-4 bg-slate-800 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : (
                    <>
                      {authMode === 'login' ? 'Login' : 'Sign Up'}
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="text-sm text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <LandingPage onGetStarted={() => setCurrentPage('login')} />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage} 
      user={user}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}
