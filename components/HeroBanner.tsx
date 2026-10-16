'use client';

import React from 'react';
import Image from 'next/image';
import { Presentation, Play, HelpCircle, FileCheck, Award, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  onSelectTab: (tab: string) => void;
  onOpenAiGenerator: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectTab,
  onOpenAiGenerator,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-slate-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 space-y-5">
            {/* Unboxed subtle metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-medium text-amber-800">
              <span>ក្រសួងអប់រំ យុវជន និងកីឡា</span>
              <span aria-hidden="true">·</span>
              <span>សេចក្តីណែនាំលេខ ៤១៧ អយក.សណន</span>
              <span aria-hidden="true">·</span>
              <span>ឆ្នាំសិក្សា ២០២៦-២០២៧</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug text-balance">
              វេទិកាបទបង្ហាញ វីដេអូខ្លីៗ សំណួរតេស្ត និងលំហាត់ភាសាខ្មែរ
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              ឧបករណ៍ឌីជីថលពេញលេញសម្រាប់គណៈគ្រប់គ្រងសាលា លោកគ្រូអ្នកគ្រូ និងអ្នករៀនភាសាខ្មែរ
              អនុវត្តស្របតាមបទដ្ឋានសាលារៀនគំរូ កញ្ចប់អំណានថ្នាក់ដំបូង ១៣ ម៉ោង/សប្តាហ៍
              វិធីសាស្ត្រ PLP &amp; PTOM និងការវាយតម្លៃសីលធម៌ ៥ ប្រការ។
            </p>

            {/* Quick Navigation Action Grid */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => onSelectTab('slides')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm active:scale-98"
              >
                <Presentation className="w-4 h-4 text-amber-400" />
                <span>មើលបទបង្ហាញ (Slides)</span>
              </button>

              <button
                onClick={() => onSelectTab('reels')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-sm font-medium transition-all active:scale-98"
              >
                <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>ទស្សនាវីដេអូខ្លីៗ (Reels)</span>
              </button>

              <button
                onClick={() => onSelectTab('exercises')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-lg text-sm font-medium transition-all active:scale-98"
              >
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>លំហាត់អនុវត្ត</span>
              </button>

              <button
                onClick={onOpenAiGenerator}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>AI បង្កើតថ្មី</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/images/khmer_education_hero.jpg"
                  alt="ថ្នាក់រៀនបឋមសិក្សាគំរូកម្ពុជា"
                  fill
                  className="object-cover"
                  priority
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>សាលាបឋមសិក្សាគំរូ ៥ ស្តង់ដាជាតិ</span>
                  </div>
                  <div className="text-sm font-medium leading-snug mt-0.5">
                    បណ្តុះមូលដ្ឋានគ្រឹះអំណាន គណិតវិទ្យា និងសីលធម៌កុមារកម្ពុជា
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Metric Strip (Full-width row below hero split) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-200/80">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="text-xs text-slate-500">ម៉ោងបង្រៀនភាសាខ្មែរ (ថ្នាក់ទី១-៣)</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-600 tabular-nums mt-0.5">១៣ ម៉ោង</div>
            <div className="text-xs text-slate-500 mt-0.5">ក្នុងមួយសប្តាហ៍ + ជំនួយសិស្សយឺត</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="text-xs text-slate-500">ស្តង់ដាសាលារៀនគំរូ</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums mt-0.5">៥ ស្តង់ដា</div>
            <div className="text-xs text-slate-500 mt-0.5">លទ្ធផល ការបង្រៀន អភិបាលកិច្ច</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="text-xs text-slate-500">ការវាយតម្លៃសីលធម៌ (ឧបសម្ព័ន្ធ៣)</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 tabular-nums mt-0.5">៧៨ ពិន្ទុ</div>
            <div className="text-xs text-slate-500 mt-0.5">ស្អាត សុភាព របៀប ទៀងពេល សមាធិ</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <div className="text-xs text-slate-500">កាលបរិច្ឆេទបើកបវេសនកាល</div>
            <div className="text-xl sm:text-2xl font-bold text-indigo-600 tabular-nums mt-0.5">០១ វិច្ឆិកា</div>
            <div className="text-xs text-slate-500 mt-0.5">ឆ្នាំសិក្សា ២០២៦-២០២៧ ផ្លូវការ</div>
          </div>
        </div>
      </div>
    </div>
  );
};
