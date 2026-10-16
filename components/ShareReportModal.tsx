'use client';

import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  Share2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { getCachedAccessToken, signInWithGoogle, auth } from '@/lib/firebase';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: {
    title: string;
    studentName?: string;
    studentGrade?: string;
    schoolName?: string;
    scoreOutOfTen?: string;
    gradeLetter?: string;
    totalEarned?: number;
    summaryText: string;
  };
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
}) => {
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [customSubject, setCustomSubject] = useState<string>(
    `របាយការណ៍សីលធម៌ និងការសិក្សា៖ ${reportData.studentName || reportData.title}`
  );
  const [customMessage, setCustomMessage] = useState<string>(
    reportData.summaryText ||
      `សូមគោរពជម្រាបជូនមាតាបិតា/អាណាព្យាបាលសិស្ស៖\nខាងក្រោមនេះជារបាយការណ៍វាយតម្លៃសីលធម៌ ៥ ប្រការរបស់សិស្ស ${reportData.studentName} (${reportData.studentGrade}) ស្របតាមសេចក្តីណែនាំលេខ ៤១៧ របស់ក្រសួងអប់រំ យុវជន និងកីឡា។\nពិន្ទុ៖ ${reportData.scoreOutOfTen}/១០ (${reportData.gradeLetter})`
  );

  const [isSendingGmail, setIsSendingGmail] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirmSendDialog, setShowConfirmSendDialog] = useState<boolean>(false);

  if (!isOpen) return null;

  // Telegram Share link
  const telegramShareText = encodeURIComponent(
    `📢 ${customSubject}\n\n${customMessage}\n\n🏫 ${reportData.schoolName || 'សាលាបឋមសិក្សាគំរូ'}\n📘 សេចក្តីណែនាំលេខ ៤១៧ អយក.សណន (២០២៦-២០២៧)`
  );
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    typeof window !== 'undefined' ? window.location.origin : ''
  )}&text=${telegramShareText}`;

  // Copy to clipboard
  const handleCopyText = async () => {
    try {
      const fullText = `${customSubject}\n\n${customMessage}\n\n${reportData.schoolName || 'សាលាបឋមសិក្សាគំរូ'}`;
      await navigator.clipboard.writeText(fullText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      setStatusMessage({ type: 'error', text: 'មិនអាចចម្លងអត្ថបទបានទេ។' });
    }
  };

  // Gmail Send function
  const executeSendGmail = async () => {
    setShowConfirmSendDialog(false);
    setIsSendingGmail(true);
    setStatusMessage(null);

    try {
      let accessToken = getCachedAccessToken();
      if (!accessToken) {
        // Trigger sign in to get access token
        const signResult = await signInWithGoogle();
        accessToken = signResult?.accessToken || getCachedAccessToken();
      }

      if (!accessToken) {
        throw new Error('មិនទាន់បានចូលគណនី Google ឬគ្មានសិទ្ធិប្រើប្រាស់ Gmail។ សូមព្យាយាមចូលគណនីម្តងទៀត។');
      }

      // Construct MIME message
      const currentUserEmail = auth.currentUser?.email || 'me';
      const emailContent = [
        `From: ${currentUserEmail}`,
        `To: ${recipientEmail}`,
        `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(customSubject)))}?=`,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 7bit',
        '',
        customMessage,
        '',
        `--\n${reportData.schoolName || 'សាលាបឋមសិក្សាគំរូ'}\nផ្អែកលើសេចក្តីណែនាំលេខ ៤១៧ ក្រសួងអប់រំ យុវជន និងកីឡា`,
      ].join('\r\n');

      // Base64url encode
      const base64EncodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ raw: base64EncodedEmail }),
        }
      );

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Gmail API Error (Status ${response.status})`);
      }

      setStatusMessage({
        type: 'success',
        text: `បានផ្ញើអ៊ីមែលទៅកាន់ «${recipientEmail}» ជោគជ័យតាមរយៈ Gmail!`,
      });
    } catch (err: any) {
      console.error('Send Gmail error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'មានបញ្ហាក្នុងការផ្ញើអ៊ីមែល។',
      });
    } finally {
      setIsSendingGmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ចែករំលែករបាយការណ៍ទៅកាន់ Gmail &amp; Telegram
              </h3>
              <p className="text-xs text-slate-500">
                ផ្ញើជូនមាតាបិតាសិស្ស គណៈកម្មការ គ.គ.ថ. ឬក្រុម Telegram
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
        <div className="p-6 space-y-4">
          {/* Quick Telegram Button */}
          <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between gap-3">
            <div className="text-xs text-sky-950">
              <span className="font-bold block text-sky-900 flex items-center gap-1.5 mb-0.5">
                <Send className="w-3.5 h-3.5 text-sky-600" />
                <span>ផ្ញើផ្ទាល់ទៅកាន់ Telegram Group ថ្នាក់រៀន</span>
              </span>
              <span>ចែករំលែកព័ត៌មាន និងលទ្ធផលសិស្សទៅកាន់គ្រុប Telegram ភ្លាមៗ</span>
            </div>

            <a
              href={telegramShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-2xs"
            >
              <span>បើក Telegram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Email Recipient Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              អាសយដ្ឋានអ៊ីមែលអ្នកទទួល (មាតាបិតា ឬអ្នកគ្រប់គ្រង)៖
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="ឧទាហរណ៍៖ parent@example.com"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              ចំណងជើងសារ (Subject)៖
            </label>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900"
            />
          </div>

          {/* Message Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                ខ្លឹមសារសារ (Message Body)៖
              </label>
              <button
                onClick={handleCopyText}
                className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                <span>{isCopied ? 'បានចម្លងរួចរាល់!' : 'ចម្លងអត្ថបទ'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 leading-relaxed"
            />
          </div>

          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 bg-white rounded-lg transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isCopied ? 'បានចម្លង!' : 'ចម្លងខ្លឹមសារ'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              បិទ
            </button>
            <button
              onClick={() => {
                if (!recipientEmail.trim()) {
                  setStatusMessage({ type: 'error', text: 'សូមបញ្ចូលអ៊ីមែលអ្នកទទួលជាមុនសិន។' });
                  return;
                }
                setShowConfirmSendDialog(true);
              }}
              disabled={isSendingGmail || !recipientEmail.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold transition-all shadow-xs"
            >
              {isSendingGmail ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>កំពុងផ្ញើ...</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span>ផ្ញើតាម Gmail</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Explicit User Confirmation Dialog for Mutating Action (MANDATORY per Workspace integration guidelines) */}
      {showConfirmSendDialog && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  បញ្ជាក់ការផ្ញើអ៊ីមែលតាម Gmail
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  តើលោកអ្នកពិតជាចង់ផ្ញើរបាយការណ៍នេះទៅកាន់អាសយដ្ឋាន <strong className="text-slate-900">{recipientEmail}</strong> ដោយប្រើប្រាស់គណនី Gmail របស់លោកអ្នកមែនទេ?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowConfirmSendDialog(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                បោះបង់
              </button>
              <button
                onClick={executeSendGmail}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-semibold shadow-xs"
              >
                បញ្ជាក់ និងផ្ញើ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
