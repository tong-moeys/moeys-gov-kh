import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'វេទិកាសិក្សាភាសាខ្មែរ និងបទដ្ឋានអប់រំបឋមសិក្សា',
  description: 'ប្រព័ន្ធឌីជីថលសម្រាប់បង្កើតបទបង្ហាញ វីដេអូខ្លីៗ សំណួរតេស្ត និងលំហាត់អនុវត្តភាសាខ្មែរ ផ្អែកលើសេចក្តីណែនាំស្តីពីដំណើរការគ្រឹះស្ថានបឋមសិក្សាសាធារណៈ ឆ្នាំសិក្សា២០២៦-២០២៧ ក្រសួងអប់រំ យុវជន និងកីឡា',
  openGraph: {
    title: 'វេទិកាសិក្សាភាសាខ្មែរ និងបទដ្ឋានអប់រំបឋមសិក្សា',
    description: 'ប្រព័ន្ធឌីជីថលសម្រាប់បង្កើតបទបង្ហាញ វីដេអូខ្លីៗ សំណួរតេស្ត និងលំហាត់អនុវត្តភាសាខ្មែរ ផ្អែកលើសេចក្តីណែនាំស្តីពីដំណើរការគ្រឹះស្ថានបឋមសិក្សាសាធារណៈ ឆ្នាំសិក្សា២០២៦-២០២៧ ក្រសួងអប់រំ យុវជន និងកីឡា',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'វេទិកាសិក្សាភាសាខ្មែរ និងបទដ្ឋានអប់រំបឋមសិក្សា',
    description: 'ប្រព័ន្ធឌីជីថលសម្រាប់បង្កើតបទបង្ហាញ វីដេអូខ្លីៗ សំណួរតេស្ត និងលំហាត់អនុវត្តភាសាខ្មែរ ផ្អែកលើសេចក្តីណែនាំស្តីពីដំណើរការគ្រឹះស្ថានបឋមសិក្សាសាធារណៈ ឆ្នាំសិក្សា២០២៦-២០២៧ ក្រសួងអប់រំ យុវជន និងកីឡា',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km" suppressHydrationWarning>
      <body
        className="bg-slate-50 text-slate-900 antialiased font-sans selection:bg-amber-100 selection:text-amber-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
