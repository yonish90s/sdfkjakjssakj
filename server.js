// Server-side logic for the digital products store
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cron = require('node-cron');
const { collectStockNews } = require('./agent/hebrew_stock_agent');
const app = express();
const PORT = process.env.PORT || 4242;

// Enable trust proxy for Vercel to correctly identify client IPs
app.set('trust proxy', 1);

// --- Rate Limiting (Security) ---
const loginLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 2, // Limit each IP to 2 attempts per day
  message: { 
    status: 'error', 
    message: 'Too many login attempts. Your IP address has been temporarily blocked for 24 hours for security reasons.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

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

// --- Admin Login API ---
app.post('/api/admin-login', loginLimiter, (req, res) => {
  const { user, pass } = req.body;
  // Use environment variables for production! (Hardcoded 1/1 for now as per current site logic)
  const ADMIN_USER = process.env.ADMIN_USER || '1';
  const ADMIN_PASS = process.env.ADMIN_PASS || '1';

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    res.json({ status: 'success', message: 'Admin logged in' });
  } else {
    res.status(401).json({ status: 'error', message: 'Invalid credentials' });
  }
});

// --- ML Intent Classifier (Lazy loaded to prevent cold start crashes) ---
let classifier = null;
const getClassifier = () => {
  if (classifier) return classifier;
  const natural = require('natural');
  classifier = new natural.BayesClassifier();
  
  classifier.addDocument('when are you open', 'hours');
  classifier.addDocument('opening hours', 'hours');
  classifier.addDocument('when can I visit', 'hours');
  classifier.addDocument('when are you open', 'hours');
  classifier.addDocument('opening hours', 'hours');

  classifier.addDocument('how to contact', 'contact');
  classifier.addDocument('talk to me', 'contact');
  classifier.addDocument('phone', 'contact');
  classifier.addDocument('email', 'contact');
  classifier.addDocument('how can I talk to you', 'contact');

  classifier.addDocument('book an appointment', 'appointment');
  classifier.addDocument('schedule a meeting', 'appointment');
  classifier.addDocument('new appointment', 'appointment');
  classifier.addDocument('how to book an appointment', 'appointment');
  classifier.addDocument('want to book an appointment', 'appointment');

  classifier.addDocument('graphs', 'charts');
  classifier.addDocument('data', 'charts');
  classifier.addDocument('data file', 'charts');
  classifier.addDocument('statistics', 'charts');
  classifier.addDocument('where are the charts', 'charts');
  
  classifier.train();
  return classifier;
};

const intentResponses = {
  hours: 'We are available for you 24/7 on our website! All articles and products are available at any time.',
  contact: 'You can send us an email at support@project11.com or use the contact form on the site.',
  appointment: 'You can easily book an appointment through the "Book Appointment" page in our navigation menu.',
  charts: 'On the "Charts" page, you can find advanced analytics, graphs, and data files for direct download.'
};

// Test endpoint
app.get('/api/test', (req, res) => res.json({ status: 'ok', message: 'Server is alive!' }));

// --- AI Chat Endpoint ---
const DEFAULT_SYSTEM_PROMPT = `
You are a smart and professional virtual assistant for the website "Project 11". 
The site deals with news, technology, digital services, downloadable graphs, and appointment scheduling.

Guidelines:
1. Always answer in clear and polite English.
2. Be concise and relevant, but friendly.
3. If asked about the site, refer users to the relevant pages (Articles, Charts, Appointment booking).
4. If the user wants to contact us, tell them they can send an email to support@project11.com.
5. Do not invent information about the site.
`;

app.post(['/api/chat', '/chat'], async (req, res) => {
  try {
    const { message, history, systemPrompt } = req.body;

    // --- ML INTENT CHECK (Fast Pass) ---
    const cls = getClassifier();
    const intent = cls.classify(message);
    const classifications = cls.getClassifications(message);
    const topScore = classifications[0].value;

    // High confidence ML match - return instant answer
    if (topScore > 0.5) {
      const response = intentResponses[intent];
      if (response) {
        return res.json({ text: response, isIntent: true });
      }
    }
    // --- END ML INTENT CHECK ---
    
    const apiKey = process.env.bbb || process.env.GEMINI_API_KEY || process.env.aa || process.env.gemini;
    
    if (!apiKey) {
      // Fallback if no API key is provided
      if (topScore > 0.001) {
        const response = intentResponses[intent];
        return res.json({ text: response, isIntent: true });
      }
      return res.json({ text: "Sorry, I'm still learning and didn't understand the question. You can try rephrasing or visit our contact page. 😊" });
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
    
    if (!text) throw new Error('Received empty response');
    
    res.json({ text });
  } catch (err) {
    console.error('GEMINI API ERROR:', err);
    res.status(500).json({ error: 'AI Error', details: err.message });
  }
});

// Serve static frontend files
app.use(express.static(process.cwd()));

// Explicit route for home page to fix "Cannot GET /"
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

// Explicit route for other common pages
app.get(['/login', '/login.html'], (req, res) => res.sendFile(path.join(process.cwd(), 'login.html')));
app.get(['/success', '/success.html'], (req, res) => res.sendFile(path.join(process.cwd(), 'success.html')));


// =============================================
// OTP System - in-memory store
// =============================================
const otpStore = new Map(); // email -> { code, expires }

// POST /api/send-otp
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(email, { code, expires });

  try {
    const resend = getResend();
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px; max-width: 400px;">
          <h2 style="color:#111;margin-bottom:8px">Your Verification Code</h2>
          <p style="color:#555;margin-bottom:20px">Enter the following code to verify your account:</p>
          <div style="background:#f5f5f7; padding:16px; font-size:2rem; font-weight:800; text-align:center; border-radius:8px; color:#0071e3; letter-spacing:4px;">${code}</div>
          <p style="color:#999;font-size:0.8rem;margin-top:16px">The code is valid for 10 minutes. Do not share it with anyone.</p>
        </div>
      `
    });
    res.json({ success: true });
  } catch (err) {
    console.error('OTP email error:', err.message);
    res.status(500).json({ error: 'Error sending email' });
  }
});

// POST /api/verify-otp
app.post('/api/verify-otp', (req, res) => {
  const { email, code } = req.body;
  const record = otpStore.get(email);

  if (!record) return res.status(400).json({ error: 'No code sent to this address' });
  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'Code expired, please request a new one' });
  }
  if (record.code !== code) return res.status(400).json({ error: 'Invalid code' });

  otpStore.delete(email);
  res.json({ success: true });
});

// GET /api/articles - Returns all articles from the articles directory

app.get('/api/articles', (req, res) => {
    try {
          const articlesDir = path.join(process.cwd(), 'articles');
          if (!fs.existsSync(articlesDir)) {
                  fs.mkdirSync(articlesDir, { recursive: true });
                  return res.json([]);
          }
          const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));
          const articles = files.map(file => {
                  const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
                  return JSON.parse(content);
          }).sort((a, b) => (b.id || 0) - (a.id || 0));
          res.json(articles);
    } catch (err) {
          console.error('Articles error:', err.message);
          res.status(500).json({ error: err.message });
    }
});

// POST /api/articles - Saves a user-submitted article to the server
app.post('/api/articles', (req, res) => {
  try {
    const article = req.body;
    if (!article.title) return res.status(400).json({ error: 'Title is required' });
    
    const articlesDir = path.join(process.cwd(), 'articles');
    if (!fs.existsSync(articlesDir)) fs.mkdirSync(articlesDir, { recursive: true });
    
    const filename = `${article.id || Date.now()}.json`;
    fs.writeFileSync(path.join(articlesDir, filename), JSON.stringify(article, null, 2));
    
    res.json({ success: true, message: 'Article saved to server' });
  } catch (err) {
    console.error('Save article error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ali-products — AliExpress products with localized pricing
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
        currency: 'usd',
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
    const customerName = session.customer_details?.name || 'Valued Customer';
    const total = (session.amount_total / 100).toFixed(2);
    const currency = session.currency?.toUpperCase() || 'ILS';

    // Build items list for the receipt
    const lineItems = session.line_items?.data || [];
    const itemsHtml = lineItems.map(item => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${item.description || item.price?.product_data?.name || 'Product'}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:left;">$${(item.amount_total / 100).toFixed(2)}</td>
      </tr>
    `).join('');

    // Send receipt email
    if (customerEmail) {
      try {
        const resend = getResend();
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: customerEmail,
          subject: '✅ Receipt for your order',
          html: `
            <div dir="ltr" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#fafafa;border-radius:16px;border:1px solid #e5e5e5;">
              <h1 style="font-size:1.6rem;font-weight:800;margin-bottom:4px;color:#111;">Thank you for your order! 🎉</h1>
              <p style="color:#666;margin-bottom:28px;">Hello ${customerName}, your order has been received successfully.</p>

              <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e5e5e5;">
                <thead>
                  <tr style="background:#111;color:#fff;">
                    <th style="padding:12px;text-align:right;">Product</th>
                    <th style="padding:12px;text-align:center;">Quantity</th>
                    <th style="padding:12px;text-align:left;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml || `<tr><td colspan="3" style="padding:12px;text-align:center;color:#888;">Product details will be sent separately</td></tr>`}
                </tbody>
              </table>

              <div style="background:#111;color:#fff;padding:16px 20px;border-radius:10px;display:flex;justify-content:space-between;margin-bottom:24px;">
                <span style="font-weight:700;font-size:1.1rem;">Total paid:</span>
                <span style="font-weight:800;font-size:1.2rem;">$${total}</span>
              </div>

              ${downloads.length > 0 ? `
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin-bottom:24px;">
                <p style="font-weight:700;color:#166534;margin-bottom:8px;">🔗 Your download links:</p>
                ${downloads.map((url, i) => `<a href="${url}" style="display:block;color:#0071e3;margin-bottom:6px;word-break:break-all;">Download file ${i+1}</a>`).join('')}
              </div>` : ''}

              <p style="color:#999;font-size:0.8rem;text-align:center;margin-top:20px;">Order ID: ${session.id}</p>
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
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const itemsHtml = (items || []).map(item => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;">${item}</td>
        <td style="padding:10px;border-bottom:1px solid #eee;text-align:left;">$${(total / items.length).toFixed(2)}</td>
      </tr>
    `).join('');

    const resend = getResend();
    console.log('Attempting to send email via Resend to:', email);
    
    const sendResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: '📄 Receipt for test order',
      html: `
        <div dir="ltr" style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#fafafa;border-radius:16px;border:1px solid #e5e5e5;">
          <h1 style="font-size:1.6rem;font-weight:800;margin-bottom:4px;color:#111;">Order Receipt (Test Mode) 🧪</h1>
          <p style="color:#666;margin-bottom:28px;">Hello ${name || 'Valued Customer'}, this is a receipt sent for system testing.</p>

          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e5e5e5;">
            <thead>
              <tr style="background:#0071e3;color:#fff;">
                <th style="padding:12px;text-align:right;">Product</th>
                <th style="padding:12px;text-align:left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background:#111;color:#fff;padding:16px 20px;border-radius:10px;display:flex;justify-content:space-between;margin-bottom:24px;">
            <span style="font-weight:700;font-size:1.1rem;">Total (Test):</span>
            <span style="font-weight:800;font-size:1.2rem;">$${total}</span>
          </div>

          <p style="color:#999;font-size:0.8rem;text-align:center;">Sent on: ${new Date().toLocaleString('en-US')}</p>
        </div>
      `
    });

    console.log('Resend response:', sendResult);
    res.json({ success: true, message: 'Receipt sent successfully', id: sendResult.id });
  } catch (err) {
    console.error('Manual receipt error:', err.message);
    res.status(500).json({ error: 'Error sending receipt: ' + err.message });
  }
});


if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`   Frontend expected at: ${FRONTEND_URL}`);
  });
}

// ── כתבות שוק ההון בעברית – כל יום ב-05:00 שעון ישראל ──────────────────────
cron.schedule('0 5 * * *', () => {
  collectStockNews().catch(err => console.error('[Cron] שגיאה:', err.message));
}, { timezone: 'Asia/Jerusalem' });
console.log('📅 Stock news cron scheduled: daily at 05:00 Asia/Jerusalem');

module.exports = app;
// Force Redeploy Mon May 11 19:45:00 IDT 2026
