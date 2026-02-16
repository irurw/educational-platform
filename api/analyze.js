export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, language, level } = req.body;

    if (!content || !language || !level) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const levelPrompts = {
      comprehensive: language === 'arabic' ? 
        'ملخص شامل وتفصيلي (400-600 كلمة)' :
        'Comprehensive summary (400-600 words)',
      balanced: language === 'arabic' ?
        'ملخص متوازن (250-350 كلمة)' :
        'Balanced summary (250-350 words)',
      concise: language === 'arabic' ?
        'ملخص مختصر (150-200 كلمة)' :
        'Concise summary (150-200 words)'
    };

    const prompt = language === 'arabic' ? `أنت مساعد أكاديمي. حلل المحتوى وقدم:
1. ${levelPrompts[level]}
2. خمس نصائح دراسية
3. خمس أسئلة اختيار من متعدد

المحتوى: ${content.substring(0, 12000)}

رد بصيغة JSON فقط:
{
  "summary": "الملخص",
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3", "نصيحة 4", "نصيحة 5"],
  "questions": [
    {"question": "السؤال؟", "answers": ["أ", "ب", "ج", "د"], "correct": 0},
    {"question": "السؤال 2؟", "answers": ["أ", "ب", "ج", "د"], "correct": 1},
    {"question": "السؤال 3؟", "answers": ["أ", "ب", "ج", "د"], "correct": 2},
    {"question": "السؤال 4؟", "answers": ["أ", "ب", "ج", "د"], "correct": 0},
    {"question": "السؤال 5؟", "answers": ["أ", "ب", "ج", "د"], "correct": 3}
  ]
}` : `Academic assistant. Analyze and provide:
1. ${levelPrompts[level]}
2. Five study tips
3. Five multiple choice questions

Content: ${content.substring(0, 12000)}

Respond in JSON only:
{
  "summary": "Summary",
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "questions": [
    {"question": "Q1?", "answers": ["A", "B", "C", "D"], "correct": 0},
    {"question": "Q2?", "answers": ["A", "B", "C", "D"], "correct": 1},
    {"question": "Q3?", "answers": ["A", "B", "C", "D"], "correct": 2},
    {"question": "Q4?", "answers": ["A", "B", "C", "D"], "correct": 0},
    {"question": "Q5?", "answers": ["A", "B", "C", "D"], "correct": 3}
  ]
}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 3000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini error:', errorData);
      return res.status(response.status).json({ 
        error: 'AI service error',
        details: errorData 
      });
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content) {
      return res.status(500).json({ error: 'Invalid AI response' });
    }

    let responseText = data.candidates[0].content.parts[0].text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }

    const result = JSON.parse(responseText);

    if (!result.summary || !result.tips || !result.questions) {
      return res.status(500).json({ error: 'Incomplete AI response' });
    }

    return res.status(200).json(result);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal error',
      message: error.message 
    });
  }
}
```

4. اضغط **Commit new file**

---

## ⏳ انتظر:

- Vercel سينشر تلقائياً (30-60 ثانية)

---

## 🎉 جرّب الموقع:
```
https://educational-platform-lcram5266-ras-projects-cb308a96.vercel.app
