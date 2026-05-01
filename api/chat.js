const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Add CORS headers for serverless function
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history, systemPrompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'מפתח Gemini API חסר בשרת.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const chat = model.startChat({
      history: history || [],
      generationConfig: { maxOutputTokens: 1000 },
    });

    const fullPrompt = systemPrompt 
      ? `הנחיות מערכת: ${systemPrompt}\n\nהודעת משתמש: ${message}` 
      : message;

    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error('התקבלה תשובה ריקה');
    
    return res.status(200).json({ text });
  } catch (err) {
    console.error('GEMINI API ERROR:', err);
    return res.status(500).json({ error: 'שגיאה בבינה המלאכותית', details: err.message });
  }
};
