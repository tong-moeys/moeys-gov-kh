'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Heart,
  Share2,
  Users
} from 'lucide-react';
import { VIDEO_REELS, VideoReel } from '@/data/moeys-guidelines';

interface ShortVideoReelsProps {
  customReels?: VideoReel[];
  onOpenAiGenerator: () => void;
}

export const ShortVideoReels: React.FC<ShortVideoReelsProps> = ({
  customReels = [],
  onOpenAiGenerator,
}) => {
  const allReels = [...VIDEO_REELS, ...customReels];
  const [selectedReelIndex, setSelectedReelIndex] = useState<number>(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [sceneProgress, setSceneProgress] = useState<number>(0); // 0 to 100%
  const [likesCount, setLikesCount] = useState<number>(142);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  const activeReel = allReels[selectedReelIndex] || allReels[0];
  const currentScene = activeReel.scenes[currentSceneIndex] || activeReel.scenes[0];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Play narration using Web Speech API if unmuted
  const speakCurrentScene = useCallback((text: string) => {
    if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95 * playbackSpeed;
    const voices = window.speechSynthesis.getVoices();
    const kmVoice = voices.find((v) => v.lang.includes('km') || v.lang.includes('kh'));
    if (kmVoice) utterance.voice = kmVoice;

    window.speechSynthesis.speak(utterance);
  }, [isMuted, playbackSpeed]);

  // Scene progression loop when isPlaying is true
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      stopAudio();
      return;
    }

    // Trigger audio narration on scene start
    speakCurrentScene(currentScene.narrationKhmer);

    const sceneDurationMs = (currentScene.durationSec * 1000) / playbackSpeed;
    const intervalMs = 50;
    const stepIncrement = (intervalMs / sceneDurationMs) * 100;

    timerRef.current = setInterval(() => {
      setSceneProgress((prev) => {
        if (prev >= 100) {
          // Advance to next scene or loop
          if (currentSceneIndex < activeReel.scenes.length - 1) {
            setCurrentSceneIndex((idx) => idx + 1);
            return 0;
          } else {
            // End of reel
            setIsPlaying(false);
            return 100;
          }
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    isPlaying,
    currentSceneIndex,
    selectedReelIndex,
    playbackSpeed,
    isMuted,
    currentScene.durationSec,
    currentScene.narrationKhmer,
    activeReel.scenes.length,
    speakCurrentScene,
    stopAudio,
  ]);

  const handleTogglePlay = () => {
    if (sceneProgress >= 100 && currentSceneIndex === activeReel.scenes.length - 1) {
      // Replay from start
      setCurrentSceneIndex(0);
      setSceneProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestartReel = () => {
    setCurrentSceneIndex(0);
    setSceneProgress(0);
    setIsPlaying(true);
  };

  const handleNextScene = () => {
    if (currentSceneIndex < activeReel.scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
      setSceneProgress(0);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
      setSceneProgress(0);
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Reel Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            វីដេអូខ្លីៗអប់រំ (Educational Micro-Reels)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            វីដេអូខ្លីៗស្វែងយល់ពីបទដ្ឋានអប់រំ និងការបង្រៀនភាសាខ្មែរ
          </h2>
        </div>

        <button
          onClick={onOpenAiGenerator}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>បង្កើតវីដេអូខ្លីថ្មីជាមួយ AI</span>
        </button>
      </div>

      {/* Main Reel Layout: Left Reel Deck, Right Player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Reel Selection List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            បញ្ជីវីដេអូខ្លីៗ ({allReels.length})
          </div>

          <div className="space-y-2.5">
            {allReels.map((reel, idx) => (
              <button
                key={reel.id}
                onClick={() => {
                  setSelectedReelIndex(idx);
                  setCurrentSceneIndex(0);
                  setSceneProgress(0);
                  setIsPlaying(false);
                  stopAudio();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                  selectedReelIndex === idx
                    ? 'border-amber-600 bg-amber-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="relative w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-900 block">
                  <Image
                    src={reel.thumbnail}
                    alt={reel.titleKhmer}
                    fill
                    className="object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white/80" />
                  </span>
                  <span className="absolute bottom-1 right-1 text-[10px] font-mono text-white/90 bg-black/60 px-1 rounded">
                    {reel.totalDurationSec}s
                  </span>
                </span>

                <span className="flex-1 min-w-0 block">
                  <span className="block text-xs font-semibold text-amber-700">{reel.topic}</span>
                  <span className="block text-sm font-bold text-slate-900 mt-0.5 line-clamp-1">
                    {reel.titleKhmer}
                  </span>
                  <span className="block text-xs text-slate-500 mt-1 line-clamp-2">
                    {reel.taglineKhmer}
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-1">
                    {reel.scenes.length} ឈុតសកម្មភាព
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Vertical 9:16 Video Canvas Stage */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-full max-w-[380px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-950 flex flex-col justify-between text-white p-4 select-none">
            {/* Top Scene Progress Bars (Instagram/TikTok style) */}
            <div className="z-20 space-y-2">
              <div className="flex items-center gap-1.5">
                {activeReel.scenes.map((scene, idx) => (
                  <div
                    key={scene.id}
                    className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{
                        width:
                          idx < currentSceneIndex
                            ? '100%'
                            : idx === currentSceneIndex
                            ? `${sceneProgress}%`
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Reel Title & Audio Indicator */}
              <div className="flex items-center justify-between text-xs text-white/90 pt-1">
                <span className="font-semibold line-clamp-1 pr-2">{activeReel.titleKhmer}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 rounded bg-black/40 hover:bg-black/60 text-white/90"
                    title={isMuted ? 'បើកសំឡេង' : 'បិទសំឡេង'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      const speeds = [0.75, 1, 1.25];
                      const nextSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                      setPlaybackSpeed(nextSpeed);
                    }}
                    className="px-1.5 py-0.5 rounded bg-black/40 hover:bg-black/60 text-[10px] font-mono"
                  >
                    {playbackSpeed}x
                  </button>
                </div>
              </div>
            </div>

            {/* Middle Animated Visual Stage */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${currentScene.bgGradient} transition-colors duration-700 flex flex-col justify-center items-center p-6 text-center`}
            >
              {/* Decorative Subtle Background Graphics */}
              <div className="absolute top-1/4 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />

              {/* Scene Dynamic Icon / Graphic */}
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mb-6 shadow-lg transform transition-transform duration-300 hover:scale-105">
                {currentScene.illustrationType === 'reading' && <BookOpen className="w-8 h-8" />}
                {currentScene.illustrationType === 'time' && <Clock className="w-8 h-8" />}
                {currentScene.illustrationType === 'morality' && <Heart className="w-8 h-8" />}
                {currentScene.illustrationType === 'slow_learners' && <Sparkles className="w-8 h-8" />}
                {currentScene.illustrationType === 'committee' && <Users className="w-8 h-8" />}
              </div>

              {/* Scene Title */}
              <div className="text-xs uppercase tracking-widest text-amber-200 font-bold mb-2">
                {currentScene.sceneTitleKhmer}
              </div>

              {/* Visual Card Prompt Illustration */}
              <div className="text-xs text-white/80 max-w-xs mb-6 italic leading-relaxed">
                «{currentScene.visualPrompt}»
              </div>

              {/* Key Takeaway Card */}
              <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3.5 max-w-xs shadow-xl">
                <div className="text-[11px] text-amber-300 font-semibold mb-0.5">សារគន្លឹះសំខាន់</div>
                <div className="text-sm font-bold text-white leading-snug">
                  {currentScene.keyTakeaway}
                </div>
              </div>
            </div>

            {/* Subtitles & Captions Zone (Karaoke style) */}
            <div className="z-20 space-y-3 pb-2">
              <div className="bg-black/75 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-left shadow-lg">
                <div className="text-[11px] text-amber-300 font-semibold mb-1 flex items-center justify-between">
                  <span>អត្ថបទអធិប្បាយ (Narration)</span>
                  <span className="font-mono text-white/60">
                    ឈុត {currentSceneIndex + 1}/{activeReel.scenes.length}
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-white">
                  {currentScene.narrationKhmer}
                </p>
              </div>

              {/* Bottom Reel Controller Buttons */}
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevScene}
                    disabled={currentSceneIndex === 0}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleTogglePlay}
                    className="w-10 h-10 rounded-full bg-white text-slate-950 flex items-center justify-center font-bold shadow-md hover:bg-amber-100 transition-all active:scale-95"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-slate-950" />
                    ) : (
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    )}
                  </button>
                  <button
                    onClick={handleNextScene}
                    disabled={currentSceneIndex === activeReel.scenes.length - 1}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRestartReel}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    title="ចាក់ឡើងវិញពីដើម"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-1 text-xs text-white/90 hover:text-white"
                  >
                    <Heart
                      className={`w-4 h-4 ${hasLiked ? 'text-rose-500 fill-rose-500' : ''}`}
                    />
                    <span className="font-mono">{likesCount}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                        alert('បានចម្លងតំណភ្ជាប់វីដេអូរួចរាល់!');
                      }
                    }}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                    title="ចែករំលែក"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
