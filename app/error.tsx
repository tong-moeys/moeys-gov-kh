'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">មានបញ្ហាបច្ចេកទេសកើតឡើង</h2>
      <p className="text-slate-600 text-sm max-w-md mb-6">
        សូមអភ័យទោស ប្រព័ន្ធបានជួបប្រទះបញ្ហាមិនរំពឹងទុក។ សូមព្យាយាមម្តងទៀត។
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        <span>ព្យាយាមម្តងទៀត</span>
      </button>
    </div>
  );
}
