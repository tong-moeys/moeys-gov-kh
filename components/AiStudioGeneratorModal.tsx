'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Presentation,
  Play,
  HelpCircle,
  Loader2,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { SlideDeck, VideoReel, QuizQuestion } from '@/data/moeys-guidelines';

interface AiStudioGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomDeck: (deck: SlideDeck) => void;
  onAddCustomReel: (reel: VideoReel) => void;
  onAddCustomQuestions: (questions: QuizQuestion[]) => void;
  onNavigateToTab: (tab: string) => void;
}

export const AiStudioGeneratorModal: React.FC<AiStudioGeneratorModalProps> = ({
  isOpen,
  onClose,
  onAddCustomDeck,
  onAddCustomReel,
  onAddCustomQuestions,
  onNavigateToTab,
}) => {
  const [activeMode, setActiveMode] = useState<'slide' | 'reel' | 'quiz'>('slide');
  const [promptTopic, setPromptTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!promptTopic.trim()) return;
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const actionMap = {
      slide: 'generate_slide',
      reel: 'generate_reel',
      quiz: 'generate_quiz',
    };

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionMap[activeMode],
          topic: promptTopic,
        }),
      });

      const resData = await response.json();
      if (!resData.success) {
        throw new Error(resData.error || 'ការបង្កើតមិនបានជោគជ័យ');
      }

      const generated = resData.data;

      if (activeMode === 'slide' && generated?.slides) {
        const newDeck: SlideDeck = {
          id: `custom-deck-${Date.now()}`,
          titleKhmer: generated.title || promptTopic,
          subtitleKhmer: generated.subtitle || 'បទបង្ហាញបង្កើតដោយ AI',
          category: 'បទបង្ហាញបង្កើតថ្មី',
          coverImage: '/images/khmer_reading_desk.jpg',
          durationMin: 10,
          slides: generated.slides.map((s: any, idx: number) => ({
            id: Date.now() + idx,
            slideNumber: idx + 1,
            titleKhmer: s.titleKhmer || `ស្លាយទី ${idx + 1}`,
            summaryKhmer: s.summaryKhmer || '',
            bulletPoints: Array.isArray(s.bulletPoints) ? s.bulletPoints : [],
            speakerNotesKhmer: s.speakerNotesKhmer || '',
            tag: 'AI Generated',
          })),
        };
        onAddCustomDeck(newDeck);
        setSuccessMessage('បានបង្កើតស្លាយបទបង្ហាញថ្មីដោយជោគជ័យ!');
        setTimeout(() => {
          onClose();
          onNavigateToTab('slides');
        }, 1200);
      } else if (activeMode === 'reel' && generated?.scenes) {
        const newReel: VideoReel = {
          id: `custom-reel-${Date.now()}`,
          titleKhmer: generated.titleKhmer || promptTopic,
          taglineKhmer: generated.descriptionKhmer || 'វីដេអូខ្លីបង្កើតដោយ AI',
          topic: 'វីដេអូខ្លីថ្មី',
          thumbnail: '/images/khmer_education_hero.jpg',
          totalDurationSec: generated.targetDurationSeconds || 45,
          scenes: generated.scenes.map((sc: any, idx: number) => ({
            id: idx + 1,
            sceneTitleKhmer: sc.sceneTitleKhmer || `ឈុតទី ${idx + 1}`,
            narrationKhmer: sc.narrationKhmer || '',
            visualPrompt: sc.visualPrompt || '',
            keyTakeaway: sc.sceneTitleKhmer || '',
            durationSec: sc.durationSec || 8,
            bgGradient:
              idx % 3 === 0
                ? 'from-amber-600 via-orange-600 to-amber-700'
                : idx % 3 === 1
                ? 'from-blue-600 via-indigo-600 to-cyan-700'
                : 'from-emerald-600 via-teal-600 to-green-700',
            illustrationType: 'reading',
          })),
        };
        onAddCustomReel(newReel);
        setSuccessMessage('បានបង្កើតវីដេអូខ្លីថ្មីដោយជោគជ័យ!');
        setTimeout(() => {
          onClose();
          onNavigateToTab('reels');
        }, 1200);
      } else if (activeMode === 'quiz' && generated?.questions) {
        const newQuestions: QuizQuestion[] = generated.questions.map((q: any, idx: number) => ({
          id: Date.now() + idx,
          level: 'កម្រិត AI ពិសេស',
          questionKhmer: q.question || '',
          options: q.options || [],
          correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
          explanationKhmer: q.explanation || '',
          circularReference: 'បង្កើតថ្មីតាមសេចក្តីណែនាំ ២០២៦-២០២៧',
        }));
        onAddCustomQuestions(newQuestions);
        setSuccessMessage('បានបង្កើតសំណួរតេស្តថ្មីៗដោយជោគជ័យ!');
        setTimeout(() => {
          onClose();
          onNavigateToTab('quizzes');
        }, 1200);
      } else {
        setSuccessMessage('បានទទួលទិន្នន័យពី AI!');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'មានបញ្ហាក្នុងការបង្កើត');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleSuggestions = {
    slide: [
      'វិធីសាស្ត្របង្រៀនព្យញ្ជនៈ និងស្រៈផ្សំសម្រាប់កុមារថ្នាក់ទី១',
      'ការគ្រប់គ្រងហិរញ្ញវត្ថុសាលាបឋមសិក្សា SOF ២០២៦-២០២៧',
      'ការរៀបចំពិធីបើកបវេសនកាលថ្ងៃទី០១ ខែវិច្ឆិកា ឆ្នាំ២០២៦',
    ],
    reel: [
      'គន្លឹះ ៣ យ៉ាងជួយសិស្សចេះអានពាក្យពិបាកក្នុង ៤០ វិនាទី',
      'សារៈសំខាន់នៃការច្រៀងបទនគររាជ ៣ វគ្គក្នុង១ខែ',
      'របៀបបែងចែកសំរាមក្នុងយុទ្ធនាការសាលាស្អាតគ្មានសំរាម',
    ],
    quiz: [
      'សំណួរតេស្តលើការគ្រប់គ្រងបុគ្គលិក និងក្រមសីលធម៌វិជ្ជាជីវៈគ្រូ',
      'សំណួរតេស្តលើការធ្វើតេស្តស្ទង់ PLP និងការគណនាពិន្ទុ',
      'សំណួរតេស្តលើតួនាទីគណៈកម្មការ គ.គ.ថ.',
    ],
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ស្ទូឌីយោបង្កើតមាតិកា AI ភាសាខ្មែរ
              </h3>
              <p className="text-xs text-slate-500">
                បង្កើតបទបង្ហាញ វីដេអូខ្លីៗ ឬសំណួរតេស្តដោយស្វ័យប្រវត្តិ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Content Mode Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveMode('slide')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeMode === 'slide'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Presentation className="w-4 h-4 text-amber-600" />
              <span>បទបង្ហាញ</span>
            </button>
            <button
              onClick={() => setActiveMode('reel')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeMode === 'reel'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-4 h-4 text-rose-500" />
              <span>វីដេអូខ្លីៗ</span>
            </button>
            <button
              onClick={() => setActiveMode('quiz')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeMode === 'quiz'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>សំណួរតេស្ត</span>
            </button>
          </div>

          {/* Topic Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              ប្រធានបទដែលចង់បង្កើត៖
            </label>
            <textarea
              rows={3}
              value={promptTopic}
              onChange={(e) => setPromptTopic(e.target.value)}
              placeholder="សូមបញ្ជាក់ប្រធានបទលម្អិត..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
            />
          </div>

          {/* Sample Topic Suggestions */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500">គំនិតប្រធានបទគំរូ៖</div>
            <div className="flex flex-wrap gap-1.5">
              {sampleSuggestions[activeMode].map((sample, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setPromptTopic(sample)}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 transition-colors text-left"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Status Messages */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-900">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            បោះបង់
          </button>
          <button
            onClick={handleGenerate}
            disabled={isLoading || !promptTopic.trim()}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>កំពុងបង្កើតជាមួយ AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>ចាប់ផ្តើមបង្កើត</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
