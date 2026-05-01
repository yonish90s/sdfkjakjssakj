// Server-side logic for the digital products store
const express = require('express');
const { Resend } = require('resend');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
const PORT = process.env.PORT || 4242;

// SDK Helpers (Initialize only when needed to prevent crashes)
const getStripe = () => require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const getResend = () => {
  const { Resend } = require('resend');
  return new Resend(process.env.RESEND_API_KEY || '');
};

const FRONTEND_URL = process.env.FRONTEND_URL 
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

app.use(cors({ origin: '*' }));
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => res.json({ status: 'ok', message: 'Server is alive!' }));

// --- AI Chat Endpoint ---
app.post(['/api/chat', '/chat'], async (req, res) => {
  try {
    const { message, history, systemPrompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('SERVER ERROR: GEMINI_API_KEY is missing.');
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
    
    res.json({ text });
  } catch (err) {
    console.error('GEMINI API ERROR:', err);
    res.status(500).json({ error: 'שגיאה בבינה המלאכותית', details: err.message });
  }
});

// Serve static frontend files
app.use(express.static(__dirname));

// Payment & Other Endpoints (Existing logic preserved...)
// ... (I will keep the rest of the file content intact but without the cron part)

// =============================================
// OTP System - in-memory store
// =============================================
const otpStore = new Map(); // email -> { code, expires }

// POST /api/send-otp
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'נדרש מייל' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 דקות
  otpStore.set(email, { code, expires });

  try {
    const resend = getResend();
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'קוד האימות שלך',
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:400px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px">
          <h2 style="color:#111;margin-bottom:8px">קוד האימות שלך</h2>
          <p style="color:#555;margin-bottom:20px">הכנס את הקוד הבא כדי לאמת את החשבון שלך:</p>
          <div style="background:#111;color:#fff;font-size:2rem;font-weight:bold;letter-spacing:12px;text-align:center;padding:20px;border-radius:8px">${code}</div>
          <p style="color:#999;font-size:0.8rem;margin-top:16px">הקוד תקף ל-10 דקות. אל תשתף אותו עם אף אחד.</p>
        </div>
      `
    });
    res.json({ success: true });
  } catch (err) {
    console.error('OTP email error:', err.message);
    res.status(500).json({ error: 'שגיאה בשליחת המייל' });
  }
});

// POST /api/verify-otp
app.post('/api/verify-otp', (req, res) => {
  const { email, code } = req.body;
  const record = otpStore.get(email);

  if (!record) return res.status(400).json({ error: 'לא נשלח קוד לכתובת זו' });
  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'הקוד פג תוקף, בקש קוד חדש' });
  }
  if (record.code !== code) return res.status(400).json({ error: 'קוד שגוי' });

  otpStore.delete(email);
  res.json({ success: true });
});

// GET /api/articles - מחזיר את כל הכתבות מתיקיית articles
const fs = require('fs');
const path = require('path');

app.get('/api/articles', (req, res) => {
    try {
          const articlesDir = path.join(process.cwd(), 'articles');
          if (!fs.existsSync(articlesDir)) {
                  return res.json([]);
          }
          const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));
          const articles = files.map(file => {
                  const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
                  return JSON.parse(content);
          }).sort((a, b) => new Date(b.date) - new Date(a.date));
          res.json(articles);
    } catch (err) {
          console.error('Articles error:', err.message);
          res.status(500).json({ error: err.message });
    }
});

// GET /api/ali-products — מוצרי אלי אקספרס עם מחיר כפול
app.get('/api/ali-products', (req, res) => {
  try {
    const filePath = path.join(process.cwd(), 'aliexpress_products.json');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Products file not found. Run: python3 agent/aliexpress_agent.py' });
    }
    const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// Products database (server-side, with private download URLs)
// Add your real download links here — they are NEVER exposed to the browser
// =============================================
const PRODUCTS_DB = {
  1: { downloadUrl: 'https://drive.google.com/your-figma-course-link' },
  2: { downloadUrl: 'https://drive.google.com/your-wp-template-link' },
  3: { downloadUrl: 'https://drive.google.com/your-icons-link' },
  4: { downloadUrl: 'https://drive.google.com/your-js-course-link' },
  5: { downloadUrl: 'https://drive.google.com/your-fonts-link' },
  6: { downloadUrl: 'https://drive.google.com/your-notion-link' },
  7: { downloadUrl: 'https://drive.google.com/your-photo-course-link' },
  8: { downloadUrl: 'https://drive.google.com/your-music-link' },
};

// POST /api/create-checkout-session
// Body: { items: [{ id, name, price, desc }] }
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'ils',
        product_data: {
          name: item.name,
          description: item.desc || undefined,
        },
        unit_amount: Math.round(item.price * 100), // agorot
      },
      quantity: 1,
    }));

    const productIds = items.map(i => i.id);
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      metadata: { productIds: JSON.stringify(productIds) },
      success_url: `${FRONTEND_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/`,
      locale: 'auto',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/order/:sessionId
// Called by success.html to retrieve download links after payment
app.get('/api/order/:sessionId', async (req, res) => {
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
      expand: ['line_items']
    });

    if (session.payment_status !== 'paid') {
      return res.status(403).json({ error: 'Payment not completed' });
    }

    const productIds = JSON.parse(session.metadata.productIds || '[]');
    const downloads = productIds.map(id => {
      const product = PRODUCTS_DB[id];
      return product ? product.downloadUrl : null;
    }).filter(Boolean);

    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name || 'לקוח יקר';
    const total = (session.amount_total / 100).toFixed(2);
    const currency = session.currency?.toUpperCase() || 'ILS';

    // Build items list for the receipt
    const lineItems = session.line_items?.data || [];
    const itemsHtml = lineItems.map(item => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${item.description || item.price?.product_data?.name || 'מוצר'}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:left;">₪${(item.amount_total / 100).toFixed(2)}</td>
      </tr>
    `).join('');

    // Send receipt email
    if (customerEmail) {
      try {
        const resend = getResend();
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: customerEmail,
          subject: '✅ קבלה על הזמנתך',
          html: `
            <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#fafafa;border-radius:16px;border:1px solid #e5e5e5;">
              <h1 style="font-size:1.6rem;font-weight:800;margin-bottom:4px;color:#111;">תודה על הזמנתך! 🎉</h1>
              <p style="color:#666;margin-bottom:28px;">שלום ${customerName}, ההזמנה שלך התקבלה בהצלחה.</p>

              <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e5e5e5;">
                <thead>
                  <tr style="background:#111;color:#fff;">
                    <th style="padding:12px;text-align:right;">מוצר</th>
                    <th style="padding:12px;text-align:center;">כמות</th>
                    <th style="padding:12px;text-align:left;">מחיר</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml || `<tr><td colspan="3" style="padding:12px;text-align:center;color:#888;">פרטי המוצר יישלחו בנפרד</td></tr>`}
                </tbody>
              </table>

              <div style="background:#111;color:#fff;padding:16px 20px;border-radius:10px;display:flex;justify-content:space-between;margin-bottom:24px;">
                <span style="font-weight:700;font-size:1.1rem;">סה"כ ששולם:</span>
                <span style="font-weight:800;font-size:1.2rem;">₪${total}</span>
              </div>

              ${downloads.length > 0 ? `
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin-bottom:24px;">
                <p style="font-weight:700;color:#166534;margin-bottom:8px;">🔗 קישורי ההורדה שלך:</p>
                ${downloads.map((url, i) => `<a href="${url}" style="display:block;color:#0071e3;margin-bottom:6px;word-break:break-all;">הורד קובץ ${i+1}</a>`).join('')}
              </div>` : ''}

              <p style="color:#999;font-size:0.8rem;text-align:center;margin-top:20px;">מספר הזמנה: ${session.id}</p>
            </div>
          `
        });
        console.log('Receipt email sent to:', customerEmail);
      } catch (emailErr) {
        console.error('Receipt email error:', emailErr.message);
        // Don't fail the order if email fails
      }
    }

    res.json({ downloads, customerEmail });
  } catch (err) {
    console.error('Order lookup error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/send-receipt (Simple manual receipt for testing)
app.post('/api/send-receipt', async (req, res) => {
  try {
    const { email, name, items, total } = req.body;
    if (!email) return res.status(400).json({ error: 'נדרש מייל' });

    const itemsHtml = (items || []).map(item => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${item}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:left;">₪${(total / items.length).toFixed(2)}</td>
      </tr>
    `).join('');

    const resend = getResend();
    console.log('Attempting to send email via Resend to:', email);
    
    const sendResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '📄 קבלה על הזמנת בדיקה',
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#fafafa;border-radius:16px;border:1px solid #e5e5e5;">
          <h1 style="font-size:1.6rem;font-weight:800;margin-bottom:4px;color:#111;">קבלה על הזמנה (מצב בדיקה) 🧪</h1>
          <p style="color:#666;margin-bottom:28px;">שלום ${name || 'לקוח יקר'}, זוהי קבלה שנשלחה לבדיקה של המערכת.</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e5e5e5;">
            <thead>
              <tr style="background:#0071e3;color:#fff;">
                <th style="padding:12px;text-align:right;">מוצר</th>
                <th style="padding:12px;text-align:left;">מחיר</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background:#111;color:#fff;padding:16px 20px;border-radius:10px;display:flex;justify-content:space-between;margin-bottom:24px;">
            <span style="font-weight:700;font-size:1.1rem;">סה"כ (בדיקה):</span>
            <span style="font-weight:800;font-size:1.2rem;">₪${total}</span>
          </div>

          <p style="color:#999;font-size:0.8rem;text-align:center;">נשלח בתאריך: ${new Date().toLocaleString('he-IL')}</p>
        </div>
      `
    });

    console.log('Resend response:', sendResult);
    res.json({ success: true, message: 'Receipt sent successfully', id: sendResult.id });
  } catch (err) {
    console.error('Manual receipt error:', err.message);
    res.status(500).json({ error: 'שגיאה בשליחת הקבלה: ' + err.message });
  }
});


if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`   Frontend expected at: ${FRONTEND_URL}`);
  });
}

module.exports = app;
