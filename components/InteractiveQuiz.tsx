'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '@/data/moeys-guidelines';

interface InteractiveQuizProps {
  customQuestions?: QuizQuestion[];
  onOpenAiGenerator: () => void;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({
  customQuestions = [],
  onOpenAiGenerator,
}) => {
  const allQuestions = [...QUIZ_QUESTIONS, ...customQuestions];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const currentQ = allQuestions[currentIndex] || allQuestions[0];
  const selectedOption = selectedAnswers[currentQ.id];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: index }));
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === undefined) return;
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setIsAnswerSubmitted(false);
    setIsQuizCompleted(false);
  };

  // Calculate scores
  const totalQuestions = allQuestions.length;
  const correctCount = allQuestions.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;
  const percentageScore = Math.round((correctCount / totalQuestions) * 100);

  // Khmer grade
  let gradeKhmer = 'និទ្ទេស F';
  if (percentageScore >= 90) gradeKhmer = 'និទ្ទេស A (ល្អប្រសើរ)';
  else if (percentageScore >= 80) gradeKhmer = 'និទ្ទេស B (ល្អណាស់)';
  else if (percentageScore >= 70) gradeKhmer = 'និទ្ទេស C (ល្អ)';
  else if (percentageScore >= 60) gradeKhmer = 'និទ្ទេស D (មធ្យម)';
  else if (percentageScore >= 50) gradeKhmer = 'និទ្ទេស E (ខ្សោយ)';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            សំណួរតេស្តវាស់ស្ទង់ការយល់ដឹង
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            សំណួរតេស្តស្តីពីសេចក្តីណែនាំបឋមសិក្សា ២០២៦-២០២៧
          </h2>
        </div>

        <button
          onClick={onOpenAiGenerator}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>បង្កើតសំណួរតេស្តបន្ថែមជាមួយ AI</span>
        </button>
      </div>

      {!isQuizCompleted ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Quiz Top Status Bar */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-700">{currentQ.level}</span>
            </div>
            <div className="text-slate-500 font-semibold tabular-nums">
              សំណួរ {currentIndex + 1} នៃ {totalQuestions}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-slate-100 w-full overflow-hidden">
            <div
              className="h-full bg-amber-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question and Options Area */}
          <div className="p-6 sm:p-8 space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.questionKhmer}
            </h3>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = currentQ.correctIndex === idx;

                let optionStyle =
                  'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-800';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-rose-400 bg-rose-50 text-rose-950';
                  } else {
                    optionStyle = 'border-slate-200 opacity-60 text-slate-600';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-amber-600 bg-amber-50/70 text-amber-950 font-medium ring-1 ring-amber-600';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${optionStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isAnswerSubmitted && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isAnswerSubmitted && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm sm:text-base leading-relaxed flex-1">{option}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Box (appears after submit) */}
            {isAnswerSubmitted && (
              <div
                className={`p-4 rounded-xl border text-sm leading-relaxed ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {selectedOption === currentQ.correctIndex
                      ? 'ចម្លើយត្រឹមត្រូវ!'
                      : 'ចម្លើយត្រឹមត្រូវគឺ៖ ' +
                        String.fromCharCode(65 + currentQ.correctIndex)}
                  </span>
                  <span className="text-xs font-normal opacity-80">
                    ({currentQ.circularReference})
                  </span>
                </div>
                <p>{currentQ.explanationKhmer}</p>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handleRestartQuiz}
              className="text-xs sm:text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ចាប់ផ្តើមឡើងវិញ</span>
            </button>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === undefined}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-xs"
              >
                ពិនិត្យចម្លើយ
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs"
              >
                <span>
                  {currentIndex === totalQuestions - 1 ? 'មើលលទ្ធផលសរុប' : 'សំណួរបន្ទាប់'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Complete Screen */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              លទ្ធផលតេស្តវាស់ស្ទង់
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              សូមអបអរសាទរ! លោកអ្នកបានបញ្ចប់តេស្ត
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              ផ្អែកលើសេចក្តីណែនាំស្តីពីដំណើរការគ្រឹះស្ថានបឋមសិក្សាសាធារណៈ ២០២៦-២០២៧
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-4xl font-extrabold text-amber-600 tabular-nums">
              {percentageScore}%
            </div>
            <div className="text-sm font-semibold text-slate-700">
              ឆ្លើយត្រូវ {correctCount} នៃ {totalQuestions} សំណួរ
            </div>
            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold">
              {gradeKhmer}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ធ្វើតេស្តម្តងទៀត</span>
            </button>
            <button
              onClick={onOpenAiGenerator}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>សាកល្បងសំណួរថ្មីៗជាមួយ AI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
