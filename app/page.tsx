'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { SlidePresentation } from '@/components/SlidePresentation';
import { ShortVideoReels } from '@/components/ShortVideoReels';
import { InteractiveQuiz } from '@/components/InteractiveQuiz';
import { KhmerPracticeExercises } from '@/components/KhmerPracticeExercises';
import { GuidelinesReference } from '@/components/GuidelinesReference';
import { AiStudioGeneratorModal } from '@/components/AiStudioGeneratorModal';
import { SlideDeck, VideoReel, QuizQuestion } from '@/data/moeys-guidelines';
import {
  Presentation,
  Play,
  HelpCircle,
  FileCheck,
  BookOpen,
  Award,
  Sparkles
} from 'lucide-react';

import { testFirebaseConnection } from '@/lib/firebase';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('slides');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  // Custom user-generated state from AI
  const [customDecks, setCustomDecks] = useState<SlideDeck[]>([]);
  const [customReels, setCustomReels] = useState<VideoReel[]>([]);
  const [customQuestions, setCustomQuestions] = useState<QuizQuestion[]>([]);

  const handleAddCustomDeck = (deck: SlideDeck) => {
    setCustomDecks((prev) => [deck, ...prev]);
  };

  const handleAddCustomReel = (reel: VideoReel) => {
    setCustomReels((prev) => [reel, ...prev]);
  };

  const handleAddCustomQuestions = (questions: QuizQuestion[]) => {
    setCustomQuestions((prev) => [...questions, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Top Navigation */}
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAiGenerator={() => setIsAiModalOpen(true)}
        />

        {/* Hero Section */}
        <HeroBanner
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenAiGenerator={() => setIsAiModalOpen(true)}
        />

        {/* Main Content Workspace */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Main Module Tabs Header */}
          <div className="flex items-center justify-between border-b border-slate-200 mb-8 pb-1 overflow-x-auto">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('slides')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'slides'
                    ? 'border-amber-600 text-amber-700 bg-amber-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Presentation className="w-4 h-4 text-amber-600" />
                <span>១. បទបង្ហាញ (Slides)</span>
              </button>

              <button
                onClick={() => setActiveTab('reels')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'reels'
                    ? 'border-rose-600 text-rose-700 bg-rose-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>២. វីដេអូខ្លីៗ (Reels)</span>
              </button>

              <button
                onClick={() => setActiveTab('quizzes')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'quizzes'
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>៣. សំណួរតេស្ត (Quizzes)</span>
              </button>

              <button
                onClick={() => setActiveTab('exercises')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'exercises'
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>៤. លំហាត់អនុវត្ត (Exercises)</span>
              </button>

              <button
                onClick={() => setActiveTab('reference')}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'reference'
                    ? 'border-slate-800 text-slate-900 bg-slate-100 rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-slate-700" />
                <span>៥. បទដ្ឋានក្រសួង (Reference)</span>
              </button>
            </div>

            <button
              onClick={() => setIsAiModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>ស្ទូឌីយោ AI</span>
            </button>
          </div>

          {/* Active Tab Panel */}
          {activeTab === 'slides' && (
            <SlidePresentation
              customDecks={customDecks}
              onOpenAiGenerator={() => setIsAiModalOpen(true)}
            />
          )}

          {activeTab === 'reels' && (
            <ShortVideoReels
              customReels={customReels}
              onOpenAiGenerator={() => setIsAiModalOpen(true)}
            />
          )}

          {activeTab === 'quizzes' && (
            <InteractiveQuiz
              customQuestions={customQuestions}
              onOpenAiGenerator={() => setIsAiModalOpen(true)}
            />
          )}

          {activeTab === 'exercises' && (
            <KhmerPracticeExercises
              onOpenAiGenerator={() => setIsAiModalOpen(true)}
            />
          )}

          {activeTab === 'reference' && <GuidelinesReference />}
        </main>
      </div>

      {/* AI Generator Modal */}
      <AiStudioGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAddCustomDeck={handleAddCustomDeck}
        onAddCustomReel={handleAddCustomReel}
        onAddCustomQuestions={handleAddCustomQuestions}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              ក្រសួងអប់រំ យុវជន និងកីឡា (MOEYS)
            </span>
            <span aria-hidden="true">·</span>
            <span>សេចក្តីណែនាំលេខ ៤១៧ អយក.សណន (២០២៦-២០២៧)</span>
          </div>

          <div className="text-slate-400">
            វេទិកាឌីជីថលគាំទ្រការបង្រៀននិងរៀនភាសាខ្មែរ · សាលាបឋមសិក្សាគំរូ
          </div>
        </div>
      </footer>
    </div>
  );
}
