'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  FileText,
  Sparkles,
  CheckCircle2,
  Printer,
  Layers,
  Award,
  Share2
} from 'lucide-react';
import { SLIDE_DECKS, SlideDeck } from '@/data/moeys-guidelines';
import { ShareReportModal } from './ShareReportModal';

interface SlidePresentationProps {
  customDecks?: SlideDeck[];
  onOpenAiGenerator: () => void;
}

export const SlidePresentation: React.FC<SlidePresentationProps> = ({
  customDecks = [],
  onOpenAiGenerator,
}) => {
  const allDecks = [...SLIDE_DECKS, ...customDecks];
  const [selectedDeckId, setSelectedDeckId] = useState<string>(allDecks[0].id);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const activeDeck = allDecks.find((d) => d.id === selectedDeckId) || allDecks[0];
  const currentSlide = activeDeck.slides[currentSlideIndex] || activeDeck.slides[0];
  const totalSlides = activeDeck.slides.length;

  // Audio Speech synthesis for Khmer slide narration
  function stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }

  function handleSelectDeck(deckId: string) {
    setSelectedDeckId(deckId);
    setCurrentSlideIndex(0);
    stopSpeech();
  }

  function handleNextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      stopSpeech();
    }
  }

  function handlePrevSlide() {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      stopSpeech();
    }
  }

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : prev));
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  function handleToggleSpeech() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      stopSpeech();
    } else {
      const textToRead = `${currentSlide.titleKhmer}។ ${currentSlide.summaryKhmer}។ ${currentSlide.bulletPoints.join('។ ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.9;
      const voices = window.speechSynthesis.getVoices();
      const khmerVoice = voices.find((v) => v.lang.includes('km') || v.lang.includes('kh'));
      if (khmerVoice) utterance.voice = khmerVoice;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  }

  function handlePrintSummary() {
    window.print();
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 sm:p-8 flex flex-col justify-between overflow-y-auto' : ''}`}>
      {/* Deck Selector Strip (if not fullscreen) */}
      {!isFullscreen && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              កម្រងស្លាយបទបង្ហាញផ្លូវការ
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              បទបង្ហាញគរុកោសល្យ និងរដ្ឋបាលអប់រំ
            </h2>
          </div>

          {/* Interactive segmented deck selector */}
          <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 rounded-xl">
            {allDecks.map((deck) => (
              <button
                key={deck.id}
                onClick={() => handleSelectDeck(deck.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  selectedDeckId === deck.id
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {deck.titleKhmer.slice(0, 22)}...
              </button>
            ))}
            <button
              onClick={onOpenAiGenerator}
              className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-amber-700 hover:text-amber-800 rounded-lg hover:bg-amber-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>បង្កើតបន្ថែម</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Slide Stage Container */}
      <div
        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'bg-slate-900 text-white max-w-5xl mx-auto w-full shadow-2xl border border-slate-800'
            : 'bg-white text-slate-900 border border-slate-200/90 shadow-sm'
        }`}
      >
        {/* Slide Top Metadata Bar */}
        <div
          className={`flex items-center justify-between px-6 py-3.5 border-b text-xs ${
            isFullscreen ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            <span className="text-amber-600 font-bold">{activeDeck.titleKhmer}</span>
            <span aria-hidden="true">·</span>
            <span>{currentSlide.tag}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="tabular-nums font-semibold">
              ស្លាយ {currentSlideIndex + 1} នៃ {totalSlides}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleSpeech}
                title="អានជាសំឡេង (Audio Narration)"
                className={`p-1.5 rounded-md transition-colors ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-800'
                    : isFullscreen
                    ? 'hover:bg-slate-800 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                title="កំណត់សម្គាល់វាគ្មិន (Speaker Notes)"
                className={`p-1.5 rounded-md transition-colors ${
                  showSpeakerNotes
                    ? 'bg-amber-100 text-amber-800 font-semibold'
                    : isFullscreen
                    ? 'hover:bg-slate-800 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'ចាកចេញពីពេញអេក្រង់' : 'ពេញអេក្រង់ (Fullscreen)'}
                className={`p-1.5 rounded-md transition-colors ${
                  isFullscreen ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Slide Body Content */}
        <div className="p-6 sm:p-10 min-h-[380px] sm:min-h-[440px] flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="text-xs font-semibold text-amber-600 mb-1.5 tracking-wider uppercase">
                {currentSlide.tag || 'ចំណុចគន្លឹះ'}
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-snug">
                {currentSlide.titleKhmer}
              </h3>
            </div>

            {/* Summary Box */}
            <div
              className={`p-4 rounded-xl border leading-relaxed text-sm sm:text-base ${
                isFullscreen
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                  : 'bg-amber-50/70 border-amber-200/80 text-amber-950 font-medium'
              }`}
            >
              {currentSlide.summaryKhmer}
            </div>

            {/* Bullet points with checkmarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
              {currentSlide.bulletPoints.map((point, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                    isFullscreen
                      ? 'bg-slate-800/50 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                      : 'bg-slate-50/80 border-slate-200/80 text-slate-800 hover:bg-white hover:shadow-2xs'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base leading-relaxed">{point}</span>
                </div>
              ))}
            </div>

            {/* Optional Highlight Stat */}
            {currentSlide.highlightStat && (
              <div
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg border ${
                  isFullscreen
                    ? 'bg-slate-800 border-slate-700 text-amber-400'
                    : 'bg-slate-100 border-slate-200 text-slate-900'
                }`}
              >
                <Award className="w-5 h-5 text-amber-500" />
                <span className="text-base font-bold tabular-nums">
                  {currentSlide.highlightStat.value}
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  — {currentSlide.highlightStat.label}
                </span>
              </div>
            )}
          </div>

          {/* Speaker Notes Drawer (if opened) */}
          {showSpeakerNotes && (
            <div
              className={`mt-6 p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                isFullscreen
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="font-bold mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>កំណត់សម្គាល់សម្រាប់វាគ្មិន / គ្រូឧទ្ទេស៖</span>
              </div>
              <p>{currentSlide.speakerNotesKhmer}</p>
            </div>
          )}
        </div>

        {/* Slide Bottom Navigation Controls */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-t ${
            isFullscreen ? 'border-slate-800 bg-slate-950' : 'border-slate-100 bg-slate-50/60'
          }`}
        >
          <button
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentSlideIndex === 0
                ? 'opacity-40 cursor-not-allowed'
                : isFullscreen
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ត្រឡប់ក្រោយ</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {activeDeck.slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  stopSpeech();
                }}
                className={`h-2 transition-all rounded-full ${
                  idx === currentSlideIndex
                    ? 'w-6 bg-amber-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`ទៅកាន់ស្លាយទី ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNextSlide}
            disabled={currentSlideIndex === totalSlides - 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentSlideIndex === totalSlides - 1
                ? 'opacity-40 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
            }`}
          >
            <span>ស្លាយបន្ទាប់</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Drawer (when not fullscreen) */}
      {!isFullscreen && (
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-3">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>តារាងស្លាយទាំងអស់ក្នុងកម្រងនេះ ({totalSlides})</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1 text-amber-700 hover:text-amber-800 text-xs font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>ចែករំលែក (Gmail / Telegram)</span>
              </button>
              <button
                onClick={handlePrintSummary}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-medium"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>បោះពុម្ពសេចក្តីសង្ខេប</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeDeck.slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  stopSpeech();
                }}
                className={`p-3 text-left rounded-lg border text-xs transition-all ${
                  idx === currentSlideIndex
                    ? 'border-amber-600 bg-amber-50/70 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="block text-slate-400 font-bold mb-1">ស្លាយ {idx + 1}</span>
                <span className="block font-semibold text-slate-800 line-clamp-2">
                  {slide.titleKhmer}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        reportData={{
          title: activeDeck.titleKhmer,
          schoolName: 'សាលាបឋមសិក្សាគំរូ',
          summaryText: `បទបង្ហាញ៖ ${activeDeck.titleKhmer}\nប្រធានបទរង៖ ${activeDeck.subtitleKhmer}\n\nស្លាយទី ${currentSlideIndex + 1}៖ ${currentSlide.titleKhmer}\nសេចក្តីសង្ខេប៖ ${currentSlide.summaryKhmer}\n\n• ${currentSlide.bulletPoints.join('\n• ')}\n\nស្របតាមសេចក្តីណែនាំលេខ ៤១៧ អយក.សណន (២០២៦-២០២៧) ក្រសួងអប់រំ យុវជន និងកីឡា`,
        }}
      />
    </div>
  );
};
