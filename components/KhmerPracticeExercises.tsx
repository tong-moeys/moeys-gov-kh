'use client';

import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Volume2,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';
import { PRACTICE_EXERCISES } from '@/data/moeys-guidelines';
import { MoralityRubricEvaluator } from './MoralityRubricEvaluator';

interface KhmerPracticeExercisesProps {
  onOpenAiGenerator: () => void;
}

export const KhmerPracticeExercises: React.FC<KhmerPracticeExercisesProps> = ({
  onOpenAiGenerator,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'comprehension' | 'cloze' | 'sentence_order' | 'rubric'>(
    'comprehension'
  );

  // Comprehension state
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<string | null>(null);

  // Cloze state
  const [clozeSelections, setClozeSelections] = useState<Record<number, string>>({});
  const [isClozeChecked, setIsClozeChecked] = useState<boolean>(false);

  // Sentence reorder state
  const [reorderAnswers, setReorderAnswers] = useState<Record<number, string[]>>({});
  const [reorderChecked, setReorderChecked] = useState<Record<number, boolean>>({});

  // Audio helper for Khmer pronunciation
  const speakKhmer = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const kmVoice = voices.find((v) => v.lang.includes('km') || v.lang.includes('kh'));
    if (kmVoice) utterance.voice = kmVoice;
    window.speechSynthesis.speak(utterance);
  };

  const toggleRevealAnswer = (idx: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Cloze check
  const handleSelectCloze = (exerciseIdx: number, word: string) => {
    if (isClozeChecked) return;
    setClozeSelections((prev) => ({ ...prev, [exerciseIdx]: word }));
  };

  const handleResetCloze = () => {
    setClozeSelections({});
    setIsClozeChecked(false);
  };

  // Sentence reorder logic
  const handleAddWordToSentence = (exId: number, word: string) => {
    const current = reorderAnswers[exId] || [];
    setReorderAnswers((prev) => ({
      ...prev,
      [exId]: [...current, word],
    }));
  };

  const handleRemoveWordFromSentence = (exId: number, wordIndex: number) => {
    const current = reorderAnswers[exId] || [];
    const updated = current.filter((_, idx) => idx !== wordIndex);
    setReorderAnswers((prev) => ({
      ...prev,
      [exId]: updated,
    }));
    setReorderChecked((prev) => ({ ...prev, [exId]: false }));
  };

  const handleCheckSentence = (exId: number) => {
    setReorderChecked((prev) => ({ ...prev, [exId]: true }));
  };

  const handleResetSentence = (exId: number) => {
    setReorderAnswers((prev) => ({ ...prev, [exId]: [] }));
    setReorderChecked((prev) => ({ ...prev, [exId]: false }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            លំហាត់អនុវត្តភាសាខ្មែរ
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            លំហាត់អំណាន វាក្យសព្ទ ល្បះ និងការអនុវត្តជាក់ស្តែង
          </h2>
        </div>

        <button
          onClick={onOpenAiGenerator}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>បង្កើតលំហាត់ថ្មីជាមួយ AI</span>
        </button>
      </div>

      {/* Sub-tab segmented bar */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveSubTab('comprehension')}
          className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            activeSubTab === 'comprehension'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ១. អំណាន និងស្វែងយល់ន័យ
        </button>
        <button
          onClick={() => setActiveSubTab('cloze')}
          className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            activeSubTab === 'cloze'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ២. បំពេញចន្លោះវាក្យសព្ទ
        </button>
        <button
          onClick={() => setActiveSubTab('sentence_order')}
          className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            activeSubTab === 'sentence_order'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ៣. រៀបចំលំដាប់ពាក្យក្នុងល្បះ
        </button>
        <button
          onClick={() => setActiveSubTab('rubric')}
          className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            activeSubTab === 'rubric'
              ? 'bg-white text-slate-900 font-semibold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ៤. កម្មវិធីវាយតម្លៃសីលធម៌ (ឧបសម្ព័ន្ធ៣)
        </button>
      </div>

      {/* 1. COMPREHENSION EXERCISE */}
      {activeSubTab === 'comprehension' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {PRACTICE_EXERCISES.comprehension.title}
              </h3>
              <button
                onClick={() => speakKhmer(PRACTICE_EXERCISES.comprehension.passage)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                title="ស្តាប់ការអានជាសំឡេង"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span>ស្តាប់ការអាន</span>
              </button>
            </div>

            {/* Passage Box with clean typography */}
            <div className="p-6 bg-slate-50/80 rounded-xl border border-slate-200 leading-loose text-base text-slate-800 font-medium">
              {PRACTICE_EXERCISES.comprehension.passage}
            </div>

            {/* Interactive Vocabulary Glossary */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>វាក្យសព្ទគន្លឹះក្នុងអត្ថបទ (ចុចលើពាក្យដើម្បីមើលន័យ និងស្តាប់សំឡេង)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRACTICE_EXERCISES.comprehension.glossary.map((item) => (
                  <button
                    key={item.word}
                    onClick={() => {
                      setActiveGlossaryTerm(
                        activeGlossaryTerm === item.word ? null : item.word
                      );
                      speakKhmer(item.word);
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                      activeGlossaryTerm === item.word
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                  >
                    <span>{item.word}</span>
                    <Volume2 className="w-3.5 h-3.5 opacity-70" />
                  </button>
                ))}
              </div>

              {/* Glossary meaning popup */}
              {activeGlossaryTerm && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs sm:text-sm text-amber-950 mt-2">
                  <span className="font-bold text-amber-900">
                    ពាក្យ «{activeGlossaryTerm}» ៖
                  </span>{' '}
                  {
                    PRACTICE_EXERCISES.comprehension.glossary.find(
                      (g) => g.word === activeGlossaryTerm
                    )?.meaning
                  }
                </div>
              )}
            </div>

            {/* Comprehension Questions */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="text-sm font-bold text-slate-900">
                សំណួរស្វែងយល់ន័យ៖
              </div>

              <div className="space-y-3">
                {PRACTICE_EXERCISES.comprehension.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm sm:text-base font-semibold text-slate-800">
                      <span>{q.q}</span>
                      <button
                        onClick={() => toggleRevealAnswer(idx)}
                        className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1 ml-2 shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{revealedAnswers[idx] ? 'លាក់ចម្លើយ' : 'បង្ហាញចម្លើយ'}</span>
                      </button>
                    </div>

                    {revealedAnswers[idx] && (
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                        <span className="font-bold">ចម្លើយគំរូ៖</span> {q.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CLOZE FILL-IN-THE-BLANKS EXERCISE */}
      {activeSubTab === 'cloze' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              លំហាត់បំពេញចន្លោះវាក្យសព្ទគន្លឹះ
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ជ្រើសរើសពាក្យត្រឹមត្រូវដើម្បីបំពេញចន្លោះក្នុងល្បះនីមួយៗឱ្យបានត្រឹមត្រូវតាមសេចក្តីណែនាំ
            </p>
          </div>

          <div className="space-y-5">
            {PRACTICE_EXERCISES.cloze.map((item, idx) => {
              const selectedWord = clozeSelections[idx];
              const isCorrect = selectedWord === item.missingWord;

              return (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="text-sm sm:text-base leading-loose font-medium text-slate-800">
                    <span className="font-mono text-slate-400 mr-1.5">{idx + 1}.</span>
                    <span>{item.sentenceBefore}</span>
                    <span
                      className={`inline-block px-3 py-0.5 mx-1.5 rounded-lg border font-bold min-w-[70px] text-center ${
                        selectedWord
                          ? isClozeChecked
                            ? isCorrect
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                              : 'bg-rose-100 border-rose-400 text-rose-900'
                            : 'bg-amber-100 border-amber-400 text-amber-900'
                          : 'bg-white border-dashed border-slate-400 text-slate-400'
                      }`}
                    >
                      {selectedWord || '__________'}
                    </span>
                    <span>{item.sentenceAfter}</span>
                  </div>

                  {/* Word Options */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSelectCloze(idx, option)}
                        disabled={isClozeChecked}
                        className={`px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
                          selectedWord === option
                            ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {isClozeChecked && (
                    <div
                      className={`text-xs p-2.5 rounded-lg font-medium flex items-center gap-1.5 ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>ត្រឹមត្រូវ!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>មិនទាន់ត្រឹមត្រូវទេ។ ចម្លើយត្រូវគឺ៖ «{item.missingWord}»</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={handleResetCloze}
              className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>កំណត់ឡើងវិញ</span>
            </button>

            <button
              onClick={() => setIsClozeChecked(true)}
              disabled={Object.keys(clozeSelections).length < PRACTICE_EXERCISES.cloze.length}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-xs"
            >
              ផ្ទៀងផ្ទាត់ចម្លើយ
            </button>
          </div>
        </div>
      )}

      {/* 3. SENTENCE REORDERING EXERCISE */}
      {activeSubTab === 'sentence_order' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              លំហាត់រៀបចំលំដាប់ពាក្យក្នុងល្បះ
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ចុចលើពាក្យដើម្បីរៀបចំឱ្យក្លាយជាល្បះពេញលេញនិងត្រឹមត្រូវតាមវេយ្យាករណ៍ខ្មែរ
            </p>
          </div>

          <div className="space-y-6">
            {PRACTICE_EXERCISES.sentenceOrder.map((item) => {
              const currentSentence = reorderAnswers[item.id] || [];
              const targetWords = item.targetSentence.split(' ');
              const remainingWords = item.jumbledWords.filter((w) => {
                const countInCurrent = currentSentence.filter((cw) => cw === w).length;
                const totalInJumbled = item.jumbledWords.filter((jw) => jw === w).length;
                return countInCurrent < totalInJumbled;
              });

              const isChecked = reorderChecked[item.id];
              const isCorrect = currentSentence.join(' ') === item.targetSentence;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4"
                >
                  <div className="text-xs font-bold text-slate-500">លំហាត់ទី {item.id}</div>

                  {/* Target construction box */}
                  <div className="p-4 bg-white rounded-xl border-2 border-dashed border-amber-200 min-h-[64px] flex flex-wrap items-center gap-2">
                    {currentSentence.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">
                        ចុចលើពាក្យខាងក្រោមដើម្បីបញ្ចូលក្នុងប្រអប់នេះ...
                      </span>
                    ) : (
                      currentSentence.map((word, wIdx) => (
                        <button
                          key={wIdx}
                          onClick={() => handleRemoveWordFromSentence(item.id, wIdx)}
                          className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1"
                          title="ចុចដើម្បីដកពាក្យនេះចេញ"
                        >
                          <span>{word}</span>
                          <span className="text-amber-500 text-xs font-bold">×</span>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Jumbled Words Pool */}
                  <div className="space-y-1.5">
                    <div className="text-xs text-slate-500 font-medium">ឃ្លាំងពាក្យ៖</div>
                    <div className="flex flex-wrap gap-2">
                      {remainingWords.map((word, wIdx) => (
                        <button
                          key={wIdx}
                          onClick={() => handleAddWordToSentence(item.id, word)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-amber-50 hover:border-amber-400 text-slate-800 text-xs sm:text-sm font-medium transition-all shadow-2xs"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons & Result */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleResetSentence(item.id)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>រៀបចំឡើងវិញ</span>
                    </button>

                    <button
                      onClick={() => handleCheckSentence(item.id)}
                      disabled={currentSentence.length !== item.jumbledWords.length}
                      className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
                    >
                      ផ្ទៀងផ្ទាត់
                    </button>
                  </div>

                  {isChecked && (
                    <div
                      className={`p-3 rounded-lg text-xs sm:text-sm font-medium flex items-start gap-2 ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                          : 'bg-rose-50 text-rose-950 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>អបអរសាទរ! ល្បះនេះត្រឹមត្រូវឥតខ្ចោះ៖ «{item.targetSentence}»</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <div>លំដាប់ពាក្យមិនទាន់ត្រូវទេ។</div>
                            <div className="mt-1 font-bold text-slate-800">
                              ល្បះត្រឹមត្រូវគឺ៖ «{item.targetSentence}»
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. RUBRIC EVALUATOR */}
      {activeSubTab === 'rubric' && <MoralityRubricEvaluator />}
    </div>
  );
};
