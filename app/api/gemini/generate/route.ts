import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const { action, prompt, topic, context } = await req.json();

    let systemInstruction = `You are an expert pedagogical consultant and Khmer language specialist working with Cambodia's Ministry of Education, Youth and Sport (MOEYS) guidelines for Primary Schools 2026-2027 (សេចក្តីណែនាំលេខ ៤១៧ អយក.សណន ស្តីពីដំណើរការគ្រឹះស្ថានបឋមសិក្សាសាធារណៈ ឆ្នាំសិក្សា២០២៦-២០២៧).
Always answer with correct, elegant, natural Khmer orthography and grammar (អក្ខរាវិរុទ្ធត្រឹមត្រូវ).`;

    let userPrompt = '';

    if (action === 'generate_slide') {
      systemInstruction += ` You generate structured slide deck presentations in JSON format with title, subtitle, slides (each slide having slideNumber, titleKhmer, summaryKhmer, bulletPoints array, speakerNotesKhmer, iconName).`;
      userPrompt = `បង្កើតស្លាយបទបង្ហាញជាទម្រង់ JSON ស្តីពីប្រធានបទ៖ "${topic || prompt}".
Context from MOEYS 2026-2027 guideline: ${context || 'ការបង្រៀនភាសាខ្មែរ ម៉ោងសិក្សា រង្វាយតម្លៃ និងស្តង់ដាសាលាគំរូ'}.
សូមផ្តល់ JSON ក្នុងទម្រង់៖
{
  "title": "ចំណងជើងបទបង្ហាញ",
  "subtitle": "ចំណងជើងរង",
  "slides": [
    {
      "slideNumber": 1,
      "titleKhmer": "ចំណងជើងស្លាយ",
      "summaryKhmer": "សេចក្តីសង្ខេបខ្លី",
      "bulletPoints": ["ចំណុចទី១", "ចំណុចទី២", "ចំណុចទី៣"],
      "speakerNotesKhmer": "កំណត់សម្គាល់សម្រាប់វាគ្មិនពន្យល់លម្អិត",
      "iconName": "BookOpen"
    }
  ]
}`;
    } else if (action === 'generate_reel') {
      systemInstruction += ` You generate short vertical video reels (វីដេអូខ្លីៗ ៣០-៦០ វិនាទី) in JSON format. Each reel has titleKhmer, descriptionKhmer, targetDurationSeconds, and scenes array (each scene has id, sceneTitleKhmer, narrationKhmer, visualPrompt, durationSec).`;
      userPrompt = `បង្កើតសេណារីយ៉ូវីដេអូខ្លី (Short Video Reel Script) សម្រាប់ផ្សព្វផ្សាយឬបង្រៀនជាទម្រង់ JSON ស្តីពី៖ "${topic || prompt}".
សូមផ្តល់ JSON ក្នុងទម្រង់៖
{
  "titleKhmer": "ចំណងជើងវីដេអូខ្លី",
  "descriptionKhmer": "ការពិពណ៌នាខ្លី",
  "targetDurationSeconds": 45,
  "scenes": [
    {
      "id": 1,
      "sceneTitleKhmer": "ចំណងជើងឈុត",
      "narrationKhmer": "ពាក្យនិយាយអធិប្បាយក្នុងឈុតនេះជាភាសាខ្មែរយ៉ាងច្បាស់",
      "visualPrompt": "ការរៀបរាប់រូបភាពក្នុងឈុត",
      "durationSec": 8
    }
  ]
}`;
    } else if (action === 'generate_quiz') {
      systemInstruction += ` You generate interactive multiple-choice quiz questions in JSON format based on the MOEYS 2026-2027 guideline.`;
      userPrompt = `បង្កើតសំណួរតេស្ត ៣-៥ សំណួរជា JSON ស្តីពី៖ "${topic || prompt}".
សូមផ្តល់ JSON ក្នុងទម្រង់៖
{
  "questions": [
    {
      "id": 1,
      "question": "តួសំណួរជាភាសាខ្មែរ?",
      "options": ["ជម្រើស ក", "ជម្រើស ខ", "ជម្រើស គ", "ជម្រើស ឃ"],
      "correctIndex": 0,
      "explanation": "ការពន្យល់ហេតុផលត្រឹមត្រូវតាមសេចក្តីណែនាំក្រសួង"
    }
  ]
}`;
    } else if (action === 'explain_term') {
      userPrompt = `សូមពន្យល់វាក្យសព្ទអប់រំ និងវេយ្យាករណ៍ភាសាខ្មែរខាងក្រោមឱ្យបានក្បោះក្បាយ ងាយយល់ និងមានឧទាហរណ៍ប្រើប្រាស់ក្នុងវិស័យអប់រំ៖
ពាក្យ/ឃ្លា៖ "${prompt}"
Context: ${context || 'សេចក្តីណែនាំស្តីពីដំណើរការគ្រឹះស្ថានបឋមសិក្សាសាធារណៈ ២០២៦-២០២៧'}`;
    } else {
      userPrompt = prompt || 'សូមផ្តល់ព័ត៌មានបន្ថែមអំពីសេចក្តីណែនាំដំណើរការសាលាបឋមសិក្សា ២០២៦-២០២៧';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: ['generate_slide', 'generate_reel', 'generate_quiz'].includes(action)
          ? 'application/json'
          : 'text/plain',
      },
    });

    const resultText = response.text || '';
    if (['generate_slide', 'generate_reel', 'generate_quiz'].includes(action)) {
      try {
        const parsed = JSON.parse(resultText);
        return NextResponse.json({ success: true, data: parsed });
      } catch {
        return NextResponse.json({ success: true, raw: resultText });
      }
    }

    return NextResponse.json({ success: true, text: resultText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
