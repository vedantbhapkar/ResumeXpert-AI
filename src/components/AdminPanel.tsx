import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Mic, 
  Activity, 
  Search, 
  Filter, 
  MoreVertical,
  ArrowUp,
  ArrowDown,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminPanel() {
  const [stats, setStats] = useState({ users: 0, resumes: 0, interviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const metrics = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Resumes Analyzed', value: stats.resumes, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Interviews Conducted', value: stats.interviews, icon: Mic, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Avg. AI Usage', value: '8.4/user', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30">
          <Download size={18} /> Export Reports
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <div className={`w-12 h-12 rounded-xl ${m.bg} ${m.color} flex items-center justify-center mb-4`}>
              <m.icon size={24} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{m.label}</p>
            <p className="text-3xl font-bold mt-1">{loading ? '...' : m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* User Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold">User Management</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
              />
            </div>
            <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Last Activity</th>
                <th className="px-6 py-4">Usage</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {[
                { name: 'Vedant Bhapkar', email: 'vedant@example.com', status: 'Active', role: 'Admin', last: '2 mins ago', usage: 'High' },
                { name: 'Sarah Johnson', email: 'sarah@example.com', status: 'Active', role: 'User', last: '1 hour ago', usage: 'Medium' },
                { name: 'Michael Chen', email: 'michael@example.com', status: 'Inactive', role: 'User', last: '3 days ago', usage: 'Low' },
                { name: 'Emma Wilson', email: 'emma@example.com', status: 'Active', role: 'User', last: '12 mins ago', usage: 'High' },
                { name: 'Alex Rivera', email: 'alex@example.com', status: 'Active', role: 'User', last: '5 hours ago', usage: 'Medium' },
              ].map((user, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 text-xs font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{user.last}</td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${user.usage === 'High' ? 'bg-indigo-600 w-full' : user.usage === 'Medium' ? 'bg-amber-500 w-2/3' : 'bg-slate-400 w-1/3'}`}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Showing 5 of 1,240 users</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">Prev</button>
            <button className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
