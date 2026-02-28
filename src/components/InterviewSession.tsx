import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Play, Square, Loader2, MessageSquare, Volume2, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateInterviewQuestions, getInterviewFeedback } from '../services/geminiService';
import { GoogleGenAI, Modality } from "@google/genai";

interface InterviewSessionProps {
  resumeText: string;
}

export default function InterviewSession({ resumeText }: InterviewSessionProps) {
  const [step, setStep] = useState<'setup' | 'interview' | 'feedback'>('setup');
  const [questionCount, setQuestionCount] = useState(5);
  const [language, setLanguage] = useState('English');
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ feedback: string; score: number } | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startInterview = async () => {
    setIsProcessing(true);
    try {
      const qs = await generateInterviewQuestions(resumeText, questionCount, language);
      setQuestions(qs);
      setStep('interview');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // In a real app, we'd send this to a STT service
        // For this demo, we'll simulate transcription or just ask the user to type if voice fails
        console.log("Audio captured", audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleNext = async () => {
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsProcessing(true);
      try {
        const result = await getInterviewFeedback(questions, newAnswers, language);
        setFeedback(result);
        setStep('feedback');
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const speakQuestion = async (text: string) => {
    // Using simple browser TTS for demo, but could use Gemini TTS for high quality
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'Hindi' ? 'hi-IN' : language === 'Marathi' ? 'mr-IN' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (step === 'setup') {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 text-center">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-6">
          <Mic size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Interview with AIRA</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          AIRA will conduct a personalized mock interview based on your resume.
        </p>

        <div className="space-y-6 text-left">
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Language</label>
            <div className="grid grid-cols-3 gap-3">
              {['English', 'Hindi', 'Marathi'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`py-3 rounded-xl border-2 transition-all ${language === lang ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number of Questions</label>
            <input 
              type="range" 
              min="3" 
              max="15" 
              value={questionCount} 
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>3 Questions</span>
              <span className="font-bold text-indigo-600">{questionCount} Questions</span>
              <span>15 Questions</span>
            </div>
          </div>
        </div>

        <button
          onClick={startInterview}
          disabled={isProcessing}
          className="w-full mt-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : 'Start Interview'}
        </button>
      </div>
    );
  }

  if (step === 'interview') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
            <div>
              <h3 className="font-bold">AIRA Assistant</h3>
              <p className="text-xs text-emerald-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Live Interview
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[300px] flex flex-col justify-between">
          <div>
            <div className="flex items-start gap-4 mb-8">
              <div className="mt-1 text-indigo-600"><Volume2 size={24} /></div>
              <h2 className="text-2xl font-medium leading-relaxed">
                {questions[currentQuestionIndex]}
              </h2>
            </div>
            <button 
              onClick={() => speakQuestion(questions[currentQuestionIndex])}
              className="text-indigo-600 text-sm font-medium flex items-center gap-2 hover:underline"
            >
              <Play size={16} /> Replay Audio
            </button>
          </div>

          <div className="mt-12">
            <div className="relative">
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer or use the microphone..."
                className="w-full p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px] resize-none"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  className={`p-4 rounded-full transition-all ${isRecording ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/30' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200'}`}
                >
                  {isRecording ? <Square size={20} /> : <Mic size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleNext}
            disabled={!currentAnswer && !isProcessing}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/30 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : currentQuestionIndex === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-6">
          <span className="text-4xl font-bold">{feedback?.score}</span>
        </div>
        <h2 className="text-3xl font-bold mb-2">Interview Performance</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Great job! Here is your feedback from AIRA.</p>
        
        <div className="text-left bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <MessageSquare size={20} className="text-indigo-600" />
            Detailed Feedback
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {feedback?.feedback}
          </p>
        </div>

        <button
          onClick={() => setStep('setup')}
          className="mt-10 px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all"
        >
          Retake Interview
        </button>
      </div>
    </div>
  );
}
