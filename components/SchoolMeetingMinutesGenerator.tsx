'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Sparkles,
  Printer,
  Copy,
  Download,
  Check,
  Plus,
  Trash2,
  Edit3,
  Eye,
  RefreshCw,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
  FileSpreadsheet,
  Share2
} from 'lucide-react';
import {
  SMCMeetingMinutes,
  SMC_PRESET_TEMPLATES,
  DEFAULT_COMMITTEE_MEMBERS,
  SAMPLE_INITIAL_MINUTES,
  MeetingPreset,
  AgendaItem,
  ActionPlanItem,
  CommitteeMember
} from '@/data/smc-meeting-data';

export const SchoolMeetingMinutesGenerator: React.FC = () => {
  const [minutes, setMinutes] = useState<SMCMeetingMinutes>(SAMPLE_INITIAL_MINUTES);
  const [savedHistory, setSavedHistory] = useState<SMCMeetingMinutes[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sip-budget-q1');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form input states for AI generation
  const [formSchool, setFormSchool] = useState<string>(SAMPLE_INITIAL_MINUTES.schoolName);
  const [formDistrict, setFormDistrict] = useState<string>(SAMPLE_INITIAL_MINUTES.clusterOrDistrict);
  const [formProvince, setFormProvince] = useState<string>(SAMPLE_INITIAL_MINUTES.province);
  const [formMeetingType, setFormMeetingType] = useState<SMCMeetingMinutes['meetingType']>('សាមញ្ញត្រីមាសទី១');
  const [formAgendas, setFormAgendas] = useState<string[]>(
    SMC_PRESET_TEMPLATES[0].suggestedAgendas
  );
  const [newAgendaInput, setNewAgendaInput] = useState<string>('');
  const [customNotes, setCustomNotes] = useState<string>('');

  const printableRef = useRef<HTMLDivElement>(null);

  // Load saved history from localStorage on client asynchronously to prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('smc_meeting_minutes_history');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedHistory(parsed);
            setMinutes(parsed[0]);
          }
        }
      } catch {
        // Ignore localStorage errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const saveToHistory = (item: SMCMeetingMinutes) => {
    try {
      const updated = [item, ...savedHistory.filter((h) => h.id !== item.id)].slice(0, 10);
      setSavedHistory(updated);
      localStorage.setItem('smc_meeting_minutes_history', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleSelectPreset = (preset: MeetingPreset) => {
    setSelectedPresetId(preset.id);
    setFormMeetingType(preset.meetingType);
    setFormAgendas([...preset.suggestedAgendas]);
    setCustomNotes(preset.contextHint);
  };

  const handleAddAgenda = () => {
    if (!newAgendaInput.trim()) return;
    setFormAgendas((prev) => [...prev, newAgendaInput.trim()]);
    setNewAgendaInput('');
  };

  const handleRemoveAgenda = (idx: number) => {
    setFormAgendas((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setSuccessToast(null);

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_smc_minutes',
          metadata: {
            schoolName: formSchool,
            clusterOrDistrict: formDistrict,
            province: formProvince,
            meetingType: formMeetingType,
            agendas: formAgendas,
            notes: customNotes,
          },
        }),
      });

      const resData = await response.json();
      if (!resData.success || !resData.data) {
        throw new Error(resData.error || 'ការបង្កើតកំណត់ហេតុមិនបានជោគជ័យ។');
      }

      const generatedData: SMCMeetingMinutes = {
        ...resData.data,
        id: `smc-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      setMinutes(generatedData);
      saveToHistory(generatedData);
      setSuccessToast('បានបង្កើតកំណត់ហេតុប្រជុំ គ.គ.ស. តាមលិខិតលេខ ៤៧ ដោយជោគជ័យ!');
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'មានបញ្ហាក្នុងការបង្កើត សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិត។');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = async () => {
    if (!minutes) return;

    const agendasText = minutes.agendas
      .map(
        (a, i) =>
          `របៀបវារៈទី${i + 1}៖ ${a.title}\n- អ្នករាយការណ៍៖ ${a.reporter}\n- ខ្លឹមសារពិភាក្សា៖ ${a.discussionSummary}\n- សេចក្តីសម្រេច៖ ${a.decision}`
      )
      .join('\n\n');

    const resolutionsText = minutes.generalResolutions
      .map((r, i) => `${i + 1}. ${r}`)
      .join('\n');

    const actionPlansText = minutes.actionPlans
      .map(
        (ap, i) =>
          `${i + 1}. ${ap.activity} | អ្នកទទួលខុសត្រូវ៖ ${ap.responsiblePerson} | កាលកំណត់៖ ${ap.deadline} | ធនធាន៖ ${ap.resources}`
      )
      .join('\n');

    const fullText = `ព្រះរាជាណាចក្រកម្ពុជា
ជាតិ សាសនា ព្រះមហាក្សត្រ
---
${minutes.clusterOrDistrict}
${minutes.schoolName}
លេខ៖ ${minutes.docNumber}

កំណត់ហេតុប្រជុំ
គណៈកម្មាធិការគ្រប់គ្រងសាលារៀន (គ.គ.ស.)
យោង៖ ${minutes.referenceCircular}
ប្រធានបទ៖ ${minutes.meetingTitle}

I. ព័ត៌មានទូទៅ៖
- កាលបរិច្ឆេទ៖ ${minutes.dateKhmer}
- ពេលវេលា៖ ចាប់ពីម៉ោង ${minutes.timeStart} ដល់ម៉ោង ${minutes.timeEnd}
- ទីកន្លែង៖ ${minutes.location}
- អធិបតីភាព៖ ${minutes.chairperson}
- លេខាធិការ៖ ${minutes.secretary}
- សមាជិកសរុប៖ ${minutes.totalMembers} នាក់ (វត្តមាន៖ ${minutes.presentCount} នាក់, ច្បាប់៖ ${minutes.absentWithPermission} នាក់)

II. ដំណើរការពិភាក្សាតាមរបៀបវារៈ៖
${agendasText}

III. សេចក្តីសម្រេចរបស់អង្គប្រជុំ៖
${resolutionsText}

IV. តារាងផែនការសកម្មភាពអនុវត្តបន្ត៖
${actionPlansText}

V. ការបិទបញ្ចប់កិច្ចប្រជុំ៖
${minutes.closingRemarks}

បានឃើញ និងឯកភាព
ប្រធាន គ.គ.ស.
${minutes.chairperson}

លេខាធិការអង្គប្រជុំ / នាយកសាលា
${minutes.secretary}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadWordDoc = () => {
    if (!printableRef.current) return;
    const contentHtml = printableRef.current.innerHTML;
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${minutes.meetingTitle}</title>
  <style>
    body { font-family: 'Kantumruy Pro', 'Khmer OS Siemreap', Arial, sans-serif; padding: 20px; line-height: 1.6; }
    h1, h2, h3 { text-align: center; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #444; padding: 6px 10px; text-align: left; }
    th { background-color: #f2f2f2; }
    .header-box { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .text-center { text-align: center; }
  </style>
</head>
<body>
  ${contentHtml}
</body>
</html>`;

    const blob = new Blob(['\ufeff', fullHtml], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `កំណត់ហេតុ_គគស_${minutes.schoolName.replace(/\s+/g, '_')}_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="no-print fixed top-20 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Top Banner & Official Law Citations */}
      <div className="no-print bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-amber-600/30">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-200 rounded-full text-xs font-semibold border border-amber-400/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>បទដ្ឋានក្រសួងអប់រំ យុវជន និងកីឡា (MOEYS)</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              ប្រព័ន្ធ AI បង្កើតកំណត់ហេតុប្រជុំ គ.គ.ស. តាមលិខិតលេខ ៤៧ អយក.សណន
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              រៀបចំ និងបង្កើតកំណត់ហេតុប្រជុំគណៈកម្មាធិការគ្រប់គ្រងសាលារៀន (School Management Committee)
              ឱ្យបានត្រឹមត្រូវ ១០០% តាមរចនាសម្ព័ន្ធរដ្ឋបាលក្រសួងអប់រំ រួមទាំងផែនការ SIP, ថវិកាដំណើរការ SIG/PB,
              អនាម័យទឹកស្អាត WASH, និងការលើកកម្ពស់លទ្ធផលសិក្សាសិស្ស។
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('ai-form-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>បង្កើតកំណត់ហេតុថ្មី</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-xs sm:text-sm transition-all border border-white/20"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ព (Print)</span>
            </button>
          </div>
        </div>

        {/* Quick Legal Reference Bar */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-200/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>លិខិតលេខ ៤៧ អយក.សណន (គ.គ.ស.)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>សេចក្តីណែនាំលេខ ៤១៧ (ដំណើរការបឋមសិក្សា)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>ស្តង់ដាសាលារៀនគំរូ ៥ ប្រការ & SBM</span>
          </div>
        </div>
      </div>

      {/* Preset Templates Selector */}
      <div className="no-print space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-amber-600" />
            <span>ជ្រើសរើសគំរូប្រជុំស្តង់ដារ គ.គ.ស. តាមលិខិតលេខ ៤៧ (Templates)</span>
          </h2>
          <span className="text-xs text-slate-500">ចុចលើគំរូខាងក្រោមដើម្បីជ្រើសរើស</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SMC_PRESET_TEMPLATES.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/80 shadow-xs ring-1 ring-amber-600'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {preset.meetingType}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                </div>
                <h3 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">
                  {preset.title}
                </h3>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                  {preset.subtitle}
                </p>
                <div className="mt-2 text-[10px] text-slate-400">
                  {preset.suggestedAgendas.length} របៀបវារៈស្តង់ដារ
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Generator Input Configuration Form */}
      <div
        id="ai-form-section"
        className="no-print bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                ព័ត៌មាន និងរបៀបវារៈសម្រាប់ជំនួយការ AI បង្កើតកំណត់ហេតុ
              </h2>
              <p className="text-xs text-slate-500">
                បញ្ចូលឈ្មោះសាលា និងជ្រើសរើសរបៀបវារៈ បន្ទាប់មកចុច «បង្កើតដោយ AI»
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all active:scale-98"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI កំពុងបង្កើតកំណត់ហេតុ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>បង្កើតកំណត់ហេតុដោយ AI</span>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ឈ្មោះសាលារៀន *
            </label>
            <input
              type="text"
              value={formSchool}
              onChange={(e) => setFormSchool(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="ឧ. សាលាបឋមសិក្សា ហ៊ុន សែន ព្រែកឯង"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ការិយាល័យអប់រំ / ស្រុក-ខណ្ឌ *
            </label>
            <input
              type="text"
              value={formDistrict}
              onChange={(e) => setFormDistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="ឧ. ការិយាល័យអប់រំ យុវជន និងកីឡា នៃរដ្ឋបាលខណ្ឌច្បារអំពៅ"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ខេត្ត / រាជធានី *
            </label>
            <input
              type="text"
              value={formProvince}
              onChange={(e) => setFormProvince(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="ឧ. រាជធានីភ្នំពេញ"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ប្រភេទកិច្ចប្រជុំ គ.គ.ស. *
            </label>
            <select
              value={formMeetingType}
              onChange={(e) =>
                setFormMeetingType(e.target.value as SMCMeetingMinutes['meetingType'])
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="សាមញ្ញត្រីមាសទី១">ប្រជុំសាមញ្ញត្រីមាសទី១</option>
              <option value="សាមញ្ញត្រីមាសទី២">ប្រជុំសាមញ្ញត្រីមាសទី២</option>
              <option value="សាមញ្ញត្រីមាសទី៣">ប្រជុំសាមញ្ញត្រីមាសទី៣</option>
              <option value="សាមញ្ញត្រីមាសទី៤">ប្រជុំសាមញ្ញត្រីមាសទី៤</option>
              <option value="វិសាមញ្ញ">ប្រជុំវិសាមញ្ញ (ដោះស្រាយបន្ទាន់)</option>
            </select>
          </div>
        </div>

        {/* Agendas List */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            របៀបវារៈប្រជុំដែលត្រូវពិភាក្សា (Meeting Agendas)
          </label>
          <div className="space-y-2 mb-3">
            {formAgendas.map((agenda, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span>{agenda}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAgenda(idx)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="លុបរបៀបវារៈនេះ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newAgendaInput}
              onChange={(e) => setNewAgendaInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAgenda()}
              placeholder="បន្ថែមរបៀបវារៈប្រជុំថ្មី..."
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={handleAddAgenda}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>បន្ថែម</span>
            </button>
          </div>
        </div>

        {/* Custom Context / Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            ចំណុចពិភាក្សា ឬកំណត់សម្គាល់ជាក់ស្តែងរបស់សាលារៀន (ជាជម្រើស)
          </label>
          <textarea
            rows={2}
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="ឧ. នាយកសាលាបានស្នើសុំបន្ថែមម៉ោងអំណានដល់សិស្សថ្នាក់ទី១, សហគមន៍បានបរិច្ចាគតុរៀនចំនួន ១០ និងទឹកថ្នាំលាបបន្ទប់រៀន..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Action Toolbar above Document Preview */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isEditing
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'ត្រឡប់ទៅមើលទម្រង់ផ្លូវការ' : 'កែសម្រួលខ្លឹមសារដោយដៃ'}</span>
          </button>

          <span className="text-xs text-slate-400">|</span>

          <span className="text-xs text-slate-500">
            ស្ថានភាព៖ <strong className="text-slate-800">ស្របតាមលិខិតលេខ ៤៧</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            title="ចម្លងជាអត្ថបទ (Copy to Clipboard)"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">បានចម្លងរួចរាល់</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>ចម្លងអត្ថបទ</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadWordDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            title="ទាញយកជាឯកសារ Word (.doc)"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>ទាញយក Word</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
            title="បោះពុម្ព ឬរក្សាទុកជា PDF"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>បោះពុម្ព / សន្សំជា PDF</span>
          </button>
        </div>
      </div>

      {/* OFFICIAL CAMBODIAN DOCUMENT PAPER CONTAINER */}
      <div className="print-only-container bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-10 lg:p-12 text-slate-900 mx-auto max-w-4xl">
        <div ref={printableRef} className="space-y-6 text-sm leading-relaxed">
          {/* Header Zone: Royal Coat of Arms / Hierarchy */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 border-b-2 border-slate-900 pb-5">
            {/* Left Column: Ministry Hierarchy */}
            <div className="text-center sm:text-left space-y-0.5 text-xs sm:text-sm font-medium">
              <div className="font-bold text-slate-900">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
              <div className="text-slate-800">
                {isEditing ? (
                  <input
                    type="text"
                    value={minutes.province}
                    onChange={(e) => setMinutes({ ...minutes, province: e.target.value })}
                    className="border border-amber-400 rounded px-1 text-xs"
                  />
                ) : (
                  `មន្ទីរអប់រំ យុវជន និងកីឡា ${minutes.province}`
                )}
              </div>
              <div className="text-slate-700">
                {isEditing ? (
                  <input
                    type="text"
                    value={minutes.clusterOrDistrict}
                    onChange={(e) =>
                      setMinutes({ ...minutes, clusterOrDistrict: e.target.value })
                    }
                    className="border border-amber-400 rounded px-1 text-xs"
                  />
                ) : (
                  minutes.clusterOrDistrict
                )}
              </div>
              <div className="font-bold text-slate-900">
                {isEditing ? (
                  <input
                    type="text"
                    value={minutes.schoolName}
                    onChange={(e) => setMinutes({ ...minutes, schoolName: e.target.value })}
                    className="border border-amber-400 rounded px-1 text-xs font-bold"
                  />
                ) : (
                  minutes.schoolName
                )}
              </div>
              <div className="text-slate-600 text-xs pt-1">
                លេខ៖{' '}
                {isEditing ? (
                  <input
                    type="text"
                    value={minutes.docNumber}
                    onChange={(e) => setMinutes({ ...minutes, docNumber: e.target.value })}
                    className="border border-amber-400 rounded px-1 text-xs w-28"
                  />
                ) : (
                  minutes.docNumber
                )}
              </div>
            </div>

            {/* Right Column: Kingdom Royal Header */}
            <div className="text-center space-y-1">
              <div className="font-moul text-sm sm:text-base text-slate-900">
                ព្រះរាជាណាចក្រកម្ពុជា
              </div>
              <div className="font-moul text-xs sm:text-sm text-slate-900">
                ជាតិ សាសនា ព្រះមហាក្សត្រ
              </div>
              {/* Traditional Cambodian Flourish / Divider */}
              <div className="flex items-center justify-center gap-1 pt-0.5 text-slate-800 text-xs">
                <span>෴</span>
                <span className="w-12 h-0.5 bg-slate-800 inline-block"></span>
                <span>෴</span>
              </div>
            </div>
          </div>

          {/* Document Title & Circular Reference */}
          <div className="text-center space-y-2 pt-2">
            <h1 className="font-moul text-base sm:text-lg lg:text-xl text-slate-950 tracking-wide">
              កំណត់ហេតុប្រជុំ
            </h1>
            <h2 className="font-bold text-sm sm:text-base text-slate-900">
              គណៈកម្មាធិការគ្រប់គ្រងសាលារៀន (គ.គ.ស.)
            </h2>
            <div className="inline-block px-3 py-1 bg-slate-100 rounded-md text-xs font-semibold text-slate-700 border border-slate-200">
              {minutes.meetingType} ៖ {minutes.meetingTitle}
            </div>
            <div className="text-[11px] text-slate-500 italic max-w-2xl mx-auto">
              យោង៖ {minutes.referenceCircular}
            </div>
          </div>

          {/* SECTION I: ព័ត៌មានទូទៅនៃកិច្ចប្រជុំ */}
          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 text-xs sm:text-sm flex items-center gap-1.5">
              <span>I. ព័ត៌មានទូទៅនៃកិច្ចប្រជុំ</span>
            </h3>
            <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <strong className="text-slate-800">កាលបរិច្ឆេទ៖</strong> {minutes.dateKhmer}
              </div>
              <div>
                <strong className="text-slate-800">ពេលវេលា៖</strong> ពីម៉ោង {minutes.timeStart}{' '}
                ដល់ម៉ោង {minutes.timeEnd}
              </div>
              <div>
                <strong className="text-slate-800">ទីកន្លែងប្រជុំ៖</strong> {minutes.location}
              </div>
              <div>
                <strong className="text-slate-800">អធិបតីភាព៖</strong> {minutes.chairperson}
              </div>
              <div>
                <strong className="text-slate-800">លេខាធិការអង្គប្រជុំ៖</strong> {minutes.secretary}
              </div>
              <div>
                <strong className="text-slate-800">កូរ៉ុមចូលរួម៖</strong> សរុប {minutes.totalMembers}{' '}
                រូប (វត្តមាន៖ {minutes.presentCount} រូប, អវត្តមានមានច្បាប់៖{' '}
                {minutes.absentWithPermission} រូប)
              </div>
            </div>
          </div>

          {/* SECTION II: សមាសភាពចូលរួមប្រជុំ គ.គ.ស. */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 text-xs sm:text-sm">
              II. សមាសភាពចូលរួមប្រជុំ គ.គ.ស. (សមាសភាពតាមលិខិតលេខ ៤៧)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-300 px-2 py-1.5 text-center w-10">ល.រ</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left">គោត្តនាម-នាម</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left">តួនាទីក្នុង គ.គ.ស.</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left">មុខតំណែង/អង្គភាព</th>
                    <th className="border border-slate-300 px-2 py-1.5 text-center w-20">វត្តមាន</th>
                  </tr>
                </thead>
                <tbody>
                  {minutes.members.map((member, idx) => (
                    <tr key={member.id || idx} className="hover:bg-slate-50/50">
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-medium">
                        {idx + 1}
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 font-medium">
                        {member.name}
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                        {member.role}
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-slate-600">
                        {member.positionTitle}
                      </td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center">
                        <span className="text-emerald-700 font-bold">មានវត្តមាន</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION III: របៀបវារៈ និងដំណើរការពិភាក្សា */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 text-xs sm:text-sm">
              III. ដំណើរការប្រជុំ និងការពិភាក្សាតាមរបៀបវារៈនីមួយៗ
            </h3>
            <div className="space-y-4">
              {minutes.agendas.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs"
                >
                  <div className="font-bold text-amber-900 text-xs sm:text-sm flex items-center justify-between">
                    <span>
                      របៀបវារៈទី {idx + 1}៖ {item.title}
                    </span>
                    <span className="text-[11px] font-normal text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      អ្នករាយការណ៍៖ {item.reporter}
                    </span>
                  </div>

                  <div>
                    <strong className="text-slate-800">ខ្លឹមសារពិភាក្សា និងមតិយោបល់៖</strong>
                    {isEditing ? (
                      <textarea
                        rows={3}
                        value={item.discussionSummary}
                        onChange={(e) => {
                          const updated = [...minutes.agendas];
                          updated[idx].discussionSummary = e.target.value;
                          setMinutes({ ...minutes, agendas: updated });
                        }}
                        className="w-full bg-white border border-amber-300 rounded p-2 text-xs mt-1"
                      />
                    ) : (
                      <p className="text-slate-700 mt-1 leading-relaxed pl-2 border-l-2 border-amber-400">
                        {item.discussionSummary}
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <strong className="text-emerald-800">សេចក្តីសម្រេចលើរបៀបវារៈនេះ៖</strong>{' '}
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.decision}
                        onChange={(e) => {
                          const updated = [...minutes.agendas];
                          updated[idx].decision = e.target.value;
                          setMinutes({ ...minutes, agendas: updated });
                        }}
                        className="w-full bg-white border border-amber-300 rounded px-2 py-1 text-xs mt-1"
                      />
                    ) : (
                      <span className="text-slate-800">{item.decision}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION IV: សេចក្តីសម្រេចរួមរបស់អង្គប្រជុំ */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 text-xs sm:text-sm">
              IV. សេចក្តីសម្រេចរួមរបស់អង្គប្រជុំ គ.គ.ស.
            </h3>
            <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/80 space-y-1.5 text-xs">
              <div className="text-slate-700 mb-1">
                អង្គប្រជុំគណៈកម្មាធិការគ្រប់គ្រងសាលារៀន (គ.គ.ស.) បានបោះឆ្នោតអនុម័តជាឯកច្ឆន្ទ
                នូវសេចក្តីសម្រេចដូចខាងក្រោម៖
              </div>
              <ul className="space-y-1 pl-4 list-disc text-slate-800">
                {minutes.generalResolutions.map((res, i) => (
                  <li key={i} className="leading-relaxed">
                    {res}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION V: តារាងផែនការសកម្មភាពអនុវត្តបន្ត */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 text-xs sm:text-sm">
              V. តារាងផែនការសកម្មភាព និងការចាត់តាំងការទទួលខុសត្រូវបន្ត
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="border border-slate-300 px-2 py-1.5 text-center w-10">ល.រ</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left">សកម្មភាពត្រូវអនុវត្ត</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left">អ្នកទទួលខុសត្រូវ</th>
                    <th className="border border-slate-300 px-2.5 py-1.5 text-left w-28">កាលបរិច្ឆេទ</th>
                    <th className="border border-slate-300 px-2.5 py-1.5 text-left w-28">ធនធាន/ថវិកា</th>
                  </tr>
                </thead>
                <tbody>
                  {minutes.actionPlans.map((ap, idx) => (
                    <tr key={ap.id || idx} className="hover:bg-slate-50/50">
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-medium">
                        {idx + 1}
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 font-medium text-slate-900">
                        {ap.activity}
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                        {ap.responsiblePerson}
                      </td>
                      <td className="border border-slate-300 px-2.5 py-1.5 text-slate-600">
                        {ap.deadline}
                      </td>
                      <td className="border border-slate-300 px-2.5 py-1.5 text-slate-600">
                        {ap.resources}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION VI: ការបិទបញ្ចប់កិច្ចប្រជុំ */}
          <div className="space-y-1.5 text-xs text-slate-700">
            <h3 className="font-bold text-slate-900 border-b border-slate-300 pb-1 text-xs sm:text-sm">
              VI. ការបិទបញ្ចប់កិច្ចប្រជុំ
            </h3>
            <p className="leading-relaxed">{minutes.closingRemarks}</p>
          </div>

          {/* SIGNATURES BLOCK */}
          <div className="print-avoid-break pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            {/* Left signature: ប្រធាន គ.គ.ស. */}
            <div className="space-y-1">
              <div className="font-bold text-slate-900">បានឃើញ និងឯកភាព</div>
              <div className="font-bold text-slate-950">ប្រធាន គ.គ.ស.</div>
              <div className="text-[11px] text-slate-500 italic pb-16">(ហត្ថលេខា និងត្រា)</div>
              <div className="font-bold text-slate-900 underline decoration-slate-400 underline-offset-4">
                {minutes.chairperson}
              </div>
            </div>

            {/* Right signature: នាយកសាលា / លេខាធិការ */}
            <div className="space-y-1">
              <div className="text-slate-600 italic">
                ធ្វើនៅ {minutes.schoolName.replace('សាលាបឋមសិក្សា', '').trim()} នាថ្ងៃខែឆ្នាំដដែល
              </div>
              <div className="font-bold text-slate-950">លេខាធិការអង្គប្រជុំ / នាយកសាលា</div>
              <div className="text-[11px] text-slate-500 italic pb-16">(ហត្ថលេខា និងឈ្មោះ)</div>
              <div className="font-bold text-slate-900 underline decoration-slate-400 underline-offset-4">
                {minutes.secretary}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
