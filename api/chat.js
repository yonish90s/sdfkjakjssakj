const { GoogleGenerativeAI } = require("@google/generative-ai");

const DEFAULT_SYSTEM_PROMPT = `
אתה עוזר וירטואלי חכם ומקצועי עבור האתר "פרויקט 11" (Project 11). 
האתר עוסק בחדשות, טכנולוגיה, שירותים דיגיטליים, גרפים להורדה, וקביעת תורים.

הנחיות להתנהגות:
1. תענה תמיד בעברית רהוטה ומנומסת.
2. תהיה תמציתי וענייני, אך ידידותי.
3. אם שואלים אותך שאלות על האתר, תפנה את המשתמשים לעמודים הרלוונטיים (כתבות, גרפים, קביעת תור).
4. אם המשתמש רוצה ליצור קשר, תגיד לו שאפשר לשלוח מייל ל-support@project11.com.
5. אל תמציא מידע שאתה לא יודע על האתר.
`;

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
    
    // Check for multiple possible env var names
    const apiKey = process.env.GEMINI_API_KEY || process.env.aa || process.env.gemini;
    
    if (!apiKey) {
      return res.json({ text: 'סליחה, אני עדיין לומד ולא הבנתי את השאלה. תוכל לבחור אחת מהאפשרויות (1-4) או לנסות לנסח שוב? 😊' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      systemInstruction: systemPrompt || DEFAULT_SYSTEM_PROMPT
    });
    
    const chat = model.startChat({
      history: history || [],
      generationConfig: { maxOutputTokens: 1000 },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error('התקבלה תשובה ריקה');
    
    return res.status(200).json({ text });
  } catch (err) {
    console.error('GEMINI API ERROR:', err);
    return res.status(500).json({ error: 'שגיאה בבינה המלאכותית', details: err.message });
  }
};
