import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileCheck, 
  Clock, 
  Award, 
  ArrowUpRight,
  Target,
  Zap,
  Mic,
  BookOpen
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'motion/react';

const data = [
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 72 },
  { name: 'Mar', score: 78 },
  { name: 'Apr', score: 85 },
  { name: 'May', score: 82 },
  { name: 'Jun', score: 90 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, resumes: 0, interviews: 0 });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const cards = [
    { label: 'Resume Score', value: '85/100', icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', trend: '+12%' },
    { label: 'Interview Avg', value: '78%', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', trend: '+5%' },
    { label: 'Skills Tracked', value: '24', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', trend: '+3' },
    { label: 'Interviews Done', value: '12', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', trend: 'Last 30 days' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Welcome back, Vedant!</h2>
          <p className="text-slate-500 dark:text-slate-400">Your career acceleration is on track. Keep it up!</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Award className="text-amber-500" size={20} />
          <span className="font-bold text-sm">Pro Member</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 group hover:border-indigo-500 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                {card.trend} <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Score Progression</h3>
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-bold px-3 py-2 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold mb-8">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { title: 'Resume Analyzed', time: '2 hours ago', desc: 'Software Engineer Role', icon: FileCheck, color: 'bg-indigo-100 text-indigo-600' },
              { title: 'Interview Completed', time: 'Yesterday', desc: 'Score: 82/100', icon: Mic, color: 'bg-emerald-100 text-emerald-600' },
              { title: 'New Skill Added', time: '3 days ago', desc: 'React Native', icon: Zap, color: 'bg-amber-100 text-amber-600' },
              { title: 'Learning Path Updated', time: '1 week ago', desc: 'System Design', icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <item.icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
