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
    const { action, prompt, topic, context, metadata } = await req.json();

    let systemInstruction = `You are an expert pedagogical consultant, administrative record officer, and Khmer language specialist working with Cambodia's Ministry of Education, Youth and Sport (MOEYS).
You have specialized expertise in MOEYS guidelines for Primary Schools 2026-2027 (សេចក្តីណែនាំលេខ ៤១៧ អយក.សណន) and Circular No. 47 on School Management Committee (SMC / គ.គ.ស.) organization and meeting procedures (លិខិតលេខ ៤៧ អយក.សណន ស្តីពីការរៀបចំ និងការប្រព្រឹត្តទៅរបស់គណៈកម្មាធិការគ្រប់គ្រងសាលារៀន).
Always answer with correct, elegant, official administrative Khmer orthography and formal governance terminology (អក្ខរាវិរុទ្ធរដ្ឋបាលត្រឹមត្រូវ និងពាក្យពេចន៍ផ្លូវការ).`;

    let userPrompt = '';

    if (action === 'generate_smc_minutes') {
      systemInstruction += ` You generate complete, formal, highly detailed MoEYS Circular No. 47 compliant School Management Committee (គ.គ.ស.) meeting minutes (កំណត់ហេតុប្រជុំ គ.គ.ស. តាមលិខិតលេខ ៤៧ អយក.សណន) in JSON format.
The generated minutes must follow the authentic Cambodian administrative meeting minutes structure:
1. Reference line: strictly referring to "លិខិតលេខ ៤៧ អយក.សណន ស្តីពីការរៀបចំ និងការប្រព្រឹត្តទៅរបស់គណៈកម្មាធិការគ្រប់គ្រងសាលារៀន"
2. Clear headers, date/time in traditional Khmer calendar style alongside western date, location, quorum and attendees.
3. Detailed, realistic, high-quality discussion minutes for every agenda item showing community/teacher/principal perspectives, debate, and consensus.
4. Formal resolutions adopted by the committee.
5. Action plan matrix table with specific tasks, assignees, deadlines, and allocated resources.
6. Closing statement.`;

      const school = metadata?.schoolName || 'សាលាបឋមសិក្សាគំរូ';
      const district = metadata?.clusterOrDistrict || 'ការិយាល័យអប់រំ យុវជន និងកីឡា នៃរដ្ឋបាលក្រុង/ស្រុក/ខណ្ឌ';
      const province = metadata?.province || 'រាជធានីភ្នំពេញ';
      const meetingType = metadata?.meetingType || 'សាមញ្ញត្រីមាសទី១';
      const agendas = metadata?.agendas && metadata.agendas.length > 0 ? metadata.agendas.join('; ') : (topic || 'ការអនុម័តផែនការកែលម្អសាលា (SIP) និងការបែងចែកថវិកាដំណើរការ (SIG/PB)');
      const notes = metadata?.notes || prompt || '';

      userPrompt = `សូមបង្កើត "កំណត់ហេតុប្រជុំគណៈកម្មាធិការគ្រប់គ្រងសាលារៀន (គ.គ.ស.)" ពេញលេញ និងត្រឹមត្រូវតាម "លិខិតលេខ ៤៧ អយក.សណន" របស់ក្រសួងអប់រំ យុវជន និងកីឡា ជាទម្រង់ JSON ស្របតាមទិន្នន័យខាងក្រោម៖
- ឈ្មោះសាលារៀន៖ ${school}
- ការិយាល័យអប់រំ/ស្រុក៖ ${district}
- ខេត្ត/រាជធានី៖ ${province}
- ប្រភេទកិច្ចប្រជុំ៖ ${meetingType}
- របៀបវារៈប្រជុំអាទិភាព៖ ${agendas}
- បរិបទ និងកំណត់សម្គាល់បន្ថែមពីសាលា៖ ${notes || 'ការប្រជុំពង្រឹងគុណភាពអប់រំ អនាម័យ និងការគ្រប់គ្រងហិរញ្ញវត្ថុតម្លាភាព'}

សូមផ្តល់ JSON ក្នុងទម្រង់ស្តង់ដារដូចខាងក្រោម (សុទ្ធតែជាភាសាខ្មែររដ្ឋបាលត្រឹមត្រូវក្បោះក្បាយ)៖
{
  "referenceCircular": "លិខិតលេខ ៤៧ អយក.សណន ស្តីពីការរៀបចំ និងការប្រព្រឹត្តទៅរបស់គណៈកម្មាធិការគ្រប់គ្រងសាលារៀន (គ.គ.ស.)",
  "docNumber": "០១/២៦ គ.គ.ស.",
  "schoolName": "${school}",
  "clusterOrDistrict": "${district}",
  "province": "${province}",
  "meetingTitle": "កំណត់ហេតុប្រជុំ គ.គ.ស. ស្តីពី...",
  "meetingType": "${meetingType}",
  "dateKhmer": "ថ្ងៃ... ខែ... ឆ្នាំ... ត្រូវនឹងថ្ងៃទី... ខែ... ឆ្នាំ២០២៦",
  "timeStart": "០៨:០០ ព្រឹក",
  "timeEnd": "១១:៣០ ព្រឹក",
  "location": "បន្ទប់ប្រជុំនៃសាលារៀន",
  "chairperson": "លោក... (មេឃុំ/ប្រធាន គ.គ.ស.)",
  "secretary": "លោក... (នាយកសាលា/លេខាធិការ គ.គ.ស.)",
  "totalMembers": 9,
  "presentCount": 9,
  "absentWithPermission": 0,
  "absentWithoutPermission": 0,
  "members": [
    {
      "id": "m1",
      "name": "ឈ្មោះសមាជិក",
      "role": "ប្រធាន គ.គ.ស.",
      "positionTitle": "មេឃុំ/ចៅសង្កាត់ ឬតំណាងសហគមន៍",
      "isPresent": true
    },
    {
      "id": "m2",
      "name": "ឈ្មោះសមាជិក",
      "role": "អនុប្រធាន គ.គ.ស.",
      "positionTitle": "តំណាងមាតាបិតាសិស្ស",
      "isPresent": true
    },
    {
      "id": "m3",
      "name": "ឈ្មោះសមាជិក",
      "role": "លេខាធិការ (សមាជិកអចិន្ត្រៃយ៍)",
      "positionTitle": "នាយកសាលាបឋមសិក្សា",
      "isPresent": true
    },
    {
      "id": "m4",
      "name": "ឈ្មោះសមាជិក",
      "role": "សមាជិក",
      "positionTitle": "តំណាងលោកគ្រូ-អ្នកគ្រូ",
      "isPresent": true
    },
    {
      "id": "m5",
      "name": "ឈ្មោះសមាជិក",
      "role": "សមាជិក",
      "positionTitle": "តំណាងសហគមន៍/ឥស្សរជនភូមិ",
      "isPresent": true
    },
    {
      "id": "m6",
      "name": "ឈ្មោះសមាជិក",
      "role": "សមាជិក",
      "positionTitle": "ប្រធានក្រុមប្រឹក្សាកុមារសាលារៀន",
      "isPresent": true
    }
  ],
  "agendas": [
    {
      "id": 1,
      "title": "ចំណងជើងរបៀបវារៈទី១",
      "reporter": "អ្នករាយការណ៍",
      "discussionSummary": "សេចក្តីសង្ខេបលម្អិតនៃដំណើរការពិភាក្សា និងមតិយោបល់របស់សមាជិកអង្គប្រជុំជាភាសាខ្មែររដ្ឋបាលយ៉ាងក្បោះក្បាយ",
      "decision": "សេចក្តីសម្រេចរបស់អង្គប្រជុំលើចំណុចនេះ"
    }
  ],
  "generalResolutions": [
    "សេចក្តីសម្រេចសំខាន់ទី១ ដែលអង្គប្រជុំបានឯកភាព",
    "សេចក្តីសម្រេចសំខាន់ទី២",
    "សេចក្តីសម្រេចសំខាន់ទី៣"
  ],
  "actionPlans": [
    {
      "id": 1,
      "activity": "សកម្មភាពជាក់លាក់ដែលត្រូវអនុវត្ត",
      "responsiblePerson": "អ្នកទទួលខុសត្រូវ (ឧ. នាយកសាលា, គណៈកម្មការលទ្ធកម្ម...)",
      "deadline": "កាលបរិច្ឆេទកំណត់",
      "resources": "ប្រភពធនធាន/ថវិកា (SIG, សហគមន៍...)",
      "status": "pending"
    }
  ],
  "closingRemarks": "សេចក្តីថ្លែងការណ៍បិទបញ្ចប់អង្គប្រជុំ និងការចុះហត្ថលេខាឯកភាពជាភស្តុតាង"
}`;
    } else if (action === 'generate_slide') {
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
      userPrompt = `សូមពន្យល់វាក្យសព្ទអប់រំ និងបទដ្ឋានក្រសួងអប់រំខាងក្រោមឱ្យបានក្បោះក្បាយ ងាយយល់ និងមានឧទាហរណ៍ប្រើប្រាស់ក្នុងវិស័យអប់រំ (រួមទាំងលិខិតលេខ ៤៧ អយក.សណន ស្តីពី គ.គ.ស. និងសេចក្តីណែនាំលេខ ៤១៧)៖
ពាក្យ/ឃ្លា៖ "${prompt}"
Context: ${context || 'សេចក្តីណែនាំស្តីពីដំណើរការគ្រឹះស្ថានបឋមសិក្សាសាធារណៈ ២០២៦-២០២៧ និងលិខិតលេខ ៤៧ អយក.សណន'}`;
    } else {
      userPrompt = prompt || 'សូមផ្តល់ព័ត៌មានបន្ថែមអំពីសេចក្តីណែនាំដំណើរការសាលាបឋមសិក្សា ២០២៦-២០២៧ និងការងារ គ.គ.ស. តាមលិខិតលេខ ៤៧';
    }

    const isJsonAction = ['generate_slide', 'generate_reel', 'generate_quiz', 'generate_smc_minutes'].includes(action);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: isJsonAction ? 'application/json' : 'text/plain',
      },
    });

    const resultText = response.text || '';
    if (isJsonAction) {
      try {
        const parsed = JSON.parse(resultText);
        return NextResponse.json({ success: true, data: parsed });
      } catch (err: any) {
        console.error('JSON parse error from Gemini response:', err);
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
