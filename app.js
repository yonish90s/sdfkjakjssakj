// ========== DATA ==========

const defaultNewsArticles = [
  { id: 1, title: 'לנובו מרעננת את סדרת ניידי ה-ThinkPad עם חמישה דגמים חדשים', image: 'https://images.unsplash.com/photo-1531297122539-5692f69f1092?auto=format&fit=crop&q=80&w=800', category: 'מחשבים', isTop: 1, author: 'מערכת החדשות', time: 'היום, 18:30' },
  { id: 2, title: 'גוגל מציגה: תהליך אבטחה חדש להתקנת אפליקציות באנדרואיד', image: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=800', category: 'אבטחה', isTop: 2, author: 'מערכת החדשות', time: 'היום, 17:00' },
  { id: 3, title: 'הוכרז: Xiaomi Watch S5 - מסך גדול יותר, ועד 21 ימי סוללה', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', category: 'שעונים חכמים', isTop: 3, author: 'מערכת החדשות', time: 'היום, 16:00' },
  { id: 4, title: 'גוגל משדרגת את מנוי ה-Google AI Pro ל-5TB, ללא תוספת תשלום', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800', author: 'מערכת החדשות', time: 'היום, 16:45', snippet: 'נקודת עיקריות גוגל משדרגת את נפח אחסון מ-2TB ל-5TB. הגדלת הנפח מתבצעת ללא שינוי במחיר, שעומד על 74.90 שקלים בישראל. המהלך נועד להפוך את התוכנית לאטרקטיבית יותר עבור משתמשים הדורשים שטח רב עבור תוצרי בינה מלאכותית...', category: 'גוגל' },
  { id: 5, title: 'וואטסאפ מזהירה: כ-200 משתמשים הורידו גרסה מזויפת עם תוכנת ריגול', image: 'https://images.unsplash.com/photo-1614064641913-6b7140414f70?auto=format&fit=crop&q=80&w=800', author: 'מערכת החדשות', time: 'היום, 15:45', snippet: 'חוקרי אבטחה מזהירים כי גרסה מזויפת של וואטסאפ עוקפת את מנגנוני ההגנה של חנות האפליקציות, במטרה לאסוף מידע אישי על המשתמשים...', category: 'אבטחה' },
  { id: 6, title: 'גוגל מכריזה על Wear OS 6.1: זיהוי מיקום עצמאי ושדרוג חשבונות ילדים', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800', author: 'מערכת החדשות', time: 'היום, 12:12', snippet: 'העדכון משפר את יכולות השעונים החכמים, במטרה להתחרות ראש בראש עם שעוני אפל בגרסאותיהם החדשות.', category: 'גוגל' },
  { id: 7, title: 'אנבידיה מציגה את טכנולוגיית ה-Auto Shader Compilation לקיצור זמני טעינה במשחקים', image: 'https://images.unsplash.com/photo-1598550487031-0898b4852123?auto=format&fit=crop&q=80&w=800', author: 'מערכת החדשות', time: 'היום, 10:40', snippet: 'הטכנולוגיה החדשה צפויה לחסוך שניות יקרות בעת טעינת המשחק הראשונית, ומונעת כליל את צורך בדימוי גרפי מיותר מראש.', category: 'חומרה' },
  { id: 8, title: 'טלגרם מציגה: עורך טקסט מבוסס AI, שדרוג לסקרים ותמיכה בתמונות חיים', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800', author: 'מערכת החדשות', time: 'היום, 09:19', snippet: 'גרסת טלגרם החדשה כוללת חידושים בולטים הנוגעים לכלי הבינה המלאכותית ולנוחות השיתוף בפלטפורמה.', category: 'אפליקציות' }
];

const defaultPdfStoreItems = [];





let storedPdfItems = localStorage.getItem('pdfStoreItems');
if (!storedPdfItems || JSON.parse(storedPdfItems).length === 0) {
  localStorage.setItem('pdfStoreItems', JSON.stringify(defaultPdfStoreItems));
}

const SERVER_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:4242' 
  : window.location.origin;

let storedArticles = localStorage.getItem('newsArticles');
let newsArticles = storedArticles ? JSON.parse(storedArticles) : [...defaultNewsArticles];
if (!storedArticles) {
  localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
}

let nextId = newsArticles.length ? Math.max(...newsArticles.map(a => a.id)) + 1 : 1;

// =====================================================================
// Auto-fetch scraped articles from articles.json (populated by agent)
// User-added articles (id < 1000) are preserved; scraped ones use id >= 1000
// =====================================================================
(async function loadScrapedArticles() {
  try {
    const resp = await fetch('articles.json?ts=' + Date.now());
    if (!resp.ok) return;
    const scraped = await resp.json();
    if (!Array.isArray(scraped) || scraped.length === 0) return;

    // Keep user's custom articles (id < 1000)
    const userArticles = newsArticles.filter(a => (a.id ?? 0) < 1000);
    
    // For scraped articles, merge local flags (like isPremium) if they exist
    const mergedScraped = scraped.map(s => {
      const local = newsArticles.find(ln => ln.id === s.id);
      if (local) {
        return { ...s, isPremium: local.isPremium ?? s.isPremium, isTop: local.isTop ?? s.isTop };
      }
      return s;
    });

    newsArticles = [...mergedScraped, ...userArticles];
    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));

    // Re-render if we're on the home page
    if (document.getElementById('top-news-grid')) {
      if (typeof renderNewsLayout === 'function') renderNewsLayout();
    }
    console.log(`[articles] Loaded ${scraped.length} scraped articles`);
  } catch (e) {
    // Silently fail - site works fine with defaults
    console.log('[articles] No articles.json found, using defaults');
  }
})();
let isAdmin = localStorage.getItem('isAdmin') === 'true';
// Cleanup obsolete data
if (localStorage.getItem('viewerPhotos')) localStorage.removeItem('viewerPhotos');
if (localStorage.getItem('comicsStore')) localStorage.removeItem('comicsStore');
if (localStorage.getItem('pdfStoreItems')) localStorage.removeItem('pdfStoreItems');

let previousPage = 'home';

// ========== SOCIAL LINKS LOGIC ==========
const defaultSocialLinks = {
  x: 'https://x.com',
  fb: 'https://facebook.com',
  ig: 'https://instagram.com',
  yt: 'https://youtube.com'
};

function loadSocialLinks() {
  const links = JSON.parse(localStorage.getItem('siteSocialLinks') || JSON.stringify(defaultSocialLinks));
  applySocialLinksToUI(links);
  return links;
}

function applySocialLinksToUI(links) {
  const ids = { x: 'footer-link-x', fb: 'footer-link-fb', ig: 'footer-link-ig', yt: 'footer-link-yt' };
  for (const [key, id] of Object.entries(ids)) {
    const el = document.getElementById(id);
    if (el) el.href = links[key] || '#';
  }
}

function saveSocialLinks() {
  if (!isAdmin) {
    showToast('❌ אין לך הרשאות לבצע פעולה זו');
    return;
  }
  const links = {
    x: document.getElementById('admin-social-x').value,
    fb: document.getElementById('admin-social-fb').value,
    ig: document.getElementById('admin-social-ig').value,
    yt: document.getElementById('admin-social-yt').value
  };
  localStorage.setItem('siteSocialLinks', JSON.stringify(links));
  applySocialLinksToUI(links);
  showToast('✅ הקישורים עודכנו בהצלחה');
}

function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.add('active');
    showToast('טוען מערכת תשלום מאובטחת...');
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');
}

function toggleNavDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('nav-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

// Close dropdown when clicking outside
window.addEventListener('click', (e) => {
  const dropdown = document.getElementById('nav-dropdown');
  if (dropdown && dropdown.classList.contains('active')) {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  }
});

// ========== NAVIGATION ==========
function showPage(page) {
  if (page === 'checkout') {
    openCheckoutModal();
    return;
  }
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));
  
  const targetPage = document.getElementById(`page-${page}`);
  if (targetPage) {
    targetPage.classList.add('active');
  } else {
    console.warn('Page not found:', page);
    const home = document.getElementById('page-home');
    if (home) home.classList.add('active');
  }

  if (page === 'home') renderNewsLayout();
  if (page === 'store') renderStoreLayout();
  if (page === 'pdf-store') { syncPdfItemsFromFirebase(); renderPdfStoreGrid(); }
  if (page === 'shop') { loadAliExpressProducts(); renderShopGrid(); }
  if (page === 'services') renderServicesGrid();
  if (page === 'subscription') window.scrollTo({ top: 0, behavior: 'smooth' });
  if (page === 'appointments') initBookingWidget();
  
  if (page === 'join') {
    if (currentUser) {
      document.getElementById('join-name').value = currentUser.name || '';
      document.getElementById('join-email').value = currentUser.email || '';
      document.getElementById('join-password').value = '';
      document.getElementById('btn-logout').style.display = 'block';
      document.querySelector('.auth-tabs').style.display = 'none';
      document.getElementById('auth-login-section').style.display = 'none';
      document.getElementById('auth-register-section').style.display = 'block';
      document.getElementById('auth-register-section').querySelector('h2')?.remove(); 
      // Maybe add a heading "פרופיל אישי"
    } else {
      document.getElementById('join-name').value = '';
      document.getElementById('join-email').value = '';
      document.getElementById('join-password').value = '';
      document.getElementById('btn-logout').style.display = 'none';
      document.querySelector('.auth-tabs').style.display = 'flex';
      switchAuthTab('login');
    }
  }
  if (page === 'admin') {
    if (!isAdmin) {
      showPage('admin-login');
      return;
    }
    initAdminDashboard();
  }

  updateFloatingButtons(page);
}

function updateFloatingButtons(page = null) {
  if (!page) {
    const activePage = document.querySelector('.page.active');
    page = activePage ? activePage.id.replace('page-', '') : 'home';
  }

  const isStore = ['store', 'pdf-store', 'shop', 'services', 'appointments', 'product-detail'].includes(page);
  const supportBtn = document.getElementById('support-floating-btn');
  const cartBtn = document.querySelector('.cart-nav-btn');
  
  if (window.innerWidth <= 768) {
    if (supportBtn) supportBtn.style.display = isStore ? 'flex' : 'none';
    if (cartBtn) cartBtn.style.display = isStore ? 'flex' : 'none';
  } else {
    if (supportBtn) supportBtn.style.display = 'flex';
    if (cartBtn) cartBtn.style.display = 'flex';
  }
}

window.addEventListener('resize', () => {
  updateFloatingButtons();
});



// ========== BOOKING LOGIC ==========
// ========== BOOKING LOGIC ==========
function initBookingWidget() {
  const grid = document.getElementById('book-time-grid');
  if (!grid) return;
  const day = document.getElementById('book-day').value;
  const appts = JSON.parse(localStorage.getItem('appointments') || '[]');
  
  let html = '';
  selectedTime = ''; // Reset selection on day change
  
  for (let h = 7; h <= 18; h++) {
    const time = `${h.toString().padStart(2, '0')}:00`;
    // Check if this slot is already booked for this specific day
    const isBooked = appts.some(a => a.day === day && a.time === time);
    
    if (isBooked) {
      html += `<div class="time-slot booked" style="padding:10px; border:1px solid #eee; border-radius:10px; text-align:center; font-size:0.9rem; font-weight:600; background:#f5f5f7; color:#d2d2d7; cursor:not-allowed; text-decoration:line-through;">${time}</div>`;
    } else {
      html += `<div class="time-slot" onclick="selectTime(this)" style="padding:10px; border:1px solid #d2d2d7; border-radius:10px; text-align:center; cursor:pointer; font-size:0.9rem; font-weight:600; transition:0.2s; background:#fff; color:#1d1d1f;">${time}</div>`;
    }
  }
  grid.innerHTML = html;
}

let selectedTime = '';
function selectTime(el) {
  if (el.classList.contains('booked')) return;
  document.querySelectorAll('.time-slot').forEach(s => {
    if (!s.classList.contains('booked')) {
      s.style.borderColor = '#d2d2d7';
      s.style.backgroundColor = '#fff';
      s.style.color = '#1d1d1f';
    }
  });
  el.style.borderColor = '#0071e3';
  el.style.backgroundColor = 'rgba(0, 113, 227, 0.05)';
  el.style.color = '#0071e3';
  selectedTime = el.textContent;
}

function openBookingModal() {
  const day = document.getElementById('book-day').value;
  if (!selectedTime) {
    showToast('❌ נא לבחור שעה פנויה');
    return;
  }
  
  document.getElementById('booking-selected-info').textContent = `יום ${day} בשעה ${selectedTime}`;
  document.getElementById('booking-modal').classList.add('active');
}

function closeBookingModal() {
  document.getElementById('booking-modal').classList.remove('active');
}

// stub — prevents crash from duplicate definition above
function openAddSiteModal() { showToast('בקרוב: הוספת אתר'); }
function closeComicPasswordModal() { const m = document.getElementById('comic-password-modal'); if (m) m.classList.remove('active'); }
function verifyComicPassword() { closeComicPasswordModal(); }

function submitBookingDirect() {
  const name = document.getElementById('book-name-direct').value;
  const phone = document.getElementById('book-phone-direct').value;
  const request = document.getElementById('book-request-direct').value;
  const day = document.getElementById('book-day').value;
  
  if (!selectedTime) {
    showToast('❌ נא לבחור שעה פנויה');
    return;
  }
  if (!name || !phone) {
    showToast('❌ נא למלא שם וטלפון');
    return;
  }

  const appt = {
    id: Date.now(),
    name,
    phone,
    request,
    day,
    time: selectedTime,
    created: new Date().toLocaleString('he-IL')
  };
  
  const appts = JSON.parse(localStorage.getItem('appointments') || '[]');
  appts.push(appt);
  localStorage.setItem('appointments', JSON.stringify(appts));
  
  showToast('✅ התור נקבע בהצלחה!');
  
  // Transition to Success View
  document.getElementById('booking-form-view').style.display = 'none';
  document.getElementById('booking-success-view').style.display = 'block';

  // Clear direct inputs
  document.getElementById('book-name-direct').value = '';
  document.getElementById('book-phone-direct').value = '';
  document.getElementById('book-request-direct').value = '';
  
  initBookingWidget(); // Refresh grid to remove booked slot
}

function resetBookingView() {
  document.getElementById('booking-form-view').style.display = 'block';
  document.getElementById('booking-success-view').style.display = 'none';
  selectedTime = ''; // Reset selection
  initBookingWidget();
}

function submitBooking(e) {
  e.preventDefault();
  const name = document.getElementById('book-name').value;
  const phone = document.getElementById('book-phone').value;
  const request = document.getElementById('book-request').value;
  const day = document.getElementById('book-day').value;
  
  const appt = {
    id: Date.now(),
    name,
    phone,
    request,
    day,
    time: selectedTime,
    created: new Date().toLocaleString('he-IL')
  };
  
  const appts = JSON.parse(localStorage.getItem('appointments') || '[]');
  appts.push(appt);
  localStorage.setItem('appointments', JSON.stringify(appts));
  
  showToast('✅ התור נקבע בהצלחה!');
  
  // If on appointments page, show success view
  const formView = document.getElementById('booking-form-view');
  if (formView && document.getElementById('page-appointments').classList.contains('active')) {
    formView.style.display = 'none';
    document.getElementById('booking-success-view').style.display = 'block';
  }

  closeBookingModal();
  e.target.reset();
  initBookingWidget(); // Refresh grid to remove booked slot
}

// ========== ADMIN CALENDAR ==========
function renderAdminCalendar() {
  const list = document.getElementById('admin-calendar-list');
  if (!list) return;
  const appts = JSON.parse(localStorage.getItem('appointments') || '[]');
  
  if (appts.length === 0) {
    list.innerHTML = '<div style="text-align:center; padding:40px; color:#86868b;">אין תורים קבועים ביומן.</div>';
    return;
  }
  
  list.innerHTML = appts.reverse().map(a => `
    <div style="background:#f5f5f7; border-radius:12px; padding:24px; border:1px solid var(--border-subtle); text-align:right;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
        <div>
          <div style="font-weight:800; font-size:1.2rem; color:#1d1d1f; margin-bottom:4px;">${escHtml(a.name)}</div>
          <div style="font-size:0.95rem; color:#86868b;">📞 ${escHtml(a.phone)}</div>
        </div>
        <div style="text-align:left;">
          <div style="font-weight:800; color:#0071e3; font-size:1.1rem;">יום ${escHtml(a.day)} | ${escHtml(a.time)}</div>
          <div style="font-size:0.75rem; color:#86868b; margin-top:6px;">נקבע ב: ${a.created}</div>
        </div>
      </div>
      ${a.request ? `
        <div style="background:#fff; border-radius:10px; padding:16px; border:1px solid #e1e1e6; font-size:1rem; color:#424245; line-height:1.5;">
          <strong>בקשה:</strong> ${escHtml(a.request)}
        </div>
      ` : ''}
    </div>
  `).join('');
}

function clearAppointments() {
  if (confirm('האם אתה בטוח שברצונך למחוק את כל התורים?')) {
    localStorage.removeItem('appointments');
    renderAdminCalendar();
    showToast('🗑️ היומן נוקה');
  }
}


function goBack() {
  showPage(previousPage);
}

// ========== RENDER NEWS ==========
let currentPage = 1;
const ARTICLES_PER_PAGE = 10;

function renderNewsLayout(page = 1) {
  currentPage = page;
  const topGrid = document.getElementById('top-news-grid');
  const feedList = document.getElementById('news-feed-list');
  const paginationEl = document.getElementById('news-pagination');
  if(!topGrid || !feedList) return;

  // Top 3 hero cards only on first page
  const topArticles = newsArticles.filter(x => x.isTop && x.approved !== false).sort((a,b) => a.isTop - b.isTop);
  if (page === 1) {
    topGrid.innerHTML = topArticles.map(a => `
      <div class="top-news-card" onclick="showArticle(${a.id})">
        <div class="top-news-bg" style="background-image: url('${a.image}')"></div>
        <div class="top-news-overlay">
          ${a.isPremium ? `<div style="font-size:0.75rem; font-weight:800; color:#f9b233; margin-bottom:8px; display:flex; align-items:center; gap:4px; text-transform:uppercase;"><i class="fas fa-crown"></i> פרימיום</div>` : ''}
          <h3>${escHtml(a.title)}</h3>
        </div>
      </div>
    `).join('');
  }

  const feedArticles = newsArticles.filter(x => !x.isTop && x.approved !== false);
  const totalPages = Math.max(1, Math.ceil(feedArticles.length / ARTICLES_PER_PAGE));
  const start = (page - 1) * ARTICLES_PER_PAGE;
  const pageArticles = feedArticles.slice(start, start + ARTICLES_PER_PAGE);

  feedList.innerHTML = pageArticles.map(a => `
    <div class="feed-item" onclick="showArticle(${a.id})">
      <div class="feed-image" style="background-image: url('${a.image}')"></div>
      <div class="feed-content">
        <h2 class="feed-title">${escHtml(a.title)}</h2>
        <div class="feed-meta"><span class="author-name">${escHtml(a.author)}</span> <span class="meta-sep">|</span> <span class="meta-date">${escHtml(a.time)}</span></div>
        ${a.snippet ? `<p class="feed-snippet">${escHtml(a.snippet)}</p>` : ''}
        ${a.isPremium ? `<div style="margin-top:8px; font-size:0.8rem; font-weight:700; color:#f9b233; display:flex; align-items:center; gap:4px;"><i class="fas fa-crown"></i> פרימיום</div>` : ''}
      </div>
    </div>
  `).join('');

  // Render pagination buttons
  if (paginationEl) {
    if (totalPages <= 1) {
      paginationEl.innerHTML = '';
    } else {
      paginationEl.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
        <button onclick="renderNewsLayout(${p}); window.scrollTo({top:0,behavior:'smooth'});"
          style="padding: 8px 16px; border-radius: 980px; border: 1px solid ${p === page ? '#0071e3' : '#ccc'};
          background: ${p === page ? '#0071e3' : '#fff'}; color: ${p === page ? '#fff' : '#1d1d1f'};
          font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;">
          ${p}
        </button>
      `).join('');
    }
  }
  
  // Render Ads on Home
  if (page === 1) {
    renderAdsSidebar();
  }
}

function filterCategory(cat) {
  // Logic not fully implemented since this is a UI prototype
  alert('Filtering by: ' + cat);
}

function showArticle(id) {
  currentArticleId = id;
  previousPage = document.querySelector('.page.active')?.id?.replace('page-', '') || 'home';
  const a = newsArticles.find(x => x.id === id);
  if (!a) return;

  document.getElementById('article-content').innerHTML = `
    <header class="article-header">
      <div class="article-category">${escHtml(a.category)}</div>
      <h1 class="article-title-main" id="inline-title">${escHtml(a.title)}</h1>
      <div class="article-meta-main">
        מאת <span id="inline-author" class="author-name" style="font-weight:700;">${escHtml(a.author)}</span>
        <span class="meta-sep">|</span> 
        <span id="inline-time" class="meta-date">${escHtml(a.time)}</span>
      </div>
    </header>
    <div class="article-hero-img" id="inline-hero-img" style="background-image: url('${a.image}'); position: relative;">
    </div>
    <div class="article-body">
      <div id="inline-content">
        ${a.content ? a.content : `
        <p>זהו טקסט דמה להמחשת הכתבה. במערכת החדשות המלאה, אזור זה יישאב ממסד הנתונים ויכיל פסקאות, ציטוטים מורחבים, גלריות תמונות ואפשרויות לשיתוף ברשתות חברתיות.</p>
        <p>חברת הטכנולוגיה המובילה חשפה לאחרונה את כל העדכונים של המערכת המיוחלת החדשה. באירוע שערכה, השתתפו אלפי עיתונאי טכנולוגיה מכל העולם, שזכו לראות את כלי התוכנה המתקדמים ואת החומרה.</p>
        <p>בנוסף, הושם דגש מיוחד על יכולות בינה מלאכותית, פרטיות ואבטחת מידע, עם שיפורים שיהפכו כל פעולה ליעילה, נוחה ומאובטחת יותר מתמיד.</p>
        `}
      </div>

    <div class="article-body">
      ${(() => {
        const isSubscriber = currentUser && currentUser.isSubscriber;
        const hasAccess = !a.isPremium || isSubscriber || isAdmin;
        
        if (hasAccess) {
          return `
            <div class="article-text">${a.content || a.text || ''}</div>
            ${(() => {
              const ytId = getYouTubeId(a.youtube);
              if (!ytId) return '';
              return `
              <div class="article-video-wrapper" style="margin-top: 32px; width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); background: #000;">
                <div style="position: relative; padding-bottom: 56.25%; height: 0;">
                  <iframe 
                    src="https://www.youtube.com/embed/${ytId}" 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                  </iframe>
                </div>
              </div>
              `;
            })()}
          `;
        } else {
          // Locked State: Show only snippet + blur dummy text
          return `
            <div class="article-text">
              <p>${escHtml(a.snippet || '')}</p>
              <div class="content-blurred" style="user-select:none; pointer-events:none; opacity:0.6;">
                <p>כאן מופיע תוכן הכתבה המלא והבלעדי של פרויקט 11. המנויים שלנו נהנים מגישה מלאה לכל המידע, הניתוחים והנתונים המתקדמים ביותר בתחום. הצטרפו אלינו עוד היום כדי לפתוח את הגישה לכתבה זו ולמאות כתבות נוספות במאגר שלנו.</p>
                <p>עוד טקסט מטושטש כדי ליצור מראה של כתבה מלאה... עוד טקסט מטושטש כדי ליצור מראה של כתבה מלאה... עוד טקסט מטושטש כדי ליצור מראה של כתבה מלאה...</p>
                <p>עוד טקסט מטושטש כדי ליצור מראה של כתבה מלאה... עוד טקסט מטושטש כדי ליצור מראה של כתבה מלאה...</p>
              </div>
            </div>
          `;
        }
      })()}
      
      <!-- Recommended Articles Section -->
      <div class="recommendations-wrapper">
        <h3 class="recommendations-title">אולי יעניין אותך גם</h3>
        <div class="recommendations-grid">
          ${renderRecommendations(a.id, a.category)}
        </div>
      </div>
    </div>
  `;

  showPage('article');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // PAYWALL OVERLAY TOGGLE
  const paywall = document.getElementById('premium-paywall');
  const isSubscriber = currentUser && currentUser.isSubscriber;
  const hasAccess = !a.isPremium || isSubscriber || isAdmin;
  
  if (paywall) {
    paywall.style.display = hasAccess ? 'none' : 'block';
  }
}



function renderRecommendations(currentId, category) {
  // Find articles in the same category, excluding current
  let recs = newsArticles.filter(art => art.id !== currentId && art.category === category);
  
  // If not enough, fill with others
  if (recs.length < 4) {
    const others = newsArticles.filter(art => art.id !== currentId && art.category !== category);
    recs = [...recs, ...others].slice(0, 4);
  } else {
    recs = recs.slice(0, 4);
  }

  return recs.map(r => `
    <div class="rec-card" onclick="showArticle(${r.id})">
      <div class="rec-image" style="background-image: url('${r.image}')"></div>
      <div class="rec-meta">${escHtml(r.category)}</div>
      <div class="rec-title">${escHtml(r.title)}</div>
    </div>
  `).join('');
}

// ========== ADMIN DASHBOARD ==========
function adminLogin() {
  const user = document.getElementById('admin-user')?.value;
  const pass = document.getElementById('admin-pass')?.value;
  if (user === '1' && pass === '1') {
    localStorage.setItem('isAdmin', 'true');
    isAdmin = true;
    showToast('✅ מנהל התחבר בהצלחה');
    showPage('admin');
  } else {
    showToast('❌ שם משתמש או סיסמה שגויים');
  }
}

function initAdminDashboard() {
  // Populate stats
  const statTotal = document.getElementById('stat-total');
  const statToday = document.getElementById('stat-today');
  const statArticles = document.getElementById('stat-articles');
  const statMessages = document.getElementById('stat-messages');
  const statOrders = document.getElementById('stat-orders');
  const statUsers = document.getElementById('stat-users');

  let msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  let users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
  let orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');

  if (statTotal) statTotal.textContent = localStorage.getItem('visitTotal') || '0';
  if (statToday) statToday.textContent = localStorage.getItem('visitToday') || '0';
  if (statArticles) statArticles.textContent = newsArticles.length;
  if (statMessages) statMessages.textContent = msgs.length;
  if (statOrders) statOrders.textContent = orders.length;
  if (statUsers) statUsers.textContent = Object.keys(users).length;

  const msgList = document.getElementById('admin-messages-list');
  const navMsgCount = document.getElementById('nav-msg-count');
  if (navMsgCount) navMsgCount.textContent = msgs.length;

  if (msgList) {
    // ... (existing msgList logic)
  }

  const userList = document.getElementById('admin-users-list');
  if (userList) {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const emails = Object.keys(users);
    if (emails.length === 0) {
      userList.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; color:#86868b;">אין משתמשים רשומים</td></tr>';
    } else {
      userList.innerHTML = emails.map(email => `
        <tr>
          <td><img src="${users[email].avatar}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;"></td>
          <td><strong>${escHtml(users[email].name)}</strong></td>
          <td>${escHtml(email)}</td>
          <td>
            <button class="remove-btn" style="padding: 4px 12px; font-size: 0.85rem; border: none; background: transparent; color: #ef4444;" onclick="deleteUser('${email}')">מחק</button>
          </td>
        </tr>
      `).join('');
    }
  }


  const ordersList = document.getElementById('admin-orders-list');
  if (ordersList) {
    const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    if (orders.length === 0) {
      ordersList.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color:#86868b;">אין הזמנות חדשות</td></tr>';
    } else {
      ordersList.innerHTML = orders.map((o, i) => `
        <tr>
          <td style="white-space: nowrap;">${escHtml(o.date)}</td>
          <td><strong>${escHtml(o.email)}</strong></td>
          <td style="font-size: 0.85rem;">${o.items.join('<br>')}</td>
          <td>₪${parseFloat(o.total).toLocaleString('he-IL')}</td>
          <td>
            <button class="remove-btn" style="padding: 4px 12px; font-size: 0.85rem; border: none; background: transparent; color: #ef4444;" onclick="deleteOrder(${i})">מחק</button>
          </td>
        </tr>
      `).join('');
    }
  }

  list.innerHTML = newsArticles.map(a => `
    <tr style="${a.approved === false ? 'background-color: #fff8e1;' : ''}">
      <td>${a.id}</td>
      <td><strong>${escHtml(a.title)}</strong> ${a.isTop ? '🌟' : ''} ${a.approved === false ? '<span style="color:#d97706; font-size:0.8rem; margin-right:8px; background:#fef3c7; padding:2px 6px; border-radius:4px;">ממתין</span>' : ''}</td>
      <td>${escHtml(a.category)}</td>
      <td>${escHtml(a.author)}</td>
      <td style="display:flex; gap:8px;">
        <button class="btn-primary" style="padding: 4px 12px; font-size: 0.85rem; background: #0071e3;" onclick="editArticle(${a.id})">ערוך</button>
        ${a.approved === false ? `<button class="btn-primary" style="padding: 4px 12px; font-size: 0.85rem;" onclick="approveArticle(${a.id})">אשר</button>` : ''}
        <button class="btn-secondary" style="padding: 4px 12px; font-size: 0.85rem; border: 1px solid #d2d2d7;" onclick="toggleFeatured(${a.id})">${a.isTop ? 'הסר מהמומלצים' : 'הפוך למומלץ'}</button>
        <button class="remove-btn" style="padding: 4px 12px; font-size: 0.85rem; border: none; background: transparent;" onclick="deleteArticle(${a.id})">מחק</button>
      </td>
    </tr>
  `).join('');

  // FEATURED ARTICLES LIST
  const featuredList = document.getElementById('admin-featured-articles-list');
  if (featuredList) {
    const featured = newsArticles.filter(a => a.isTop);
    if (featured.length === 0) {
      featuredList.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px; color:#86868b;">אין כתבות נבחרות כרגע</td></tr>';
    } else {
      featuredList.innerHTML = featured.map(a => `
        <tr>
          <td><strong>${escHtml(a.title)}</strong></td>
          <td>${escHtml(a.category)}</td>
          <td>
            <button class="remove-btn" style="padding: 4px 12px; font-size: 0.85rem; border: none; background: transparent; color: #ef4444;" onclick="toggleFeatured(${a.id})">הסר</button>
          </td>
        </tr>
      `).join('');
    }
  }

  const sc = JSON.parse(localStorage.getItem('storeConfig')) || { title: 'התוכנה המקצועית שלי', version: 'גרסה 1.0', desc: 'קבל גישה לכלים המתקדמים ביותר עם התוכנה שלנו. כלי חובה לכל מקצוען שמחפש לייעל עבודה ולחסוך זמן.', image: '', downloadLink: '', youtube: '' };
  const storeTitleInput = document.getElementById('store-edit-title');
  if(storeTitleInput) {
    storeTitleInput.value = sc.title || '';
    document.getElementById('store-edit-version').value = sc.version || '';
    document.getElementById('store-edit-desc').value = sc.desc || '';
    document.getElementById('store-edit-image').value = sc.image || '';
    document.getElementById('store-edit-youtube').value = sc.youtube || '';
    document.getElementById('store-edit-download').value = sc.downloadLink || '';
  }

  // Populate Social Links inside Admin
  const sl = loadSocialLinks();
  if (document.getElementById('admin-social-x')) {
    document.getElementById('admin-social-x').value = sl.x || '';
    document.getElementById('admin-social-fb').value = sl.fb || '';
    document.getElementById('admin-social-ig').value = sl.ig || '';
    document.getElementById('admin-social-yt').value = sl.yt || '';
  }

  // Populate Ads inside Admin
  const ads = JSON.parse(localStorage.getItem('siteAds') || '[]');
  for (let i = 1; i <= 9; i++) {
    const ad = ads[i - 1] || { img: '', link: '' };
    const imgInput = document.getElementById(`ad-img-${i}`);
    const linkInput = document.getElementById(`ad-link-${i}`);
    const preview = document.getElementById(`ad-preview-${i}`);
    if (imgInput) imgInput.value = ad.img;
    if (linkInput) linkInput.value = ad.link;
    if (preview) {
      if (ad.img) {
        preview.innerHTML = `<img src="${ad.img}" style="width:100%; height:100%; object-fit:contain;">`;
      } else {
        preview.innerHTML = '<span style="color:#86868b; font-size:0.85rem;">אין תמונה</span>';
      }
    }
  }

  // Populate AI settings
  const aiPrompt = localStorage.getItem('aiSystemPrompt') || '';
  if (document.getElementById('admin-ai-prompt')) {
    document.getElementById('admin-ai-prompt').value = aiPrompt;
  }
}

function saveAiSettings() {
  const prompt = document.getElementById('admin-ai-prompt').value;
  localStorage.setItem('aiSystemPrompt', prompt);
  showToast('הגדרות AI נשמרו בהצלחה');
}

let chatHistory = [];

async function sendChatMessage() {
  const input = document.getElementById('ai-chat-input');
  const message = input.value.trim();
  if (!message) return;

  const chatContainer = document.getElementById('ai-chat-messages');
  
  // Add user message to UI
  chatContainer.innerHTML += `
    <div style="background:var(--primary); color:white; padding:10px 14px; border-radius:14px; align-self:flex-end; max-width:85%; font-size:0.95rem; text-align:right;">
      ${message}
    </div>
  `;
  input.value = '';
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Add "Typing..."
  const typingId = 'typing-' + Date.now();
  chatContainer.innerHTML += `<div id="${typingId}" style="background:#f1f1f1; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.95rem; text-align:right;">העוזר חושב...</div>`;
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const systemPrompt = localStorage.getItem('aiSystemPrompt') || "אתה עוזר וירטואלי באתר. תענה בעברית בצורה מנומסת.";
    
    const res = await fetch(`${window.API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: chatHistory, systemPrompt })
    });
    
    let data;
    const responseText = await res.text();
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      const typingElem = document.getElementById(typingId);
      if (typingElem) typingElem.innerHTML = `<span style="color:red;">שגיאת שרת (לא JSON): ${responseText.substring(0, 100)}...</span>`;
      return;
    }

    const typingElem = document.getElementById(typingId);
    if (typingElem) typingElem.remove();

    if (res.ok && data.text) {
      chatContainer.innerHTML += `
        <div style="background:#f1f1f1; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.95rem; text-align:right;">
          ${data.text}
        </div>
      `;
      chatHistory.push({ role: 'user', parts: [{ text: message }] });
      chatHistory.push({ role: 'model', parts: [{ text: data.text }] });
    } else {
      const errorMsg = data.error || 'שגיאה לא ידועה';
      const details = data.details || '';
      chatContainer.innerHTML += `
        <div style="background:#fff1f0; border:1px solid #ffa39e; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.95rem; text-align:right; color:#cf1322;">
          <strong>שגיאת שרת:</strong> ${errorMsg}<br>
          <small>${details}</small>
        </div>
      `;
    }
  } catch (err) {
    const typingElem = document.getElementById(typingId);
    if (typingElem) typingElem.innerHTML = `<span style="color:red;">שגיאת תקשורת: ${err.message}</span>`;
  }
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleAdImageUpload(event, index) {
  const file = event.target.files[0];
  if (!file) return;
  showToast('מעבד תמונה...');
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 600;
      let width = img.width;
      let height = img.height;
      if (width > MAX_WIDTH) {
        height = Math.round(height * (MAX_WIDTH / width));
        width = MAX_WIDTH;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      document.getElementById(`ad-img-${index}`).value = dataUrl;
      const preview = document.getElementById(`ad-preview-${index}`);
      if (preview) {
        preview.innerHTML = `<img src="${dataUrl}" style="width:100%; height:100%; object-fit:contain;">`;
      }
      showToast('התמונה מוכנה! ✅');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function clearAdSlot(index) {
  const imgInput = document.getElementById(`ad-img-${index}`);
  const linkInput = document.getElementById(`ad-link-${index}`);
  const preview = document.getElementById(`ad-preview-${index}`);
  
  if (imgInput) imgInput.value = '';
  if (linkInput) linkInput.value = '';
  if (preview) preview.innerHTML = '<span style="color:#86868b; font-size:0.85rem;">אין תמונה</span>';
  
  showToast(`פרסומת ${index} נוקתה. אל תשכח לשמור!`);
}

function saveAdminAds() {
  const ads = [];
  for (let i = 1; i <= 9; i++) {
    const img = document.getElementById(`ad-img-${i}`).value.trim();
    const link = document.getElementById(`ad-link-${i}`).value.trim();
    if (img) {
      ads.push({ img, link });
    }
  }
  localStorage.setItem('siteAds', JSON.stringify(ads));
  showToast('✅ פרסומות נשמרו בהצלחה');
  renderAdsSidebar();
}

function renderAdsSidebar() {
  const adContainers = document.querySelectorAll('.public-sidebar-ad');
  if (adContainers.length === 0) return;
  
  const ads = JSON.parse(localStorage.getItem('siteAds') || '[]');
  
  adContainers.forEach(adContainer => {
    if (ads.length === 0) {
      adContainer.style.background = '#fff';
      adContainer.style.padding = '24px';
      adContainer.style.border = '1px solid var(--border-subtle)';
      adContainer.style.boxShadow = 'var(--shadow-soft)';
      adContainer.style.borderRadius = '16px';

      adContainer.innerHTML = `
        <h3 style="font-size:1.4rem; font-weight:800; margin-bottom:12px;">שטח פרסום</h3>
        <p style="color:var(--text-muted); font-size:1rem; margin-bottom:24px; line-height: 1.5;">הזדמנות נהדרת להגיע לאלפי קוראים ביום. פנה אלינו לקבלת הצעת מחיר משתלמת.</p>
        <button class="btn-primary" style="margin-top:auto; width:100%; border-radius:980px;" onclick="openContactModal()">פרסם אצלנו למטה</button>
      `;
      return;
    }

    adContainer.style.background = 'transparent';
    adContainer.style.padding = '0';
    adContainer.style.border = 'none';
    adContainer.style.boxShadow = 'none';

    let html = `<div style="display: flex; flex-direction: column; gap: 24px;">`;
    ads.forEach(ad => {
      const inner = `<img src="${ad.img}" style="width: 100%; height: auto; border-radius: 16px; object-fit: cover; display: block; box-shadow: var(--shadow-soft); cursor: ${ad.link ? 'pointer' : 'default'};">`;
      if (ad.link) {
        html += `<a href="${ad.link.startsWith('http') ? ad.link : 'https://' + ad.link}" target="_blank" style="display:block;">${inner}</a>`;
      } else {
        html += `<div>${inner}</div>`;
      }
    });
    html += `</div>`;
    adContainer.innerHTML = html;
  });
}

function switchAdminTab(tabId, btnEl) {
  document.querySelectorAll('.admin-section').forEach(el => el.style.display = 'none');
  const target = document.getElementById('admin-section-' + tabId);
  if (target) target.style.display = 'block';
  
  if (btnEl) {
    document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));
    btnEl.classList.add('active');
  }
  if (tabId === 'calendar') renderAdminCalendar();
  if (tabId === 'pdfstore') renderPdfAdminList();

}



function deleteMessage(index) {
  if (confirm('האם אתה בטוח שברצונך למחוק הודעה זו?')) {
    let msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    msgs.splice(index, 1);
    localStorage.setItem('contactMessages', JSON.stringify(msgs));
    initAdminDashboard();
    showToast('ההודעה נמחקה');
  }
}

let currentViewMessageIndex = -1;

function viewMessage(index) {
  let msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const m = msgs[index];
  if (!m) return;
  currentViewMessageIndex = index;
  document.getElementById('view-msg-name').textContent = m.name;
  document.getElementById('view-msg-phone').textContent = 'טלפון: ' + (m.phone || 'לא הוזן');
  document.getElementById('view-msg-date').textContent = m.date;
  document.getElementById('view-msg-body').textContent = m.body;
  document.getElementById('message-view-modal').classList.add('active');
}

function closeMessageViewModal() {
  document.getElementById('message-view-modal').classList.remove('show');
  currentViewMessageIndex = -1;
}

function deleteMessageFromModal() {
  if (currentViewMessageIndex >= 0) {
    if (confirm('האם אתה בטוח שברצונך למחוק הודעה זו?')) {
      let msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      msgs.splice(currentViewMessageIndex, 1);
      localStorage.setItem('contactMessages', JSON.stringify(msgs));
      initAdminDashboard();
      closeMessageViewModal();
      showToast('ההודעה נמחקה');
    }
  }
}

function deleteArticle(id) {
  if (confirm('האם אתה בטוח שברצונך למחוק כתבה זו?')) {
    newsArticles = newsArticles.filter(a => a.id !== id);
    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
    initAdminDashboard();
    renderNewsLayout();
    showToast('נמחק בהצלחה');
  }
}

function openArticleEditor() {
  document.getElementById('admin-editor').classList.remove('hidden');
  const editorTitle = document.getElementById('admin-editor').querySelector('h3');
  
  editorTitle.textContent = 'יצירת כתבה חדשה';
  document.getElementById('edit-id').value = '';
  document.getElementById('edit-title').value = '';
  document.getElementById('edit-category').value = '';
  document.getElementById('edit-author').value = 'מערכת החדשות';
  document.getElementById('edit-time').value = 'היום, 12:00';
  document.getElementById('edit-image').value = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800';
  document.getElementById('edit-snippet').value = '';
  document.getElementById('edit-content').value = '';
  document.getElementById('edit-youtube').value = '';
  document.getElementById('edit-isTop').checked = false;
  document.getElementById('edit-isPremium').checked = false;
  
  document.getElementById('admin-editor').scrollIntoView({ behavior: 'smooth' });
}

function editArticle(id) {
  const a = newsArticles.find(x => x.id === id);
  if (!a) return;

  document.getElementById('admin-editor').classList.remove('hidden');
  document.getElementById('admin-editor').querySelector('h3').textContent = 'עריכת כתבה';
  
  document.getElementById('edit-id').value = a.id;
  document.getElementById('edit-title').value = a.title || '';
  document.getElementById('edit-category').value = a.category || '';
  document.getElementById('edit-author').value = a.author || '';
  document.getElementById('edit-time').value = a.time || '';
  document.getElementById('edit-image').value = a.image || '';
  document.getElementById('edit-snippet').value = a.snippet || '';
  document.getElementById('edit-content').value = a.content || '';
  document.getElementById('edit-youtube').value = a.youtube || '';
  document.getElementById('edit-isTop').checked = !!a.isTop;
  document.getElementById('edit-isPremium').checked = !!a.isPremium;
  
  document.getElementById('admin-editor').scrollIntoView({ behavior: 'smooth' });
}



function saveAdminArticle() {
  const idValue = document.getElementById('edit-id').value;
  const isTop = document.getElementById('edit-isTop').checked;
  
  const articleObj = {
    id: idValue ? Number(idValue) : nextId++,
    title: document.getElementById('edit-title').value,
    category: document.getElementById('edit-category').value,
    author: document.getElementById('edit-author').value,
    time: document.getElementById('edit-time').value,
    image: document.getElementById('edit-image').value,
    snippet: document.getElementById('edit-snippet').value,
    content: document.getElementById('edit-content').value,
    youtube: document.getElementById('edit-youtube').value.trim(),
    isTop: isTop ? (newsArticles.filter(a => a.isTop).length + 1) : false,
    isPremium: document.getElementById('edit-isPremium').checked
  };

  if(!articleObj.title) {
    showToast('יש למלא כותרת');
    return;
  }

  if (idValue) {
    // Editing existing
    const idx = newsArticles.findIndex(a => a.id === Number(idValue));
    if (idx !== -1) {
      newsArticles[idx] = articleObj;
      showToast('עודכן בהצלחה');
    }
  } else {
    // New article
    newsArticles.unshift(articleObj);
    showToast('נוצר בהצלחה');
  }

  if (isTop) {
     const topArts = newsArticles.filter(a => a.isTop).sort((a,b) => a.isTop - b.isTop);
     if(topArts.length > 3) {
        topArts[topArts.length-1].isTop = false; // Limit to 3 top items max implicitly
     }
  }

  localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
  document.getElementById('admin-editor').classList.add('hidden');
  initAdminDashboard();
  renderNewsLayout();
}

// ========== UTILS ==========
function openLightbox(src) {
  const modal = document.getElementById('lightbox-modal');
  modal.querySelector('img').src = src;
  modal.classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightbox-modal').classList.remove('active');
}

function getYouTubeId(url) {
  if (!url) return null;
  url = url.trim();
  // Handle shorts
  if (url.includes('youtube.com/shorts/')) {
    return url.split('shorts/')[1].split('?')[0].split('&')[0];
  }
  // Handle standard v=
  if (url.includes('v=')) {
    return url.split('v=')[1].split('&')[0];
  }
  // Handle youtu.be/
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0].split('&')[0];
  }
  // Handle embed/
  if (url.includes('youtube.com/embed/')) {
    return url.split('embed/')[1].split('?')[0].split('&')[0];
  }
  // Otherwise assume it's just the ID
  return url;
}

function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) {
    alert(msg);
    return;
  }
  toast.textContent = msg;
  toast.className = 'toast show'; // Reset and show
  if (type) toast.classList.add(type);
  
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Show a loading toast
  showToast('מעבד תמונה...');

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800; // compress dimension
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round(height * (MAX_WIDTH / width));
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compress to 70% quality JPEG => Greatly saves LocalStorage space
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      document.getElementById('edit-image').value = compressedDataUrl;
      showToast('התמונה מוכנה! ✅');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ========== STORE MANAGEMENT ==========
function renderStoreLayout() {
  const c = JSON.parse(localStorage.getItem('storeConfig')) || { title: 'התוכנה המקצועית שלי', version: 'גרסה 1.0', desc: 'קבל גישה לכלים המתקדמים ביותר עם התוכנה שלנו. כלי חובה לכל מקצוען שמחפש לייעל עבודה ולחסוך זמן.', image: '', downloadLink: '', youtube: '' };
  const contentArea = document.getElementById('store-content-area');
  
  if (!contentArea) return;

  const youtubeId = getYouTubeId(c.youtube);
  
  contentArea.innerHTML = `
    <!-- Content (Main Store Box) -->
    <div style="display: flex; justify-content: center; width: 100%; margin-top: 40px;">
      <div style="display: flex; flex-direction: column; gap: 48px; background: #ffffff; border-radius: 48px; padding: 64px; border: 1px solid var(--border-subtle); box-shadow: 0 20px 60px rgba(0,0,0,0.05); align-items: center; max-width: 1100px; width: 100%; text-align: center;">
        
        <!-- Top Section: Details -->
        <div class="store-details" style="width: 100%; max-width: 800px;">
          <div class="store-badge" style="font-size: 0.9rem; color: #0071e3; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 16px; background: rgba(0, 113, 227, 0.1); display: inline-block; padding: 8px 24px; border-radius: 980px;" id="store-render-version">${escHtml(c.version)}</div>
          <h1 class="store-title" style="font-size: 4rem; font-weight: 800; margin-bottom: 24px; color: #1d1d1f; letter-spacing: -0.04em; line-height: 1.1;" id="store-render-title">${escHtml(c.title)}</h1>
          <p class="store-desc" style="font-size: 1.4rem; color: #86868b; line-height: 1.6; margin-bottom: 0; white-space: pre-wrap; max-width: 700px; margin-left: auto; margin-right: auto;" id="store-render-desc">${escHtml(c.desc)}</p>
        </div>

        <!-- Middle Section: Visual (Wide Image or YouTube) -->
        <div class="store-visual" style="width: 100%; position: relative; aspect-ratio: 16/9; background: #f5f5f7; border-radius: 32px; overflow: hidden; display: flex; align-items: center; justify-content: center; box-shadow: 0 30px 80px rgba(0,0,0,0.12);">
          ${youtubeId ? `
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border: none;"></iframe>
          ` : (c.image ? `
            <img src="${c.image}" class="store-main-image" style="display: block; width: 100%; height: 100%; object-fit: cover;">
          ` : `
            <div class="store-emoji" style="font-size: 10rem; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.1));">🚀</div>
          `)}
        </div>

        <!-- Bottom Section: Download Buttons -->
        <div style="width: 100%; display: flex; flex-direction: column; align-items: center; gap: 32px;">
          <div class="btn-platform-container" style="display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; width: 100%;">
            <button class="btn-download-mac" onclick="downloadStorePlatform('Mac')" style="padding: 20px 48px; font-size: 1.2rem; border-radius: 20px; flex: 1; max-width: 320px; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.1);">
              <span class="platform-icon" style="font-size: 1.5rem;"></span>
              להורדה ל-Mac
            </button>
            <button class="btn-download-android" onclick="downloadStorePlatform('Android')" style="padding: 20px 48px; font-size: 1.2rem; border-radius: 20px; flex: 1; max-width: 320px; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 15px 35px rgba(52, 199, 89, 0.15);">
              <span class="platform-icon" style="font-size: 1.5rem;">🤖</span>
              להורדה ל-Android
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}


function saveStoreConfig() {
  const title = document.getElementById('store-edit-title').value;
  const version = document.getElementById('store-edit-version').value;
  const desc = document.getElementById('store-edit-desc').value;
  const image = document.getElementById('store-edit-image').value;
  const youtube = document.getElementById('store-edit-youtube').value;
  const downloadLink = document.getElementById('store-edit-download').value;
  
  const config = { title, version, desc, image, downloadLink, youtube };
  localStorage.setItem('storeConfig', JSON.stringify(config));
  
  renderStoreLayout();
  showToast('הגדרות פרויקט 11 נשמרו בהצלחה!');
}

function handleStoreImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  showToast('מעבד תמונה...');
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 600;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round(height * (MAX_WIDTH / width));
        width = MAX_WIDTH;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      document.getElementById('store-edit-image').value = compressedDataUrl;
      showToast('התמונה מוכנה! ✅');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function downloadStorePlatform(platform) {
  showToast(`⚡ מכין הורדה עבור ${platform}...`);
  
  const link = document.createElement('a');
  const baseUrl = 'https://pub-572449ca23df42e8b074673b3720fb60.r2.dev';
  
  if (platform === 'Mac') {
    link.href = `${baseUrl}/תרשים זרימה-1.0.0-universal.dmg`;
    link.download = 'תרשים זרימה-universal.dmg';
  } else if (platform === 'Android') {
    link.href = `${baseUrl}/app-android.apk`;
    link.download = 'app-android.apk';
  } else {
    link.href = `${baseUrl}/image.png`;
    link.download = 'preview.png';
  }
  document.body.appendChild(link);
  
  setTimeout(() => {
    link.click();
    document.body.removeChild(link);
    showToast('✅ ההורדה החלה!');
  }, 1000);
}

function downloadStoreSoftware() {
  downloadStorePlatform('Default');
}

// ========== PDF STORE ==========
const typeEmoji = { 'PDF': '📄', 'תוכנה': '🖥️', 'סרטון': '📹', 'קובץ': '📁', 'מדריך': '📚' };

let pdfStoreItems = []; // Global list synced from Firebase

async function syncPdfItemsFromFirebase() {
  if (!window.fbGetDocs) return; // Wait for Firebase bridge
  try {
    const q = fbQuery(fbColl(fbDb, 'pdfStoreItems'), fbOrderBy('date', 'desc'));
    const snapshot = await fbGetDocs(q);
    pdfStoreItems = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderPdfStoreGrid();
    renderPdfAdminList();
  } catch (e) {
    console.error("Error syncing from Firebase:", e);
  }
}

// Keep these for compatibility if needed elsewhere, but mainly use pdfStoreItems directly
function getPdfItems() {
  return pdfStoreItems;
}

function renderPdfStoreGrid() {
  const grid = document.getElementById('pdf-store-grid');
  if (!grid) return;
  const items = pdfStoreItems;
  // Filter for approved items (Admins see everything)
  const visibleItems = items
    .filter(item => isAdmin || item.approved !== false);
  
  if (visibleItems.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:80px; color:#86868b; font-size:1.1rem;">אין גרפים מאושרים עדיין. המנהל יאשר בקרוב!</div>';
    return;
  }
  grid.innerHTML = visibleItems.map((item) => {
    const icon = typeEmoji[item.type] || '📄';
    const mainImg = (item.images && item.images.length > 0) ? item.images[0] : '';
    
    return `
      <div class="pdf-card" onclick="showProductDetailById('${item.id}')" style="position:relative;">
        ${item.isPremium ? `
          <div style="position:absolute; top:8px; left:8px; background:rgba(0,0,0,0.7); color:#f9b233; padding:4px 8px; border-radius:6px; font-size:0.7rem; font-weight:800; z-index:2; display:flex; align-items:center; gap:4px;">
            <i class="fas fa-crown"></i> PREMIUM
          </div>
        ` : ''}
        ${mainImg ? `<img src="${mainImg}" style="width:100%; aspect-ratio: 1/1; object-fit:cover; margin-bottom:8px;" />` : 
                    `<div class="pdf-card-icon" style="padding: 40px 0; font-size: 3rem;">${icon}</div>`}
        <div class="pdf-card-title">${escHtml(item.title)}</div>
      </div>
    `;
  }).join('');
}


function showProductDetailById(id) {
  const item = pdfStoreItems.find(x => x.id === id);
  if (!item) return;
  
  document.getElementById('pdp-title').textContent = item.title;
  const mainImg = document.getElementById('pdp-main-image');
  const thumbList = document.getElementById('pdp-thumbnails');
  
  // Gallery Logic
  const images = item.images || [];
  const isPremiumItem = !!item.isPremium;
  const isUserPremium = (currentUser && currentUser.isSubscriber) || isAdmin;
  const hasAccess = !isPremiumItem || isUserPremium;

  const descEl = document.getElementById('pdp-desc');
  descEl.textContent = item.desc || '';

  if (images.length > 0) {
    if (hasAccess) {
      mainImg.src = images[0];
      mainImg.style.filter = 'none';
      descEl.style.filter = 'none';
      descEl.style.userSelect = 'auto';
      // Remove any existing paywall overlay
      const existingPaywall = document.getElementById('pdp-paywall-overlay');
      if (existingPaywall) existingPaywall.remove();
    } else {
      // Locked State for non-premium users
      mainImg.src = images[0];
      mainImg.style.filter = 'blur(20px)';
      mainImg.style.userSelect = 'none';
      mainImg.style.pointerEvents = 'none';
      
      // Blur the description too
      descEl.style.filter = 'blur(5px)';
      descEl.style.userSelect = 'none';
      
      // Add Paywall Overlay
      if (!document.getElementById('pdp-paywall-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'pdp-paywall-overlay';
        overlay.style = `
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(255,255,255,0.7); display: flex; flex-direction: column;
          align-items: center; justify-content: center; color: #1d1d1f;
          border-radius: 20px; padding: 20px; text-align: center;
          z-index: 10; backdrop-filter: blur(5px);
        `;
        overlay.innerHTML = `
          <div style="font-size: 3.5rem; margin-bottom: 15px;">🔒</div>
          <h2 style="font-size: 1.8rem; margin-bottom: 12px; font-weight: 800;">התוכן שמור למנויי פרימיום</h2>
          <p style="margin-bottom: 25px; font-size: 1.05rem; color: #424245; max-width: 300px;">כדי לצפות בגרף המלא ובניתוח הנתונים, יש להצטרף למסלול הפרימיום שלנו.</p>
          <button class="btn-primary" onclick="showPage('subscription')" style="background: #0071e3; color: #fff; border: none; padding: 14px 40px; border-radius: 980px; font-weight: 700; cursor: pointer; font-size: 1.1rem; box-shadow: 0 10px 30px rgba(0,113,227,0.3);">✨ הצטרף עכשיו</button>
        `;
        mainImg.parentElement.style.position = 'relative';
        mainImg.parentElement.appendChild(overlay);
      }
    }

    thumbList.innerHTML = images.map((img, i) => `
      <div class="pdp-thumb ${i === 0 ? 'active' : ''}" onclick="changePdpImage(this, '${img}')">
        <img src="${img}" alt="Thumbnail ${i+1}" style="${hasAccess ? '' : 'filter: blur(4px);'}">
      </div>
    `).join('');
  } else {
    const cidMap = { 'PDF': '1544716278-ca5e3f4abd8c', 'תוכנה': '1517694712202-14dd9538aa97', 'סרטון': '1492724441997-5dc865305da7', 'קובץ': '1544391490-01c6db9f5a70', 'מדריך': '1497633762265-9d179a990aa6' };
    const cid = cidMap[item.type] || cidMap['PDF'];
    const fallback = `https://images.unsplash.com/photo-${cid}?auto=format&fit=crop&q=80&w=800`;
    mainImg.src = fallback;
    thumbList.innerHTML = `<div class="pdp-thumb active"><img src="${fallback}"></div>`;
  }
  

  
  renderProductRecommendations(id);
  
  // Remove contact info if it exists (cleaning up the UI as requested)
  const infoCol = document.querySelector('.product-info-column');
  if (infoCol) {
    const toRemove = Array.from(infoCol.children).filter(child => 
      child.textContent.includes('איש קשר') || 
      child.textContent.includes('שלח הודעה') ||
      child.querySelector('.fa-facebook-messenger')
    );
    toRemove.forEach(el => el.remove());
  }

  showPage('product-detail');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderProductRecommendations(currentId) {
  const grid = document.getElementById('product-recommendations-grid');
  if (!grid) return;
  
  const allItems = pdfStoreItems;
  // Filter out the current product and show up to 6 others randomly
  const recommendations = allItems
    .filter(item => item.id !== currentId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 6);
    
  if (recommendations.length === 0) {
    document.getElementById('product-recommendations-wrapper').style.display = 'none';
    return;
  }
  
  document.getElementById('product-recommendations-wrapper').style.display = 'block';
  
  grid.innerHTML = recommendations.map(item => {
    const mainImg = (item.images && item.images.length > 0) ? item.images[0] : '';
    const icon = typeEmoji[item.type] || '📄';
    
    return `
      <div class="rec-card" onclick="showProductDetailById('${item.id}')">
        ${mainImg ? `<div class="rec-image" style="background-image: url('${mainImg}')"></div>` : 
                    `<div class="rec-image" style="display:flex; align-items:center; justify-content:center; font-size:3rem; background:#f5f5f7;">${icon}</div>`}
        <div class="rec-meta">${escHtml(item.type)}</div>
        <div class="rec-title">${escHtml(item.title)}</div>
      </div>
    `;
  }).join('');
}


function changePdpImage(el, src) {
  document.getElementById('pdp-main-image').src = src;
  document.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}



function renderPdfAdminList() {
  const list = document.getElementById('pdf-admin-list');
  if (!list) return;
  const items = getPdfItems();
  if (items.length === 0) {
    list.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:32px; color:#86868b;">אין פריטים עדיין. לחץ "הוסף פריט".</div>';
    return;
  }
  list.innerHTML = items.map((item) => `
    <div style="background:#f5f5f7; border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:8px; position:relative; border: ${item.approved === false ? '2px solid #f9b233' : '1px solid #eee'};">
      ${item.approved === false ? '<div style="background:#f9b233; color:#fff; font-size:0.65rem; padding:2px 6px; border-radius:4px; position:absolute; top:8px; right:8px; font-weight:800;">ממתין לאישור</div>' : ''}
      <div style="font-size:2rem; text-align:center;">${typeEmoji[item.type] || '📄'}</div>
      <div style="font-weight:700; font-size:0.9rem; text-align:center; color:#1d1d1f;">${escHtml(item.title)}</div>
      <div style="font-size:0.8rem; color:#86868b; text-align:center;">${escHtml(item.type)} · ${escHtml(item.price || 'חינם')}</div>
      <div style="display:flex; gap:6px; flex-wrap:wrap; justify-content:center; margin-top:4px;">
        ${item.approved === false ? `<button class="btn-primary" style="padding:4px 10px; font-size:0.78rem; background:#34c759;" onclick="approvePdfItem('${item.id}')">אשר פרסום</button>` : ''}
        <button class="btn-primary" style="padding:4px 10px; font-size:0.78rem;" onclick="openPdfItemEditorById('${item.id}')">ערוך</button>
        <button class="remove-btn" style="padding:4px 10px; font-size:0.78rem; border:none; background:transparent; color:#ef4444;" onclick="deletePdfItem('${item.id}')">מחק</button>
      </div>
    </div>
  `).join('');
}

async function approvePdfItem(id) {
  try {
    await fbUpdateDoc(fbDoc(fbDb, 'pdfStoreItems', id), { approved: true });
    showToast('✅ הגרף אושר ופורסם באתר!');
    syncPdfItemsFromFirebase();
  } catch (e) {
    showToast('❌ שגיאה באישור הפריט');
  }
}

async function savePdfItemAdmin() {
  const id = document.getElementById('pdf-edit-id').value;
  const title = document.getElementById('pdf-edit-title').value;
  const desc = document.getElementById('pdf-edit-desc').value;
  const type = document.getElementById('pdf-edit-type').value;
  const price = document.getElementById('pdf-edit-price').value;
  const link = document.getElementById('pdf-edit-link').value;
  
  const imgs = [];
  for (let i = 1; i <= 4; i++) {
    const val = document.getElementById(`pdf-edit-img${i}`).value.trim();
    if (val) imgs.push(val);
  }

  const isPremium = document.getElementById('pdf-edit-premium').checked;
  
  const itemData = {
    title, desc, type, price, link,
    images: imgs,
    isPremium,
    date: new Date().toISOString()
  };

  try {
    if (id) {
      // Update existing
      await fbUpdateDoc(fbDoc(fbDb, 'pdfStoreItems', id), itemData);
      showToast('עודכן בהצלחה');
    } else {
      // New item
      itemData.approved = true; // Admin added items are approved by default
      await fbAddDoc(fbColl(fbDb, 'pdfStoreItems'), itemData);
      showToast('נוצר בהצלחה');
    }
    
    document.getElementById('pdf-item-editor').classList.add('hidden');
    syncPdfItemsFromFirebase();
  } catch (e) {
    showToast('שגיאה בשמירה');
  }
}

async function deletePdfItem(id) {
  if (!confirm('האם למחוק את הפריט לצמיתות?')) return;
  try {
    await fbDeleteDoc(fbDoc(fbDb, 'pdfStoreItems', id));
    showToast('🗑️ הפריט נמחק בהצלחה');
    syncPdfItemsFromFirebase();
  } catch (e) {
    showToast('❌ שגיאה במחיקת הפריט');
  }
}

function openPdfItemEditorById(id = null) {
  document.getElementById('pdf-item-editor').classList.remove('hidden');
  if (id) {
    const item = pdfStoreItems.find(x => x.id === id);
    if (!item) return;
    document.getElementById('pdf-edit-id').value = id;
    document.getElementById('pdf-edit-title').value = item.title || '';
    document.getElementById('pdf-edit-desc').value = item.desc || '';
    document.getElementById('pdf-edit-type').value = item.type || 'PDF';
    document.getElementById('pdf-edit-price').value = item.price || '';
    document.getElementById('pdf-edit-link').value = item.link || '';
    document.getElementById('pdf-edit-premium').checked = !!item.isPremium;
    
    // Load images
    for (let i = 1; i <= 4; i++) {
       const img = (item.images && item.images[i-1]) ? item.images[i-1] : '';
       document.getElementById(`pdf-edit-img${i}`).value = img;
    }
  } else {
    document.getElementById('pdf-edit-id').value = '';
    document.getElementById('pdf-edit-title').value = '';
    document.getElementById('pdf-edit-desc').value = '';
    document.getElementById('pdf-edit-type').value = 'PDF';
    document.getElementById('pdf-edit-price').value = '';
    document.getElementById('pdf-edit-link').value = '';
    document.getElementById('pdf-edit-premium').checked = false;
    for (let i = 1; i <= 4; i++) {
       document.getElementById(`pdf-edit-img${i}`).value = '';
    }
  }
  const statusEl = document.getElementById('pdf-upload-status');
  if (statusEl) statusEl.style.display = 'none';
  document.getElementById('pdf-item-editor').scrollIntoView({ behavior: 'smooth' });
}

function handlePdfFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const MAX_SIZE_MB = 5;
  const statusEl = document.getElementById('pdf-upload-status');

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    statusEl.textContent = `❌ הקובץ גדול מדי (${(file.size / 1024 / 1024).toFixed(1)}MB). יש להשתמש בקישור חיצוני לקבצים מעל 5MB.`;
    statusEl.style.color = '#ef4444';
    statusEl.style.display = 'block';
    return;
  }

  statusEl.textContent = '⏳ טוען קובץ...';
  statusEl.style.color = '#0071e3';
  statusEl.style.display = 'block';

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('pdf-edit-link').value = e.target.result;
    statusEl.textContent = `✅ הקובץ "${file.name}" הועלה בהצלחה! (${(file.size / 1024).toFixed(0)}KB)`;
    statusEl.style.color = '#22c55e';
    showToast('הקובץ מוכן! אל תשכח לשמור.');
  };
  reader.onerror = function() {
    statusEl.textContent = '❌ שגיאה בטעינת הקובץ. נסה שוב.';
    statusEl.style.color = '#ef4444';
  };
  reader.readAsDataURL(file);
}

function editPdfItem(index) { openPdfItemEditor(index); }

function savePdfItem() {
  const title = document.getElementById('pdf-edit-title').value.trim();
  if (!title) { showToast('יש להזין שם פריט'); return; }
  
  const idVal = document.getElementById('pdf-edit-id').value;
  const item = {
    title,
    desc: document.getElementById('pdf-edit-desc').value,
    type: document.getElementById('pdf-edit-type').value,
    price: document.getElementById('pdf-edit-price').value,
    link: document.getElementById('pdf-edit-link').value,
    images: []
  };

  for (let i = 1; i <= 4; i++) {
    const img = document.getElementById(`pdf-edit-img${i}`).value;
    if (img) item.images.push(img);
  }

  const items = getPdfItems();
  if (idVal !== '') {
    items[parseInt(idVal)] = item;
    showToast('הגרף/הקובץ עודכן בהצלחה');
  } else {
    items.unshift(item);
    showToast('הגרף/הקובץ נוסף בהצלחה');
  }

  savePdfItems(items);
  renderPdfAdminList();
  renderPdfStoreGrid();
  document.getElementById('pdf-item-editor').classList.add('hidden');
}

let activeImgSlot = 1;
function triggerImgUpload(slot) {
  activeImgSlot = slot;
  document.getElementById('pdf-image-upload-hidden').click();
}

function handleProductImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  showToast('מעבד תמונה...');
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      let width = img.width;
      let height = img.height;
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const dataUri = canvas.toDataURL('image/jpeg', 0.8);
      document.getElementById(`pdf-edit-img${activeImgSlot}`).value = dataUri;
      showToast(`תמונה ${activeImgSlot} עלתה בהצלחה!`);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}


function deletePdfItem(index) {
  if (confirm('למחוק פריט זה?')) {
    const items = getPdfItems();
    items.splice(index, 1);
    savePdfItems(items);
    renderPdfAdminList();
    renderPdfStoreGrid();
    showToast('הפריט נמחק');
  }
}


function trackVisit() {
  // Total visits
  const total = parseInt(localStorage.getItem('visitTotal') || '0') + 1;
  localStorage.setItem('visitTotal', total);

  // Today's visits
  const today = new Date().toDateString();
  const lastDay = localStorage.getItem('visitDay');
  let todayCount = parseInt(localStorage.getItem('visitToday') || '0');
  if (lastDay !== today) {
    todayCount = 0;
    localStorage.setItem('visitDay', today);
  }
  todayCount++;
  localStorage.setItem('visitToday', todayCount);
}

trackVisit();

// ========== CONTACT MODAL ==========
function openContactModal() {
  const el = document.getElementById('contact-modal');
  if (el) el.classList.add('active');
}

function closeContactModal() {
  const el = document.getElementById('contact-modal');
  if (el) el.classList.remove('active');
}

function openUploadGraphModal() {
  document.getElementById('upload-graph-modal').classList.add('active');
}

function closeUploadGraphModal() {
  document.getElementById('upload-graph-modal').classList.remove('active');
}

function openCustomerServiceModal() {
  document.getElementById('contact-modal').classList.add('active');
}

function closeCustomerServiceModal() {
  document.getElementById('contact-modal').classList.remove('active');
}

function openTermsModal() {
  const el = document.getElementById('terms-modal');
  if (el) el.classList.add('active');
}

function closeTermsModal() {
  const el = document.getElementById('terms-modal');
  if (el) el.classList.remove('active');
}

function submitContactForm(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value;
  const phone = document.getElementById('contact-phone').value;
  const body = document.getElementById('contact-body').value;
  
  // Save message to localStorage
  let msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const now = new Date();
  const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  msgs.unshift({ name, phone, body, date: dateStr });
  localStorage.setItem('contactMessages', JSON.stringify(msgs));
  
  // Close modal and show toast
  closeContactModal();
  showToast('ההודעה נשלחה בהצלחה למערכת! ✅');
  
  // Clear form
  e.target.reset();
  
  // Update admin dash if it's currently open
  if (document.getElementById('page-admin').classList.contains('active')) {
    initAdminDashboard();
  }
}

// ========== THEME LOGIC ==========
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-theme');
  const isDark = body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  showToast(isDark ? '🌙 מצב כהה הופעל' : '☀️ מצב בהיר הופעל');
}

// ========== INIT ==========
initTheme();
showPage('home');





// ========== USER & COMMENTS LOGIC ==========
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
// If Firebase auth guard already set a user (module script ran first), prefer it
if (!currentUser && window._fbUser) {
  currentUser = window._fbUser;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}


function handleProfilePicUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  showToast('מעבד תמונה...');
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 200;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const b64 = canvas.toDataURL('image/jpeg', 0.8);
      document.getElementById('register-avatar-preview').src = b64;
      document.getElementById('join-profile-pic').value = b64;
      showToast('✅ התמונה עלתה בהצלחה!');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

const randomAvatars = [
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200&h=200',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200'
];

function setRandomProfilePic() {
  const current = document.getElementById('join-profile-pic').value;
  let next = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
  while (next === current) {
    next = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];
  }
  document.getElementById('register-avatar-preview').src = next;
  document.getElementById('join-profile-pic').value = next;
  showToast('🎲 תמונה רנדומלית נבחרה');
}

function saveUserProfile() {
  const name = document.getElementById('join-name').value.trim();
  const email = document.getElementById('join-email').value.trim().toLowerCase();
  const password = document.getElementById('join-password').value.trim();
  const profilePic = document.getElementById('join-profile-pic').value;
  
  if (!name || !email || !password) {
    showToast('❌ נא למלא את כל השדות כדי להירשם');
    return;
  }

  // Basic email validation
  if (!email.includes('@') || !email.includes('.')) {
    showToast('❌ כתובת אימייל לא תקינה');
    return;
  }
  
  let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
  
  if (registeredUsers[email]) {
    showToast('❌ האימייל הזה כבר רשום במערכת', 'error');
    return;
  } else {
    // New user, register
    registeredUsers[email] = { name, password, avatar: profilePic };
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    currentUser = { name, email, avatar: profilePic };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserUI();
    
    showToast('✨ ההרשמה בוצעה בהצלחה!', 'success');
    
    setTimeout(() => {
      goBack();
    }, 1000); 
  }
}

function logoutUser() {
  if (confirm('בטוח שברצונך להתנתק?')) {
    currentUser = null;
    isAdmin = false;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    // Firebase sign-out (bridge set by auth guard module in index.html)
    if (typeof window._fbSignOut === 'function') {
      window._fbSignOut(); // redirects to login.html after sign-out
    } else {
      updateUserUI();
      showPage('home');
      showToast('👋 התנתקת בהצלחה');
    }
  }
}

function deleteUser(email) {
  // ... (existing code)
}

function deleteOrder(index) {
  if (confirm('בטוח שברצונך למחוק הזמנה זו?')) {
    let orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    orders.splice(index, 1);
    localStorage.setItem('orderHistory', JSON.stringify(orders));
    initAdminDashboard();
    showToast('🗑️ ההזמנה נמחקה');
  }
}

function clearOrders() {
  if (confirm('בטוח שברצונך למחוק את כל היסטוריית ההזמנות?')) {
    localStorage.setItem('orderHistory', '[]');
    initAdminDashboard();
    showToast('🧹 ההיסטוריה נוקתה');
  }
}

function updateUserUI() {
  const btnJoin = document.getElementById('btn-join');
  const profileBadge = document.getElementById('user-profile-badge');
  const btnLogoutNav = document.getElementById('btn-logout-nav');
  
  if (!btnJoin || !profileBadge || !btnLogoutNav) return;

  // Real user = has email (not a guest)
  const isUserLoggedIn = !!currentUser && !!currentUser.email;
  const isAdminLoggedIn = !!isAdmin;

  if (isUserLoggedIn || isAdminLoggedIn) {
    btnJoin.style.display = 'none';
    profileBadge.style.display = 'flex';
    btnLogoutNav.style.display = 'block'; // מחובר → הצג התנתק

    if (isAdminLoggedIn && !isUserLoggedIn) {
      document.getElementById('user-badge-avatar').style.display = 'none';
      const badgeEmoji = document.getElementById('user-badge-name').previousElementSibling; // This is the img
      if (badgeEmoji && badgeEmoji.id === 'user-badge-avatar') badgeEmoji.style.display = 'none';
      
      // Since it's admin, we can show a special icon or just the text
      document.getElementById('user-badge-name').textContent = '🛡️ מנהל מערכת';
    } else if (isUserLoggedIn) {
      const avatarImg = document.getElementById('user-badge-avatar');
      avatarImg.style.display = 'block';
      avatarImg.src = currentUser.avatar || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=200&h=200';
      document.getElementById('user-badge-name').textContent = currentUser.name;
    }
    
    // Update comment inputs for users
    if (isUserLoggedIn) {
      document.querySelectorAll('[id$="-comment-input-area"]').forEach(el => el.style.display = 'block');
      document.querySelectorAll('[id$="-comment-join-prompt"]').forEach(el => el.style.display = 'none');
      document.querySelectorAll('[id$="-comment-user-name"]').forEach(el => el.textContent = currentUser.name);
    }
  } else {
    btnJoin.style.display = 'block';
    profileBadge.style.display = 'none';
    btnLogoutNav.style.display = 'none';
    
    document.querySelectorAll('[id$="-comment-input-area"]').forEach(el => el.style.display = 'none');
    document.querySelectorAll('[id$="-comment-join-prompt"]').forEach(el => el.style.display = 'block');
  }
}

function submitComment(type) {
  const textarea = document.getElementById(`${type}-new-comment`);
  const text = textarea.value.trim();
  
  if (!text) {
    showToast('❌ אי אפשר לפרסם תגובה ריקה');
    return;
  }
  
  const targetId = type === 'article' ? currentArticleId : activeComicIndex;
  const comments = JSON.parse(localStorage.getItem(`comments_${type}_${targetId}`) || '[]');
  
  const newComment = {
    userName: currentUser.name,
    userAvatar: currentUser.avatar,
    text: text,
    date: new Date().toLocaleString('he-IL', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
  };
  
  comments.push(newComment);
  localStorage.setItem(`comments_${type}_${targetId}`, JSON.stringify(comments));
  
  textarea.value = '';
  renderComments(type, targetId);
  showToast('✅ התגובה פורסמה!');
}

function renderComments(type, targetId) {
  const list = document.getElementById(`${type}-comments-list`);
  if (!list) return;
  
  if (targetId === null || targetId === undefined) {
    list.innerHTML = '';
    return;
  }

  const comments = JSON.parse(localStorage.getItem(`comments_${type}_${targetId}`) || '[]');
  
  if (comments.length === 0) {
    list.innerHTML = `<div style="text-align:center; color:#86868b; padding:20px;">עוד אין תגובות. תהיו הראשונים להגיב!</div>`;
    return;
  }
  
  list.innerHTML = comments.map(c => `
    <div class="comment-card">
      <div class="comment-avatar">
        <img src="${c.userAvatar || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=200&h=200'}" alt="${escHtml(c.userName)}">
      </div>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">${escHtml(c.userName)}</span>
          <span class="comment-date">${c.date}</span>
        </div>
        <div class="comment-text">${escHtml(c.text)}</div>
      </div>
    </div>
  `).join('');
}

// Global variable for current article
let currentArticleId = null;

// Initial call
setTimeout(() => {
  updateUserUI();
  showPage('home');
}, 100);
// ========== USER PDF UPLOADS ==========
let selectedUserPdfImages = [];

function handleModalFileSelection(event) {
  const files = Array.from(event.target.files);
  const remaining = 4 - selectedUserPdfImages.length;
  const toProcess = files.slice(0, remaining);
  
  toProcess.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedB64 = canvas.toDataURL('image/jpeg', 0.7);
        selectedUserPdfImages.push(compressedB64);
        renderModalPreviews();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
  
  event.target.value = '';
}

function renderModalPreviews() {
  const container = document.getElementById('modal-user-pdf-preview');
  if (!container) return;
  
  container.innerHTML = selectedUserPdfImages.map((img, i) => `
    <div class="preview-item" style="position:relative; width:60px; height:60px;">
      <img src="${img}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" />
      <button onclick="removeModalImage(${i})" style="position:absolute; top:-5px; right:-5px; background:#ff3b30; color:white; border:none; border-radius:50%; width:18px; height:18px; cursor:pointer; font-size:10px; display:flex; align-items:center; justify-content:center;">✕</button>
    </div>
  `).join('');
}

function removeModalImage(index) {
  selectedUserPdfImages.splice(index, 1);
  renderModalPreviews();
}

async function submitModalUserPdf() {
  const title = document.getElementById('modal-user-pdf-title').value.trim();
  const desc = document.getElementById('modal-user-pdf-desc').value.trim();
  
  if (!title) {
    showToast('❌ נא להזין שם לגרף');
    return;
  }
  
  if (selectedUserPdfImages.length === 0) {
    showToast('❌ נא לבחור לפחות תמונה אחת');
    return;
  }
  
  const loader = document.getElementById('upload-loading-overlay');
  if (loader) {
    loader.style.display = 'flex';
    loader.style.opacity = '1';
    loader.style.pointerEvents = 'auto';
  }

  try {
    const newItem = {
      title: title,
      desc: desc,
      type: 'תוכן גולשים',
      images: selectedUserPdfImages,
      link: '#',
      approved: false,
      date: new Date().toISOString()
    };
    
    await fbAddDoc(fbColl(fbDb, 'pdfStoreItems'), newItem);
    
    // Reset form
    document.getElementById('modal-user-pdf-title').value = '';
    document.getElementById('modal-user-pdf-desc').value = '';
    selectedUserPdfImages = [];
    renderModalPreviews();
    
    // Hide loading overlay and close modal
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
        loader.style.pointerEvents = 'none';
        closeUploadGraphModal();
        showToast('✅ הגרף נשלח לאישור מנהל!');
        syncPdfItemsFromFirebase();
      }, 200);
    }
  } catch (err) {
    console.error('Upload failed:', err);
    showToast('❌ העלאה נכשלה, נסה שנית');
    if (loader) {
      loader.style.display = 'none';
    }
  }
}


function switchAuthTab(type) {
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');
  const loginSection = document.getElementById('auth-login-section');
  const registerSection = document.getElementById('auth-register-section');
  
  if (type === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
  } else {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
  }
}

function handleAuthSubmit(type) {
  if (type === 'login') {
    const input = document.getElementById('login-username').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value.trim();
    
    if (!input || !password) {
      showToast('❌ נא להזין אימייל וסיסמה');
      return;
    }
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const userData = registeredUsers[input];

    if (userData) {
      if (userData.password === password) {
        currentUser = { name: userData.name, email: input, avatar: userData.avatar };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserUI();
        goBack();
        showToast(`👋 ברוך שובך, ${userData.name}!`);
      } else {
        showToast('❌ סיסמה שגויה');
      }
    } else {
      showToast('❌ משתמש לא קיים. אנא הירשם.');
    }
  } else {
    saveUserProfile();
  }
}

// Initial loads
loadSocialLinks();

// ========== USER ARTICLE SUBMISSION ==========
let tempUserArticleImage = '';

function handleUserArticleImage() {
  const fileInput = document.getElementById('user-art-image-file');
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX) { height *= MAX / width; width = MAX; }
      } else {
        if (height > MAX) { width *= MAX / height; height = MAX; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      tempUserArticleImage = canvas.toDataURL('image/jpeg', 0.8);
      document.getElementById('user-art-image').value = 'תמונה נבחרה בהצלחה ✓';
      showToast('תמונה נטענה!');
    }
  };
  reader.readAsDataURL(file);
}

function submitUserArticle(event) {
  event.preventDefault();
  
  const title = document.getElementById('user-art-title').value.trim();
  const cat = document.getElementById('user-art-cat').value.trim();
  const author = document.getElementById('user-art-author').value.trim();
  const excerpt = document.getElementById('user-art-excerpt').value.trim();
  const text = document.getElementById('user-art-body').value.trim();
  let image = document.getElementById('user-art-image').value.trim();

  if (tempUserArticleImage) {
    image = tempUserArticleImage;
  } else if (!image) {
    image = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800'; // fallback
  }

  const now = new Date();
  const timeStr = 'היום, ' + now.toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'});

  const newArticle = {
    id: Date.now(),
    title,
    category: cat,
    author,
    time: timeStr,
    snippet: excerpt,
    text,
    image,
    isTop: false,
    approved: false
  };

  newsArticles.unshift(newArticle);
  localStorage.setItem('newsArticles', JSON.stringify(newsArticles));

  showToast('הכתבה נשלחה בהצלחה ותמתין לאישור הנהלה! 🚀');
  
  event.target.reset();
  tempUserArticleImage = '';
  showPage('home');
}

function approveArticle(id) {
  const art = newsArticles.find(a => a.id === id);
  if (art) {
    art.approved = true;
    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
    initAdminDashboard();
    renderNewsLayout();
    showToast('הכתבה אושרה ומוצגת באתר!');
  }
}

// =====================================================================
// SHOP & SERVICES — מוצרים פיזיים + שירותים מקצועיים
// =====================================================================

// AliExpress products loaded from /api/ali-products (replaces static list when server is running)
let aliExpressLoaded = false;

async function loadAliExpressProducts() {
  if (aliExpressLoaded) return;
  try {
    const res = await fetch('/api/ali-products');
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      shopProducts.length = 0;
      data.forEach(p => shopProducts.push(p));
      aliExpressLoaded = true;
      renderShopGrid();
    }
  } catch (e) {
    // Server not running — keep static products
  }
}

const shopProducts = [
  {
    id: 'p1',
    title: 'תיק עור איכותי',
    cat: 'אביזרים',
    desc: 'תיק עור אמיתי בעבודת יד, מושלם ליום-יום ולעבודה. עמיד, רך ויפהפה.',
    price: '₪299',
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p2',
    title: 'אוזניות אלחוטיות Pro',
    cat: 'אלקטרוניקה',
    desc: 'איכות סאונד יוצאת דופן עם ביטול רעשים אקטיבי. עד 30 שעות סוללה.',
    price: '₪549',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p3',
    title: 'שעון יד קלאסי',
    cat: 'אופנה',
    desc: 'שעון מינימליסטי ואלגנטי עם רצועת עור. מתאים לכל סגנון לבוש.',
    price: '₪399',
    img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p4',
    title: 'מנורת LED מעוצבת',
    cat: 'בית',
    desc: 'מנורה חכמה עם בקרת בהירות, צבעים מתחלפים ושליטה מהאפליקציה.',
    price: '₪189',
    img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p5',
    title: 'כוס תרמית פרימיום',
    cat: 'יומיום',
    desc: 'שומרת חום עד 12 שעות וקור עד 24 שעות. נירוסטה איכותית, 500 מ"ל.',
    price: '₪89',
    img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p6',
    title: 'תרמיל גב יומיומי',
    cat: 'אביזרים',
    desc: 'תרמיל מינימליסטי עמיד למים, עם תא ייעודי ללפטופ עד 16 אינץ\'.',
    price: '₪249',
    img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'
  }
];

const servicesItems = [
  {
    id: 's1',
    title: 'ייעוץ עסקי 1-on-1',
    cat: 'ייעוץ',
    desc: 'פגישת אסטרטגיה אישית של שעה — נמפה ביחד את היעדים, החסמים והצעדים הבאים.',
    price: '₪350 / שעה',
    icon: '🎯'
  },
  {
    id: 's2',
    title: 'בניית אתר אינטרנט',
    cat: 'דיגיטל',
    desc: 'אתר תדמית מקצועי, מותאם לנייד, מהיר וידידותי לגוגל. כולל דומיין ואחסון לשנה.',
    price: 'החל מ-₪2,500',
    icon: '🌐'
  },
  {
    id: 's3',
    title: 'ליווי דיגיטלי חודשי',
    cat: 'ליווי',
    desc: 'ניהול נוכחות דיגיטלית מלאה — רשתות חברתיות, קמפיינים, ותוכן שיווקי.',
    price: '₪1,200 / חודש',
    icon: '📱'
  },
  {
    id: 's4',
    title: 'עיצוב גרפי לפי דרישה',
    cat: 'עיצוב',
    desc: 'לוגואים, באנרים, פוסטים, פליירים — כל מה שאתה צריך כדי להיראות מקצועי.',
    price: 'מ-₪250 / פרויקט',
    icon: '🎨'
  },
  {
    id: 's5',
    title: 'כתיבת תוכן שיווקי',
    cat: 'תוכן',
    desc: 'מאמרים, פוסטים, תיאורי מוצר ודפי נחיתה שמוכרים. ממוקדי SEO ומותאמים לקהל היעד.',
    price: '₪180 / פוסט',
    icon: '✍️'
  },
  {
    id: 's6',
    title: 'צילום מקצועי לעסקים',
    cat: 'צילום',
    desc: 'צילום מוצרים, אירועים, או פורטרטים עסקיים. כולל עריכה ומשלוח דיגיטלי תוך 48 שעות.',
    price: 'מ-₪800 / יום',
    icon: '📸'
  }
];

let pendingOrderItem = null;

function renderShopGrid() {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;
  grid.innerHTML = shopProducts.map(p => `
    <div class="shop-card">
      <div class="shop-card-image">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="shop-card-body">
        <span class="shop-card-cat">${p.cat}</span>
        <h3 class="shop-card-title">${p.title}</h3>
        <p class="shop-card-desc">${p.desc}</p>
        <div class="shop-card-footer">
          <span class="shop-card-price">${p.price}</span>
          <button class="shop-card-btn" onclick="addToCart('${p.id}', 'product')">+ הוסף לעגלה</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderServicesGrid() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;
  grid.innerHTML = servicesItems.map(s => `
    <div class="service-card">
      <div class="service-card-image">${s.icon}</div>
      <div class="service-card-body">
        <span class="service-card-cat">${s.cat}</span>
        <h3 class="service-card-title">${s.title}</h3>
        <p class="service-card-desc">${s.desc}</p>
        <div class="service-card-footer">
          <span class="service-card-price">${s.price}</span>
          <button class="service-card-btn" onclick="addToCart('${s.id}', 'service')">+ הוסף לעגלה</button>
        </div>
      </div>
    </div>
  `).join('');
}

function openOrderModal(id, type) {
  const list = type === 'product' ? shopProducts : servicesItems;
  const item = list.find(x => x.id === id);
  if (!item) return;
  pendingOrderItem = { ...item, type };
  document.getElementById('order-modal-item').textContent =
    (type === 'product' ? 'מוצר: ' : 'שירות: ') + item.title + ' — ' + item.price;
  document.getElementById('order-modal').classList.add('active');
}

function closeOrderModal() {
  document.getElementById('order-modal').classList.remove('active');
  document.getElementById('order-name').value = '';
  document.getElementById('order-phone').value = '';
  pendingOrderItem = null;
}

function submitOrder(event) {
  event.preventDefault();
  const name = document.getElementById('order-name').value.trim();
  const phone = document.getElementById('order-phone').value.trim();
  if (!name || !phone) {
    showToast('נא למלא שם וטלפון', 'error');
    return;
  }
  closeOrderModal();
  // If checkout came from cart, clear the cart after successful order
  if (pendingOrderItem && pendingOrderItem.isCart) {
    shoppingCart = [];
    saveCart();
    updateCartBadge();
  }
  showToast(`תודה ${name}! ההזמנה התקבלה — ניצור איתך קשר ב-${phone} בקרוב 🚀`);
}

// =====================================================================
// SHOPPING CART — עגלת קניות לחנות ולשירותים
// =====================================================================

// Cart is always empty on page load (fresh session)
let shoppingCart = [];
localStorage.removeItem('shoppingCart');

function saveCart() {
  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
}

function parsePrice(priceStr) {
  // Extract first numeric value from strings like "₪299" or "₪350 / שעה" or "החל מ-₪2,500"
  if (!priceStr) return 0;
  const match = String(priceStr).replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function getCartCount() {
  return shoppingCart.reduce((sum, c) => sum + c.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
  // Re-trigger pop animation
  badge.style.animation = 'none';
  void badge.offsetWidth;
  badge.style.animation = '';
}

function addToCart(id, type) {
  const existing = shoppingCart.find(c => c.id === id && c.type === type);
  if (existing) {
    existing.qty += 1;
  } else {
    shoppingCart.push({ id, type, qty: 1 });
  }
  saveCart();
  updateCartBadge();
  showToast('✓ נוסף לעגלה');
}

function removeFromCart(id, type) {
  shoppingCart = shoppingCart.filter(c => !(c.id === id && c.type === type));
  saveCart();
  updateCartBadge();
  renderCart();
}

function changeCartQty(id, type, delta) {
  const item = shoppingCart.find(c => c.id === id && c.type === type);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  updateCartBadge();
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (!container || !totalEl || !checkoutBtn) return;

  if (shoppingCart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:6px;">העגלה שלך ריקה</h3>
        <p style="font-size:0.95rem;">הוסף מוצרים מהחנות או שירותים כדי להמשיך</p>
      </div>`;
    totalEl.textContent = '₪0';
    checkoutBtn.style.opacity = '0.4';
    checkoutBtn.style.pointerEvents = 'none';
    return;
  }

  let total = 0;
  container.innerHTML = shoppingCart.map(c => {
    const list = c.type === 'product' ? shopProducts : servicesItems;
    const item = list.find(x => x.id === c.id);
    if (!item) return '';
    const itemPrice = parsePrice(item.price);
    total += itemPrice * c.qty;
    const imageEl = c.type === 'product' && item.img
      ? `<img src="${item.img}" alt="">`
      : `<span>${item.icon || '💼'}</span>`;
    return `
      <div class="cart-item">
        <div class="cart-item-img">${imageEl}</div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${item.price}</div>
        </div>
        <div class="cart-item-qty">
          <button onclick="changeCartQty('${c.id}','${c.type}',-1)" aria-label="פחות">−</button>
          <span>${c.qty}</span>
          <button onclick="changeCartQty('${c.id}','${c.type}',1)" aria-label="עוד">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${c.id}','${c.type}')" title="הסר מהעגלה">×</button>
      </div>
    `;
  }).join('');

  totalEl.textContent = '₪' + total.toLocaleString('he-IL');
  checkoutBtn.style.opacity = '1';
  checkoutBtn.style.pointerEvents = 'auto';
}

function openCartModal() {
  renderCart();
  document.getElementById('cart-modal').classList.add('active');
}

function closeCartModal() {
  document.getElementById('cart-modal').classList.remove('active');
}

function checkoutCart() {
  if (shoppingCart.length === 0) return;
  let total = 0;
  const summaryLines = shoppingCart.map(c => {
    const list = c.type === 'product' ? shopProducts : servicesItems;
    const item = list.find(x => x.id === c.id);
    if (!item) return '';
    total += parsePrice(item.price) * c.qty;
    return `${item.title} × ${c.qty} — ${item.price}`;
  }).filter(Boolean);

  closeCartModal();
  runPaymentAnimation(summaryLines, total);
}

// =====================================================================
// MOCK PAYMENT MODAL
// =====================================================================

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) modal.classList.remove('active');
}

function runPaymentAnimation(summaryLines, total) {
  const modal = document.getElementById('payment-modal');
  if (!modal) return;

  document.getElementById('payment-step-form').style.display = 'none';
  document.getElementById('payment-step-anim').style.display = 'block';
  modal.classList.add('active');

  const spinner = document.getElementById('pay-phase-spinner');
  const success = document.getElementById('pay-phase-success');
  const track   = spinner.querySelector('.pay-spinner-track');

  spinner.style.display = 'block';
  success.style.display = 'none';

  // ── שלב 1: ספינר conic-gradient נטען ב-JS frame-by-frame ──
  const FILL_DURATION = 1600;
  const startTime = performance.now();

  function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

  function animateSpinner(now) {
    const t = Math.min((now - startTime) / FILL_DURATION, 1);
    const deg = easeInOut(t) * 360;
    track.style.background =
      `conic-gradient(#0071e3 ${deg}deg, #e8e8ed ${deg}deg)`;
    if (t < 1) {
      requestAnimationFrame(animateSpinner);
    } else {
      showSuccess();
    }
  }
  requestAnimationFrame(animateSpinner);

  function showSuccess() {
    spinner.style.display = 'none';

    const itemsEl = document.getElementById('payment-success-items');
    if (itemsEl) {
      itemsEl.innerHTML = summaryLines.join('<br>') +
        `<br><strong style="color:#1d1d1f;">סה"כ שולם: ₪${parseFloat(total).toLocaleString('he-IL')}</strong>`;
    }

    // Save order to history for admin
    const orderData = {
      email: (currentUser && currentUser.email) ? currentUser.email : 'אורח',
      items: summaryLines,
      total: total,
      date: new Date().toLocaleString('he-IL')
    };
    let orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    orders.unshift(orderData);
    localStorage.setItem('orderHistory', JSON.stringify(orders));

    // --- SEND RECEIPT EMAIL ---
    if (currentUser && currentUser.email && currentUser.email !== 'אורח') {
      fetch('/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          name: currentUser.name,
          items: summaryLines,
          total: total
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Receipt sent successfully');
          showToast('📧 קבלה נשלחה למייל שלך');
        } else {
          console.error('Failed to send receipt:', data.error);
        }
      })
      .catch(err => console.error('Error calling receipt API:', err));
    }

    success.style.display = 'block';

    // ── שלב 2: עיגול מצטייר ──
    const circle  = success.querySelector('.pay-checkmark-circle');
    const path    = success.querySelector('.pay-checkmark-path');
    const textWrap = success.querySelector('.pay-success-text-wrap');
    const CIRC    = 157; // 2π×25
    const CHECK   = 40;

    circle.style.strokeDashoffset = String(CIRC);
    path.style.strokeDashoffset   = String(CHECK);
    if (textWrap) textWrap.style.opacity = '0';

    animateValue(circle, 'strokeDashoffset', CIRC, 0, 500, easeInOut, () => {
      // ── שלב 3: וי מצטייר ──
      animateValue(path, 'strokeDashoffset', CHECK, 0, 380, easeInOut, () => {
        // ── שלב 4: טקסט עולה ──
        if (textWrap) animateFadeUp(textWrap, 420);
      });
    });

    shoppingCart = [];
    saveCart();
    updateCartBadge();
  }

  function animateValue(el, prop, from, to, duration, easeFn, onDone) {
    const t0 = performance.now();
    function step(now) {
      const t = Math.min((now - t0) / duration, 1);
      el.style[prop] = String(from + (to - from) * easeFn(t));
      if (t < 1) requestAnimationFrame(step);
      else if (onDone) onDone();
    }
    requestAnimationFrame(step);
  }

  function animateFadeUp(el, duration) {
    const t0 = performance.now();
    el.style.opacity   = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'none';
    function step(now) {
      const t = Math.min((now - t0) / duration, 1);
      const e = easeInOut(t);
      el.style.opacity   = String(e);
      el.style.transform = `translateY(${18 * (1 - e)}px)`;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  showWelcomeDealModal();
  renderAdsSidebar();
});
updateCartBadge();

function showWelcomeDealModal() {
  if (sessionStorage.getItem('welcomeShown')) return;
  const el = document.getElementById('welcome-deal-modal');
  if (!el) return;
  setTimeout(() => el.classList.add('active'), 600);
}

function closeWelcomeDealModal() {
  const el = document.getElementById('welcome-deal-modal');
  if (el) el.classList.remove('active');
  sessionStorage.setItem('welcomeShown', '1');
}

function selectPricingTier(el) {
  // Remove selected class from all cards
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Add selected class to the clicked card
  el.classList.add('selected');
  
  // Show a toast message for feedback
  showToast('בחרת במסלול ' + el.querySelector('.tier-name').innerText);
}

// ========== FLOATING SUPPORT DISMISS & DRAG ==========
function dismissSupportWidget() {
  const container = document.getElementById('support-floating-btn-container');
  if (container) container.style.display = 'none';
  closeContactModal();
  showToast('שירות לקוחות נסגר. הוא יחזור לאחר רענון האתר.');
}

// Draggable Logic for Chat Window
(function initDraggableChat() {
  const dragItem = document.getElementById("chat-draggable-window");
  const dragHandle = document.getElementById("chat-header");

  if (!dragItem || !dragHandle) return;

  let active = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  dragHandle.addEventListener("mousedown", dragStart);
  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("mousemove", drag);

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    if (e.target === dragHandle || dragHandle.contains(e.target)) {
      active = true;
    }
  }

  function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    active = false;
  }

  function drag(e) {
    if (active) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;
      setTranslate(currentX, currentY, dragItem);
    }
  }

  function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
  }
})();
function toggleFeatured(id) {
  const index = newsArticles.findIndex(a => a.id === id);
  if (index !== -1) {
    newsArticles[index].isTop = !newsArticles[index].isTop;
    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
    initAdminDashboard();
    renderNewsLayout(); // Refresh home page if visible
    showToast(newsArticles[index].isTop ? '🌟 הכתבה נוספה לנבחרות' : '⚪ הכתבה הוסרה מהנבחרות');
  }
}
function openLightbox() {
  const mainImg = document.getElementById('pdp-main-image');
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (mainImg && lightbox && lightboxImg) {
    lightboxImg.src = mainImg.src;
    lightbox.classList.add('active');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}
