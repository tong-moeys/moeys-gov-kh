'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="km">
      <body className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-3">មានកំហុសប្រព័ន្ធធ្ងន់ធ្ងរ</h2>
          <p className="text-slate-600 text-sm mb-6">
            ប្រព័ន្ធមិនអាចផ្ទុកទំព័របានទេ។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីផ្ទុកទំព័រឡើងវិញ។
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer"
          >
            ផ្ទុកទំព័រឡើងវិញ
          </button>
        </div>
      </body>
    </html>
  );
}
