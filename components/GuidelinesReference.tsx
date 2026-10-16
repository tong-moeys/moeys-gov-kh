'use client';

import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Users,
  Award,
  Sparkles,
  Send,
  Loader2
} from 'lucide-react';
import { MOEYS_SUMMARY } from '@/data/moeys-guidelines';

export const GuidelinesReference: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [askAiQuery, setAskAiQuery] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const handleAskAi = async () => {
    if (!askAiQuery.trim()) return;
    setIsLoadingAi(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explain_term',
          prompt: askAiQuery,
        }),
      });
      const data = await res.json();
      if (data.success && data.text) {
        setAiAnswer(data.text);
      } else {
        setAiAnswer('សូមអភ័យទោស ប្រព័ន្ធកំពុងដំណើរការ សូមសាកល្បងម្តងទៀត។');
      }
    } catch {
      setAiAnswer('មានបញ្ហាក្នុងការភ្ជាប់ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត។');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            បណ្ណសារឯកសារផ្លូវការ
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            សេចក្តីណែនាំលេខ ៤១៧ អយក.សណន (២០២៦-២០២៧)
          </h2>
        </div>

        <div className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          ចុះថ្ងៃទី១១ ខែកញ្ញា ឆ្នាំ២០២៦ · ក្រសួងអប់រំ យុវជន និងកីឡា
        </div>
      </div>

      {/* AI Assistant Question Box */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent p-5 rounded-2xl border border-amber-200 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>ជំនួយការឆ្លាតវៃ AI៖ សួរនាំ ឬពន្យល់វាក្យសព្ទ និងបទបញ្ជាក្នុងសេចក្តីណែនាំ</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={askAiQuery}
            onChange={(e) => setAskAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
            placeholder="ឧទាហរណ៍៖ «តើវិធីសាស្ត្រ PTOM ជាអ្វី?» ឬ «តើលក្ខខណ្ឌបង្កើត គ.គ.ថ. មានអ្វីខ្លះ?»"
            className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
          />
          <button
            onClick={handleAskAi}
            disabled={isLoadingAi || !askAiQuery.trim()}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            {isLoadingAi ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>សួរ AI</span>
          </button>
        </div>

        {aiAnswer && (
          <div className="p-4 bg-white rounded-xl border border-amber-200 text-sm leading-relaxed text-slate-800 shadow-2xs whitespace-pre-line">
            {aiAnswer}
          </div>
        )}
      </div>

      {/* Key Core Sections Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: 5 Standards of Model School */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Award className="w-5 h-5 text-amber-600" />
            <span>ស្តង់ដាសាលារៀនគំរូ ៥ ប្រការ</span>
          </div>
          <div className="space-y-3">
            {MOEYS_SUMMARY.fiveStandards.map((std) => (
              <div key={std.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-xs font-bold text-amber-700">
                  ស្តង់ដាទី {std.id}៖ {std.name}
                </div>
                <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {std.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Academic Calendar & Teaching Hours */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>កាលបរិច្ឆេទនៃឆ្នាំសិក្សា ២០២៦-២០២៧</span>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600">ថ្ងៃបើកបវេសនកាល៖</span>
                <span className="font-bold text-slate-900">
                  {MOEYS_SUMMARY.academicCalendar.start}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600">វិស្សមកាលតូច៖</span>
                <span className="font-bold text-slate-900">
                  {MOEYS_SUMMARY.academicCalendar.smallBreak}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600">មហាវិស្សមកាល៖</span>
                <span className="font-bold text-slate-900">
                  {MOEYS_SUMMARY.academicCalendar.largeVacation}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>តារាងបែងចែកម៉ោងបង្រៀនភាសាខ្មែរផ្លូវការ</span>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              {MOEYS_SUMMARY.teachingHoursKhmer.map((th, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-lg flex items-center justify-between border border-slate-100"
                >
                  <div>
                    <span className="font-bold text-slate-800">{th.grade}</span>
                    <div className="text-xs text-slate-500">គណិតវិទ្យា {th.mathHours} ម៉ោង/សប្តាហ៍</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-600">
                      ភាសាខ្មែរ {th.khmerHours} ម៉ោង
                    </span>
                    <div className="text-[11px] text-slate-400">សរុប {th.totalHours}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
