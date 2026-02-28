import React from 'react';
import { User, Mail, Shield, Bell, Lock, Globe, CreditCard, ChevronRight } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType | null;
}

export default function Profile({ user }: ProfileProps) {
  const sections = [
    { title: 'Account Settings', items: [
      { label: 'Personal Information', icon: User, desc: 'Update your name and profile details' },
      { label: 'Email Preferences', icon: Mail, desc: 'Manage your notification settings' },
      { label: 'Security', icon: Lock, desc: 'Change password and 2FA settings' },
    ]},
    { title: 'Subscription', items: [
      { label: 'Billing & Plans', icon: CreditCard, desc: 'Current Plan: Pro (Annual)' },
    ]},
    { title: 'Preferences', items: [
      { label: 'Language', icon: Globe, desc: 'Default: English' },
      { label: 'Notifications', icon: Bell, desc: 'Push and Email active' },
    ]}
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-5xl font-bold border-4 border-white dark:border-slate-800 shadow-xl">
          {user?.name?.[0]}
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-bold mb-1">{user?.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-4">{user?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.role}
            </span>
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
              Verified Account
            </span>
          </div>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30">
          Edit Profile
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 gap-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h3 className="text-lg font-bold px-2">{section.title}</h3>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              {section.items.map((item, i) => (
                <button 
                  key={item.label}
                  className={`w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all ${i !== section.items.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
                      <item.icon size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/20 flex items-center justify-between">
        <div>
          <h4 className="text-red-600 dark:text-red-400 font-bold">Danger Zone</h4>
          <p className="text-xs text-red-500 mt-1">Permanently delete your account and all data.</p>
        </div>
        <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/30">
          Delete Account
        </button>
      </div>
    </div>
  );
}
