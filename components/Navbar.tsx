'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { auth, signInWithGoogle, logOut } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiGenerator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiGenerator,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthAction = async () => {
    if (currentUser) {
      await logOut();
    } else {
      try {
        await signInWithGoogle();
      } catch (err) {
        console.error('Google Sign In error', err);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('slides')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <span className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-xs group-hover:bg-amber-700 transition-colors shrink-0">
            <BookOpen className="w-5 h-5" />
          </span>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            អប់រំបឋមសិក្សា ២០២៦-២០២៧
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('slides')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'slides'
                ? 'text-amber-700 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            បទបង្ហាញ
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'reels'
                ? 'text-amber-700 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            វីដេអូខ្លីៗ
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'quizzes'
                ? 'text-amber-700 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            សំណួរតេស្ត
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'exercises'
                ? 'text-amber-700 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            លំហាត់អនុវត្ត
          </button>
          <button
            onClick={() => setActiveTab('reference')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
              activeTab === 'reference'
                ? 'text-amber-700 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            បទដ្ឋានក្រសួង
          </button>
        </nav>

        {/* Zone 3: Actions (Google Auth + AI Generator) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Firebase Auth Button */}
          <button
            onClick={handleAuthAction}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border transition-all whitespace-nowrap shrink-0 ${
              currentUser
                ? 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800'
                : 'border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900'
            }`}
            title={currentUser ? 'ចុចដើម្បីចាកចេញ (Sign Out)' : 'ចូលគណនីជាមួយ Google'}
          >
            {currentUser ? (
              <>
                <UserIcon className="w-3.5 h-3.5 text-amber-700" />
                <span className="max-w-[100px] truncate">{currentUser.displayName || 'គណនី'}</span>
                <LogOut className="w-3 h-3 text-slate-500 ml-1" />
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-amber-700" />
                <span>ចូលគណនី</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenAiGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">បង្កើតជាមួយ AI</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-slate-50 px-2 py-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('slides')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'slides' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-600'
          }`}
        >
          បទបង្ហាញ
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'reels' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-600'
          }`}
        >
          វីដេអូខ្លីៗ
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'quizzes' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-600'
          }`}
        >
          សំណួរតេស្ត
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'exercises' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-600'
          }`}
        >
          លំហាត់
        </button>
        <button
          onClick={() => setActiveTab('reference')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'reference' ? 'bg-amber-100 text-amber-800 font-bold' : 'text-slate-600'
          }`}
        >
          បទដ្ឋាន
        </button>
      </div>
    </header>
  );
};
