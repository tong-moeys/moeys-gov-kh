'use client';

import React, { useState } from 'react';
import { Award, CheckSquare, Square, Printer, RotateCcw, Info, UserCheck, Share2 } from 'lucide-react';
import { MORALITY_RUBRIC_DATA } from '@/data/moeys-guidelines';
import { ShareReportModal } from './ShareReportModal';

export const MoralityRubricEvaluator: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>(() => {
    // default select some sample items so the teacher/learner sees how it looks
    const init: Record<string, boolean> = {};
    MORALITY_RUBRIC_DATA.forEach((cat) => {
      cat.items.slice(0, Math.ceil(cat.items.length * 0.85)).forEach((item) => {
        init[item.id] = true;
      });
    });
    return init;
  });

  const [studentName, setStudentName] = useState<string>('សុខ វិបុល');
  const [studentGrade, setStudentGrade] = useState<string>('ថ្នាក់ទី ៣ក');
  const [schoolName, setSchoolName] = useState<string>('សាលាបឋមសិក្សាគំរូ ហ៊ុន សែន');
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectAllInCategory = (categoryIndex: number) => {
    const cat = MORALITY_RUBRIC_DATA[categoryIndex];
    setSelectedItems((prev) => {
      const next = { ...prev };
      cat.items.forEach((item) => {
        next[item.id] = true;
      });
      return next;
    });
  };

  const deselectAllInCategory = (categoryIndex: number) => {
    const cat = MORALITY_RUBRIC_DATA[categoryIndex];
    setSelectedItems((prev) => {
      const next = { ...prev };
      cat.items.forEach((item) => {
        next[item.id] = false;
      });
      return next;
    });
  };

  // Calculate total scores
  let totalEarned = 0;
  const totalPossible = 78;

  MORALITY_RUBRIC_DATA.forEach((cat) => {
    cat.items.forEach((item) => {
      if (selectedItems[item.id]) {
        totalEarned += 1;
      }
    });
  });

  const scoreOutOfTen = ((totalEarned / totalPossible) * 10).toFixed(2);
  const numericScore = parseFloat(scoreOutOfTen);

  let gradeLetter = 'F';
  let gradeText = 'ខ្សោយណាស់ (ធ្លាក់)';
  if (numericScore >= 9.0) {
    gradeLetter = 'A';
    gradeText = 'ល្អប្រសើរ';
  } else if (numericScore >= 8.0) {
    gradeLetter = 'B';
    gradeText = 'ល្អណាស់';
  } else if (numericScore >= 7.0) {
    gradeLetter = 'C';
    gradeText = 'ល្អ';
  } else if (numericScore >= 6.0) {
    gradeLetter = 'D';
    gradeText = 'មធ្យម';
  } else if (numericScore >= 5.0) {
    gradeLetter = 'E';
    gradeText = 'ខ្សោយ';
  }

  const currentCat = MORALITY_RUBRIC_DATA[activeCategoryIndex];
  const catEarned = currentCat.items.filter((i) => selectedItems[i.id]).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      {/* Title & Guidelines Citation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <span>ឧបសម្ព័ន្ធ ៣ នៃសេចក្តីណែនាំ ៤១៧</span>
            <span aria-hidden="true">·</span>
            <span>រង្វាយតម្លៃសីលធម៌ និងឥរិយាបថ</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">
            តារាងវាយតម្លៃពិន្ទុសីលធម៌សិស្ស ៥ ប្រការ (ស្អាត សុភាព របៀប ទៀងពេល សមាធិ)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-2xs"
          >
            <Share2 className="w-4 h-4" />
            <span>ចែករំលែក (Gmail / Telegram)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ព</span>
          </button>
        </div>
      </div>

      {/* Student Profile Input Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm">
        <div>
          <label className="block text-slate-500 font-medium mb-1">ឈ្មោះសាលារៀន</label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-slate-500 font-medium mb-1">ឈ្មោះសិស្ស</label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-slate-500 font-medium mb-1">ថ្នាក់ទី</label>
          <input
            type="text"
            value={studentGrade}
            onChange={(e) => setStudentGrade(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Summary Score Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl">
          <div className="text-xs text-amber-800 font-medium">ពិន្ទុសរុបជាក់ស្តែង</div>
          <div className="text-2xl font-bold text-amber-900 tabular-nums mt-0.5">
            {totalEarned} / {totalPossible}
          </div>
          <div className="text-xs text-amber-700/80 mt-0.5">
            គិតជាភាគរយ៖ {Math.round((totalEarned / totalPossible) * 100)}%
          </div>
        </div>

        <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/80 rounded-xl">
          <div className="text-xs text-indigo-800 font-medium">ពិន្ទុគិតជាមូលដ្ឋាន ១០</div>
          <div className="text-2xl font-bold text-indigo-900 tabular-nums mt-0.5">
            {scoreOutOfTen} <span className="text-sm font-normal">/១០</span>
          </div>
          <div className="text-xs text-indigo-700/80 mt-0.5">រូបមន្ត៖ (ពិន្ទុ ÷ ៧៨) × ១០</div>
        </div>

        <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
          <div className="text-xs text-emerald-800 font-medium">និទ្ទេសសីលធម៌ផ្លូវការ</div>
          <div className="text-2xl font-bold text-emerald-900 mt-0.5">
            និទ្ទេស {gradeLetter}
          </div>
          <div className="text-xs text-emerald-700/80 mt-0.5">{gradeText}</div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
          <div className="text-xs text-slate-500 font-medium">ទម្ងន់ក្នុងពិន្ទុខែ</div>
          <div className="text-xl font-bold text-slate-800 tabular-nums mt-0.5">
            ២០% <span className="text-xs font-normal text-slate-500">(៨០% តេស្ត)</span>
          </div>
          <div className="text-xs text-slate-500">ស្របតាមទំព័រ ២៦</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 rounded-xl">
        {MORALITY_RUBRIC_DATA.map((cat, idx) => {
          const catCount = cat.items.filter((i) => selectedItems[i.id]).length;
          return (
            <button
              key={cat.category}
              onClick={() => setActiveCategoryIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-2 ${
                activeCategoryIndex === idx
                  ? 'bg-white text-slate-900 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{cat.category}</span>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                {catCount}/{cat.maxScore}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Category Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
          <span className="font-semibold text-slate-800">
            សូចនាករផ្នែក {currentCat.category} (បានជ្រើសរើស {catEarned} នៃ {currentCat.maxScore})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => selectAllInCategory(activeCategoryIndex)}
              className="text-amber-700 hover:text-amber-800 font-medium"
            >
              ជ្រើសរើសទាំងអស់
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => deselectAllInCategory(activeCategoryIndex)}
              className="text-slate-500 hover:text-slate-700"
            >
              ដោះចេញទាំងអស់
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {currentCat.items.map((item, idx) => {
            const isChecked = !!selectedItems[item.id];
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                  isChecked
                    ? 'border-amber-500/80 bg-amber-50/50 text-slate-900'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="mt-0.5 shrink-0 text-amber-600 block">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-amber-600 fill-amber-100" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300" />
                  )}
                </span>
                <span className="flex-1 min-w-0 block">
                  <span className="font-mono text-slate-400 text-xs mr-1.5">{idx + 1}.</span>
                  <span>{item.label}</span>
                </span>
                <span className="font-mono text-xs text-slate-400 shrink-0">1 pt</span>
              </button>
            );
          })}
        </div>
      </div>

      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        reportData={{
          title: 'របាយការណ៍សីលធម៌ និងឥរិយាបថសិស្ស (ឧបសម្ព័ន្ធ៣)',
          studentName,
          studentGrade,
          schoolName,
          scoreOutOfTen,
          gradeLetter,
          totalEarned,
          summaryText: `របាយការណ៍សីលធម៌ ៥ ប្រការ (ឧបសម្ព័ន្ធ៣ នៃសេចក្តីណែនាំលេខ ៤១៧ ក្រសួងអប់រំ យុវជន និងកីឡា)\n• សិស្ស៖ ${studentName}\n• ថ្នាក់៖ ${studentGrade}\n• សាលារៀន៖ ${schoolName}\n• ពិន្ទុសរុប៖ ${totalEarned}/៧៨\n• ពិន្ទុបម្លែងមូលដ្ឋាន ១០៖ ${scoreOutOfTen}/១០\n• និទ្ទេសផ្លូវការ៖ ${gradeLetter} (${gradeText})\nសូមអរគុណ!`,
        }}
      />
    </div>
  );
};
