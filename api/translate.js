const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { text } = req.body;
    const apiKey = process.env.bbb || process.env.GEMINI_API_KEY || process.env.aa || process.env.gemini;

    if (!apiKey) return res.status(500).json({ error: 'מפתח API חסר בשרת.' });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: "אתה מתרגם מקצועי מאנגלית לעברית. תרגם את הטקסט הבא לעברית רהוטה, טבעית ומקצועית, תוך שמירה על משמעות המקור ועל מבנה הפסקאות. אל תוסיף הערות משלך, רק את התרגום."
    });

    const result = await model.generateContent(text);
    const response = await result.response;
    const translatedText = response.text();

    return res.status(200).json({ translatedText });
  } catch (err) {
    console.error('TRANSLATION ERROR:', err);
    return res.status(500).json({ error: 'שגיאה בתרגום הטקסט', details: err.message });
  }
};
