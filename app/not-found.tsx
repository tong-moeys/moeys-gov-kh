import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">រកមិនឃើញទំព័រ (404)</h2>
      <p className="text-gray-600 mb-6">ទំព័រដែលលោកអ្នកកំពុងស្វែងរកមិនមានឡើយ ឬត្រូវបានផ្លាស់ប្តូរទីតាំង។</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition shadow-sm"
      >
        ត្រឡប់ទៅទំព័រដើម
      </Link>
    </div>
  );
}
