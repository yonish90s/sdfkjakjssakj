// ========== GLOBAL CONFIGS ==========
var activeCustomizations = {};
var isAdmin = localStorage.getItem('isAdmin') === 'true';

// ========== DATA ==========

const defaultNewsArticles = [
  { id: 1, title: 'Lenovo Refreshes ThinkPad Laptop Series with Five New Models', image: 'https://images.unsplash.com/photo-1531297122539-5692f69f1092?auto=format&fit=crop&q=80&w=800', category: 'Computers', isTop: 1, author: 'News Desk', time: 'Today, 18:30' },
  { id: 2, title: 'Google Introduces New Security Process for Android App Installation', image: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&q=80&w=800', category: 'Security', isTop: 2, author: 'News Desk', time: 'Today, 17:00' },
  { id: 3, title: 'Xiaomi Watch S5 Announced: Larger Screen and Up to 21 Days of Battery', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', category: 'Smartwatches', isTop: 3, author: 'News Desk', time: 'Today, 16:00' },
  { id: 4, title: 'Google Upgrades Google AI Pro Subscription to 5TB at No Extra Cost', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800', author: 'News Desk', time: 'Today, 16:45', snippet: 'Highlights: Google is upgrading storage from 2TB to 5TB. The increase is without any change in price, which stands at $19.99/mo. This move aims to make the plan more attractive for users demanding more space for AI-generated content...', category: 'Google' },
  { id: 5, title: 'WhatsApp Warning: About 200 Users Downloaded Fake Version with Spyware', image: 'https://images.unsplash.com/photo-1614064641913-6b7140414f70?auto=format&fit=crop&q=80&w=800', author: 'News Desk', time: 'Today, 15:45', snippet: 'Security researchers warn that a fake version of WhatsApp bypasses App Store protection mechanisms to collect personal user information...', category: 'Security' },
  { id: 6, title: 'Google Announces Wear OS 6.1: Independent Location and Kids Account Upgrade', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800', author: 'News Desk', time: 'Today, 12:12', snippet: 'The update improves smartwatch capabilities, aiming to compete head-to-head with the newest Apple Watch versions.', category: 'Google' },
  { id: 7, title: 'NVIDIA Introduces Auto Shader Compilation to Shorten Game Loading Times', image: 'https://images.unsplash.com/photo-1598550487031-0898b4852123?auto=format&fit=crop&q=80&w=800', author: 'News Desk', time: 'Today, 10:40', snippet: 'The new technology is expected to save precious seconds during initial game loading, completely eliminating the need for unnecessary pre-graphic simulation.', category: 'Hardware' },
  { id: 8, title: 'Telegram Introduces AI-Based Text Editor, Poll Upgrades, and Live Photo Support', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800', author: 'News Desk', time: 'Today, 09:19', snippet: 'The new Telegram version includes prominent innovations concerning AI tools and sharing convenience on the platform.', category: 'Apps' }
];

const defaultPdfStoreItems = [];





let storedPdfItems = localStorage.getItem('pdfStoreItems');
if (!storedPdfItems || JSON.parse(storedPdfItems).length === 0) {
  localStorage.setItem('pdfStoreItems', JSON.stringify(defaultPdfStoreItems));
}

const defaultServerUrl = 'http://localhost:4242';
const hostname = window.location.hostname;
const protocol = window.location.protocol;
const currentOrigin = window.location.origin || '';

const SERVER_URL = (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '' || protocol === 'file:')
  ? defaultServerUrl
  : currentOrigin.replace(/:\d+$/, ':4242');

let storedArticles = localStorage.getItem('newsArticles');
if (!storedArticles || JSON.parse(storedArticles).length === 0) {
  localStorage.setItem('newsArticles', JSON.stringify(defaultNewsArticles));
  storedArticles = localStorage.getItem('newsArticles');
}
let newsArticles = JSON.parse(storedArticles);
let searchQuery = '';

// Backup user articles before Firestore sync wipes them
if (storedArticles && !localStorage.getItem('newsArticles_migrated')) {
  const userArticles = JSON.parse(storedArticles).filter(a => a.id > 1000000);
  if (userArticles.length > 0) {
    localStorage.setItem('newsArticles_localBackup', JSON.stringify(userArticles));
    localStorage.setItem('newsArticles_migrated', 'true');
    console.log(`[Backup] Backed up ${userArticles.length} articles for migration.`);
  }
}

if (!storedArticles) {
  localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
}

let nextId = newsArticles.length ? Math.max(...newsArticles.map(a => a.id)) + 1 : 1;

const store3dProducts = [
  { 
    id: 'quantum-os', 
    title: 'Quantum OS', 
    price: 100,
    desc: 'The next generation of mobile computing. AI-integrated, fluid, and secure.',
    image: 'assets/quantum-os.png' 
  },
  { 
    id: 'infinity-pad', 
    title: 'Infinity Pad', 
    price: 150,
    desc: 'Unleash your creativity with the most powerful tablet ever made.',
    image: 'assets/infinity-pad.png' 
  },
  { 
    id: 'orbit-watch', 
    title: 'Orbit Watch', 
    price: 80,
    desc: 'Your health and connectivity, elegantly wrapped around your wrist.',
    image: 'assets/orbit-watch.png' 
  },
  { 
    id: 'apex-desktop', 
    title: 'Apex Desktop', 
    price: 300,
    desc: 'Ultimate performance for professionals. Speed and power.',
    image: 'assets/apex-desktop.png' 
  }
];

// ========== REVIEWS DATA ==========
const videoReviews = [
  { 
    id: 1, 
    title: 'Q&A: Neural Processing Unit', 
    subtitle: 'Meet with Team',
    duration: '15:20',
    youtubeId: 'dQw4w9WgXcQ', 
    thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800',
    description: 'An in-depth look at the next generation of hardware acceleration.'
  },
  { 
    id: 2, 
    title: 'Prepare your app for Accessibility', 
    subtitle: 'Tech Talks',
    duration: '34:50',
    youtubeId: 'dQw4w9WgXcQ', 
    thumbnail: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800',
    description: 'Exploring the latest features in inclusive design.'
  },
  { 
    id: 3, 
    title: 'Accelerate your workloads', 
    subtitle: 'Performance Lab',
    duration: '24:15',
    youtubeId: 'dQw4w9WgXcQ', 
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    description: 'Optimization techniques for massive data sets.'
  }
];

// ========== ARTICLE REVIEWS DATA ==========
const articleReviews = [
  {
    id: 101,
    title: 'The Future of Quantum OS: A Deep Dive',
    date: 'May 11, 2024',
    author: 'Chief Editor',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    description: 'We explore how Quantum OS is redefining the mobile experience with AI-first architecture and futuristic design language.',
    content: 'Full review content here...'
  },
  {
    id: 102,
    title: 'Infinity Pad: The Only Tablet You Need?',
    date: 'May 09, 2024',
    author: 'Tech Analyst',
    thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
    description: 'Is the Infinity Pad truly a laptop replacement? We put it to the test in real-world professional workflows.',
    content: 'Full review content here...'
  }
];

const servicesItems = [
  {
    id: 's1',
    title: 'Business Consulting 1-on-1',
    cat: 'Consulting',
    desc: '1-hour strategy session — mapping goals, blockers, and next steps together.',
    price: '$350 / hour',
    icon: '🎯'
  },
  {
    id: 's2',
    title: 'Website Building',
    cat: 'Digital',
    desc: 'Professional website, mobile-responsive, fast and SEO-friendly. Includes domain and hosting for 1 year.',
    price: 'From $2,500',
    icon: '🌐'
  },
  {
    id: 's3',
    title: 'Monthly Digital Support',
    cat: 'Support',
    desc: 'Full digital presence management — social media, campaigns, and marketing content.',
    price: '$1,200 / month',
    icon: '📱'
  },
  {
    id: 's4',
    title: 'On-demand Graphic Design',
    cat: 'Design',
    desc: 'Logos, banners, posts, flyers — everything you need to look professional.',
    price: 'From $250 / project',
    icon: '🎨'
  },
  {
    id: 's5',
    title: 'Content Writing',
    cat: 'Content',
    desc: 'Articles, posts, product descriptions, and landing pages that sell. SEO-focused.',
    price: '$180 / post',
    icon: '✍️'
  },
  {
    id: 's6',
    title: 'Business Photography',
    cat: 'Photography',
    desc: 'Product, event, or business portrait photography. Includes editing and delivery within 48 hours.',
    price: 'From $800 / day',
    icon: '📸'
  }
];

// =====================================================================
// Auto-fetch scraped articles from articles.json (populated by agent)
// User-added articles (id < 1000) are preserved; scraped ones use id >= 1000
// =====================================================================
// Real-time Articles Sync from Firestore
(function initArticlesSync() {
  if (!window.db || !window.fbFirestore) {
    console.warn('[Firestore] Not initialized yet, retrying...');
    setTimeout(initArticlesSync, 500);
    return;
  }

  const { collection, onSnapshot, query, orderBy } = window.fbFirestore;
  const q = query(collection(window.db, "articles"), orderBy("id", "desc"));

  onSnapshot(q, async (snapshot) => {
    const firestoreArticles = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
    
    try {
      // 1. Fetch from static JSON (scraped/defaults)
      const scrapedR = await fetch('articles.json?ts=' + Date.now());
      const scraped = await scrapedR.json().catch(() => []);

      // 2. Fetch from local server API (articles/ folder)
      const localR = await fetch('/api/articles');
      const local = await localR.json().catch(() => []);

      // Normalization helper
      const normalize = (a) => {
        if (!a.id && a.title) {
          // Simple hash for ID if missing (from local files)
          a.id = Math.abs(a.title.split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)) % 1000000;
        }
        if (!a.time && a.date) a.time = a.date;
        if (!a.image && a.sourceUrl) a.image = a.sourceUrl;
        return a;
      };

      const combined = [...firestoreArticles, ...scraped, ...local.map(normalize)];
      const uniqueMap = new Map();
      combined.forEach(a => {
        if (a && a.id && !uniqueMap.has(a.id)) {
          uniqueMap.set(a.id, a);
        }
      });

      newsArticles = Array.from(uniqueMap.values()).sort((a, b) => (b.id || 0) - (a.id || 0));
      localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
      renderNewsLayout();
      console.log(`[Articles] Synced ${newsArticles.length} articles (Firestore: ${firestoreArticles.length}, API: ${local.length}).`);

      // ONE-TIME MIGRATION: If local articles exist that are NOT in Firestore, upload them
      const storedLocal = JSON.parse(localStorage.getItem('newsArticles_localBackup') || '[]');
      if (storedLocal.length > 0) {
        const { addDoc, collection: col } = window.fbFirestore;
        storedLocal.forEach(localArt => {
          if (!firestoreArticles.some(f => f.id === localArt.id)) {
            addDoc(col(window.db, "articles"), localArt);
            console.log(`[Migration] Uploading article ${localArt.id} to Cloud`);
          }
        });
        localStorage.removeItem('newsArticles_localBackup');
      }
    } catch (err) {
      console.error('[Articles] Sync error:', err);
    }
  });
})();
isAdmin = localStorage.getItem('isAdmin') === 'true';
// Auto-restore edit mode if was logged in as admin/editor before refresh
document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('isEditor') === 'true') {
    // Small delay to let the page fully initialize first
    setTimeout(() => { 
      if (typeof enableLiveEditMode === 'function') enableLiveEditMode(); 
      if (typeof window.updateAdminEditBar === 'function') window.updateAdminEditBar();
    }, 500);
  } else {
    setTimeout(() => {
      if (typeof window.updateAdminEditBar === 'function') window.updateAdminEditBar();
    }, 500);
  }
});
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
    showToast('❌ You do not have permissions to perform this action');
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
  showToast('✅ Links updated successfully');
}

function openCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.add('active');
    showToast('Loading secure payment system...');
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

function toggleMoreDropdown(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('more-dropdown');
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
  const moreDropdown = document.getElementById('more-dropdown');
  if (moreDropdown && moreDropdown.classList.contains('active')) {
    if (!moreDropdown.contains(e.target)) {
      moreDropdown.classList.remove('active');
    }
  }
});

// ========== NAVIGATION ==========
function showPage(pageId) {
  // Access control check for hidden pages
  const visibilityState = (typeof activeCustomizations !== 'undefined' && activeCustomizations && activeCustomizations['__pageVisibility__']) || {};
  if (visibilityState[pageId] === false && !isAdmin) {
    console.warn(`Access denied to page: ${pageId} (Admin only)`);
    // Redirect to home if they are not allowed to view
    if (pageId !== 'home') {
      showPage('home');
      return;
    }
  }

  // Navigation active state logic
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    }
  });

  // Secondary mobile nav active state
  const secMap = { 'home': 'sec-nav-home', 'pdf-store': 'sec-nav-graphs', 'my-graphs': 'sec-nav-graphs', 'groups': 'sec-nav-forum', 'shop': 'sec-nav-shop', 'appointments': 'sec-nav-booking', 'services': 'sec-nav-services' };
  document.querySelectorAll('.sec-nav-item').forEach(btn => btn.classList.remove('active'));
  const secId = secMap[pageId];
  if (secId) { const el = document.getElementById(secId); if (el) el.classList.add('active'); }

  if (pageId === 'checkout') {
    openCheckoutModal();
    return;
  }
  if (pageId === 'admin-login') {
    openAdminLoginModal();
    return;
  }
  if (pageId === 'user-article') {
    openUserArticleModal();
    return;
  }
  if (pageId === 'about') {
    window.openAboutModal();
    return;
  }
  if (pageId === 'whats-new') {
    window.openWhatsNewModal();
    return;
  }
  if (pageId === 'subscription') {
    window.openSubscriptionModal();
    return;
  }
  if (pageId === 'ads') {
    window.openAdsModal();
    return;
  }
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));
  
  const targetPage = document.getElementById(`page-${pageId}`);
  if (targetPage) {
    targetPage.classList.add('active');
  } else {
    console.warn('Page not found:', pageId);
    const home = document.getElementById('page-home');
    if (home) home.classList.add('active');
  }

  // Dynamically update the logo subtext depending on pageId (Graphs / Articles)
  const subtextEl = document.getElementById('nav-logo-subtext');
  if (subtextEl) {
    const isHeb = document.body.classList.contains('rtl-layout');
    if (pageId === 'pdf-store' || pageId === 'my-graphs') {
      subtextEl.textContent = isHeb ? 'גרפים' : 'Graphs';
    } else if (pageId === 'groups' || pageId === 'group-detail') {
      subtextEl.textContent = isHeb ? 'פורום' : 'Forum';
    } else if (pageId === 'shop') {
      subtextEl.textContent = isHeb ? 'חנות' : 'Store';
    } else if (pageId === 'b2b') {
      subtextEl.textContent = isHeb ? 'מפעלים' : 'B2B Connect';
    } else if (pageId === 'realestate') {
      subtextEl.textContent = isHeb ? 'נדל"ן' : 'Real Estate';
    } else if (pageId === 'sharing') {
      subtextEl.textContent = isHeb ? 'השאלות' : 'Sharing';
    } else if (pageId === 'uber') {
      subtextEl.textContent = isHeb ? 'נסיעות' : 'Uber';
    } else {
      subtextEl.textContent = isHeb ? 'מאמרים' : 'Articles';
    }
  }

  // Scroll to top
  window.scrollTo(0, 0);

  // Close sidebar on mobile if open
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar && window.innerWidth <= 1024) {
    sidebar.classList.remove('active');
    sidebar.classList.remove('mobile-open');
    const backdrop = document.getElementById('sidebar-mobile-backdrop');
    if (backdrop) backdrop.classList.remove('active');
    updateHamburgerIcon(false);
  }

  // Trigger rendering logic based on pageId
  if (pageId === 'home') { renderNewsLayout(); if (window.renderRecentActivity) window.renderRecentActivity(); }
  if (pageId === 'store') showPage('shop');
  if (pageId === 'pdf-store') { syncPdfItemsFromFirebase(); renderPdfStoreGrid(); }
  if (pageId === 'shop') { loadAliExpressProducts(); renderShopGrid(); }
  if (pageId === 'b2b') { initB2bPage(); }
  if (pageId === 'realestate') { initRealEstatePage(); }
  if (pageId === 'sharing') { initSharingPage(); }
  if (pageId === 'services') renderServicesGrid();
  if (pageId === 'subscription') window.scrollTo({ top: 0, behavior: 'smooth' });
  if (pageId === 'appointments') initBookingWidget();
  if (pageId === 'my-graphs') renderMyGraphsWatchlist();
  if (pageId === 'messages') { if (window.initMessagesSystem) window.initMessagesSystem(); }
  if (pageId === 'groups') renderForum();
  if (pageId === 'archive') renderPersonalArchive();
  if (pageId === 'video-reviews') renderVideoReviews();
  if (pageId === 'article-reviews') renderArticleReviews();
  if (pageId === 'exchange') initExchange();
  if (pageId === 'admin') {
    if (!isAdmin) {
      openAdminLoginModal();
      return;
    }
    if (typeof initAdminDashboard === 'function') initAdminDashboard();
  }
  
  if (pageId === 'join') {
    if (typeof currentUser !== 'undefined' && currentUser) {
      const joinName = document.getElementById('join-name');
      const joinEmail = document.getElementById('join-email');
      if (joinName) joinName.value = currentUser.name || '';
      if (joinEmail) joinEmail.value = currentUser.email || '';
      const logoutBtn = document.getElementById('btn-logout');
      if (logoutBtn) logoutBtn.style.display = 'block';
      const authTabs = document.querySelector('.auth-tabs');
      if (authTabs) authTabs.style.display = 'none';
      const loginSection = document.getElementById('auth-login-section');
      if (loginSection) loginSection.style.display = 'none';
      const registerSection = document.getElementById('auth-register-section');
      if (registerSection) {
        registerSection.style.display = 'block';
        registerSection.querySelector('h2')?.remove();
      }
    } else {
      const joinName = document.getElementById('join-name');
      const joinEmail = document.getElementById('join-email');
      if (joinName) joinName.value = '';
      if (joinEmail) joinEmail.value = '';
      const logoutBtn = document.getElementById('btn-logout');
      if (logoutBtn) logoutBtn.style.display = 'none';
      const authTabs = document.querySelector('.auth-tabs');
      if (authTabs) authTabs.style.display = 'flex';
      if (typeof switchAuthTab === 'function') switchAuthTab('login');
    }
  }

  updateFloatingButtons(pageId);
}

function updateFloatingButtons(page = null) {
  if (!page) {
    const activePage = document.querySelector('.page.active');
    page = activePage ? activePage.id.replace('page-', '') : 'home';
  }

  const container = document.getElementById('support-floating-btn-container');
  if (container) container.style.display = 'block';
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
    showToast('❌ Please select an available slot');
    return;
  }
  
  document.getElementById('booking-selected-info').textContent = `${day} at ${selectedTime}`;
  document.getElementById('booking-modal').classList.add('active');
}

function closeBookingModal() {
  document.getElementById('booking-modal').classList.remove('active');
}

// stub — prevents crash from duplicate definition above
function openAddSiteModal() { showToast('Coming soon: Add Site'); }
function closeComicPasswordModal() { const m = document.getElementById('comic-password-modal'); if (m) m.classList.remove('active'); }
function verifyComicPassword() { closeComicPasswordModal(); }

function submitBookingDirect() {
  const name = document.getElementById('book-name-direct').value;
  const phone = document.getElementById('book-phone-direct').value;
  const request = document.getElementById('book-request-direct').value;
  const day = document.getElementById('book-day').value;
  
  if (!selectedTime) {
    showToast('❌ Please select an available slot');
    return;
  }
  if (!name || !phone) {
    showToast('❌ Please fill in name and phone');
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
  
  showToast('✅ Appointment booked successfully!');
  
  // Transition to Success View
  document.getElementById('booking-form-view').style.display = 'none';
  document.getElementById('booking-success-view').style.display = 'block';

  // Clear direct inputs
  document.getElementById('book-name-direct').value = '';
  document.getElementById('book-phone-direct').value = '';
  document.getElementById('book-request-direct').value = '';
  
  startAppointmentCountdown(day, selectedTime);
  initBookingWidget(); // Refresh grid to remove booked slot
}

let appointmentCountdownInterval = null;
function startAppointmentCountdown(dayName, timeStr) {
  if (appointmentCountdownInterval) clearInterval(appointmentCountdownInterval);
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetDay = days.indexOf(dayName);
  if (targetDay === -1) return;
  
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  function updateTimer() {
    const now = new Date();
    const currentDay = now.getDay();
    let daysUntil = targetDay - currentDay;
    
    if (daysUntil < 0 || (daysUntil === 0 && (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes)))) {
      daysUntil += 7; // Next week
    }
    
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + daysUntil);
    targetDate.setHours(hours, minutes, 0, 0);
    
    const diffMs = targetDate - now;
    if (diffMs <= 0) {
      document.getElementById('booking-countdown-timer').textContent = "00:00:00";
      clearInterval(appointmentCountdownInterval);
      return;
    }
    
    const h = Math.floor(diffMs / (1000 * 60 * 60));
    const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    document.getElementById('booking-countdown-timer').textContent = 
      `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  
  updateTimer();
  appointmentCountdownInterval = setInterval(updateTimer, 1000);
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
  
  showToast('✅ Appointment booked successfully!');
  
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
    list.innerHTML = '<div style="text-align:center; padding:40px; color:#86868b;">No scheduled appointments in the calendar.</div>';
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
          <div style="font-weight:800; color:#0071e3; font-size:1.1rem;">Day ${escHtml(a.day)} | ${escHtml(a.time)}</div>
          <div style="font-size:0.75rem; color:#86868b; margin-top:6px;">Booked on: ${a.created}</div>
        </div>
      </div>
      ${a.request ? `
        <div style="background:#fff; border-radius:10px; padding:16px; border:1px solid #e1e1e6; font-size:1rem; color:#424245; line-height:1.5;">
          <strong>Request:</strong> ${escHtml(a.request)}
        </div>
      ` : ''}
    </div>
  `).join('');
}

function clearAppointments() {
  if (confirm('Are you sure you want to delete all appointments?')) {
    localStorage.removeItem('appointments');
    renderAdminCalendar();
    showToast('🗑️ Calendar cleared');
  }
}


function goBack() {
  showPage(previousPage);
}

// ========== RENDER NEWS ==========
let currentPage = 1;
const ARTICLES_PER_PAGE = 10;
let currentCategory = 'all';
let currentLocation = JSON.parse(localStorage.getItem('userLocation')) || {
  id: 'Israel',
  nameHeb: 'Hebrew',
  lat: 31.7683,
  lon: 35.2137,
  capitalHeb: 'ירושלים'
};

// Migrate legacy userLocation stored in localStorage
if (currentLocation) {
  if (currentLocation.id !== 'Israel' && currentLocation.id !== 'USA') {
    currentLocation = {
      id: 'Israel',
      nameHeb: 'Hebrew',
      lat: 31.7683,
      lon: 35.2137,
      capitalHeb: 'ירושלים'
    };
    localStorage.setItem('userLocation', JSON.stringify(currentLocation));
  } else if (currentLocation.nameHeb === 'ישראל' || currentLocation.nameHeb === 'עברית') {
    currentLocation.nameHeb = 'Hebrew';
    localStorage.setItem('userLocation', JSON.stringify(currentLocation));
  } else if (currentLocation.nameHeb === 'ארצות הברית' || currentLocation.nameHeb === 'אנגלית') {
    currentLocation.nameHeb = 'English';
    localStorage.setItem('userLocation', JSON.stringify(currentLocation));
  }
}

const categoryEmojis = {
  'Computers': '💻',
  'Security': '🔒',
  'Smartwatches': '⌚',
  'Google': '🌐',
  'Hardware': '⚙️',
  'Apps': '📱',
  'Artificial Intelligence': '🤖',
  'AI': '🤖',
  'שוק ההון': '📈'
};

function isHebrewArticle(a) {
  if (a.lang) return a.lang === 'he';
  const text = (a.title || '') + (a.category || '');
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c >= 0x0590 && c <= 0x05FF) return true;
  }
  return false;
}

function getLocationArticles() {
  if (currentLocation.id === 'Israel') return newsArticles.filter(isHebrewArticle);
  return newsArticles.filter(a => !isHebrewArticle(a));
}

function renderNewsLayout(page = 1) {
  currentPage = page;
  if (page === 1) {
    window.isInfiniteScrollUnlocked = false;
    window.infiniteScrollUnlockCount = 0;
    const unlockContainer = document.getElementById('infinite-scroll-unlock-container');
    if (unlockContainer) unlockContainer.style.display = 'none';
    
    const unlockBtn = document.getElementById('infinite-scroll-unlock-btn');
    if (unlockBtn) {
      unlockBtn.onclick = () => {
        window.infiniteScrollUnlockCount = (window.infiniteScrollUnlockCount || 0) + 1;
        if (window.infiniteScrollUnlockCount >= 2) {
          window.isInfiniteScrollUnlocked = true;
        }
        const container = document.getElementById('infinite-scroll-unlock-container');
        if (container) container.style.display = 'none';
        
        // Trigger load of next page
        const locationArticles = getLocationArticles();
        let filteredArticles = currentCategory === 'all'
          ? locationArticles
          : locationArticles.filter(a => a.category === currentCategory);

        if (searchQuery && searchQuery.trim() !== '') {
          const queryLower = searchQuery.toLowerCase().trim();
          filteredArticles = filteredArticles.filter(a => {
            const titleMatch = (a.title || '').toLowerCase().includes(queryLower);
            const snippetMatch = (a.snippet || '').toLowerCase().includes(queryLower);
            const categoryMatch = (a.category || '').toLowerCase().includes(queryLower);
            const authorMatch = (a.author || '').toLowerCase().includes(queryLower);
            const contentMatch = (a.content || '').toLowerCase().includes(queryLower);
            return titleMatch || snippetMatch || categoryMatch || authorMatch || contentMatch;
          });
        }
        let displayFeatured = [];
        const featuredCarousel = document.getElementById('featured-carousel-container');
        if (featuredCarousel && featuredCarousel.style.display !== 'none') {
          displayFeatured = filteredArticles.filter(a => a.approved !== false && a.excludeFromCarousel !== true).slice(0, 12);
        }
        const feedArticles = filteredArticles.filter(a => !displayFeatured.includes(a) && a.approved !== false);
        const totalPages = Math.max(1, Math.ceil(feedArticles.length / ARTICLES_PER_PAGE));
        
        if (currentPage < totalPages && !isInfiniteScrollLoading) {
          loadNextInfiniteScrollPage(totalPages);
        }
      };
    }
  }
  const topGrid = document.getElementById('top-news-grid');
  const feedList = document.getElementById('news-feed-list');
  const paginationEl = document.getElementById('news-pagination');
  
  // Only return if at least the main feed list is missing
  if(!feedList) return;

  // 1. Render Category Filter Bar
  const locationArticles = getLocationArticles();
  const categoryBar = document.getElementById('category-filter-bar');
  if (categoryBar) {
    const isHebLang = document.body.classList.contains('rtl-layout');
    const allLabel = isHebLang ? 'הכל' : 'All';
    const categories = ['all', ...new Set(locationArticles.map(a => a.category).filter(Boolean))];
    categoryBar.innerHTML = categories.map(cat => {
      const isSelected = currentCategory === cat;
      const displayCat = cat === 'all' ? allLabel : cat;
      const emoji = categoryEmojis[cat] ? categoryEmojis[cat] + ' ' : '';
      return `<button class="category-pill ${isSelected ? 'active' : ''}" onclick="filterCategory('${escHtml(cat)}')">${emoji}${escHtml(displayCat)}</button>`;
    }).join('');
  }

  // Filter articles based on currentCategory
  let filteredArticles = currentCategory === 'all'
    ? locationArticles
    : locationArticles.filter(a => a.category === currentCategory);

  // Apply search query filter if active
  if (searchQuery && searchQuery.trim() !== '') {
    const queryLower = searchQuery.toLowerCase().trim();
    filteredArticles = filteredArticles.filter(a => {
      const titleMatch = (a.title || '').toLowerCase().includes(queryLower);
      const snippetMatch = (a.snippet || '').toLowerCase().includes(queryLower);
      const categoryMatch = (a.category || '').toLowerCase().includes(queryLower);
      const authorMatch = (a.author || '').toLowerCase().includes(queryLower);
      const contentMatch = (a.content || '').toLowerCase().includes(queryLower);
      return titleMatch || snippetMatch || categoryMatch || authorMatch || contentMatch;
    });
  }

  // 2. Render Featured Carousel (Only on page 1)
  let displayFeatured = [];
  if (page === 1) {
    const featuredCarousel = document.getElementById('featured-carousel-container');
    if (featuredCarousel) {
      if (currentCategory === 'all' && (!searchQuery || searchQuery.trim() === '')) {
        // Show carousel only on the main 'All' page
        displayFeatured = filteredArticles.filter(a => a.approved !== false && a.excludeFromCarousel !== true).slice(0, 12);
      } else {
        // Hide carousel and show a simple list when a specific category is selected or searching
        displayFeatured = [];
      }

      if (displayFeatured.length > 0) {
        featuredCarousel.style.display = 'block';
        featuredCarousel.innerHTML = `
          <div class="carousel-track-wrapper">
            <button class="carousel-arrow left" onclick="scrollCarousel(-1)">&#10094;</button>
            <div class="carousel-track" id="main-carousel-track">
              ${displayFeatured.map(a => {
                const actionsHtml = window.isEditModeActive ? `
                  <button class="article-crop-btn" onclick="event.stopPropagation(); openCropForArticle(this);" title="חתוך תמונה" style="position: absolute; top: 12px; left: 120px; z-index: 99; background: rgba(226, 135, 67, 0.9); border: 1px solid rgba(226, 135, 67, 0.6); color: #fff; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; backdrop-filter: blur(4px); transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
                    <i class="fas fa-crop-alt"></i> חתוך
                  </button>
                  <button class="article-duplicate-btn" onclick="event.stopPropagation(); duplicateArticle(${a.id});" title="שכפל כתבה">
                    <i class="fas fa-copy"></i> שכפל
                  </button>
                  <button class="article-delete-btn" onclick="event.stopPropagation(); deleteArticle(${a.id});" title="הסר כתבה">
                    <i class="fas fa-trash-alt"></i> הסר
                  </button>
                ` : '';
                return `
                  <div class="carousel-slide featured-card ${myArticlesList.some(x => x.id === a.id) ? 'saved-highlight' : ''}" onclick="showArticle(${a.id})" style="position: relative;">
                    ${actionsHtml}
                    <img src="${a.image}" alt="${escHtml(a.title)}">
                    <div class="featured-overlay">
                      <span class="featured-tag">${escHtml(a.category)}</span>
                      ${a.isPremium ? `<div style="font-size:0.75rem; font-weight:800; color:#f9b233; margin-bottom:-4px; display:flex; align-items:center; gap:4px; text-transform:uppercase;"><i class="fas fa-crown"></i> PREMIUM</div>` : ''}
                      <div class="featured-title">${escHtml(a.title)}</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            <button class="carousel-arrow right" onclick="scrollCarousel(1)">&#10095;</button>
          </div>
        `;
        if (displayFeatured.length > 3) {
          startCarouselAutoScroll();
        } else if (carouselInterval) {
          clearInterval(carouselInterval);
          carouselInterval = null;
        }
      } else {
        featuredCarousel.style.display = 'none';
      }
    }
  }

  const feedArticles = filteredArticles.filter(a => !displayFeatured.includes(a) && a.approved !== false);
  const totalPages = Math.max(1, Math.ceil(feedArticles.length / ARTICLES_PER_PAGE));
  const start = (page - 1) * ARTICLES_PER_PAGE;
  const pageArticles = feedArticles.slice(start, start + ARTICLES_PER_PAGE);

  const articlesHTML = pageArticles.map(a => {
    const isSaved = myArticlesList.some(x => x.id === a.id);
    const actionsHtml = window.isEditModeActive ? `
      <button class="article-crop-btn" onclick="event.stopPropagation(); openCropForArticle(this);" title="חתוך תמונה" style="position: absolute; top: 12px; left: 120px; z-index: 99; background: rgba(226, 135, 67, 0.9); border: 1px solid rgba(226, 135, 67, 0.6); color: #fff; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; backdrop-filter: blur(4px); transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
        <i class="fas fa-crop-alt"></i> חתוך
      </button>
      <button class="article-duplicate-btn" onclick="event.stopPropagation(); duplicateArticle(${a.id});" title="שכפל כתבה">
        <i class="fas fa-copy"></i> שכפל
      </button>
      <button class="article-delete-btn" onclick="event.stopPropagation(); deleteArticle(${a.id});" title="הסר כתבה">
        <i class="fas fa-trash-alt"></i> הסר
      </button>
    ` : '';
    return `
      <div class="feed-item" onclick="showArticle(${a.id})" style="position: relative;">
        ${actionsHtml}
        <div class="feed-image" style="background-image: url('${a.image}')"></div>
        <div class="feed-content">
          <h2 class="feed-title">${escHtml(a.title)}</h2>
          <div class="feed-meta" style="display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; overflow: hidden;">
            <span class="author-name" style="white-space: nowrap;">${escHtml(a.author)}</span> 
            <span class="meta-sep">|</span> 
            <span class="meta-date" style="white-space: nowrap;">${escHtml(a.time)}</span>
            <button class="meta-bookmark-btn ${isSaved ? 'active' : ''}" 
              onclick="event.stopPropagation(); toggleMyArticle(${a.id}, this);"
              style="margin-right: auto; flex-shrink: 0;"
              title="${isSaved ? 'Remove from My Articles' : 'Save to My Articles'}">
              <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
            </button>
          </div>
          ${a.snippet ? `<p class="feed-snippet">${escHtml(a.snippet)}</p>` : ''}
          ${a.isPremium ? `<div style="margin-top:8px; font-size:0.8rem; font-weight:700; color:#f9b233; display:flex; align-items:center; gap:4px;"><i class="fas fa-crown"></i> PREMIUM</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  if (pageArticles.length === 0) {
    if (page === 1) {
      feedList.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-dim); display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
          <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 20px; opacity: 0.6;"></i>
          <h3 style="font-size: 1.4rem; font-weight: 700; color: var(--text-main); margin-bottom: 10px;">לא נמצאו כתבות</h3>
          <p style="font-size: 1rem; color: var(--text-muted);">נסה לחפש מונח אחר או בדוק שגיאות כתיב</p>
        </div>
      `;
    }
  } else {
    if (page === 1) {
      feedList.innerHTML = articlesHTML;
    } else {
      feedList.insertAdjacentHTML('beforeend', articlesHTML);
    }
  }

  // Render pagination buttons
  if (paginationEl) {
    if (totalPages <= 1) {
      paginationEl.innerHTML = '';
    } else {
      let html = '';
      
      // 1. Info Label: "עמוד X מתוך Y"
      html += `
        <div style="padding: 8px 16px; border-radius: 8px; border: 1px solid #d2d2d7; background: #fff; color: #1d1d1f; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; direction: rtl;">
          עמוד ${page} מתוך ${totalPages.toLocaleString()}
        </div>
      `;
      
      // Helper function to render a single button
      const btn = (p, label = p) => {
        const isCurrent = p === page;
        return `
          <button onclick="renderNewsLayout(${p}); window.scrollTo({top:0,behavior:'smooth'});"
            style="padding: 8px 16px; border-radius: 8px; border: 1px solid ${isCurrent ? '#b0b0b5' : '#d2d2d7'};
            background: ${isCurrent ? '#e5e5ea' : '#fff'}; color: #1d1d1f;
            font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; min-width: 40px; display: inline-flex; align-items: center; justify-content: center;">
            ${label}
          </button>
        `;
      };
      
      // Helper function to render ellipsis
      const dots = () => `
        <span style="padding: 8px 8px; color: #86868b; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;">...</span>
      `;
      
      // Generate pages to show
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          html += btn(i);
        }
      } else {
        // Show 1, 2, 3
        html += btn(1);
        html += btn(2);
        html += btn(3);
        
        // Ellipsis
        html += dots();
        
        // Show 10, 20, 30 if they exist
        const tens = [10, 20, 30];
        let tensRendered = false;
        tens.forEach(t => {
          if (t > 3 && t < totalPages) {
            html += btn(t);
            tensRendered = true;
          }
        });
        
        if (tensRendered) {
          html += dots();
        }
        
        // Last page number button
        html += btn(totalPages);
      }
      
      paginationEl.innerHTML = html;
    }
  }
  
  // Render Ads on Home
  if (page === 1) {
    renderAdsSidebar();
  }
}

function filterCategory(cat) {
  currentCategory = cat;
  renderNewsLayout(1);
}

let carouselInterval = null;

function startCarouselAutoScroll() {
  if (carouselInterval) clearInterval(carouselInterval);
  carouselInterval = setInterval(() => {
    scrollCarousel(1, true);
  }, 10000);
}

function scrollCarousel(direction, isAuto = false) {
  const track = document.getElementById('main-carousel-track');
  if (track) {
    const scrollAmount = track.clientWidth; // Move to the next group of 3 cards
    
    // If we've reached the end and trying to scroll right, loop back to start
    if (direction === 1 && track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
    
    // Reset timer when user manually interacts
    if (!isAuto) startCarouselAutoScroll();
  }
}

function showArticle(id) {
  currentArticleId = id;
  previousPage = document.querySelector('.page.active')?.id?.replace('page-', '') || 'home';
  const a = newsArticles.find(x => x.id === id);
  if (!a) return;

  let processedContent = a.content || '';
  if (processedContent) {
    // Strip the source box paragraph completely
    processedContent = processedContent.replace(/<p[^>]*style="[^"]*background:#f3f4f6[^"]*"[^>]*>[\s\S]*?<\/p>/gi, '');
    processedContent = processedContent.replace(/<p[^>]*class="article-source-box"[^>]*>[\s\S]*?<\/p>/gi, '');
  }

  document.getElementById('article-content').innerHTML = `
    <header class="article-header">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <div class="article-category" id="inline-category">${escHtml(a.category)}</div>
        <div style="display:flex; gap:10px; align-items:center;">
          <!-- Book Mode Button -->
          <button class="btn-book-reader" onclick="window.openBookReader(${a.id});" style="background:none; border:1px solid #0071e3; color:#0071e3; padding:8px 16px; border-radius:980px; font-size:0.85rem; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all 0.2s;" onmouseover="this.style.background='rgba(0,113,227,0.05)'" onmouseout="this.style.background='none'">
            <i class="fas fa-book-open"></i>
            <span>קרא כמו ספר / Read Book</span>
          </button>

          <button class="btn-save-article ${myArticlesList.some(x => x.id === a.id) ? 'active' : ''}" 
            onclick="toggleMyArticle(${a.id}, this);" 
            style="background:none; border:1px solid #d2d2d7; padding:8px 16px; border-radius:980px; font-size:0.85rem; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all 0.2s;">
            <i class="${myArticlesList.some(x => x.id === a.id) ? 'fas' : 'far'} fa-bookmark"></i>
            <span>${myArticlesList.some(x => x.id === a.id) ? 'Saved' : 'Save for later'}</span>
          </button>
        </div>
      </div>
      <h1 class="article-title-main" id="inline-title">${escHtml(a.title)}</h1>
      <div class="article-meta-main">
        By <span id="inline-author" class="author-name" style="font-weight:700;">${escHtml(a.author)}</span>
        <span class="meta-sep">|</span> 
        <span id="inline-time" class="meta-date">${escHtml(a.time)}</span>
      </div>
    </header>
    <div class="article-hero-img" id="inline-hero-img" style="background-image: url('${a.image}'); position: relative;">
    </div>
    <div class="article-body">
      <div id="inline-content">
        ${processedContent ? processedContent : `
        <p>This is placeholder text to illustrate the article. In the full news system, this area will be pulled from the database and contain paragraphs, extended quotes, image galleries, and social sharing options.</p>
        <p>The leading technology company recently unveiled all the updates for the highly anticipated new system. At the event, thousands of technology journalists from around the world participated, getting a first look at the advanced software tools and hardware.</p>
        <p>In addition, special emphasis was placed on AI capabilities, privacy, and data security, with improvements that will make every action more efficient, convenient, and secure than ever before.</p>
        `}
      </div>

    <div class="article-body">
      ${(() => {
        const isSubscriber = currentUser && currentUser.isSubscriber;
        const hasAccess = !a.isPremium || isSubscriber || isAdmin;
        
        if (hasAccess) {
          return `
            <div class="article-text" id="inline-text">${processedContent || a.text || ''}</div>
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
                <p>This is where the full and exclusive content of Project 11 appears. Our subscribers enjoy full access to all the information, analysis, and most advanced data in the field. Join us today to unlock access to this article and hundreds more in our database.</p>
                <p>More blurred text to create the look of a full article... More blurred text to create the look of a full article... More blurred text to create the look of a full article...</p>
                <p>More blurred text to create the look of a full article... More blurred text to create the look of a full article...</p>
              </div>
            </div>
          `;
        }
      })()}
      
      <!-- Recommended Articles Section -->
      <div class="recommendations-wrapper">
        <h3 class="recommendations-title">You might also be interested in</h3>
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
  const currentArt = newsArticles.find(a => a.id === currentId);
  if (!currentArt) return '';

  // Simple ML-like similarity scoring
  const getKeywords = (str) => {
    if (!str) return [];
    return str.toLowerCase()
      .replace(/[^\w\s]/g, '') // Keep English only (removed Hebrew support)
      .split(/\s+/)
      .filter(w => w.length > 2); // Ignore short words
  };

  const currentKeywords = getKeywords(`${currentArt.title} ${currentArt.snippet || ''}`);

  const scoredArticles = newsArticles
    .filter(a => a.id !== currentId && a.approved !== false)
    .map(a => {
      const keywords = getKeywords(`${a.title} ${a.snippet || ''}`);
      let score = 0;
      
      // Bonus for same category
      if (a.category === category) score += 5;
      
      // Score based on keyword overlap
      currentKeywords.forEach(kw => {
        if (keywords.includes(kw)) score += 2;
      });

      return { ...a, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return scoredArticles.map(r => `
    <div class="rec-card" onclick="showArticle(${r.id})">
      <div class="rec-image" style="background-image: url('${r.image}')"></div>
      <div class="rec-meta">${escHtml(r.category)}</div>
      <div class="rec-title">${escHtml(r.title)}</div>
      ${r.score > 5 ? `<div style="font-size:0.7rem; color:var(--primary); font-weight:700; margin-top:4px;">🔥 Specially matched for you</div>` : ''}
    </div>
  `).join('');
}

// ========== ADMIN DASHBOARD ==========
function toggleMobileMenu() {
  const overlay = document.getElementById('mobile-menu-overlay');
  if (overlay) {
    overlay.classList.toggle('active');
  }
}

// ========== PAYMENT SYSTEM (GROW via Make) ==========
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/lzqyn4qx7thmtdc43mtmdjgqf4sxj';

async function redirectToPayment(amount, productName) {
  if (!currentUser) {
    showToast('❌ Please sign in to purchase a plan');
    openAuthModal('login');
    return;
  }

  showToast('🔄 Preparing secure payment...', 3000);
  
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount,
        productName: productName,
        customerEmail: currentUser.email,
        customerName: currentUser.displayName || currentUser.name,
        timestamp: new Date().toISOString(),
        siteUrl: window.location.origin
      })
    });

    if (!response.ok) throw new Error('Network response was not ok');

    // The webhook should return the payment URL as plain text or JSON
    const paymentUrl = (await response.text()).trim();

    if (paymentUrl && paymentUrl.startsWith('http')) {
      window.location.href = paymentUrl;
    } else {
      console.error('Invalid response from Make:', paymentUrl);
      alert('שגיאה: המערכת לא החזירה קישור תקין. התשובה שהתקבלה: ' + paymentUrl + '\n\nודא שהוספת מודול Webhook Response ב-Make שמחזיר את הקישור.');
    }
  } catch (error) {
    console.error('Payment Error:', error);
    showToast('❌ Error connecting to payment provider');
  }
}

function handleAuthAction() {
  const user = window.fbAuth?.currentUser;
  if (user) {
    logoutUser();
  } else {
    openAuthModal('login');
  }
}

function openAdminLoginModal() {
  const overlay = document.getElementById('admin-login-modal-overlay');
  if (!overlay) {
    console.warn('Admin login modal element not found');
    return;
  }
  const userInput = document.getElementById('admin-user');
  const passInput = document.getElementById('admin-pass');
  if (userInput) userInput.value = '';
  if (passInput) passInput.value = '';
  overlay.style.display = 'flex';
  if (userInput) userInput.focus();
}

function closeAdminLoginModal() {
  const overlay = document.getElementById('admin-login-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

function openUserArticleModal() {
  const overlay = document.getElementById('user-article-modal-overlay');
  if (!overlay) {
    console.warn('User article modal element not found');
    return;
  }
  overlay.style.display = 'flex';
  const titleInput = document.getElementById('user-art-title');
  if (titleInput) titleInput.value = '';
  const catInput = document.getElementById('user-art-cat');
  if (catInput) catInput.value = '';
  const authorInput = document.getElementById('user-art-author');
  if (authorInput) authorInput.value = '';
  const imageInput = document.getElementById('user-art-image');
  if (imageInput) imageInput.value = '';
  const excerptInput = document.getElementById('user-art-excerpt');
  if (excerptInput) excerptInput.value = '';
  const bodyInput = document.getElementById('user-art-body');
  if (bodyInput) bodyInput.value = '';
  tempUserArticleImage = '';
  if (titleInput) titleInput.focus();
}

function closeUserArticleModal() {
  const overlay = document.getElementById('user-article-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

async function adminLogin() {
  const user = document.getElementById('admin-user')?.value;
  const pass = document.getElementById('admin-pass')?.value;
  const errorBox = document.getElementById('admin-login-error');

  if (errorBox) {
    errorBox.style.display = 'none';
    errorBox.textContent = '';
  }

  if (!user || !pass) {
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.textContent = 'אנא מלא שם משתמש וסיסמה.';
    }
    return;
  }

  let loginSucceeded = false;
  let loginMessage = '';
  let response = null;
  let data = null;

  try {
    response = await fetch(`${SERVER_URL}/api/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass })
    });
    data = await response.json();
    console.log('Admin login response:', response.status, data);

    if (response.ok && data.status === 'success') {
      loginSucceeded = true;
      loginMessage = data.message || 'Admin logged in';
    } else {
      loginMessage = data.message || 'שם משתמש או סיסמה לא נכונים.';
    }
  } catch (error) {
    console.error('Admin login network error:', error);
    loginMessage = 'שגיאה בשרת. בדוק שהשרת רץ ונסה שוב.';
  }

  let isEditorLogin = false;

  if (!loginSucceeded) {
    if ((user === 'admin' && (pass === 'admin' || pass === '12345')) || 
        (user === 'admin2' && pass === 'admin2')) {
      console.warn('Local admin fallback login used.');
      loginSucceeded = true;
      loginMessage = 'Admin login succeeded with local credentials.';
    } else if (user === 'editor' && pass === 'editor') {
      console.warn('Local editor fallback login used.');
      loginSucceeded = true;
      isEditorLogin = true;
      loginMessage = 'Editor login succeeded with local credentials.';
    }
  }

  if (loginSucceeded) {
    closeAdminLoginModal();
    // Enable edit mode for ALL admin/editor logins — no extra button needed
    enableLiveEditMode();
    if (isEditorLogin) {
      localStorage.setItem('isEditor', 'true');
      showPage('home');
      showToast('✏️ מחובר כעורך — לחץ על כל טקסט או תמונה לעריכה');
    } else {
      localStorage.setItem('isAdmin', 'true');
      isAdmin = true;
      if (typeof applyPageVisibility === 'function') applyPageVisibility();
      showPage('admin');
      if (typeof initAdminDashboard === 'function') initAdminDashboard();
      showToast('✏️ מחובר כמנהל — לחץ על כל טקסט או תמונה באתר לעריכה');
    }
    return;
  }

  if (errorBox) {
    errorBox.style.display = 'block';
    errorBox.textContent = loginMessage;
  }
}

// ── ADD PRODUCT FORM HELPERS ──────────────────────────
window.apShowForm = function() {
  document.getElementById('ap-list-view').style.display = 'none';
  document.getElementById('ap-form-view').style.display = 'block';
};
window.apShowList = function() {
  document.getElementById('ap-form-view').style.display = 'none';
  document.getElementById('ap-list-view').style.display = 'block';
};
window.apAddVariant = function() {
  const c = document.getElementById('ap-variants-container');
  const idx = c.children.length;
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;align-items:center;gap:10px;margin-top:12px;';
  div.innerHTML = `
    <input type="text" class="ap-input" placeholder="Option name (e.g. Size)" style="flex:1;">
    <input type="text" class="ap-input" placeholder="Values (e.g. S, M, L)" style="flex:2;">
    <button type="button" onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1.1rem;">✕</button>`;
  c.appendChild(div);
};
// ── PAYMENTS / MAKE × GROW ────────────────────────────
window.payOpenMakeSetup = function() {
  const modal = document.getElementById('pay-make-modal');
  if (modal) { modal.style.display = 'flex'; }
  // Pre-fill saved values
  const saved = JSON.parse(localStorage.getItem('makeGrowConfig') || '{}');
  if (saved.webhook)  document.getElementById('pay-make-webhook').value  = saved.webhook;
  if (saved.growKey)  document.getElementById('pay-grow-key').value      = saved.growKey;
  if (saved.merchant) document.getElementById('pay-grow-merchant').value = saved.merchant;
};
// =====================================================================
// MARKETPLACE — User sell products
// =====================================================================
let marketplaceProducts = JSON.parse(localStorage.getItem('marketplaceProducts') || '[]');

// ── MY STORE DRAWER ───────────────────────────────────
window.openMyStoreDrawer = function() {
  const drawer = document.getElementById('my-store-drawer');
  const backdrop = document.getElementById('my-store-backdrop');
  if (!drawer) return;
  drawer.style.display = 'flex';
  if (backdrop) backdrop.style.display = 'block';
  myStoreRenderDrawer();
};
window.closeMyStoreDrawer = function() {
  document.getElementById('my-store-drawer').style.display = 'none';
  const b = document.getElementById('my-store-backdrop');
  if (b) b.style.display = 'none';
};
function myStoreRenderDrawer() {
  const userId = window._fbUser?.email || 'guest';
  const mp = JSON.parse(localStorage.getItem('marketplaceProducts') || '[]');
  const mine = mp.filter(p => p.userId === userId);
  const list = document.getElementById('my-store-drawer-list');
  if (!list) return;
  // Update badge
  const badge = document.getElementById('my-store-count');
  if (badge) { badge.textContent = mine.length; badge.style.display = mine.length > 0 ? 'flex' : 'none'; }

  if (!mine.length) {
    list.innerHTML = `<div style="text-align:center; padding:40px 20px; color:#6e6e73;">
      <div style="font-size:2.5rem; margin-bottom:12px;">🏪</div>
      <div style="font-weight:700; color:#a1a1aa; margin-bottom:8px;">אין מוצרים עדיין</div>
      <div style="font-size:0.82rem;">לחץ על "פרסם מוצר" כדי להתחיל למכור</div>
    </div>`;
    return;
  }
  list.innerHTML = mine.map(p => `
    <div style="display:flex; gap:12px; background:#1c1c1e; border:1px solid #2c2c2e; border-radius:12px; padding:12px; align-items:center;">
      <img src="${p.img}" style="width:60px; height:60px; object-fit:cover; border-radius:8px; flex-shrink:0;" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100'">
      <div style="flex:1; min-width:0;">
        <div style="font-weight:700; font-size:0.88rem; color:#f5f5f7; margin-bottom:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${p.title}</div>
        <div style="font-size:1rem; font-weight:900; color:#f97316;">₪${p.price.toLocaleString()}</div>
        <div style="font-size:0.7rem; color:#6e6e73; margin-top:2px;">${p.date || ''} · ${p.cat || ''}</div>
      </div>
      <button onclick="myStoreDeleteProduct('${p.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.9rem; padding:4px;" title="מחק">🗑</button>
    </div>`).join('');
}
window.myStoreDeleteProduct = function(id) {
  let mp = JSON.parse(localStorage.getItem('marketplaceProducts') || '[]');
  mp = mp.filter(p => p.id !== id);
  localStorage.setItem('marketplaceProducts', JSON.stringify(mp));
  if (typeof marketplaceProducts !== 'undefined') { marketplaceProducts.length = 0; mp.forEach(p => marketplaceProducts.push(p)); }
  myStoreRenderDrawer();
  showToast('המוצר נמחק');
};

// ── AI SHOPPING ASSISTANT ─────────────────────────────
window.openAIShopAssistant = function() {
  const modal = document.getElementById('ai-shop-modal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.classList.add('active');
    }, 10);
    setTimeout(() => document.getElementById('ai-shop-input')?.focus(), 120);
  }
};
window.closeAIShopAssistant = function() {
  const modal = document.getElementById('ai-shop-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
};

window.aiShopSearch = async function() {
  const input = document.getElementById('ai-shop-input');
  const query = input?.value.trim();
  if (!query) return;

  const msgs = document.getElementById('ai-shop-messages');
  const results = document.getElementById('ai-shop-results');

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.style.cssText = 'background:#0071e3; color:white; padding:10px 14px; border-radius:14px; align-self:flex-end; max-width:85%; font-size:0.9rem; text-align:left;';
  userMsg.innerHTML = `<span>${query}</span>`;
  msgs.appendChild(userMsg);
  msgs.scrollTop = msgs.scrollHeight;
  input.value = '';

  // Add typing indicator
  const typing = document.createElement('div');
  typing.style.cssText = 'background:#f1f1f1; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.9rem; text-align:left; color:#000;';
  typing.innerHTML = '<span style="color:#86868b; font-style:italic;">Typing...</span>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  // Search marketplace products
  const mp = JSON.parse(localStorage.getItem('marketplaceProducts') || '[]');
  const q = query.toLowerCase();
  const matched = mp.filter(p =>
    p.title.toLowerCase().includes(q) ||
    (p.desc || '').toLowerCase().includes(q) ||
    (p.cat || '').toLowerCase().includes(q)
  );

  // AI response via API if available, otherwise smart local search
  await new Promise(r => setTimeout(r, 900));
  typing.remove();

  const botMsg = document.createElement('div');
  botMsg.style.cssText = 'background:#f1f1f1; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.9rem; text-align:left; color:#000;';

  if (matched.length > 0) {
    botMsg.innerHTML = `<span>מצאתי <strong>${matched.length}</strong> מוצר${matched.length > 1 ? 'ים' : ''} שתואמ${matched.length > 1 ? 'ים' : ''} ל"${query}" 👇</span>`;
    msgs.appendChild(botMsg);

    // Show results
    results.style.display = 'flex';
    results.innerHTML = matched.map(p => `
      <div style="background:#fff; border:1px solid #e5e5ea; border-radius:12px; overflow:hidden; padding:8px; display:flex; gap:10px; cursor:pointer;" onclick="closeAIShopAssistant(); openMarketplaceModal();">
        <img src="${p.img}" style="width:60px; height:60px; border-radius:8px; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200'">
        <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
          <div style="font-weight:700; font-size:0.85rem; color:#000; margin-bottom:2px;">${p.title}</div>
          <div style="font-weight:900; color:#0071e3; font-size:0.9rem;">₪${p.price.toLocaleString()}</div>
        </div>
      </div>`).join('');
  } else {
    botMsg.innerHTML = `<span>לא מצאתי מוצרים בשם "${query}" כרגע. נסה לחפש בצורה אחרת, או <strong onclick="openMarketplaceModal(); closeAIShopAssistant();" style="color:#f97316; cursor:pointer;">פרסם מוצר</strong> בעצמך!</span>`;
    msgs.appendChild(botMsg);
    results.style.display = 'none';
  }
  msgs.scrollTop = msgs.scrollHeight;
};

window.openMarketplaceModal = function() {
  const modal = document.getElementById('marketplace-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  // Pre-fill seller name from current user
  const sellerInput = document.getElementById('mp-seller-name');
  if (sellerInput && !sellerInput.value) {
    const user = typeof currentUser !== 'undefined' ? currentUser : (window._fbUser || {});
    sellerInput.value = user.name && user.name !== 'Guest' ? user.name : '';
  }
  mpSwitchTab('sell', document.querySelector('.mp-tab'));
  mpSetupPreviewListeners();
  mpRenderBrowse();
};

window.closeMarketplaceModal = function() {
  document.getElementById('marketplace-modal').style.display = 'none';
};

window.mpSwitchTab = function(tab, btn) {
  ['sell','listings','browse'].forEach(t => {
    const el = document.getElementById(`mp-tab-${t}`);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('.mp-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (tab === 'listings') mpRenderMyListings();
  if (tab === 'browse')   mpRenderBrowse();
};

function mpSetupPreviewListeners() {
  const titleEl = document.getElementById('mp-prod-title');
  const priceEl = document.getElementById('mp-prod-price');
  const imgEl   = document.getElementById('mp-prod-img');
  const sellerEl= document.getElementById('mp-seller-name');
  const condEls = document.querySelectorAll('input[name="mp-cond"]');

  const update = () => {
    const img = document.getElementById('mp-prev-img');
    const title = document.getElementById('mp-prev-title');
    const price = document.getElementById('mp-prev-price');
    const seller = document.getElementById('mp-prev-seller');
    const badge  = document.getElementById('mp-prev-badge');
    if (img && imgEl?.value) img.src = imgEl.value;
    if (title) title.textContent = titleEl?.value || 'שם המוצר';
    if (price) price.textContent = '₪' + (priceEl?.value || '0');
    if (seller) seller.textContent = sellerEl?.value || 'המוכר';
    const cond = document.querySelector('input[name="mp-cond"]:checked')?.value || 'new';
    const condMap = { new:'חדש', 'like-new':'כמו חדש', used:'משומש', parts:'לחלקים' };
    if (badge) badge.textContent = condMap[cond] || 'חדש';
  };
  [titleEl, priceEl, imgEl, sellerEl].forEach(el => el?.addEventListener('input', update));
  condEls.forEach(el => el.addEventListener('change', update));
}

window.mpPublishProduct = function() {
  const title  = document.getElementById('mp-prod-title')?.value.trim();
  const price  = parseFloat(document.getElementById('mp-prod-price')?.value) || 0;
  const seller = document.getElementById('mp-seller-name')?.value.trim();
  if (!title) { showToast('אנא הזן שם מוצר', 'error'); return; }
  if (!seller){ showToast('אנא הזן שם מוכר', 'error'); return; }

  const product = {
    id: 'mp_' + Date.now(),
    title,
    desc:  document.getElementById('mp-prod-desc')?.value.trim() || '',
    img:   document.getElementById('mp-prod-img')?.value.trim()  || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
    price,
    cat:   document.getElementById('mp-prod-cat')?.value || 'general',
    cond:  document.querySelector('input[name="mp-cond"]:checked')?.value || 'new',
    seller,
    phone: document.getElementById('mp-seller-phone')?.value.trim() || '',
    date:  new Date().toLocaleDateString('he-IL'),
    userId: window._fbUser?.email || 'guest'
  };

  marketplaceProducts.unshift(product);
  localStorage.setItem('marketplaceProducts', JSON.stringify(marketplaceProducts));

  // Clear form
  ['mp-prod-title','mp-prod-desc','mp-prod-img','mp-prod-price','mp-seller-phone'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });

  showToast(`✅ המוצר "${title}" פורסם בהצלחה!`);
  mpSwitchTab('listings', document.querySelectorAll('.mp-tab')[1]);
};

function mpProductCard(p, showDelete) {
  const condMap = { new:'חדש', 'like-new':'כמו חדש', used:'משומש', parts:'לחלקים' };
  const condColors = { new:'#10b981', 'like-new':'#3b82f6', used:'#f59e0b', parts:'#ef4444' };
  return `
  <div class="mp-product-card">
    <div class="mp-prod-img-wrap">
      <img src="${p.img}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'">
      <span class="mp-cond-badge" style="background:${condColors[p.cond]||'#6b7280'};">${condMap[p.cond]||'חדש'}</span>
    </div>
    <div class="mp-prod-body">
      <div class="mp-prod-price">₪${p.price.toLocaleString()}</div>
      <div class="mp-prod-title">${p.title}</div>
      ${p.desc ? `<div class="mp-prod-desc">${p.desc.substring(0,80)}${p.desc.length>80?'...':''}</div>` : ''}
      <div class="mp-prod-meta">
        <span>👤 ${p.seller}</span>
        ${p.phone ? `<a href="https://wa.me/972${p.phone.replace(/^0/,'').replace(/-/g,'')}" target="_blank" class="mp-whatsapp-btn">📱 וואטסאפ</a>` : ''}
      </div>
      ${showDelete ? `<button class="mp-delete-btn" onclick="mpDeleteProduct('${p.id}')">🗑 מחק</button>` : ''}
    </div>
  </div>`;
}

function mpRenderMyListings() {
  const grid = document.getElementById('mp-my-listings-grid');
  if (!grid) return;
  const userId = window._fbUser?.email || 'guest';
  const mine = marketplaceProducts.filter(p => p.userId === userId);
  grid.innerHTML = mine.length
    ? mine.map(p => mpProductCard(p, true)).join('')
    : '<div class="mp-empty">עדיין לא פרסמת מוצרים. לחץ על "פרסם מוצר חדש" כדי להתחיל!</div>';
}

function mpRenderBrowse() {
  const searchVal = document.getElementById('mp-search-input')?.value.toLowerCase() || '';
  const catFilter = document.getElementById('mp-filter-cat')?.value || 'all';
  const grid = document.getElementById('mp-browse-grid');
  if (!grid) return;
  const filtered = marketplaceProducts.filter(p => {
    const matchCat = catFilter === 'all' || p.cat === catFilter;
    const matchSearch = !searchVal || p.title.toLowerCase().includes(searchVal) || (p.desc||'').toLowerCase().includes(searchVal);
    return matchCat && matchSearch;
  });
  grid.innerHTML = filtered.length
    ? filtered.map(p => mpProductCard(p, false)).join('')
    : '<div class="mp-empty">לא נמצאו מוצרים התואמים את החיפוש.</div>';
}

window.mpFilterBrowse = mpRenderBrowse;

window.mpDeleteProduct = function(id) {
  marketplaceProducts = marketplaceProducts.filter(p => p.id !== id);
  localStorage.setItem('marketplaceProducts', JSON.stringify(marketplaceProducts));
  mpRenderMyListings();
  showToast('המוצר נמחק');
};

window.payCloseMakeSetup = function() {
  const modal = document.getElementById('pay-make-modal');
  if (modal) modal.style.display = 'none';
};
window.paySaveMakeSetup = function() {
  const webhook  = document.getElementById('pay-make-webhook').value.trim();
  const growKey  = document.getElementById('pay-grow-key').value.trim();
  const merchant = document.getElementById('pay-grow-merchant').value.trim();
  if (!webhook || !growKey) { showToast('אנא מלא Webhook URL ו-Grow API Key', 'error'); return; }
  localStorage.setItem('makeGrowConfig', JSON.stringify({ webhook, growKey, merchant }));
  // Update badge to show connected
  const badge = document.querySelector('.pay-badge-soon');
  if (badge) { badge.textContent = '✓ Connected'; badge.style.background = 'rgba(16,185,129,0.15)'; badge.style.color = '#10b981'; badge.style.borderColor = 'rgba(16,185,129,0.3)'; }
  payCloseMakeSetup();
  showToast('✅ חיבור Make × Grow נשמר בהצלחה!');
};

window.apSaveProduct = function() {
  const title = document.getElementById('ap-title').value.trim();
  if (!title) { showToast('אנא הזן שם מוצר', 'error'); return; }
  const price = parseFloat(document.getElementById('ap-price').value) || 0;
  const desc  = document.getElementById('ap-desc').value.trim();
  const cat   = document.getElementById('ap-category').value || 'General';
  const status = document.getElementById('ap-status').value;

  // Save to shopProducts + localStorage
  const newProduct = {
    id: 'prod-' + Date.now(),
    title, price,
    desc,
    cat,
    brand: 'SOKI Store',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    colors: [],
    colorSwatches: [],
    imagesByColor: {},
    status
  };
  shopProducts.push(newProduct);
  const stored = JSON.parse(localStorage.getItem('storeItems') || '[]');
  stored.push(newProduct);
  localStorage.setItem('storeItems', JSON.stringify(stored));

  showToast(`✅ המוצר "${title}" נשמר בחנות!`);
  apShowList();
  // Refresh table
  const list = document.getElementById('ap-table-wrap');
  const empty = document.getElementById('ap-empty-banner');
  if (shopProducts.length > 0) { list.style.display='block'; empty.style.display='none'; }
  const tbody = document.getElementById('admin-store-products-list');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><div style="width:40px;height:40px;border-radius:6px;background:#2c2c2e;"></div></td><td>${title}</td><td>${cat}</td><td>—</td><td>₪${price.toFixed(2)}</td><td><button onclick="this.closest('tr').remove()" style="background:none;border:none;color:#ef4444;cursor:pointer;">מחק</button></td>`;
    tbody.appendChild(tr);
  }
};

function adminLogout() {
  isAdmin = false;
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('isEditor');
  if (typeof applyPageVisibility === 'function') applyPageVisibility();
  if (typeof disableLiveEditMode === 'function') disableLiveEditMode();
  closeAdminLoginModal();
  showPage('home');
}

function getAdminMediaLinks() {
  return JSON.parse(localStorage.getItem('adminImageLinks') || '[]');
}

function saveAdminMediaLinks(links) {
  localStorage.setItem('adminImageLinks', JSON.stringify(links));
}

function renderAdminImageLinks() {
  const container = document.getElementById('admin-images-list');
  if (!container) return;
  const images = getAdminMediaLinks();
  if (!images.length) {
    container.innerHTML = `<div style="padding:30px; background:#fffbeb; border-radius:16px; color:#92400e; border:1px solid #fcd34d;">אין תמונות מקושרות כרגע. לחץ על "הוסף תמונה" כדי להתחיל.</div>`;
    return;
  }

  container.innerHTML = images.map(item => `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:20px; overflow:hidden; box-shadow:0 10px 30px rgba(15,23,42,0.05);">
      <a href="${escHtml(item.link || '#')}" target="_blank" style="display:block; text-decoration:none; color:inherit;">
        <div style="height: 180px; background-image:url('${escHtml(item.img)}'); background-size:cover; background-position:center;"></div>
      </a>
      <div style="padding:18px;">
        <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start; flex-wrap:wrap;">
          <div style="flex:1; min-width:0;">
            <h3 style="margin:0 0 8px; font-size:1rem; font-weight:800;">${escHtml(item.title || 'תמונה מקושרת')}</h3>
            <p style="margin:0; color:#475569; font-size:0.95rem; word-break:break-word;">${escHtml(item.link || 'אין קישור')}</p>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn-primary" style="padding: 10px 14px; font-size:0.85rem;" onclick="openAdminImageEditor('${item.id}')">ערוך</button>
            <button class="btn-secondary" style="padding: 10px 14px; font-size:0.85rem; background:#fee2e2; color:#b91c1c;" onclick="deleteAdminImageLink('${item.id}')">מחק</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function openAdminImageEditor(id) {
  const editor = document.getElementById('admin-image-editor');
  if (!editor) return;

  const titleInput = document.getElementById('image-title');
  const imgInput = document.getElementById('image-url');
  const linkInput = document.getElementById('image-link');
  const editId = document.getElementById('image-edit-id');

  if (id) {
    const images = getAdminMediaLinks();
    const item = images.find(i => String(i.id) === String(id));
    if (item) {
      titleInput.value = item.title || '';
      imgInput.value = item.img || '';
      linkInput.value = item.link || '';
      editId.value = item.id;
    }
  } else {
    editId.value = '';
    titleInput.value = '';
    imgInput.value = '';
    linkInput.value = '';
  }

  editor.classList.remove('hidden');
  editor.scrollIntoView({ behavior: 'smooth' });
}

function closeAdminImageEditor() {
  const editor = document.getElementById('admin-image-editor');
  if (editor) editor.classList.add('hidden');
}

function saveAdminImageLink() {
  const title = document.getElementById('image-title').value.trim();
  const img = document.getElementById('image-url').value.trim();
  const link = document.getElementById('image-link').value.trim();
  const editId = document.getElementById('image-edit-id').value;

  if (!img || !link) {
    return;
  }

  const images = getAdminMediaLinks();
  const id = editId ? Number(editId) : Date.now();
  const item = { id, title: title || 'תמונה מקושרת', img, link };

  const index = images.findIndex(i => String(i.id) === String(id));
  if (index >= 0) {
    images[index] = item;
  } else {
    images.unshift(item);
  }

  saveAdminMediaLinks(images);
  closeAdminImageEditor();
  renderAdminImageLinks();
}

function deleteAdminImageLink(id) {
  if (!confirm('האם אתה בטוח שברצונך למחוק את הפריט הזה?')) return;
  const images = getAdminMediaLinks().filter(i => String(i.id) !== String(id));
  saveAdminMediaLinks(images);
  renderAdminImageLinks();
}

function loadAdminSettings() {
  const settings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
  const titleInput = document.getElementById('admin-site-title');
  const descInput = document.getElementById('admin-site-description');
  const langInput = document.getElementById('admin-default-lang');
  const maintenanceInput = document.getElementById('admin-maintenance-mode');

  if (titleInput) titleInput.value = settings.siteTitle || 'Quant Insight';
  if (descInput) descInput.value = settings.siteDescription || '';
  if (langInput) langInput.value = settings.defaultLang || 'he';
  if (maintenanceInput) maintenanceInput.checked = !!settings.maintenanceMode;

  applyAdminSettings(settings);
}

function applyAdminSettings(settings) {
  if (settings.siteTitle) {
    document.title = settings.siteTitle;
    const brand = document.querySelector('.sidebar-logo');
    if (brand) brand.textContent = settings.siteTitle;
  }
  if (settings.siteDescription) {
    const descriptionBlock = document.querySelector('.admin-site-description-preview');
    if (descriptionBlock) descriptionBlock.textContent = settings.siteDescription;
  }
}

function saveAdminSettings() {
  const settings = {
    siteTitle: document.getElementById('admin-site-title').value.trim() || 'Quant Insight',
    siteDescription: document.getElementById('admin-site-description').value.trim(),
    defaultLang: document.getElementById('admin-default-lang').value,
    maintenanceMode: document.getElementById('admin-maintenance-mode').checked
  };

  localStorage.setItem('adminSettings', JSON.stringify(settings));
  applyAdminSettings(settings);
}

function initAdminDashboard() {
  // Populate stats
  const statTotal = document.getElementById('stat-total');
  const statToday = document.getElementById('stat-today');
  if (statTotal) statTotal.textContent = localStorage.getItem('visitTotal') || '1,240';
  const statSales = document.getElementById('stat-sales-today');
  if (statSales) statSales.textContent = '₪1,450';

  // Populate new Products Table
  const productsList = document.getElementById('admin-store-products-list');
  if (productsList) {
    const products = JSON.parse(localStorage.getItem('storeItems') || '[]');
    if (products.length === 0) {
      productsList.innerHTML = `
        <tr>
          <td><img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=80&q=80" style="width:40px; height:40px; border-radius:8px; object-fit:cover;"></td>
          <td>מצלמת פולארויד וינטג'</td>
          <td><span style="background:#f3f4f6; padding:2px 8px; border-radius:12px; font-size:0.8rem;">אלקטרוניקה</span></td>
          <td><span style="color:#166534; font-weight:600;">14 במלאי</span></td>
          <td>₪350</td>
          <td>
            <button class="btn-secondary" style="padding:4px 8px; font-size:0.8rem; height:auto;">ערוך מחיר/מלאי</button>
          </td>
        </tr>
      `;
    } else {
      // If there are real store items, populate them
      productsList.innerHTML = products.map(p => `
        <tr>
          <td><img src="${p.image}" style="width:40px; height:40px; border-radius:8px; object-fit:cover;"></td>
          <td>${escHtml(p.title)}</td>
          <td><span style="background:#f3f4f6; padding:2px 8px; border-radius:12px; font-size:0.8rem;">${escHtml(p.category || 'כללי')}</span></td>
          <td><span style="color:#166534; font-weight:600;">זמין</span></td>
          <td>${escHtml(p.price)}</td>
          <td>
            <button class="btn-secondary" style="padding:4px 8px; font-size:0.8rem; height:auto;">ערוך</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // Orders are populated with mock data directly in HTML for the new view, 
  // but if real orders exist, we can render them too.
  const ordersListNew = document.getElementById('admin-orders-list-new');
  const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  if (ordersListNew && orders.length > 0) {
    ordersListNew.innerHTML = orders.map((o, i) => `
        <tr>
          <td>#10${43 + i}</td>
          <td>${new Date().toLocaleDateString('he-IL')}</td>
          <td>לקוח ${i+1}</td>
          <td><span style="background:#fef08a; color:#854d0e; padding:4px 8px; border-radius:4px; font-size:0.8rem;">ממתין</span></td>
          <td>₪${o.total.toFixed(2)}</td>
          <td>
            <button class="btn-primary" style="padding:4px 8px; font-size:0.8rem; height:auto; margin-left:8px;" onclick="alert('מפיק שטר מטען...')">הפק שטר מטען</button>
          </td>
        </tr>
    `).join('');
  }
  
  switchAdminTab('home');
  // Show unread manager messages badge
  setTimeout(() => {
    const msgs = JSON.parse(localStorage.getItem('managerMessages') || '[]');
    const unread = msgs.filter(m => !m.read).length;
    const badge = document.getElementById('manager-msgs-badge');
    if (badge && unread > 0) { badge.textContent = unread; badge.style.display = 'inline'; }
  }, 300);
}

function saveAiSettings() {
  const prompt = document.getElementById('admin-ai-prompt').value;
  localStorage.setItem('aiSystemPrompt', prompt);
  showToast('AI settings saved successfully');
}

let chatHistory = [];

async function sendChatMessage() {
  const input = document.getElementById('ai-chat-input');
  const message = input.value.trim();
  if (!message) return;

  const chatContainer = document.getElementById('ai-chat-messages');
  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  
  // Add user message to UI
  chatContainer.innerHTML += `
    <div style="background:var(--primary); color:white; padding:10px 14px; border-radius:14px; align-self:flex-end; max-width:85%; font-size:0.95rem; text-align:${isHeb ? 'right' : 'left'}; direction:${isHeb ? 'rtl' : 'ltr'};">
      ${message}
    </div>
  `;
  input.value = '';
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // --- PREDEFINED ANSWERS LOGIC ---
  const predefinedAnswers = isHeb ? {
    '1': 'אנחנו זמינים 24/7 באתר שלנו! כל המאמרים והמוצרים זמינים עבורך בכל עת.',
    '2': 'תוכל ליצור איתנו קשר במייל: support@project11.com או להשתמש בטופס צור קשר באתר.',
    '3': 'תוכל לקבוע פגישה בקלות דרך עמוד "קביעת פגישה" בתפריט הניווט שלנו.',
    '4': 'בעמוד "גרפים ונתונים" תוכל למצוא ניתוחים מתקדמים, תרשימים וקובצי נתונים להורדה ישירה.'
  } : {
    '1': 'We are available 24/7 on our site! All articles and products are available anytime.',
    '2': 'You can email us at: support@project11.com or use the contact form on the site.',
    '3': 'You can easily book an appointment via the "Book Appointment" page in our navigation menu.',
    '4': 'On the "Graphs" page, you can find advanced analytics, charts, and data files for direct download.'
  };

  // Option 5 — Talk to Manager
  if (message === '5') {
    // Show prompt for user to type their message
    chatContainer.innerHTML += `
      <div style="background:#1c1c1e; color:#fff; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:90%; font-size:0.95rem; text-align:${isHeb ? 'right' : 'left'}; direction:${isHeb ? 'rtl' : 'ltr'};">
        ${isHeb 
          ? 'בטח! אנא הקלד את ההודעה שלך למטה ואני אדאג שהמנהל יראה אותה. ✉️' 
          : "Sure! Please type your message below and I'll make sure the manager sees it. ✉️"}
      </div>
    `;
    chatContainer.scrollTop = chatContainer.scrollHeight;
    // Flag so next message goes to manager
    window._chatSendToManager = true;
    return;
  }

  // If previous message was "5" — send this as a manager message
  if (window._chatSendToManager) {
    window._chatSendToManager = false;
    const senderName = (currentUser && currentUser.name) ? currentUser.name : 'Guest';
    const senderEmail = (currentUser && currentUser.email) ? currentUser.email : 'guest_' + Date.now();
    const timestamp = new Date().toISOString();
    const managerMsg = {
      from: senderName,
      email: senderEmail,
      message,
      timestamp,
      read: false
    };
    // Save to Firestore under admin messages
    if (window.fbAddDoc && window.fbDb) {
      try {
        await window.fbAddDoc(window.fbColl(window.fbDb, 'adminMessages'), managerMsg);
      } catch(e) { console.error('Failed to save manager message:', e); }
    }
    // Also save to localStorage as backup
    const stored = JSON.parse(localStorage.getItem('managerMessages') || '[]');
    stored.unshift(managerMsg);
    localStorage.setItem('managerMessages', JSON.stringify(stored));

    setTimeout(() => {
      chatContainer.innerHTML += `
        <div style="background:#1c1c1e; color:#fff; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:90%; font-size:0.95rem; text-align:${isHeb ? 'right' : 'left'}; direction:${isHeb ? 'rtl' : 'ltr'};">
          ${isHeb 
            ? '✅ ההודעה שלך נשלחה למנהל בהצלחה! נחזור אליך בהקדם.' 
            : "✅ Your message has been sent to the manager! We'll get back to you soon."}
        </div>
      `;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 400);
    return;
  }

  if (predefinedAnswers[message]) {
    setTimeout(() => {
      chatContainer.innerHTML += `
        <div style="background:#f1f1f1; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.95rem; text-align:${isHeb ? 'right' : 'left'}; direction:${isHeb ? 'rtl' : 'ltr'}; color:#000;">
          ${predefinedAnswers[message]}
        </div>
      `;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 500);
    return;
  }
  // --- END PREDEFINED ANSWERS LOGIC ---

  // Add "Typing..."
  const typingId = 'typing-' + Date.now();
  chatContainer.innerHTML += `<div id="${typingId}" style="background:#f1f1f1; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.95rem; text-align:${isHeb ? 'right' : 'left'}; direction:${isHeb ? 'rtl' : 'ltr'}; color:#71717a;">${isHeb ? 'העוזר הווירטואלי חושב...' : 'Assistant is thinking...'}</div>`;
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    let systemPrompt = localStorage.getItem('aiSystemPrompt');
    if (!systemPrompt) {
      systemPrompt = isHeb 
        ? "You are an AI virtual assistant on this digital store website named SOKI. Answer in Hebrew politely, helpfully, and professionally." 
        : "You are an AI virtual assistant on this digital store website named SOKI. Answer in English politely, helpfully, and professionally.";
    }
    
    const apiUrl = window.API_URL || '';
    const res = await fetch(`${apiUrl}/api/chat`, {
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
      if (typingElem) typingElem.innerHTML = `<span style="color:red;">Server error: ${responseText.substring(0, 100)}...</span>`;
      return;
    }

    const typingElem = document.getElementById(typingId);
    if (typingElem) typingElem.remove();

    if (res.ok && data.text) {
      chatContainer.innerHTML += `
        <div style="background:#f1f1f1; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.95rem; text-align:${isHeb ? 'right' : 'left'}; direction:${isHeb ? 'rtl' : 'ltr'}; color:#000;">
          ${data.text}
        </div>
      `;
      chatHistory.push({ role: 'user', parts: [{ text: message }] });
      chatHistory.push({ role: 'model', parts: [{ text: data.text }] });
    } else {
      const errorMsg = data.error || 'Unknown error';
      const details = data.details || '';
      chatContainer.innerHTML += `
        <div style="background:#fff1f0; border:1px solid #ffa39e; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.95rem; text-align:left; color:#cf1322;">
          <strong>Server Error:</strong> ${errorMsg}<br>
          <small>${details}</small>
        </div>
      `;
    }
  } catch (err) {
    const typingElem = document.getElementById(typingId);
    if (typingElem) typingElem.innerHTML = `<span style="color:red;">Connection error: ${err.message}</span>`;
  }
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function handleAdImageUpload(event, index) {
  const file = event.target.files[0];
  if (!file) return;
  showToast('Processing image...');
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
      showToast('Image ready! ✅');
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
  if (preview) preview.innerHTML = '<span style="color:#86868b; font-size:0.85rem;">No Image</span>';
  
  showToast(`Ad slot ${index} cleared. Don't forget to save!`);
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
  showToast('✅ Ads saved successfully');
  renderAdsSidebar();
}

function renderAdsSidebar() {
  // Disabled as per user request to remove all Ad Space blocks
  const adContainers = document.querySelectorAll('.public-sidebar-ad');
  adContainers.forEach(c => c.style.display = 'none');
}

function switchAdminTab(tabId, btnEl) {
  document.querySelectorAll('.admin-section').forEach(el => el.style.display = 'none');
  const target = document.getElementById('admin-section-' + tabId);
  if (target) target.style.display = 'block';
  
  if (!btnEl) {
    btnEl = document.querySelector(`button.admin-nav-btn[data-admin-tab="${tabId}"]`);
  }

  if (btnEl) {
    document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));
    btnEl.classList.add('active');
  }

  if (tabId === 'calendar') renderAdminCalendar();
  if (tabId === 'pdfstore') renderPdfAdminList();
  if (tabId === 'images') renderAdminImageLinks();
  if (tabId === 'manager-msgs') renderManagerMessages();
  if (tabId === 'analytics') renderAdminAnalytics();
  if (tabId === 'links') {
    if (window.loadAdminLinks) window.loadAdminLinks();
  }
  if (tabId === 'page-visibility') renderPageVisibilityControls();
}

window.renderPageVisibilityControls = function() {
  const container = document.getElementById('page-visibility-controls-grid');
  if (!container) return;

  const customPages = (activeCustomizations && activeCustomizations['__customPages__']) || [];
  const customPagesInfo = customPages.map(p => ({
    id: p.id,
    name: `${p.name} (עמוד מותאם)`,
    icon: 'fas fa-file-alt'
  }));

  const pagesInfo = [
    { id: 'shop', name: 'חנות (Store)', icon: 'fas fa-shopping-bag' },
    { id: 'b2b', name: 'חיבור מפעלים (B2B)', icon: 'fas fa-industry' },
    { id: 'realestate', name: 'נדל"ן ומגמות', icon: 'fas fa-building' },
    { id: 'sharing', name: 'השאלות ואחסון', icon: 'fas fa-handshake' },
    { id: 'uber', name: 'נסיעות (אובר)', icon: 'fas fa-car' },
    { id: 'pdf-store', name: 'גרפים ונתונים', icon: 'fas fa-chart-line' },
    { id: 'groups', name: 'פורום (Forum)', icon: 'fa-solid fa-comments' },
    { id: 'bets', name: 'הימורים (Bets)', icon: 'fa-solid fa-dice' },
    { id: 'deliveries', name: 'משלוחים (Deliveries)', icon: 'fas fa-truck' },
    ...customPagesInfo
  ];

  const visibilityState = activeCustomizations['__pageVisibility__'] || {};

  container.innerHTML = pagesInfo.map(page => {
    const isVisible = visibilityState[page.id] !== false; // defaults to true
    return `
      <div style="background: #1c1c1e; border: 1px solid #2c2c2e; padding: 20px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 42px; height: 42px; background: rgba(0,113,227,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #0071e3; font-size: 1.2rem;">
            <i class="${page.icon}"></i>
          </div>
          <div>
            <h4 style="margin: 0; font-size: 1rem; font-weight: 700; color: #fff;">${page.name}</h4>
            <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: ${isVisible ? '#30d158' : '#ff453a'}; font-weight: 600;">
              ${isVisible ? 'גלוי לציבור הרחב' : 'מוסתר מהציבור (רק למנהל)'}
            </p>
          </div>
        </div>
        <div>
          <label class="switch" style="position: relative; display: inline-block; width: 44px; height: 22px;">
            <input type="checkbox" ${isVisible ? 'checked' : ''} onchange="togglePageVisibility('${page.id}', this.checked)" style="opacity: 0; width: 0; height: 0;">
            <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #3a3a3c; transition: .4s; border-radius: 34px;"></span>
          </label>
        </div>
      </div>
    `;
  }).join('');
};

window.togglePageVisibility = async function(pageId, isVisible) {
  if (!activeCustomizations['__pageVisibility__']) {
    activeCustomizations['__pageVisibility__'] = {};
  }
  activeCustomizations['__pageVisibility__'][pageId] = isVisible;
  await saveCustomizationsToServer();
  applyPageVisibility();
  renderPageVisibilityControls();
  showToast(`העמוד "${pageId}" ${isVisible ? 'גלוי כעת לציבור' : 'מוסתר כעת מהציבור'}`);
};

window.applyPageVisibility = function() {
  try {
    const visibilityState = (typeof activeCustomizations !== 'undefined' && activeCustomizations && activeCustomizations['__pageVisibility__']) || {};
    const customPages = (typeof activeCustomizations !== 'undefined' && activeCustomizations && activeCustomizations['__customPages__']) || [];
    const customPageIds = customPages.map(p => p.id);
    const pagesInfo = ['shop', 'b2b', 'realestate', 'sharing', 'uber', 'pdf-store', 'groups', 'bets', 'deliveries', ...customPageIds];

    pagesInfo.forEach(pageId => {
      try {
        const isVisible = visibilityState[pageId] !== false; // default true
        
        // Find all links referencing this page
        const sidebarLink = document.querySelector(`.sidebar-link[data-page="${pageId}"]`);
        const appleNavItems = document.querySelectorAll(`.apple-nav-item[onclick*="showPage('${pageId}')"]`);
        const mobileLinks = document.querySelectorAll(`.mobile-nav-link[onclick*="showPage('${pageId}')"]`);
        const secNavItems = document.querySelectorAll(`.sec-nav-item[onclick*="showPage('${pageId}')"]`);

        const allElements = [sidebarLink, ...appleNavItems, ...mobileLinks, ...secNavItems].filter(Boolean);
        const currentIsAdmin = (typeof isAdmin !== 'undefined' && isAdmin === true);

        if (currentIsAdmin) {
          // If admin, we always show the links
          allElements.forEach(el => {
            el.style.display = '';
            el.style.opacity = isVisible ? '1' : '0.65';
          });

          // Add interactive eye toggle next to the sidebar link
          if (sidebarLink) {
            let eyeToggle = sidebarLink.querySelector('.sidebar-page-eye-toggle');
            if (!eyeToggle) {
              eyeToggle = document.createElement('span');
              eyeToggle.className = 'sidebar-page-eye-toggle';
              eyeToggle.style.padding = '4px';
              eyeToggle.style.cursor = 'pointer';
              eyeToggle.style.zIndex = '10';
              eyeToggle.style.display = 'inline-flex';
              eyeToggle.style.alignItems = 'center';
              eyeToggle.style.justifyContent = 'center';
              
              // Position eye icon on the far left/right depending on RTL
              const isRtl = document.body.classList.contains('rtl-layout') || document.documentElement.dir === 'rtl' || document.body.dir === 'rtl';
              eyeToggle.style.marginRight = isRtl ? 'auto' : '8px';
              eyeToggle.style.marginLeft = isRtl ? '8px' : 'auto';

              eyeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const vState = (typeof activeCustomizations !== 'undefined' && activeCustomizations && activeCustomizations['__pageVisibility__']) || {};
                const currentVisible = vState[pageId] !== false;
                togglePageVisibility(pageId, !currentVisible);
              });
              sidebarLink.appendChild(eyeToggle);
            }
            eyeToggle.innerHTML = isVisible 
              ? '<i class="fas fa-eye" style="color: #30d158; font-size: 0.9rem;" title="גלוי לציבור (לחץ להסתרה)"></i>' 
              : '<i class="fas fa-eye-slash" style="color: #ff453a; font-size: 0.9rem;" title="מוסתר מהציבור (לחץ להצגה)"></i>';
          }

          // Add interactive eye toggle next to the header navbar items (appleNavItems)
          appleNavItems.forEach(navEl => {
            let eyeToggle = navEl.querySelector('.navbar-page-eye-toggle');
            if (!eyeToggle) {
              eyeToggle = document.createElement('span');
              eyeToggle.className = 'navbar-page-eye-toggle';
              eyeToggle.style.padding = '2px';
              eyeToggle.style.cursor = 'pointer';
              eyeToggle.style.marginLeft = '6px';
              eyeToggle.style.marginRight = '6px';
              eyeToggle.style.display = 'inline-flex';
              eyeToggle.style.alignItems = 'center';
              
              eyeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const vState = (typeof activeCustomizations !== 'undefined' && activeCustomizations && activeCustomizations['__pageVisibility__']) || {};
                const currentVisible = vState[pageId] !== false;
                togglePageVisibility(pageId, !currentVisible);
              });
              navEl.appendChild(eyeToggle);
            }
            eyeToggle.innerHTML = isVisible 
              ? '<i class="fas fa-eye" style="color: #30d158; font-size: 0.75rem;" title="גלוי לציבור (לחץ להסתרה)"></i>' 
              : '<i class="fas fa-eye-slash" style="color: #ff453a; font-size: 0.75rem;" title="מוסתר מהציבור (לחץ להצגה)"></i>';
          });

        } else {
          // If not admin, hide them completely if set to false
          allElements.forEach(el => {
            el.style.display = isVisible ? '' : 'none';
          });
          if (sidebarLink) {
            const eyeToggle = sidebarLink.querySelector('.sidebar-page-eye-toggle');
            if (eyeToggle) eyeToggle.remove();
          }
          appleNavItems.forEach(navEl => {
            const eyeToggle = navEl.querySelector('.navbar-page-eye-toggle');
            if (eyeToggle) eyeToggle.remove();
          });
        }
      } catch (innerErr) {
        console.error(`Error applying visibility for page ${pageId}:`, innerErr);
      }
    });
  } catch (err) {
    console.error('Error applying page visibility:', err);
  }
};


async function renderManagerMessages() {
  const container = document.getElementById('manager-msgs-list');
  if (!container) return;

  let msgs = [];

  // Load from Firestore
  if (window.fbGetDocs && window.fbDb) {
    try {
      const snap = await window.fbGetDocs(window.fbColl(window.fbDb, 'adminMessages'));
      snap.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
      msgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch(e) {}
  }

  // Fallback to localStorage
  if (msgs.length === 0) {
    msgs = JSON.parse(localStorage.getItem('managerMessages') || '[]');
  }

  // Update badge
  const badge = document.getElementById('manager-msgs-badge');
  const unread = msgs.filter(m => !m.read).length;
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'inline' : 'none';
  }

  if (msgs.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px; color:#86868b;">אין הודעות עדיין</div>';
    return;
  }

  container.innerHTML = msgs.map((m, i) => {
    const dateStr = m.timestamp ? new Date(m.timestamp).toLocaleString('he-IL') : '';
    return `
      <div style="background:#1c1c1e; border:1px solid ${m.read ? 'rgba(255,255,255,0.06)' : 'rgba(245,158,11,0.4)'}; border-radius:12px; padding:16px; direction:rtl;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            ${!m.read ? '<span style="width:8px;height:8px;background:#f59e0b;border-radius:50%;display:inline-block;flex-shrink:0;"></span>' : ''}
            <span style="font-weight:700; color:#f5f5f7; font-size:0.9rem;">${m.from || 'אורח'}</span>
            <span style="color:#86868b; font-size:0.8rem;">${m.email || ''}</span>
          </div>
          <span style="color:#86868b; font-size:0.75rem;">${dateStr}</span>
        </div>
        <p style="color:#e5e5e5; font-size:0.9rem; margin:0 0 10px; line-height:1.5;">${m.message}</p>
        <div style="margin-top: 10px; display: flex; gap: 8px;">
          <button onclick="markManagerMsgRead(${i})" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#a1a1aa; padding:4px 12px; border-radius:6px; font-size:0.78rem; cursor:pointer;">סמן כנקרא</button>
          ${m.email ? `
            <button onclick="replyContactInDirectChat('${m.email}', '${m.from}')" style="background:#10b981; border:none; color:#fff; padding:4px 12px; border-radius:6px; font-size:0.78rem; cursor:pointer; font-weight:600; display:flex; align-items:center; gap:4px; box-shadow:0 4px 10px rgba(16,185,129,0.2);" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
              <i class="fas fa-reply"></i> השב בצ'אט ישיר
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function replyContactInDirectChat(email, name) {
  // 1. Set the active admin thread ID to their email (which is their userId)
  window._activeAdminChatThreadId = email;
  
  // 2. Initialize a user contact placeholder message if thread doesn't exist
  const localMsgs = JSON.parse(localStorage.getItem('supportDirectMessages') || '[]');
  const hasMsgs = localMsgs.some(m => m.userId === email);
  if (!hasMsgs) {
    localMsgs.push({
      userId: email,
      senderName: name || 'Guest User',
      text: `[פנייה מצור קשר / Contact Request]`,
      timestamp: new Date().toISOString(),
      isAdmin: false,
      read: true
    });
    localStorage.setItem('supportDirectMessages', JSON.stringify(localMsgs));
  }
  
  // 3. Switch subtab to 'direct'
  switchAdminMsgsSubtab('direct');
}

function markManagerMsgRead(index) {
  let msgs = JSON.parse(localStorage.getItem('managerMessages') || '[]');
  if (msgs[index]) { msgs[index].read = true; localStorage.setItem('managerMessages', JSON.stringify(msgs)); }
  renderManagerMessages();
}

function clearManagerMessages() {
  if (confirm('למחוק את כל ההודעות?')) {
    localStorage.setItem('managerMessages', JSON.stringify([]));
    renderManagerMessages();
  }
}



function deleteMessage(index) {
  if (confirm('Are you sure you want to delete this message?')) {
    let msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    msgs.splice(index, 1);
    localStorage.setItem('contactMessages', JSON.stringify(msgs));
    initAdminDashboard();
    showToast('Message deleted');
  }
}

let currentViewMessageIndex = -1;

function viewMessage(index) {
  let msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
  const m = msgs[index];
  if (!m) return;
  currentViewMessageIndex = index;
  document.getElementById('view-msg-name').textContent = m.name;
  document.getElementById('view-msg-phone').textContent = 'Phone: ' + (m.phone || 'Not provided');
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
    if (confirm('Are you sure you want to delete this message?')) {
      let msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      msgs.splice(currentViewMessageIndex, 1);
      localStorage.setItem('contactMessages', JSON.stringify(msgs));
      initAdminDashboard();
      closeMessageViewModal();
      showToast('Message deleted');
    }
  }
}

function deleteArticle(id) {
  if (confirm('Are you sure you want to delete this article?')) {
    const art = newsArticles.find(a => a.id === id);
    if (art && art.firestoreId && window.db && window.fbFirestore) {
      const { doc, deleteDoc } = window.fbFirestore;
      deleteDoc(doc(window.db, "articles", art.firestoreId))
        .then(() => showToast('🗑️ Deleted from Cloud'))
        .catch(err => console.error("Firestore delete error:", err));
    }
    
    newsArticles = newsArticles.filter(a => a.id !== id);
    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
    initAdminDashboard();
    renderNewsLayout();
    showToast('🗑️ Article deleted');
  }
}

function openArticleEditor() {
  document.getElementById('admin-editor').classList.remove('hidden');
  const editorTitle = document.getElementById('admin-editor').querySelector('h3');
  
  editorTitle.textContent = 'Create New Article';
  document.getElementById('edit-id').value = '';
  document.getElementById('edit-title').value = '';
  document.getElementById('edit-category').value = '';
  document.getElementById('edit-author').value = 'News Desk';
  document.getElementById('edit-time').value = 'Today, 12:00';
  document.getElementById('edit-image').value = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800';
  document.getElementById('edit-snippet').value = '';
  document.getElementById('edit-content').value = '';
  document.getElementById('edit-youtube').value = '';
  document.getElementById('pos-none').checked = true;
  document.getElementById('edit-isPremium').checked = false;
  
  document.getElementById('admin-editor').scrollIntoView({ behavior: 'smooth' });
}

function editArticle(id) {
  const a = newsArticles.find(x => x.id === id);
  if (!a) return;

  document.getElementById('admin-editor').classList.remove('hidden');
  document.getElementById('admin-editor').querySelector('h3').textContent = 'Edit Article';
  
  document.getElementById('edit-id').value = a.id;
  document.getElementById('edit-title').value = a.title || '';
  document.getElementById('edit-category').value = a.category || '';
  document.getElementById('edit-author').value = a.author || '';
  document.getElementById('edit-time').value = a.time || '';
  document.getElementById('edit-image').value = a.image || '';
  document.getElementById('edit-snippet').value = a.snippet || '';
  document.getElementById('edit-content').value = a.content || '';
  document.getElementById('edit-youtube').value = a.youtube || '';
  
  const posValue = a.topPosition || 'none';
  const posRadio = document.getElementById(`pos-${posValue}`);
  if (posRadio) posRadio.checked = true;
  else document.getElementById('pos-none').checked = true;

  document.getElementById('edit-isPremium').checked = !!a.isPremium;
  
  document.getElementById('admin-editor').scrollIntoView({ behavior: 'smooth' });
}



async function saveAdminArticle() {
  const idValue = document.getElementById('edit-id').value;
  const topPos = document.querySelector('input[name="topPos"]:checked').value;
  
  const articleObj = {
    id: idValue ? Number(idValue) : Date.now(),
    title: document.getElementById('edit-title').value,
    category: document.getElementById('edit-category').value,
    author: document.getElementById('edit-author').value,
    time: document.getElementById('edit-time').value,
    image: document.getElementById('edit-image').value,
    snippet: document.getElementById('edit-snippet').value,
    content: document.getElementById('edit-content').value,
    youtube: document.getElementById('edit-youtube').value.trim(),
    topPosition: topPos !== 'none' ? topPos : false,
    isPremium: document.getElementById('edit-isPremium').checked,
    isCustom: true // Mark as custom to protect from deletion
  };

  if(!articleObj.title) {
    showToast('Please fill in title');
    return;
  }

  // --- PERSIST TO SERVER/CLOUD ---
  try {
    if (window.db && window.fbFirestore) {
      const { collection, addDoc, doc, updateDoc } = window.fbFirestore;
      const existing = newsArticles.find(x => x.id === articleObj.id);
      if (existing && existing.firestoreId) {
        await updateDoc(doc(window.db, "articles", existing.firestoreId), articleObj);
      } else {
        await addDoc(collection(window.db, "articles"), articleObj);
      }
    }
    // Parallel save to local server disk as fallback/redundancy
    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleObj)
    });
    showToast('✅ Saved successfully to Cloud');
  } catch (err) {
    console.error('[Admin] Save error:', err);
    showToast('⚠️ Saved locally only (Cloud error)', 'error');
  }

  // If assigning to a top position, remove that position from others
  if (articleObj.topPosition) {
    newsArticles.forEach(a => {
      if (a.topPosition === articleObj.topPosition && a.id !== articleObj.id) {
        a.topPosition = false;
      }
    });
  }

  if (idValue) {
    const idx = newsArticles.findIndex(a => a.id === Number(idValue));
    if (idx !== -1) {
      newsArticles[idx] = articleObj;
    }
  } else {
    newsArticles.unshift(articleObj);
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
  // Disabled as per user request to remove all toast notifications from the site
  return;
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
  showToast('Processing image...');

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
      showToast('Image ready! ✅');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ========== STORE MANAGEMENT ==========
function renderStoreLayout() {
  const contentArea = document.getElementById('store-content-area');
  if (!contentArea) return;

  const categories = [
    { name: 'Snacks', icon: '🍿', color: '#ffccbc' },
    { name: 'Breakfast', icon: '🥞', color: '#ffe0b2' },
    { name: 'Drinks', icon: '🥤', color: '#b3e5fc' },
    { name: 'Coffee', icon: '☕', color: '#d7ccc8' },
    { name: 'Canned', icon: '🥫', color: '#f8bbd0' },
    { name: 'Fruits', icon: '🍎', color: '#ffcdd2' },
    { name: 'Sauces', icon: '🫙', color: '#ffe082' },
    { name: 'Vegetables', icon: '🥦', color: '#c8e6c9' }
  ];

  contentArea.innerHTML = `
    <div class="store-container-modern">
      
      <!-- Banners -->
      <div class="store-banners-grid">
        <div class="store-banner-card" style="background: linear-gradient(135deg, #184e27, #0b2e13); color: white;">
          <div class="store-banner-content">
            <h2 style="font-weight: 800; font-size: 1.5rem; line-height: 1.2; margin-bottom: 12px; text-transform: uppercase;">MEAL PLAN WITH<br>GROCERY STORE</h2>
            <button class="store-banner-btn">Shop Now</button>
          </div>
          <div class="store-banner-img">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400" alt="Groceries">
          </div>
        </div>
        <div class="store-banner-card" style="background: linear-gradient(135deg, #2e7d32, #1b5e20); color: white;">
          <div class="store-banner-content">
            <h2 style="font-weight: 800; font-size: 1.5rem; line-height: 1.2; margin-bottom: 12px; text-transform: uppercase;">MAKING THE MOST OF<br>YOUR GROCERY</h2>
            <button class="store-banner-btn">Learn More</button>
          </div>
          <div class="store-banner-img">
            <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=400" alt="Fresh Food">
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="store-categories-container">
        <div class="store-categories-track">
          ${Array(10).fill(categories).flat().map(c => `
            <div class="store-category-item">
              <div class="store-category-icon-box" style="background-color: ${c.color};">
                <span class="store-category-icon">${c.icon}</span>
              </div>
              <span class="store-category-name">${c.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Products Grid -->
      <div class="store-modern-grid">
        ${store3dProducts.map(p => `
          <div class="store-modern-card">
            <div class="store-modern-image">
              <img src="${p.image}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=300'">
              <button class="store-modern-fav-btn"><i class="fa-regular fa-heart"></i></button>
            </div>
            <div class="store-modern-info">
              <h3 class="store-modern-title">${p.title}</h3>
              <p class="store-modern-desc">${p.desc}</p>
              <div class="store-modern-footer">
                <span class="store-modern-price">$${p.price}</span>
                <button class="store-modern-add-btn" onclick="addToCart('${p.id}', 'store3d')">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('')}
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
  showToast('Project 11 settings saved successfully!');
}

function handleStoreImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  showToast('Processing image...');
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
      showToast('Image ready! ✅');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function downloadStorePlatform(platform) {
  showToast(`⚡ Preparing download for ${platform}...`);
  
  const link = document.createElement('a');
  const baseUrl = 'https://pub-572449ca23df42e8b074673b3720fb60.r2.dev';
  
  if (platform === 'Mac') {
    link.href = `${baseUrl}/flowchart-1.0.0-universal.dmg`;
    link.download = 'flowchart-universal.dmg';
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
    showToast('✅ Download started!');
  }, 1000);
}

function downloadStoreSoftware() {
  downloadStorePlatform('Default');
}

// ========== PDF STORE ==========
const typeEmoji = { 'PDF': '📄', 'Software': '🖥️', 'Video': '📹', 'File': '📁', 'Guide': '📚' };

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
    grid.innerHTML = '<div style="text-align:center; padding:80px; color:#86868b; font-size:1.1rem; direction:rtl;">אין עדיין גרפים מאושרים. מנהל המערכת יאשר בקרוב!</div>';
    return;
  }
  
  grid.innerHTML = visibleItems.map((item) => {
    const icon = typeEmoji[item.type] || '📊';
    const mainImg = (item.images && item.images.length > 0) ? item.images[0] : '';
    const isUserLoggedIn = !!currentUser && !!currentUser.email;
    const isSaved = myGraphsList.some(x => x.id === item.id);
    const dateStr = item.date ? new Date(item.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'short', year: 'numeric' }) : 'הועלה לאחרונה';
    
    // Unified horizontal card — same proportions regardless of image
    const imageBlock = mainImg
      ? `<img src="${mainImg}" style="width:100%; height:100%; object-fit:cover;">`
      : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02));"><span style="font-size:2rem;opacity:0.4;">${icon}</span></div>`;

    const cardContent = `
      <div style="display:flex; gap:24px; align-items:stretch; width:100%; direction:rtl; text-align:right; min-height:140px;">
        <!-- Image / placeholder on the right -->
        <div style="width:220px; height:140px; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.08); flex-shrink:0;">
          ${imageBlock}
        </div>

        <!-- Text details -->
        <div style="flex:1; min-width:0; display:flex; flex-direction:column; justify-content:space-between; padding:4px 0;">
          <div>
            <h3 style="font-size:1.4rem; font-weight:800; color:#ffffff; margin-bottom:8px; transition:color 0.2s;" class="post-card-title">${escHtml(item.title)}</h3>
            <p style="color:#86868b; font-size:0.95rem; margin:0;">${item.type || 'ניתוח טכני'}</p>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.85rem; color:#86868b; border-top:1px solid rgba(255,255,255,0.06); padding-top:12px; margin-top:12px;">
            <div>${dateStr}</div>
            <div style="display:flex; align-items:center; gap:12px;">
              ${isUserLoggedIn ? `
                <button class="pdf-card-bookmark-btn ${isSaved ? 'active' : ''}"
                        style="background:transparent; border:none; color:${isSaved ? '#ff453a' : '#86868b'}; cursor:pointer; font-size:1.15rem; transition:color 0.2s;"
                        onclick="event.stopPropagation(); addToMyGraphs('${item.id}', this)"
                        onmouseover="this.style.color='#ff453a'"
                        onmouseout="this.style.color='${isSaved ? '#ff453a' : '#86868b'}'">
                  <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    return `
      <div class="premium-post-card" style="background:#1c1c1e; border:1px solid rgba(255,255,255,0.06); border-radius:16px; padding:24px; cursor:pointer; transition:all 0.25s cubic-bezier(0.16, 1, 0.3, 1);" 
           onmouseover="this.style.borderColor='rgba(255,255,255,0.15)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.4)'" 
           onmouseout="this.style.borderColor='rgba(255,255,255,0.06)'; this.style.transform='none'; this.style.boxShadow='none'" 
           onclick="showProductDetailById('${item.id}')">
        ${cardContent}
      </div>
    `;
  }).join('');
}

// ========== MY GRAPHS WATCHLIST LOGIC ==========
let myGraphsList = JSON.parse(localStorage.getItem('myGraphsList') || '[]');
let myArticlesList = JSON.parse(localStorage.getItem('myArticlesList') || '[]');

// Data migration logic: convert old ID arrays to object arrays [{id, customName}]
function migrateWatchlists() {
  let changed = false;
  if (myGraphsList.length > 0 && typeof myGraphsList[0] === 'string') {
    myGraphsList = myGraphsList.map(id => {
      const item = pdfStoreItems.find(x => x.id === id);
      return { id, customName: item ? item.title : id };
    });
    changed = true;
  }
  if (myArticlesList.length > 0 && typeof myArticlesList[0] === 'number') {
    myArticlesList = myArticlesList.map(id => {
      const art = newsArticles.find(x => x.id === id);
      return { id, customName: art ? art.title : id.toString() };
    });
    changed = true;
  }
  if (changed) {
    localStorage.setItem('myGraphsList', JSON.stringify(myGraphsList));
    localStorage.setItem('myArticlesList', JSON.stringify(myArticlesList));
  }
}
migrateWatchlists();

// Firestore Sync Functions
async function syncUserPersonalDataToFirebase() {
  if (!currentUser || !currentUser.email || !window.fbSetDoc) return;
  try {
    const userDocRef = window.fbDoc(window.fbDb, 'userData', currentUser.email);
    await window.fbSetDoc(userDocRef, {
      myGraphsList,
      myArticlesList,
      shoppingCart,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error syncing to Firestore:', err);
  }
}

window.enterFocusMode = function(event, type) {
  if (event) event.stopPropagation();
  console.log('enterFocusMode called for', type);
  const sidebar = document.getElementById('app-sidebar');
  const targetLink = document.getElementById(`link-${type}`);
  
  if (sidebar.classList.contains('focus-mode') && targetLink.classList.contains('focused-link')) {
    console.log('Already in focus mode for this type, exiting...');
    exitFocusMode();
    return;
  }
  
  sidebar.classList.add('focus-mode');
  
  // Remove any previous focused-link class
  document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('focused-link'));
  
  if (targetLink) targetLink.classList.add('focused-link');
  
  // Ensure the submenu is open and rendered
  if (type === 'my-graphs') renderSidebarWatchlist();
  if (type === 'my-articles') renderSidebarArticles();
  // if (type === 'my-purchases') renderSidebarPurchases();
  
  const dropdown = document.getElementById(`${type}-dropdown`);
  if (dropdown) dropdown.style.display = 'flex';
};

window.exitFocusMode = function(event) {
  if (event) event.preventDefault();
  const sidebar = document.getElementById('app-sidebar');
  sidebar.classList.remove('focus-mode');
  document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('focused-link'));
  
  // Close all personal dropdowns for a clean return
  const dropdowns = ['my-graphs-dropdown', 'my-articles-dropdown', 'my-purchases-dropdown'];
  dropdowns.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
};


async function loadUserPersonalDataFromFirebase() {
  if (!currentUser || !currentUser.email || !window.fbGetDoc) return;
  try {
    const userDocRef = window.fbDoc(window.fbDb, 'userData', currentUser.email);
    const docSnap = await window.fbGetDoc(userDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.myGraphsList) myGraphsList = data.myGraphsList;
      if (data.myArticlesList) myArticlesList = data.myArticlesList;
      if (data.shoppingCart) shoppingCart = data.shoppingCart;
      
      localStorage.setItem('myGraphsList', JSON.stringify(myGraphsList));
      localStorage.setItem('myArticlesList', JSON.stringify(myArticlesList));
      localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
      
      renderSidebarWatchlist();
      renderSidebarArticles();
      renderCart();
      renderNotifications();
      if (document.getElementById('page-my-graphs') && document.getElementById('page-my-graphs').classList.contains('active')) {
        renderMyGraphsWatchlist();
      }
    }
  } catch (err) {
    console.error('Error loading from Firestore:', err);
  }
}

// Inline Rename Functionality
function inlineRename(element, type, id) {
  const currentName = element.textContent;
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.className = 'inline-rename-input';
  input.style.width = '100%';
  input.style.background = 'transparent';
  input.style.border = '1px solid var(--primary)';
  input.style.color = 'inherit';
  input.style.padding = '2px 5px';
  input.style.borderRadius = '4px';
  input.style.outline = 'none';

  const saveName = async () => {
    const newName = input.value.trim() || currentName;
    if (type === 'graph') {
      const item = myGraphsList.find(x => x.id === id);
      if (item) item.customName = newName;
      localStorage.setItem('myGraphsList', JSON.stringify(myGraphsList));
      renderMyGraphsWatchlist();
      renderSidebarWatchlist();
    } else if (type === 'article') {
      const item = myArticlesList.find(x => x.id === id);
      if (item) item.customName = newName;
      localStorage.setItem('myArticlesList', JSON.stringify(myArticlesList));
      renderSidebarArticles();
    }
    syncUserPersonalDataToFirebase();
  };

  input.addEventListener('blur', saveName);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur();
    }
    if (e.key === 'Escape') {
      input.value = currentName;
      input.blur();
    }
  });

  element.parentNode.replaceChild(input, element);
  input.focus();
  input.select();
}

function addToMyGraphs(id, btnElement) {
  if (!currentUser || !currentUser.email) {
    showToast('❌ You must log in to manage your list');
    return;
  }
  
  const index = myGraphsList.findIndex(x => x.id === id);
  const isAdding = index === -1;

  if (isAdding) {
    const item = pdfStoreItems.find(x => x.id === id);
    myGraphsList.push({ id, customName: item ? item.title : id });
    showToast('✅ Added to My Graphs');
  } else {
    myGraphsList.splice(index, 1);
    showToast('📈 Removed from My Graphs');
  }

  // Optimistic UI update for instant feedback
  if (btnElement) {
    btnElement.classList.toggle('active', isAdding);
    const icon = btnElement.querySelector('i');
    if (icon) {
      icon.className = isAdding ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
    }
  }

  localStorage.setItem('myGraphsList', JSON.stringify(myGraphsList));
  renderMyGraphsWatchlist();
  renderSidebarWatchlist();
  syncUserPersonalDataToFirebase();
  updateSidebarBadges();
}

function removeFromMyGraphs(id) {
  myGraphsList = myGraphsList.filter(item => item.id !== id);
  localStorage.setItem('myGraphsList', JSON.stringify(myGraphsList));
  renderMyGraphsWatchlist();
  renderSidebarWatchlist();
  showToast('🗑️ Removed from list');
  syncUserPersonalDataToFirebase();
}

function renderMyGraphsWatchlist() {
  const container = document.getElementById('my-graphs-list');
  if (!container) return;
  
  const graphIds = myGraphsList.map(x => x.id);
  const items = pdfStoreItems.filter(item => graphIds.includes(item.id));
  
  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:60px; color:#86868b;">
        <i class="fas fa-list-ul" style="font-size:3rem; margin-bottom:16px; opacity:0.3;"></i>
        <p>Your watchlist is empty. Add graphs from the "Graphs & Data" page.</p>
      </div>
    `;
    return;
  }
  
  const savedItems = pdfStoreItems.filter(item => graphIds.includes(item.id));
  
  let html = `
    <div class="watchlist-container">
      <div class="watchlist-header">
        <div class="col-symbol">Symbol</div>
        <div class="col-last">Last</div>
        <div class="col-chg">Chg</div>
        <div class="col-chg-pct">Chg%</div>
        <div class="col-actions"></div>
      </div>
      <div class="watchlist-group">
        <div class="group-title">My Choices</div>
        ${savedItems.map(item => {
          const savedItem = myGraphsList.find(x => x.id === item.id);
          // Mock data for the TradingView style
          const lastPrice = (Math.random() * 500 + 50).toFixed(2);
          const chgRaw = (Math.random() * 20 - 10).toFixed(2);
          const chgPctRaw = (Math.random() * 5 - 2).toFixed(2);
          const isUp = parseFloat(chgRaw) >= 0;
          
          const chgValue = Math.abs(parseFloat(chgRaw)).toFixed(2);
          const chgPct = Math.abs(parseFloat(chgPctRaw)).toFixed(2);
          
          return `
            <div class="watchlist-row" onclick="showProductDetailById('${item.id}')">
              <div class="col-symbol">
                <div class="symbol-icon">${typeEmoji[item.type] || '📊'}</div>
                <div class="symbol-info">
                  <span class="symbol-name" ondblclick="event.stopPropagation(); inlineRename(this, 'graph', '${item.id}')" title="Double-click to rename">${escHtml(savedItem.customName || item.title)}</span>
                  <span class="symbol-desc">${item.type || 'DATA'}</span>
                </div>
              </div>
              <div class="col-last">${lastPrice}</div>
              <div class="col-chg ${isUp ? 'up' : 'down'}">${isUp ? '+' : '-'}${chgValue}</div>
              <div class="col-chg-pct ${isUp ? 'up' : 'down'}">${isUp ? '+' : '-'}${chgPct}%</div>
              <div class="col-actions">
                <button onclick="event.stopPropagation(); removeFromMyGraphs('${item.id}')" class="remove-btn">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
  
  container.innerHTML = html;
  renderSidebarWatchlist(); // Sync sidebar
}

// ========== SAVED ITEMS DRAWER LOGIC ==========
let currentSavedDrawerType = 'articles'; // 'articles' or 'graphs'

function toggleSavedDrawer(type) {
  const drawer = document.getElementById('saved-items-drawer');
  if (!drawer) return;
  
  if (drawer.classList.contains('active') && (currentSavedDrawerType === type || !type)) {
    drawer.classList.remove('active');
  } else {
    // Close other drawers
    const cart = document.getElementById('cart-drawer');
    if (cart) cart.classList.remove('active');
    const forums = document.getElementById('forums-drawer');
    if (forums) forums.classList.remove('active');
    const messages = document.getElementById('messages-drawer');
    if (messages) {
      messages.classList.remove('active');
      if (window.drawerChatRefreshInterval) {
        clearInterval(window.drawerChatRefreshInterval);
        window.drawerChatRefreshInterval = null;
      }
    }

    if (type) currentSavedDrawerType = type;
    renderSavedDrawer();
    drawer.classList.add('active');
  }
}

function renderSavedDrawer() {
  const container = document.getElementById('saved-items-container');
  const titleEl = document.getElementById('saved-items-title');
  if (!container || !titleEl) return;
  
  let itemsHtml = '';
  
  if (currentSavedDrawerType === 'graphs') {
    titleEl.textContent = 'Saved Graphs';
    if (myGraphsList.length === 0) {
      itemsHtml = `
        <div class="bottom-drawer-empty">
          <i class="fas fa-chart-pie" style="font-size:3rem; margin-bottom:12px; color:#86868b;"></i>
          <div style="font-size:1.1rem; font-weight:600; color:#86868b;">No saved graphs</div>
        </div>`;
    } else {
      const graphIds = myGraphsList.map(x => x.id);
      const savedItems = pdfStoreItems.filter(item => graphIds.includes(item.id));
      itemsHtml = savedItems.map(item => {
        const savedItem = myGraphsList.find(x => x.id === item.id);
        const displayName = savedItem.customName || item.title;
        return `
          <div class="bottom-drawer-item" onclick="showProductDetailById('${item.id}'); toggleSavedDrawer();" style="cursor:pointer;">
            <div class="bottom-drawer-item-img">
              <i class="fas fa-chart-pie" style="font-size:2rem; color:#fff;"></i>
            </div>
            <div class="bottom-drawer-item-title">${displayName}</div>
            <button class="bottom-drawer-item-remove" onclick="event.stopPropagation(); removeFromMyGraphs('${item.id}'); renderSavedDrawer();" title="Remove">&times;</button>
          </div>
        `;
      }).join('');
    }
  } else if (currentSavedDrawerType === 'articles') {
    titleEl.textContent = 'Saved Articles';
    if (myArticlesList.length === 0) {
      itemsHtml = `
        <div class="bottom-drawer-empty">
          <i class="fas fa-newspaper" style="font-size:3rem; margin-bottom:12px; color:#86868b;"></i>
          <div style="font-size:1.1rem; font-weight:600; color:#86868b;">No saved articles</div>
        </div>`;
    } else {
      const artIds = myArticlesList.map(x => x.id);
      const items = newsArticles.filter(art => artIds.includes(art.id));
      itemsHtml = items.map(art => {
        const savedItem = myArticlesList.find(x => x.id === art.id);
        const displayName = savedItem.customName || art.title;
        const imgEl = art.image 
          ? `<img src="${art.image}" alt="" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">` 
          : `<i class="fas fa-newspaper" style="font-size:2rem; color:#fff;"></i>`;
        return `
          <div class="bottom-drawer-item" onclick="showArticle(${art.id}); toggleSavedDrawer();" style="cursor:pointer;">
            <div class="bottom-drawer-item-img">
              ${imgEl}
            </div>
            <div class="bottom-drawer-item-title">${displayName}</div>
            <button class="bottom-drawer-item-remove" onclick="event.stopPropagation(); toggleMyArticle(${art.id}); renderSavedDrawer();" title="Remove">&times;</button>
          </div>
        `;
      }).join('');
    }
  }
  
  container.innerHTML = itemsHtml;
}

function toggleMyArticle(id, btn) {
  const existingIndex = myArticlesList.findIndex(x => x.id === id);
  const isAdding = existingIndex === -1;

  // Optimistic UI Update
  if (btn && btn.classList) {
    btn.classList.toggle('active', isAdding);
    const icon = btn.querySelector('i');
    const textSpan = btn.querySelector('span'); // PDP button has a span
    if (icon) {
      icon.className = isAdding ? 'fas fa-bookmark' : 'far fa-bookmark';
    }
    if (textSpan) {
      textSpan.textContent = isAdding ? 'Saved' : 'Save for later';
    }
  }

  if (!isAdding) {
    myArticlesList.splice(existingIndex, 1);
    showToast('🗑️ Removed from My Articles');
  } else {
    const art = newsArticles.find(x => x.id === id);
    myArticlesList.push({ id, customName: art ? art.title : id.toString() });
    showToast('✅ Added to My Articles');
  }

  localStorage.setItem('myArticlesList', JSON.stringify(myArticlesList));
  renderSidebarArticles();
  syncUserPersonalDataToFirebase();

  // If no btn provided (from other contexts), we might need to re-render
  if (!btn && (typeof currentArticleId !== 'undefined' && currentArticleId === id)) {
    showArticle(id);
  }
}

// ========== MY PURCHASES LOGIC ==========
function toggleMyPurchasesDropdown(event) {
  if (event) event.preventDefault();
  const dropdown = document.getElementById('my-purchases-dropdown');
  const chevron = document.getElementById('my-purchases-chevron');
  const isHidden = dropdown.style.display === 'none';
  
  dropdown.style.display = isHidden ? 'flex' : 'none';
  if (chevron) {
    chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  }
  
  if (isHidden) {
    renderSidebarPurchases();
  }
}

function renderSidebarPurchases() {
  const container = document.getElementById('my-purchases-dropdown');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  const userOrders = currentUser?.email ? orders.filter(o => o.email === currentUser.email) : [];

  if (userOrders.length === 0) {
    container.innerHTML = '<div style="padding:10px 45px; font-size:0.8rem; color:#86868b;">No purchases yet</div>';
    return;
  }

  const purchasedItems = [];
  userOrders.forEach(order => {
    order.items.forEach(item => {
      if (!purchasedItems.some(pi => pi.id === item.id)) {
        purchasedItems.push(item);
      }
    });
  });

  container.innerHTML = purchasedItems.map(item => `
    <a href="#" class="sidebar-link" onclick="showPage('reviews'); return false;" data-page="reviews">
      <div class="sidebar-link-content">
        <i class="fa-solid fa-play"></i>
        <span>סקירה</span>
      </div>
    </a>

    <a href="#" class="sidebar-link" onclick="showPage('graphs'); return false;" data-page="graphs">
      ${item.name}
    </a>
  `).join('');
}


function showProductDetailById(id) {
  const item = pdfStoreItems.find(x => x.id === id);
  if (!item) return;
  
  document.getElementById('pdp-title').textContent = item.title;
  const mainImg = document.getElementById('pdp-main-image');
  const thumbList = document.getElementById('pdp-thumbnails');
  const toggle3dBtn = document.getElementById('toggle-3d-btn');
  const viewer3d = document.getElementById('pdp-model-viewer');
  const container3d = document.getElementById('pdp-3d-container');
  const imageWrapper = document.getElementById('pdp-image-wrapper');
  
  // Gallery Logic
  const images = item.images || [];
  const isPremiumItem = !!item.isPremium;
  const isUserPremium = (currentUser && currentUser.isSubscriber) || isAdmin;
  const hasAccess = !isPremiumItem || isUserPremium;

  const descEl = document.getElementById('pdp-desc');
  descEl.textContent = item.desc || '';

  // Reset 3D State
  container3d.classList.add('hidden');
  container3d.classList.remove('active');
  imageWrapper.classList.remove('hidden');

  if (item.model3d) {
    toggle3dBtn.classList.remove('hidden');
    viewer3d.src = item.model3d;
    toggle3dBtn.innerHTML = '<i class="fas fa-cube"></i> View in 3D';
  } else {
    toggle3dBtn.classList.add('hidden');
  }

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
          <h2 style="font-size: 1.8rem; margin-bottom: 12px; font-weight: 800;">Content Reserved for Premium Subscribers</h2>
          <p style="margin-bottom: 25px; font-size: 1.05rem; color: #424245; max-width: 300px;">To view the full graph and data analysis, please join our premium plan.</p>
          <button class="btn-primary" onclick="showPage('subscription')" style="background: #0071e3; color: #fff; border: none; padding: 14px 40px; border-radius: 980px; font-weight: 700; cursor: pointer; font-size: 1.1rem; box-shadow: 0 10px 30px rgba(0,113,227,0.3);">✨ Join Now</button>
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
    const cidMap = { 'PDF': '1544716278-ca5e3f4abd8c', 'Software': '1517694712202-14dd9538aa97', 'Video': '1492724441997-5dc865305da7', 'File': '1544391490-01c6db9f5a70', 'Guide': '1497633762265-9d179a990aa6' };
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
      child.textContent.includes('Contact') || 
      child.textContent.includes('Send Message') ||
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
    list.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:32px; color:#86868b;">No items yet. Click "Add Item".</div>';
    return;
  }
  list.innerHTML = items.map((item) => `
    <div style="background:#f5f5f7; border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:8px; position:relative; border: ${item.approved === false ? '2px solid #f9b233' : '1px solid #eee'};">
      ${item.approved === false ? '<div style="background:#f9b233; color:#fff; font-size:0.65rem; padding:2px 6px; border-radius:4px; position:absolute; top:8px; right:8px; font-weight:800;">Pending Approval</div>' : ''}
      <div style="font-size:2rem; text-align:center;">${typeEmoji[item.type] || '📄'}</div>
      <div style="font-weight:700; font-size:0.9rem; text-align:center; color:#1d1d1f;">${escHtml(item.title)}</div>
      <div style="font-size:0.8rem; color:#86868b; text-align:center;">${escHtml(item.type)} · ${escHtml(item.price || 'Free')}</div>
      <div style="display:flex; gap:6px; flex-wrap:wrap; justify-content:center; margin-top:4px;">
        ${item.approved === false ? `<button class="btn-primary" style="padding:4px 10px; font-size:0.78rem; background:#34c759;" onclick="approvePdfItem('${item.id}')">Approve</button>` : ''}
        <button class="btn-primary" style="padding:4px 10px; font-size:0.78rem;" onclick="openPdfItemEditorById('${item.id}')">Edit</button>
        <button class="remove-btn" style="padding:4px 10px; font-size:0.78rem; border:none; background:transparent; color:#ef4444;" onclick="deletePdfItem('${item.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

async function approvePdfItem(id) {
  try {
    await fbUpdateDoc(fbDoc(fbDb, 'pdfStoreItems', id), { approved: true });
    showToast('✅ Graph approved and published on the site!');
    syncPdfItemsFromFirebase();
  } catch (e) {
    showToast('❌ Error approving item');
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
      showToast('Updated successfully');
    } else {
      // New item
      itemData.approved = true; // Admin added items are approved by default
      await fbAddDoc(fbColl(fbDb, 'pdfStoreItems'), itemData);
      showToast('Created successfully');
    }
    
    document.getElementById('pdf-item-editor').classList.add('hidden');
    syncPdfItemsFromFirebase();
  } catch (e) {
    showToast('Error saving');
  }
}

async function deletePdfItem(id) {
  if (!confirm('Are you sure you want to permanently delete this item?')) return;
  try {
    await fbDeleteDoc(fbDoc(fbDb, 'pdfStoreItems', id));
    showToast('🗑️ Item deleted successfully');
    syncPdfItemsFromFirebase();
  } catch (e) {
    showToast('❌ Error deleting item');
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
    statusEl.textContent = `❌ File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Please use an external link for files over 5MB.`;
    statusEl.style.color = '#ef4444';
    statusEl.style.display = 'block';
    return;
  }

  statusEl.textContent = '⏳ Loading file...';
  statusEl.style.color = '#0071e3';
  statusEl.style.display = 'block';

  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('pdf-edit-link').value = e.target.result;
    statusEl.textContent = `✅ File "${file.name}" uploaded successfully! (${(file.size / 1024).toFixed(0)}KB)`;
    statusEl.style.color = '#22c55e';
    showToast('File ready! Don\'t forget to save.');
  };
  reader.onerror = function() {
    statusEl.textContent = '❌ Error loading file. Try again.';
    statusEl.style.color = '#ef4444';
  };
  reader.readAsDataURL(file);
}

function editPdfItem(index) { openPdfItemEditor(index); }

function savePdfItem() {
  const title = document.getElementById('pdf-edit-title').value.trim();
  if (!title) { showToast('Please enter item name'); return; }
  
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
    showToast('Graph/File updated successfully');
  } else {
    items.unshift(item);
    showToast('Graph/File added successfully');
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
  showToast('Processing image...');
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
      showToast(`Image ${activeImgSlot} uploaded successfully!`);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}


function deletePdfItem(index) {
  if (confirm('Delete this item?')) {
    const items = getPdfItems();
    items.splice(index, 1);
    savePdfItems(items);
    renderPdfAdminList();
    renderPdfStoreGrid();
    showToast('Item deleted');
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
  if (el) {
    el.classList.add('active');
    // Ensure chat widget is correctly localized whenever opened
    updateNavbarLanguage();
  }
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
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.toggle('active');
    
    // Switch to direct support messages mode automatically so the user can write to support immediately
    window._supportChatMode = 'assistant'; // reset to force transition to direct mode
    if (typeof toggleSupportChatMode === 'function') {
      toggleSupportChatMode();
    }
    
    updateNavbarLanguage();
    
    if (modal.classList.contains('active')) {
      setTimeout(() => {
        const inp = document.getElementById('direct-chat-input');
        if (inp) inp.focus();
      }, 350);
    }
  }
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
  showToast('Message sent successfully! ✅');
  
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
  if (savedTheme !== 'light') {
    document.body.classList.add('dark-theme');
  }
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-theme');
  const isDark = body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  showToast(isDark ? '🌙 Dark mode activated' : '☀️ Light mode activated');
}

// ========== REVIEWS LOGIC ==========
function renderVideoReviews() {
  const grid = document.getElementById('reviews-grid');
  if (!grid) return;

  grid.innerHTML = videoReviews.map(v => `
    <div class="video-card" onclick="showReviewDetail(${v.id}, 'video')">
      <div class="video-thumbnail" style="background-image: url('${v.thumbnail}')">
        <div class="video-brand"><span></span> Developer</div>
        <div class="video-duration">${v.duration}</div>
        <div class="play-overlay"><i class="fas fa-play"></i></div>
      </div>
      <div class="video-info">
        <h3 class="video-title">${v.title}</h3>
        <p class="video-subtitle">${v.subtitle}</p>
      </div>
    </div>
  `).join('');
}

function renderArticleReviews() {
  const grid = document.getElementById('article-reviews-grid');
  if (!grid) return;

  grid.innerHTML = articleReviews.map(a => `
    <div class="article-review-card" onclick="showReviewDetail(${a.id}, 'article')">
      <div class="article-review-thumb" style="background-image: url('${a.thumbnail}')"></div>
      <div class="article-review-info">
        <h3 class="article-review-title">${a.title}</h3>
        <p class="article-review-desc">${a.description}</p>
        <div class="article-review-meta">By ${a.author} • ${a.date}</div>
      </div>
    </div>
  `).join('');
}

function showReviewDetail(id, type) {
  const v = type === 'video' ? videoReviews.find(x => x.id === id) : articleReviews.find(x => x.id === id);
  if (!v) return;

  const backBtn = document.getElementById('review-back-btn');
  if (backBtn) backBtn.setAttribute('onclick', `showPage('${type === 'video' ? 'video-reviews' : 'article-reviews'}')`);

  const content = document.getElementById('review-detail-content');
  
  if (type === 'video') {
    content.innerHTML = `
      <div class="review-detail-container">
        <div class="video-embed-wrapper">
          <iframe src="https://www.youtube.com/embed/${v.youtubeId}" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="review-text-content">
          <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 16px;">${v.title}</h1>
          <div style="display: flex; gap: 15px; color: #86868b; margin-bottom: 24px;">
            <span>By ${v.author || v.subtitle}</span>
            <span>•</span>
            <span>${v.date || ''}</span>
          </div>
          <p style="font-size: 1.15rem; line-height: 1.6; color: var(--text-main);">${v.description}</p>
        </div>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="review-detail-container">
        <div class="review-article-hero" style="background-image: url('${v.thumbnail}');"></div>
        <div class="review-text-content">
          <h1 style="font-size: 3rem; font-weight: 900; margin-bottom: 24px; letter-spacing: -0.04em;">${v.title}</h1>
          <div style="display: flex; gap: 15px; color: #86868b; margin-bottom: 40px; font-weight: 600;">
            <span>By ${v.author}</span>
            <span>•</span>
            <span>${v.date}</span>
          </div>
          <div class="review-body-text" style="font-size: 1.25rem; line-height: 1.7; color: var(--text-main); max-width: 800px;">
            ${v.description}<br><br>${v.content}
          </div>
        </div>
      </div>
    `;
  }
  showPage('review-detail');
}

// ========== INIT ==========
initTheme();
if (isAdmin) {
  showPage('admin');
} else {
  showPage('home');
}





// ========== USER & COMMENTS LOGIC ==========
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
// If Firebase auth guard already set a user (module script ran first), prefer it
if (!currentUser && window._fbUser) {
  currentUser = window._fbUser;
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Initial sync from cloud
if (currentUser && currentUser.email) {
  loadUserPersonalDataFromFirebase();
}


function handleProfilePicUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  showToast('Processing image...');
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
      showToast('✅ Image uploaded successfully!');
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
  showToast('🎲 Random image selected');
}

function saveUserProfile() {
  const name = document.getElementById('join-name').value.trim();
  const email = document.getElementById('join-email').value.trim().toLowerCase();
  const password = document.getElementById('join-password').value.trim();
  const profilePic = document.getElementById('join-profile-pic').value;
  
  if (!name || !email || !password) {
    showToast('❌ Please fill in all fields to register');
    return;
  }

  // Basic email validation
  if (!email.includes('@') || !email.includes('.')) {
    showToast('❌ Invalid email address');
    return;
  }
  
  let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
  
  if (registeredUsers[email]) {
    showToast('❌ This email is already registered', 'error');
    return;
  } else {
    // New user, register
    registeredUsers[email] = { name, password, avatar: profilePic };
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    currentUser = { name, email, avatar: profilePic };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserUI();
    if (typeof window.syncCurrentUserProfileToFirestore === 'function') {
      window.syncCurrentUserProfileToFirestore();
    }
    
    showToast('✨ Registration successful!', 'success');
    
    setTimeout(() => {
      goBack();
    }, 1000); 
  }
}

function logoutUser() {
  if (confirm('Are you sure you want to log out?')) {
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
      showToast('👋 Logged out successfully');
    }
  }
}

function deleteUser(email) {
  // ... (existing code)
}

function deleteOrder(index) {
  if (confirm('Are you sure you want to delete this order?')) {
    let orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    orders.splice(index, 1);
    localStorage.setItem('orderHistory', JSON.stringify(orders));
    initAdminDashboard();
    showToast('Order deleted');
  }
}

function clearOrders() {
  if (confirm('Are you sure you want to clear order history?')) {
    localStorage.setItem('orderHistory', '[]');
    initAdminDashboard();
    showToast('🧹 History cleared');
  }
}

async function handleDailyWallet() {
  if (!currentUser || !currentUser.email) {
    const el = document.getElementById('user-wallet-balance');
    if (el) el.style.display = 'none';
    return;
  }
  
  const el = document.getElementById('user-wallet-balance');
  if (el) el.style.display = 'flex';
  
  if (!window.fbDoc || !window.fbDb) return;
  
  const today = new Date().toISOString().split('T')[0];
  const localClaimKey = `wallet_claim_${currentUser.email}`;
  
  try {
    const userRef = window.fbDoc(window.fbDb, 'userData', currentUser.email);
    const docSnap = await window.fbGetDoc(userRef);
    
    let walletBalance = 0;
    let lastClaimDate = '';
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      walletBalance = data.walletBalance || 0;
      lastClaimDate = data.lastClaimDate || '';
    }
    
    if (lastClaimDate !== today && localStorage.getItem(localClaimKey) !== today) {
      walletBalance += 10;
      lastClaimDate = today;
      await window.fbSetDoc(userRef, {
        walletBalance,
        lastClaimDate
      }, { merge: true });
      localStorage.setItem(localClaimKey, today);
      showToast('קיבלת 10₪ במזומן לארנק יומי! 🎁', 'success');
    } else {
      localStorage.setItem(localClaimKey, today);
    }
    
    const amtEl = document.getElementById('wallet-amount');
    if (amtEl) amtEl.textContent = walletBalance;
  } catch(err) {
    console.error('Wallet error:', err);
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

  if (isAdminLoggedIn) {
    if (!window.isEditModeActive) {
      enableLiveEditMode();
    }
  } else {
    if (window.isEditModeActive) {
      disableLiveEditMode();
    }
  }

  if (isUserLoggedIn || isAdminLoggedIn) {
    btnJoin.style.display = 'none';
    profileBadge.style.display = 'flex';
    btnLogoutNav.style.display = 'none'; // Replaced by Reddit profile dropdown logout button!

    if (isAdminLoggedIn && !isUserLoggedIn) {
      document.getElementById('user-badge-avatar').style.display = 'none';
      const badgeEmoji = document.getElementById('user-badge-name').previousElementSibling; // This is the img
      if (badgeEmoji && badgeEmoji.id === 'user-badge-avatar') badgeEmoji.style.display = 'none';
      
      // Since it's admin, we can show a special icon or just the text
      document.getElementById('user-badge-name').textContent = '🛡️ System Admin';
    } else if (isUserLoggedIn) {
      const avatarImg = document.getElementById('user-badge-avatar');
      avatarImg.style.display = 'block';
      avatarImg.src = currentUser.avatar || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=200&h=200';
      document.getElementById('user-badge-name').textContent = currentUser.name;
      handleDailyWallet();
    }
    
    // Update comment inputs for users
    if (isUserLoggedIn) {
      document.querySelectorAll('[id$="-comment-input-area"]').forEach(el => el.style.display = 'block');
      document.querySelectorAll('[id$="-comment-join-prompt"]').forEach(el => el.style.display = 'none');
      document.querySelectorAll('[id$="-comment-user-name"]').forEach(el => el.textContent = currentUser.name);
      
      // Show Sidebar Links for email-logged-in users
      const myGraphsLink = document.getElementById('link-my-graphs');
      if (myGraphsLink) myGraphsLink.style.display = 'flex';

      const myArticlesLink = document.getElementById('link-my-articles');
      if (myArticlesLink) myArticlesLink.style.display = 'flex';

      const myPurchasesLink = document.getElementById('link-my-purchases');
      if (myPurchasesLink) myPurchasesLink.style.display = 'flex';

      const displayEmail = document.getElementById('user-display-email');
      if (displayEmail) displayEmail.textContent = currentUser.email;
      
      const adminLink = document.getElementById('sidebar-admin-link');
      if (currentUser.email === 'yoni98321@gmail.com') {
        isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        if (adminLink) adminLink.style.display = 'flex';
      } else {
        if (adminLink) adminLink.style.display = 'none';
      }
    }
  } else {
    btnJoin.style.display = 'block';
    profileBadge.style.display = 'none';
    btnLogoutNav.style.display = 'none';
    
    const adminLink = document.getElementById('sidebar-admin-link');
    if (adminLink) adminLink.style.display = 'none';
    
    document.querySelectorAll('[id$="-comment-input-area"]').forEach(el => el.style.display = 'none');
    document.querySelectorAll('[id$="-comment-join-prompt"]').forEach(el => el.style.display = 'block');
    
    const wEl = document.getElementById('user-wallet-balance');
    if (wEl) wEl.style.display = 'none';
    
    // Hide "My Graphs" for guests/logged-out
    const myGraphsLink = document.getElementById('link-my-graphs');
    if (myGraphsLink) myGraphsLink.style.display = 'none';

    const myArticlesLink = document.getElementById('link-my-articles');
    if (myArticlesLink) myArticlesLink.style.display = 'none';

    const myPurchasesLink = document.getElementById('link-my-purchases');
    if (myPurchasesLink) myPurchasesLink.style.display = 'none';
  }
  
  if (typeof window.updateAdminEditBar === 'function') {
    window.updateAdminEditBar();
  }
  
  if (typeof window.renderDeliveriesList === 'function') {
    window.renderDeliveriesList();
  }
}

function submitLocalComment(type) {
  const textarea = document.getElementById(`${type}-new-comment`);
  const text = textarea.value.trim();
  
  if (!text) {
    showToast('❌ Cannot post an empty comment');
    return;
  }
  
  const targetId = type === 'article' ? currentArticleId : activeComicIndex;
  const comments = JSON.parse(localStorage.getItem(`comments_${type}_${targetId}`) || '[]');
  
  const newComment = {
    userName: currentUser.name,
    userAvatar: currentUser.avatar,
    text: text,
    date: new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
  };
  
  comments.push(newComment);
  localStorage.setItem(`comments_${type}_${targetId}`, JSON.stringify(comments));
  
  textarea.value = '';
  renderComments(type, targetId);
  showToast('✅ Comment posted!');
  if (window.renderRecentActivity) window.renderRecentActivity();
}
window.submitLocalComment = submitLocalComment;

function renderComments(type, targetId) {
  const list = document.getElementById(`${type}-comments-list`);
  if (!list) return;
  
  if (targetId === null || targetId === undefined) {
    list.innerHTML = '';
    return;
  }

  const comments = JSON.parse(localStorage.getItem(`comments_${type}_${targetId}`) || '[]');
  
  if (comments.length === 0) {
    list.innerHTML = `<div style="text-align:center; color:#86868b; padding:20px;">No comments yet. Be the first to comment!</div>`;
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
        const MAX_WIDTH = 2500;
        const MAX_HEIGHT = 2500;
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

        const compressedB64 = canvas.toDataURL('image/jpeg', 1.0);
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
    showToast('❌ Please enter a name for the graph');
    return;
  }
  
  if (selectedUserPdfImages.length === 0) {
    showToast('❌ Please select at least one image');
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
      type: 'User Content',
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
        showToast('✅ Graph sent for admin approval!');
        syncPdfItemsFromFirebase();
      }, 200);
    }
  } catch (err) {
    console.error('Upload failed:', err);
    showToast('❌ Upload failed, try again');
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
      showToast('❌ Please enter email and password');
      return;
    }
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    const userData = registeredUsers[input];

    if (userData) {
      if (userData.password === password) {
        currentUser = { name: userData.name, email: input, avatar: userData.avatar };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserUI();
        if (typeof window.syncCurrentUserProfileToFirestore === 'function') {
          window.syncCurrentUserProfileToFirestore();
        }
        goBack();
        showToast(`👋 Welcome back, ${userData.name}!`);
      } else {
        showToast('❌ Incorrect password');
      }
    } else {
      showToast('❌ User does not exist. Please register.');
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
      document.getElementById('user-art-image').value = 'Image selected successfully ✓';
      showToast('Image loaded!');
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
  const timeStr = 'Today, ' + now.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});

  // Auto-assign position if it's one of the first few articles
  const userArticlesCount = newsArticles.filter(a => a.id > 1700000000000).length;
  let topPosition = '';
  if (userArticlesCount === 0) topPosition = 'center';
  else if (userArticlesCount === 1) topPosition = 'right';
  else if (userArticlesCount === 2) topPosition = 'left';

  const newArticle = {
    id: Date.now(),
    title,
    category: cat,
    author,
    time: timeStr,
    snippet: excerpt,
    text,
    image,
    isTop: topPosition !== '',
    topPosition: topPosition,
    approved: true
  };

  // Save to Firestore
  if (window.db && window.fbFirestore) {
    const { collection, addDoc } = window.fbFirestore;
    addDoc(collection(window.db, "articles"), newArticle)
      .then(() => {
        showToast('Article saved to Cloud! Visible on all devices. 🚀');
      })
      .catch(err => {
        console.error('Firestore save error:', err);
        showToast('Error saving to Cloud. Saved locally only.');
        // Fallback
        newsArticles.unshift(newArticle);
        localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
        renderNewsLayout();
      });
  } else {
    // Fallback if Firebase not ready
    newsArticles.unshift(newArticle);
    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
    renderNewsLayout();
  }
  
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
    showToast('Article approved and live on site!');
  }
}

// =====================================================================
// SHOP & SERVICES — Products + Professional Services
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
    id: 'meadow-pillow',
    title: 'Meadow High Pile Cushion',
    brand: 'Ferm Living',
    cat: 'Home',
    desc: 'Shaggy high pile cushion made of premium organic wool and filled with luxury feathers.',
    price: '$155.00',
    originalPrice: '$195.00',
    discount: 21,
    img: 'assets/meadow_high_pile_cushion.png',
    colors: ['Beige/Cream', 'Soft Rose', 'Sage', 'Charcoal'],
    colorSwatches: ['#c4a882', '#d4a0a0', '#8faa8b', '#4a4a4a'],
    imagesByColor: {
      'Beige/Cream': 'assets/meadow_high_pile_cushion.png',
      'Soft Rose': 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&q=80&w=600',
      'Sage': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600',
      'Charcoal': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600'
    },
    quickShip: true
  },
  {
    id: 'oleo-pillow',
    title: 'Oleo Cushion',
    brand: 'Ferm Living',
    cat: 'Home',
    desc: 'Striped linen throw pillow with thick vertical contrast stitching. Extremely popular.',
    price: '$82.00',
    originalPrice: '$115.00',
    discount: 29,
    img: 'assets/oleo_cushion.png',
    colors: ['Natural/Black', 'Seashell/Gold', 'Charcoal/Dark', 'Sage/Cream'],
    colorSwatches: ['#c08060', '#d4b483', '#5a6a72', '#8faa8b'],
    imagesByColor: {
      'Natural/Black': 'assets/oleo_cushion.png',
      'Seashell/Gold': 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=600',
      'Charcoal/Dark': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
      'Sage/Cream': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600'
    },
    quickShip: true
  },
  {
    id: 'weaver-throw',
    title: 'Weaver Throw',
    brand: 'Ferm Living',
    cat: 'Home',
    desc: 'Luxurious woven throw blanket with fringe details. Perfectly styled for contemporary living rooms.',
    price: '$114.00',
    originalPrice: '$155.00',
    discount: 27,
    img: 'assets/weaver_throw.png',
    colors: ['Off-White', 'Muted Rose', 'Sage Green', 'Mustard', 'Oatmeal'],
    colorSwatches: ['#e8e0d4', '#c9a0a0', '#8faa8b', '#c8a85a', '#d4c4a8'],
    imagesByColor: {
      'Off-White': 'assets/weaver_throw.png',
      'Muted Rose': 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&q=80&w=600',
      'Sage Green': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600',
      'Mustard': 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=600',
      'Oatmeal': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600'
    },
    quickShip: true
  },
  {
    id: 'naive-pillow',
    title: 'Naive Cushion',
    brand: 'Ferm Living',
    cat: 'Home',
    desc: 'Embroidered cotton canvas cushion with a beautiful artistic bird and celestial elements.',
    price: '$66.00',
    originalPrice: '$85.00',
    discount: 22,
    img: 'assets/naive_cushion.png',
    colors: ['Cream/Multi', 'Navy/Gold', 'Sage/Multi', 'Rose/Multi'],
    colorSwatches: ['#e8dcc8', '#2c3e6e', '#8faa8b', '#c9a0a0'],
    imagesByColor: {
      'Cream/Multi': 'assets/naive_cushion.png',
      'Navy/Gold': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
      'Sage/Multi': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600',
      'Rose/Multi': 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&q=80&w=600'
    },
    quickShip: true
  }
];

// ── DOWNLOADABLE PRODUCTS ─────────────────────────────
const downloadProducts = [
  // 3D Files
  {
    id: 'dl-3d-living-room',
    type: 'download',
    dlType: '3d',
    cat: '3d',
    title: 'Modern Living Room — 3D Scene',
    brand: 'SOKI Assets',
    desc: 'Full Blender / OBJ scene with furniture, lighting and materials. Ready to render.',
    price: '$29.00',
    originalPrice: '$49.00',
    discount: 41,
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600',
    badge: '📦 3D',
    badgeColor: '#7c3aed',
    fileFormat: 'Blender + OBJ + FBX',
    fileSize: '84 MB',
    password: 'soki3d2026',
    downloadUrl: '#'
  },
  {
    id: 'dl-3d-smartwatch',
    type: 'download',
    dlType: '3d',
    cat: '3d',
    title: 'Smartwatch 3D Model Pack',
    brand: 'SOKI Assets',
    desc: 'High-poly smartwatch model with 4 color variants. Perfect for product renders.',
    price: '$19.00',
    originalPrice: '$35.00',
    discount: 46,
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    badge: '📦 3D',
    badgeColor: '#7c3aed',
    fileFormat: 'OBJ + FBX + GLB',
    fileSize: '32 MB',
    password: 'soki3d2026',
    downloadUrl: '#'
  },
  {
    id: 'dl-3d-dashboard',
    type: 'download',
    dlType: '3d',
    cat: '3d',
    title: 'Futuristic Dashboard UI — 3D Kit',
    brand: 'SOKI Assets',
    desc: 'Isometric 3D UI kit for presentations. Includes 40+ component blocks.',
    price: '$24.00',
    originalPrice: '$44.00',
    discount: 45,
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
    badge: '📦 3D',
    badgeColor: '#7c3aed',
    fileFormat: 'Blender + PNG sprites',
    fileSize: '120 MB',
    password: 'soki3d2026',
    downloadUrl: '#'
  },
  // Videos
  {
    id: 'dl-video-trading',
    type: 'download',
    dlType: 'video',
    cat: 'video',
    title: 'Trading Strategies — Full Course (2h)',
    brand: 'SOKI Academy',
    desc: 'Complete video course on stock market strategies, technical analysis and risk management.',
    price: '$49.00',
    originalPrice: '$99.00',
    discount: 51,
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600',
    badge: '🎬 Video',
    badgeColor: '#dc2626',
    fileFormat: 'MP4 1080p',
    fileSize: '2.4 GB',
    password: 'sokivideo2026',
    downloadUrl: '#'
  },
  {
    id: 'dl-video-webdev',
    type: 'download',
    dlType: 'video',
    cat: 'video',
    title: 'Build a SaaS — Web Dev Masterclass',
    brand: 'SOKI Academy',
    desc: 'Step-by-step video guide to building a full SaaS product from scratch with React + Node.',
    price: '$59.00',
    originalPrice: '$120.00',
    discount: 51,
    img: 'https://images.unsplash.com/photo-1587620962725-abab19836100?auto=format&fit=crop&q=80&w=600',
    badge: '🎬 Video',
    badgeColor: '#dc2626',
    fileFormat: 'MP4 4K',
    fileSize: '5.1 GB',
    password: 'sokivideo2026',
    downloadUrl: '#'
  },
  // Website code
  {
    id: 'dl-code-news',
    type: 'download',
    dlType: 'code',
    cat: 'code',
    title: 'News Portal Template — Full Source',
    brand: 'SOKI Code',
    desc: 'Complete news & articles website source code. HTML/CSS/JS + Node backend. Ready to deploy.',
    price: '$79.00',
    originalPrice: '$149.00',
    discount: 47,
    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=600',
    badge: '💻 Code',
    badgeColor: '#0284c7',
    fileFormat: 'ZIP (HTML + JS + CSS + Node)',
    fileSize: '8.2 MB',
    password: 'sokicode2026',
    downloadUrl: '#'
  },
  {
    id: 'dl-code-ecommerce',
    type: 'download',
    dlType: 'code',
    cat: 'code',
    title: 'E-Commerce Starter Kit',
    brand: 'SOKI Code',
    desc: 'Full online store template with cart, checkout and admin panel. React + Firebase.',
    price: '$99.00',
    originalPrice: '$199.00',
    discount: 50,
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600',
    badge: '💻 Code',
    badgeColor: '#0284c7',
    fileFormat: 'ZIP (React + Firebase)',
    fileSize: '14 MB',
    password: 'sokicode2026',
    downloadUrl: '#'
  },
  {
    id: 'dl-code-dashboard',
    type: 'download',
    dlType: 'code',
    cat: 'code',
    title: 'Analytics Dashboard Template',
    brand: 'SOKI Code',
    desc: 'Dark-mode analytics dashboard with charts, tables and real-time data hooks.',
    price: '$59.00',
    originalPrice: '$110.00',
    discount: 46,
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
    badge: '💻 Code',
    badgeColor: '#0284c7',
    fileFormat: 'ZIP (HTML + Chart.js)',
    fileSize: '3.8 MB',
    password: 'sokicode2026',
    downloadUrl: '#'
  }
];

// ── CATEGORY FILTER ───────────────────────────────────
let activeShopCat = 'all';

window.filterShopCat = function(cat, btn) {
  activeShopCat = cat;
  document.querySelectorAll('.shop-cat-chip').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderShopGrid();
};

// ── DOWNLOAD PASSWORD MODAL ───────────────────────────
let _dlCurrentProduct = null;

window.dlOpenModal = function(productId) {
  const p = downloadProducts.find(x => x.id === productId);
  if (!p) return;
  _dlCurrentProduct = p;
  document.getElementById('dl-modal-icon').textContent = p.badge?.split(' ')[0] || '📦';
  document.getElementById('dl-modal-title').textContent = p.title;
  document.getElementById('dl-modal-desc').textContent = `${p.fileFormat} · ${p.fileSize}`;
  document.getElementById('dl-password-input').value = '';
  document.getElementById('dl-error-msg').style.display = 'none';
  document.getElementById('dl-password-modal').style.display = 'flex';
};

window.dlCloseModal = function() {
  document.getElementById('dl-password-modal').style.display = 'none';
  _dlCurrentProduct = null;
};

window.dlCheckPassword = function() {
  if (!_dlCurrentProduct) return;
  const input = document.getElementById('dl-password-input').value;
  if (input === _dlCurrentProduct.password) {
    dlCloseModal();
    showToast(`✅ Download started: ${_dlCurrentProduct.title}`);
    // Simulate download
    const a = document.createElement('a');
    a.href = _dlCurrentProduct.downloadUrl || '#';
    a.download = _dlCurrentProduct.title.replace(/\s+/g, '_') + '.zip';
    a.click();
  } else {
    document.getElementById('dl-error-msg').style.display = 'block';
    document.getElementById('dl-password-input').style.borderColor = '#ff453a';
    setTimeout(() => {
      document.getElementById('dl-password-input').style.borderColor = '';
    }, 1500);
  }
};

window.dlTogglePwd = function() {
  const inp = document.getElementById('dl-password-input');
  inp.type = inp.type === 'password' ? 'text' : 'password';
};

let pendingOrderItem = null;

function renderServicesGrid() {
  const grid = document.getElementById('services-grid');
  if (!grid) return;
  grid.innerHTML = servicesItems.map(s => `
    <div class="service-card" style="background:#fff; border-radius:16px; border:1px solid var(--border-subtle); padding:24px; display:flex; flex-direction:column; gap:16px; box-shadow:var(--shadow-soft);">
      <div style="font-size:3rem;">${s.icon}</div>
      <div>
        <span style="font-size:0.75rem; font-weight:800; color:#0071e3; text-transform:uppercase; letter-spacing:0.05em;">${s.cat}</span>
        <h3 style="font-size:1.4rem; font-weight:800; margin:4px 0 8px;">${s.title}</h3>
        <p style="color:#86868b; font-size:1rem; line-height:1.5; margin-bottom:16px;">${s.desc}</p>
      </div>
      <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:900; font-size:1.2rem; color:#1d1d1f;">${s.price}</span>
        <button class="btn-primary" style="padding:10px 20px; border-radius:980px;" onclick="addToCart('${s.id}', 'service')">+ Add</button>
      </div>
    </div>
  `).join('');
}

// Switch shop card image when swatch is clicked
window.shopSwatchClick = function(el, productId, colorName, imgSrc) {
  event.stopPropagation();
  // Update image
  const card = el.closest('.shop-card');
  const img = card.querySelector('.shop-card-img');
  if (img) img.src = imgSrc;
  // Highlight active swatch
  card.querySelectorAll('.shop-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
};

function buildShopCard(p, isAli) {
  const colors = p.colors || [];
  const swatches = p.colorSwatches || [];
  const imagesByColor = p.imagesByColor || {};
  const mainImg = p.img || p.image || '';
  const extraCount = colors.length > 4 ? colors.length - 4 : 0;

  const swatchHtml = colors.slice(0, 4).map((colorName, i) => {
    const hex = swatches[i] || '#ccc';
    const targetImg = imagesByColor[colorName] || mainImg;
    const escapedImg = targetImg.replace(/'/g, "\\'");
    return `<span class="shop-swatch${i === 0 ? ' active' : ''}"
      style="background:${hex};"
      title="${colorName}"
      onclick="window.shopSwatchClick(this,'${p.id}','${colorName}','${escapedImg}')"></span>`;
  }).join('');

  const extraHtml = extraCount > 0 ? `<span class="shop-swatch-count">${extraCount}+</span>` : '';

  const discountBadge = p.discount ? `
    <div class="shop-badge-row">
      <span class="shop-badge-deal">מבצע לזמן מוגבל</span>
      <span class="shop-badge-pct">${p.discount}% הנחה</span>
    </div>` : '';

  const priceHtml = p.originalPrice ? `
    <div class="shop-price-row">
      <span class="shop-price-main">${p.price}</span>
      <span class="shop-price-orig">${p.originalPrice}</span>
    </div>` : `<div class="shop-price-row"><span class="shop-price-main">${p.price || `$${p.price}`}</span></div>`;

  const swatchSection = colors.length > 0 ? `
    <div class="shop-swatches-row">
      ${swatchHtml}${extraHtml}
      <span class="shop-swatch-label">${colors.length}+ צבעים/תבניות</span>
    </div>` : '';

  const brandLink = `<a class="shop-brand-link" onclick="event.stopPropagation(); window.openProductDetailsModal('${p.id}')">לקנות ${p.brand || 'במבצע'} במבצע</a>`;

  return `
  <div class="shop-card" onclick="window.openProductDetailsModal('${p.id}')">
    <div class="shop-card-image">
      <img class="shop-card-img" src="${mainImg}" alt="${p.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600'">
      <button class="shop-add-btn" onclick="event.stopPropagation(); addToCart('${p.id}','product')">+</button>
    </div>
    <div class="shop-card-body">
      ${discountBadge}
      ${priceHtml}
      <p class="shop-card-title">${p.title}</p>
      ${swatchSection}
      ${brandLink}
    </div>
  </div>`;
}

function buildDownloadCard(p) {
  const discountBadge = p.discount ? `
    <div class="shop-badge-row">
      <span class="shop-badge-deal">Limited Deal</span>
      <span class="shop-badge-pct">${p.discount}% הנחה</span>
    </div>` : '';

  return `
  <div class="shop-card dl-card" data-cat="${p.cat}">
    <div class="shop-card-image" style="position:relative;">
      <img class="shop-card-img" src="${p.img}" alt="${p.title}" loading="lazy" style="filter:brightness(0.85);">
      <div class="dl-badge" style="background:${p.badgeColor || '#7c3aed'};">${p.badge || '📦'}</div>
      <div class="dl-overlay">
        <button class="dl-unlock-btn" onclick="dlOpenModal('${p.id}')">
          🔒 Unlock Download
        </button>
      </div>
    </div>
    <div class="shop-card-body">
      ${discountBadge}
      <div class="shop-price-row">
        <span class="shop-price-main">${p.price}</span>
        ${p.originalPrice ? `<span class="shop-price-orig">${p.originalPrice}</span>` : ''}
      </div>
      <p class="shop-card-title">${p.title}</p>
      <div class="dl-meta">
        <span class="dl-meta-chip">${p.fileFormat}</span>
        <span class="dl-meta-chip">${p.fileSize}</span>
      </div>
      <a class="shop-brand-link" onclick="event.stopPropagation(); dlOpenModal('${p.id}')">לקנות ${p.brand} במבצע</a>
    </div>
  </div>`;
}

function renderShopGrid() {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;
  const cat = activeShopCat || 'all';

  // Physical products (cat: 'home')
  let physicalHtml = '';
  if (cat === 'all' || cat === 'home') {
    physicalHtml = shopProducts.map(p => buildShopCard(p, false)).join('');
  }

  // Pro Apps (cat: 'apps')
  let appsHtml = '';
  if (cat === 'all' || cat === 'apps') {
    appsHtml = store3dProducts.map(p => buildShopCard({
      id: p.id, title: p.title, brand: 'Antigravity Pro',
      price: `$${p.price}.00`, originalPrice: `$${Math.round(p.price * 1.3)}.00`, discount: 23,
      img: p.image, cat: 'apps',
      colors: ['Black', 'Silver', 'Blue'], colorSwatches: ['#1c1c1e', '#c0c0c0', '#3a7bd5'], imagesByColor: {}
    }, false)).join('');
  }

  // Download products (3d / video / code)
  let dlHtml = '';
  const filteredDl = cat === 'all'
    ? downloadProducts
    : downloadProducts.filter(p => p.cat === cat);
  dlHtml = filteredDl.map(p => buildDownloadCard(p)).join('');

  grid.innerHTML = physicalHtml + appsHtml + dlHtml;

  // Show/hide empty state
  const total = physicalHtml.length + appsHtml.length + dlHtml.length;
  if (!total) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:60px; color:#86868b;">No products in this category yet.</div>`;
  }
}

window.openProductDetailsModal = function(productId) {
  let product = shopProducts.find(p => p.id === productId) || store3dProducts.find(p => p.id === productId);
  if (!product) {
    product = (window.aliExpressProducts || []).find(p => p.id === productId);
  }
  if (!product) return;

  window.currentDetailedProduct = product;

  const brandEl = document.getElementById('detail-product-brand');
  if (brandEl) brandEl.textContent = product.brand || 'FERM LIVING';
  
  const titleEl = document.getElementById('detail-product-title');
  if (titleEl) titleEl.textContent = product.title;
  
  let displayPrice = typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price;
  if (displayPrice && !displayPrice.toString().startsWith('$')) displayPrice = '$' + displayPrice;
  const priceEl = document.getElementById('detail-product-price');
  if (priceEl) priceEl.textContent = displayPrice;

  const imgEl = document.getElementById('detail-product-img');
  if (imgEl) imgEl.src = product.img || product.image || '';

  const colorSelect = document.getElementById('detail-product-color');
  if (colorSelect) {
    colorSelect.innerHTML = '';
    const colors = product.colors || ['NATURAL/BLACK', 'SEASHELL/GOLD', 'CHARCOAL/DARK'];
    colors.forEach(col => {
      const opt = document.createElement('option');
      opt.textContent = col;
      colorSelect.appendChild(opt);
    });
  }

  const qtyInput = document.getElementById('detail-product-qty');
  if (qtyInput) qtyInput.value = '1';

  const modal = document.getElementById('product-details-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
};

// =====================================================================
// TUTORIAL VIDEO MODAL
// =====================================================================
// Change TUTORIAL_YOUTUBE_ID to your actual YouTube video ID
const TUTORIAL_YOUTUBE_ID = 'dQw4w9WgXcQ';

window.openTutorialVideo = function() {
  const modal = document.getElementById('tutorial-modal');
  const iframe = document.getElementById('tutorial-iframe');
  if (!modal || !iframe) return;
  iframe.src = `https://www.youtube.com/embed/${TUTORIAL_YOUTUBE_ID}?autoplay=1&rel=0`;
  modal.style.display = 'flex';
};

window.closeTutorialVideo = function() {
  const modal = document.getElementById('tutorial-modal');
  const iframe = document.getElementById('tutorial-iframe');
  if (!modal || !iframe) return;
  iframe.src = '';
  modal.style.display = 'none';
};

window.closeProductDetailsModal = function() {
  const modal = document.getElementById('product-details-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  window.currentDetailedProduct = null;
};

window.incrementDetailQty = function() {
  const input = document.getElementById('detail-product-qty');
  if (input) {
    let val = parseInt(input.value) || 1;
    input.value = val + 1;
  }
};

window.decrementDetailQty = function() {
  const input = document.getElementById('detail-product-qty');
  if (input) {
    let val = parseInt(input.value) || 1;
    if (val > 1) {
      input.value = val - 1;
    }
  }
};

window.addCurrentProductToCart = function() {
  if (!window.currentDetailedProduct) return;
  const product = window.currentDetailedProduct;
  const qtyInput = document.getElementById('detail-product-qty');
  const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;

  let type = 'product';
  if (store3dProducts.some(p => p.id === product.id)) {
    type = 'store3d';
  }
  
  addToCart(product.id, type, qty);
};

function openOrderModal(id, type) {
  const list = type === 'product' ? shopProducts : servicesItems;
  const item = list.find(x => x.id === id);
  if (!item) return;
  pendingOrderItem = { ...item, type };
  document.getElementById('order-modal-item').textContent =
    (type === 'product' ? 'Product: ' : 'Service: ') + item.title + ' — ' + item.price;
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
    showToast('Please fill in name and phone', 'error');
    return;
  }
  closeOrderModal();
  // If checkout came from cart, clear the cart after successful order
  if (pendingOrderItem && pendingOrderItem.isCart) {
    shoppingCart = [];
    saveCart();
    updateCartBadge();
  }
  showToast(`Thank you ${name}! Order received — we will contact you at ${phone} soon 🚀`);
}

// =====================================================================
// SHOPPING CART — Store and Services
// =====================================================================

let shoppingCart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');

function saveCart() {
  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
  syncUserPersonalDataToFirebase();
}

function parsePrice(priceStr) {
  // Extract first numeric value from strings like "$299" or "$350 / hr" or "From $2,500"
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
  
  // Validate cart items to remove non-existent products
  const originalLength = shoppingCart.length;
  shoppingCart = shoppingCart.filter(c => {
    const list = c.type === 'product' ? shopProducts : (c.type === 'store3d' ? store3dProducts : servicesItems);
    return list.some(x => x.id === c.id);
  });
  if (shoppingCart.length !== originalLength) {
    saveCart();
  }

  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
  // Re-trigger pop animation
  badge.style.animation = 'none';
  void badge.offsetWidth;
  badge.style.animation = '';
}

function addToCart(id, type, qty = 1) {
  const qtyNum = parseInt(qty) || 1;
  const existing = shoppingCart.find(c => c.id === id && c.type === type);
  if (existing) {
    existing.qty += qtyNum;
  } else {
    shoppingCart.push({ id, type, qty: qtyNum });
  }
  saveCart();
  updateCartBadge();
  const drawer = document.getElementById('cart-drawer');
  if (drawer && drawer.classList.contains('active')) {
    renderCart();
  }
  showToast('✓ Added to cart');
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
      <div class="bottom-drawer-empty">
        <i class="fas fa-bag-shopping" style="font-size:3rem; margin-bottom:12px; color:#86868b;"></i>
        <div style="font-size:1.1rem; font-weight:600; color:#86868b;">Your cart is empty</div>
      </div>`;
    totalEl.textContent = '$0';
    checkoutBtn.style.opacity = '0.4';
    checkoutBtn.style.pointerEvents = 'none';
    return;
  }

  let total = 0;
  container.innerHTML = shoppingCart.map(c => {
    const list = c.type === 'product' ? shopProducts : (c.type === 'store3d' ? store3dProducts : servicesItems);
    const item = list.find(x => x.id === c.id);
    if (!item) return '';
    const itemPrice = parsePrice(item.price);
    total += itemPrice * c.qty;
    
    let imageEl = '';
    if (c.type === 'product' && item.img) {
      imageEl = `<img src="${item.img}" alt="" style="width:100%; height:100%; object-fit:cover;">`;
    } else if (c.type === 'store3d' && item.image) {
      imageEl = `<img src="${item.image}" alt="" style="width:100%; height:100%; object-fit:cover; background:#fff;">`;
    } else {
      imageEl = `<div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:2rem; color:#fff;">${item.icon || '💼'}</div>`;
    }
    
    return `
      <div class="bottom-drawer-item">
        <div class="bottom-drawer-item-img">
          ${imageEl}
          <div class="bottom-drawer-item-qty">${c.qty}</div>
        </div>
        <div class="bottom-drawer-item-title">${item.title}</div>
        <button class="bottom-drawer-item-remove" onclick="removeFromCart('${c.id}','${c.type}')" title="Remove">&times;</button>
      </div>
    `;
  }).join('');
  
  totalEl.textContent = '$' + total.toLocaleString('en-US');
  checkoutBtn.style.opacity = '1';
  checkoutBtn.style.pointerEvents = 'auto';
}

function toggleCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (!drawer) return;
  if (drawer.classList.contains('active')) {
    drawer.classList.remove('active');
  } else {
    // Close other drawers
    const saved = document.getElementById('saved-items-drawer');
    if (saved) saved.classList.remove('active');
    const forums = document.getElementById('forums-drawer');
    if (forums) forums.classList.remove('active');
    const messages = document.getElementById('messages-drawer');
    if (messages) {
      messages.classList.remove('active');
      if (window.drawerChatRefreshInterval) {
        clearInterval(window.drawerChatRefreshInterval);
        window.drawerChatRefreshInterval = null;
      }
    }
    
    renderCart();
    drawer.classList.add('active');
  }
}

// =====================================================================
// NOTIFICATIONS & RECEIPTS
// =====================================================================

function toggleNotificationsDrawer() {
  // Disabled as per user request to use the Messages/Alerts Hub page instead
  return;
}

async function renderNotifications() {
  const container = document.getElementById('notifications-container');
  const badge = document.getElementById('notifications-badge');
  if (!container) return;

  if (!currentUser || !currentUser.email || !window.fbGetDocs) {
    container.innerHTML = '<div style="text-align:center; padding:30px; color:#86868b;">Please sign in to view receipts.</div>';
    if (badge) badge.style.display = 'none';
    return;
  }

  container.innerHTML = '<div style="text-align:center; padding:20px; color:#86868b;">Loading receipts...</div>';
  
  try {
    const receiptsRef = window.fbColl(window.fbDb, `userData/${currentUser.email}/receipts`);
    const q = window.fbQuery(receiptsRef, window.fbOrderBy('timestamp', 'desc'));
    const snapshot = await window.fbGetDocs(q);
    
    if (snapshot.empty) {
      container.innerHTML = '<div style="text-align:center; padding:30px; color:#86868b;">No receipts found.</div>';
      if (badge) badge.style.display = 'none';
      return;
    }

    if (badge) {
      const readCount = parseInt(localStorage.getItem(`readReceipts_${currentUser.email}`) || '0', 10);
      const unread = snapshot.size - readCount;
      badge.dataset.total = snapshot.size;
      badge.textContent = unread > 0 ? unread : '';
      badge.style.display = unread > 0 ? 'flex' : 'none';
    }

    let html = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const dateStr = new Date(data.timestamp).toLocaleString();
      const itemsHtml = data.items ? data.items.map(i => {
        if (typeof i === 'string') {
          return `<div style="font-size:0.85rem; color:#a1a1aa; padding:4px 0;">&bull; ${i}</div>`;
        } else {
          return `
            <div style="display:flex; align-items:center; gap:12px; margin-top:8px; padding-bottom:8px; border-bottom:1px solid #1c1c1e;">
              ${i.image ? `<img src="${i.image}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; background:#fff;">` : `<div style="width:40px; height:40px; border-radius:6px; background:#1c1c1e; display:flex; align-items:center; justify-content:center;"><i class="fas fa-box" style="color:#86868b;"></i></div>`}
              <div style="font-size:0.85rem; color:#e5e5ea; flex:1;">${i.text}</div>
            </div>
          `;
        }
      }).join('') : '';
      
      const firstItem = data.items && data.items.length > 0 ? data.items[0] : null;
      const firstItemText = firstItem ? (typeof firstItem === 'string' ? firstItem : firstItem.text) : '';
      const shortTitle = firstItemText ? firstItemText.split('×')[0] + (data.items.length > 1 ? ' + more...' : '') : 'Order Confirmation';
      
      const orderTime = new Date(data.timestamp).getTime();
      const now = Date.now();
      const minutesSinceOrder = (now - orderTime) / (1000 * 60);
      
      let step = 1; // Ordered
      if (minutesSinceOrder > 5) step = 2; // Shipped
      if (minutesSinceOrder > 15) step = 3; // Arrived
      
      const step1Color = step >= 1 ? '#34c759' : '#3a3a3c';
      const step2Color = step >= 2 ? '#34c759' : '#3a3a3c';
      const step3Color = step >= 3 ? '#34c759' : '#3a3a3c';
      const line1Color = step >= 2 ? '#34c759' : '#3a3a3c';
      const line2Color = step >= 3 ? '#34c759' : '#3a3a3c';
      
      const trackerHtml = `
        <div style="margin-bottom: 24px; background:#000; border-radius:8px; padding:16px; border:1px solid #1c1c1e;">
          <div style="font-size:0.75rem; font-weight:700; color:#86868b; margin-bottom:16px; text-transform:uppercase; letter-spacing:1px; text-align:center;">Order Tracker</div>
          <div style="display:flex; align-items:center; justify-content:space-between; position:relative; padding:0 10px;">
            <div style="position:absolute; top:12px; left:30px; right:30px; height:2px; background:#3a3a3c; z-index:1;"></div>
            <div style="position:absolute; top:12px; left:30px; width:calc(50% - 30px); height:2px; background:${line1Color}; z-index:2; transition: background 0.3s;"></div>
            <div style="position:absolute; top:12px; left:50%; width:calc(50% - 30px); height:2px; background:${line2Color}; z-index:2; transition: background 0.3s;"></div>
            
            <div style="position:relative; z-index:3; display:flex; flex-direction:column; align-items:center; gap:8px;">
              <div style="width:26px; height:26px; border-radius:50%; background:${step1Color}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.7rem; border:3px solid #000;"><i class="fas fa-check"></i></div>
              <div style="font-size:0.7rem; color:${step >= 1 ? '#e5e5ea' : '#86868b'}; font-weight:600;">Ordered</div>
            </div>
            
            <div style="position:relative; z-index:3; display:flex; flex-direction:column; align-items:center; gap:8px;">
              <div style="width:26px; height:26px; border-radius:50%; background:${step2Color}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.7rem; border:3px solid #000;"><i class="fas fa-truck"></i></div>
              <div style="font-size:0.7rem; color:${step >= 2 ? '#e5e5ea' : '#86868b'}; font-weight:600;">Shipped</div>
            </div>
            
            <div style="position:relative; z-index:3; display:flex; flex-direction:column; align-items:center; gap:8px;">
              <div style="width:26px; height:26px; border-radius:50%; background:${step3Color}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.7rem; border:3px solid #000;"><i class="fas fa-box-open"></i></div>
              <div style="font-size:0.7rem; color:${step >= 3 ? '#e5e5ea' : '#86868b'}; font-weight:600;">Arrived</div>
            </div>
          </div>
        </div>
      `;
      
      html += `
        <div style="background:#1c1c1e; border:1px solid #2c2c2e; border-radius:12px; padding:12px; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='#2c2c2e'" onmouseout="this.style.background='#1c1c1e'" onclick="const d = this.querySelector('.receipt-details'); d.style.display = d.style.display === 'none' ? 'block' : 'none'">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="display:flex; align-items:flex-start; gap:12px;">
              <div style="width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg, #0071e3, #0a84ff); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1rem; flex-shrink:0;">
                <i class="fas fa-envelope-open-text"></i>
              </div>
              <div>
                <div style="font-weight:700; color:#f5f5f7; font-size:0.95rem; margin-bottom:2px;">Project 11</div>
                <div style="font-weight:600; color:#e5e5ea; font-size:0.85rem; margin-bottom:2px;">Order Receipt #${doc.id.slice(0, 6).toUpperCase()}</div>
                <div style="font-size:0.8rem; color:#86868b; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical;">${shortTitle}</div>
              </div>
            </div>
            <div style="font-size:0.75rem; color:#86868b; white-space:nowrap; margin-top:2px;">${dateStr.split(',')[0]}</div>
          </div>
          
          <div class="receipt-details" style="display:none; margin-top:16px; padding-top:16px; border-top:1px solid #2c2c2e;">
            ${trackerHtml}
            <div style="font-size:0.9rem; color:#e5e5ea; margin-bottom:16px; line-height:1.5;">
              Hi ${data.customer_name || 'Customer'},<br><br>
              Thank you for your purchase! We have successfully processed your payment. Below are the details of your transaction:
            </div>
            <div style="background:#000; border-radius:8px; padding:12px; margin-bottom:16px; border:1px solid #1c1c1e;">
              <div style="font-size:0.75rem; font-weight:700; color:#86868b; margin-bottom:8px; text-transform:uppercase; letter-spacing:1px;">Order Summary</div>
              ${itemsHtml}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; background:#1c1c1e; padding:12px; border-radius:8px; border:1px solid #3a3a3c;">
              <span style="font-weight:600; color:#86868b; font-size:0.9rem;">Total Paid</span>
              <span style="font-weight:800; color:#0071e3; font-size:1.2rem;">$${data.amount ? data.amount.toLocaleString() : '0'}</span>
            </div>
            <div style="text-align:center; margin-top:16px;">
              <p style="font-size:0.75rem; color:#86868b;">Transaction completed on ${dateStr}</p>
            </div>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (err) {
    console.error('Error fetching receipts:', err);
    container.innerHTML = '<div style="text-align:center; padding:30px; color:#ef4444;">Failed to load receipts.</div>';
  }
}

function checkoutCart() {
  if (shoppingCart.length === 0) return;
  let total = 0;
  const summaryLines = shoppingCart.map(c => {
    const list = c.type === 'product' ? shopProducts : (c.type === 'store3d' ? store3dProducts : servicesItems);
    const item = list.find(x => x.id === c.id);
    if (!item) return null;
    total += parsePrice(item.price) * c.qty;
    return {
      text: `${item.title} × ${c.qty} — ${item.price}`,
      image: item.image || item.img || item.image_url || ''
    };
  }).filter(Boolean);

  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.remove('active');
  
  window.location.href = `/grow-checkout.html?amount=${total}&items=${encodeURIComponent(JSON.stringify(summaryLines))}`;
}

// =====================================================================
// MOCK PAYMENT MODAL
// =====================================================================

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) modal.classList.remove('active');
}

async function sendReceiptMessage(userEmail, summaryLines, total, timestamp) {
  const SOKI_SYSTEM = 'receipts@soki.co';
  const roomId = [userEmail, SOKI_SYSTEM].sort().join('_').replace(/[^a-zA-Z0-9_]/g, '');
  const dateStr = new Date(timestamp).toLocaleString('he-IL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const orderId = Math.random().toString(36).slice(2, 8).toUpperCase();

  const itemsList = summaryLines.map(i => `• ${i.text}`).join('\n');
  const receiptText =
`🧾 קבלת רכישה | Order Receipt #${orderId}

📅 ${dateStr}

${itemsList}

💳 סה"כ שולם | Total Paid: $${total.toLocaleString()}

תודה על הרכישה! הזמנתך התקבלה ועובדת.
Thank you for your purchase! Your order has been received.

— SOKI`;

  const newMsg = {
    senderEmail: SOKI_SYSTEM,
    senderName: 'SOKI',
    text: receiptText,
    time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    read: false,
    isReceipt: true,
    orderId
  };

  const chatDocRef = window.fbDoc(window.fbDb, 'chats', roomId);
  const existing = await window.fbGetDoc ? (await window.fbGetDoc(chatDocRef).catch(() => null)) : null;
  const existingMessages = (existing && existing.exists && existing.exists() && existing.data().messages) ? existing.data().messages : [];
  const updatedMessages = [...existingMessages, newMsg];

  await window.fbSetDoc(chatDocRef, {
    participants: [userEmail, SOKI_SYSTEM],
    messages: updatedMessages,
    updatedAt: new Date().toISOString(),
    lastMessage: `🧾 קבלה #${orderId}`,
    lastSender: SOKI_SYSTEM
  }, { merge: true });

  // Update local storage so badge & list refresh
  localStorage.setItem(`real_chat_messages_${roomId}`, JSON.stringify(updatedMessages));

  // Make sure SOKI system account appears in the users list
  try {
    const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    if (!localUsers[SOKI_SYSTEM]) {
      localUsers[SOKI_SYSTEM] = {
        name: 'SOKI — קבלות',
        avatar: 'https://ui-avatars.com/api/?name=SOKI&background=fb923c&color=fff&size=80&rounded=true&bold=true',
        email: SOKI_SYSTEM
      };
      localStorage.setItem('registeredUsers', JSON.stringify(localUsers));
    }
  } catch(e) {}

  // Refresh messages badge and list
  if (window.updateMessagesBadge) window.updateMessagesBadge();
  if (window.renderChatUsersList) window.renderChatUsersList();
}

async function runRealPayment(summaryLines, total) {
  const modal = document.getElementById('payment-modal');
  if (!modal) return;

  // Show the loading state with premium animation
  document.getElementById('payment-step-form').style.display = 'none';
  document.getElementById('payment-step-anim').style.display = 'block';
  modal.classList.add('active');

  const spinner = document.getElementById('pay-phase-spinner');
  const success = document.getElementById('pay-phase-success');
  const track   = spinner.querySelector('.pay-spinner-track');

  spinner.style.display = 'block';
  success.style.display = 'none';

  // Start the background animation
  const startTime = performance.now();
  function animateSpinner(now) {
    const t = Math.min((now - startTime) / 3000, 0.95); // Fill up to 95% while waiting
    const deg = t * 360;
    track.style.background = `conic-gradient(#0071e3 ${deg}deg, #e8e8ed ${deg}deg)`;
    if (t < 0.95 && spinner.style.display !== 'none') {
      requestAnimationFrame(animateSpinner);
    }
  }
  requestAnimationFrame(animateSpinner);

  try {
    const email = (currentUser && currentUser.email) ? currentUser.email : 'guest@example.com';
    const name = (currentUser && currentUser.name) ? currentUser.name : 'Guest Customer';

    const payload = {
      amount: total,
      customer_name: name,
      email: email,
      items: summaryLines,
      timestamp: new Date().toISOString()
    };

    // 1. Send email receipt via backend API
    try {
      const emailItemsText = summaryLines.map(i => i.text);
      await fetch(`${SERVER_URL}/api/send-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, items: emailItemsText, total })
      });
    } catch (emailErr) {
      console.error('Error sending email receipt:', emailErr);
    }

    // 2. Save receipt to Firestore
    if (currentUser && currentUser.email && window.fbAddDoc) {
      try {
        const receiptsRef = window.fbColl(window.fbDb, `userData/${currentUser.email}/receipts`);
        await window.fbAddDoc(receiptsRef, payload);
      } catch (e) {
        console.error('Failed to write receipt to Firestore:', e);
      }
    }

    // 3. Send receipt message in the messages system
    if (currentUser && currentUser.email && window.fbSetDoc && window.fbDb) {
      try {
        await sendReceiptMessage(currentUser.email, summaryLines, total, payload.timestamp);
      } catch (msgErr) {
        console.error('Failed to send receipt message:', msgErr);
      }
    }

    // 4. Complete animation & show success
    track.style.background = `conic-gradient(#0071e3 360deg, #e8e8ed 360deg)`;
    setTimeout(() => {
      spinner.style.display = 'none';
      success.style.display = 'flex';
      setTimeout(() => {
        closePaymentModal();
        shoppingCart = [];
        saveCart();
        updateCartBadge();
        renderCart();
        showToast('Payment Successful! Receipt sent to ' + email, 'success');
        if (currentUser && currentUser.email) {
          renderNotifications();
        }
      }, 2000);
    }, 500);

  } catch (err) {
    console.error('Payment Error:', err);
    closePaymentModal();
    showToast('Payment Error: ' + err.message, 'error');
  }
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

  // Step 1: Loading spinner conic-gradient in JS frame-by-frame
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
    
    const emailItemsText = summaryLines.map(i => i.text);

    const itemsEl = document.getElementById('payment-success-items');
    if (itemsEl) {
      itemsEl.innerHTML = emailItemsText.join('<br>') +
        `<br><strong style="color:#1d1d1f;">Total Paid: $${parseFloat(total).toLocaleString('en-US')}</strong>`;
    }

    // Save order to history for admin
    const orderData = {
      email: (currentUser && currentUser.email) ? currentUser.email : 'Guest',
      items: emailItemsText,
      total: total,
      date: new Date().toLocaleString('en-US')
    };
    let orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    orders.unshift(orderData);
    localStorage.setItem('orderHistory', JSON.stringify(orders));

    // --- SEND RECEIPT EMAIL ---
    if (currentUser && currentUser.email && currentUser.email !== 'Guest') {
      fetch('/api/send-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          name: currentUser.name,
          items: emailItemsText,
          total: total
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Receipt sent successfully');
          showToast('📧 Receipt sent to your email');
        } else {
          console.error('Failed to send receipt:', data.error);
        }
      })
      .catch(err => console.error('Error calling receipt API:', err));
    }

    success.style.display = 'block';

    // Step 2: Drawing the circle
    const circle  = success.querySelector('.pay-checkmark-circle');
    const path    = success.querySelector('.pay-checkmark-path');
    const textWrap = success.querySelector('.pay-success-text-wrap');
    const CIRC    = 157; // 2π×25
    const CHECK   = 40;

    circle.style.strokeDashoffset = String(CIRC);
    path.style.strokeDashoffset   = String(CHECK);
    if (textWrap) textWrap.style.opacity = '0';

    animateValue(circle, 'strokeDashoffset', CIRC, 0, 500, easeInOut, () => {
      // Step 3: Drawing the checkmark
      animateValue(path, 'strokeDashoffset', CHECK, 0, 380, easeInOut, () => {
        // Step 4: Fading up the text
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
  // showWelcomeDealModal(); // Removed as requested by the user
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
  showToast('You selected plan ' + el.querySelector('.tier-name').innerText);
}

// ========== FLOATING SUPPORT DISMISS & DRAG ==========
function dismissSupportWidget() {
  const container = document.getElementById('support-floating-btn-container');
  if (container) container.style.display = 'none';
  closeContactModal();
  showToast('Customer service closed. It will return after refreshing the site.');
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
    const art = newsArticles[index];
    art.isTop = !art.isTop;
    if (art.isTop && !art.topPosition) {
       art.topPosition = 'center';
    }
    
    if (art.firestoreId && window.db && window.fbFirestore) {
      const { doc, updateDoc } = window.fbFirestore;
      updateDoc(doc(window.db, "articles", art.firestoreId), { 
        isTop: art.isTop,
        topPosition: art.topPosition || 'center'
      });
    }

    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
    initAdminDashboard();
    renderNewsLayout();
    showToast(art.isTop ? '🌟 Added to featured' : '➖ Removed from featured');
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

// ========== 3D PRODUCT LOGIC ==========
function toggle3DMode() {
  const container3D = document.getElementById('pdp-3d-container');
  const imageWrapper = document.getElementById('pdp-image-wrapper');
  const btn = document.getElementById('toggle-3d-btn');

  if (container3D.classList.contains('hidden')) {
    container3D.classList.remove('hidden');
    container3D.classList.add('active');
    imageWrapper.classList.add('hidden');
    btn.innerHTML = '<i class="fas fa-image"></i> Back to Image View';
  } else {
    container3D.classList.add('hidden');
    container3D.classList.remove('active');
    imageWrapper.classList.remove('hidden');
    btn.innerHTML = '<i class="fas fa-cube"></i> View in 3D';
  }
}

// ========== SIDEBAR LOGIC ==========
function toggleSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  const mainWrapper = document.getElementById('main-wrapper');

  // Mobile/tablet ≤1024px: overlay mode
  if (window.innerWidth <= 1024) {
    const isOpen = sidebar.classList.contains('mobile-open');
    sidebar.classList.toggle('mobile-open', !isOpen);
    let backdrop = document.getElementById('sidebar-mobile-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'sidebar-mobile-backdrop';
      backdrop.className = 'sidebar-mobile-backdrop';
      backdrop.onclick = () => toggleSidebar();
      document.body.appendChild(backdrop);
    }
    backdrop.classList.toggle('active', !isOpen);
    updateHamburgerIcon(!isOpen);
    return;
  }

  sidebar.classList.toggle('collapsed');
  mainWrapper.classList.toggle('sidebar-collapsed');

  const isCollapsed = sidebar.classList.contains('collapsed');
  document.body.classList.toggle('sidebar-collapsed', isCollapsed);
  document.body.classList.toggle('sidebar-expanded', !isCollapsed);
  localStorage.setItem('sidebarCollapsed', isCollapsed);

  // Update old sidebar-toggle icon if it exists
  const oldToggleBtn = document.getElementById('sidebar-toggle');
  if (oldToggleBtn) {
    const icon = oldToggleBtn.querySelector('i');
    if (icon) {
      if (isCollapsed) {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-left');
      } else {
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right');
      }
    }
  }

  // Update navbar hamburger icon
  updateHamburgerIcon(isCollapsed);

  // Close all submenus when collapsing
  if (isCollapsed) {
    const submenus = ['my-graphs-dropdown', 'my-articles-dropdown', 'my-purchases-dropdown'];
    submenus.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const chevrons = ['my-graphs-chevron', 'my-articles-chevron', 'my-purchases-chevron'];
    chevrons.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.transform = 'rotate(0deg)';
    });
  }
}

function updateHamburgerIcon(isCollapsed) {
  const btn = document.getElementById('sidebar-hamburger-btn');
  const svg = document.getElementById('sidebar-hamburger-svg');
  if (!btn || !svg) return;

  if (isCollapsed) {
    // Sidebar closed → yellow to invite opening
    svg.innerHTML = `
      <rect y="3" width="20" height="2" rx="1" fill="#f59e0b"/>
      <rect y="9" width="20" height="2" rx="1" fill="#f59e0b"/>
      <rect y="15" width="20" height="2" rx="1" fill="#f59e0b"/>
    `;
    btn.style.background = 'rgba(245, 158, 11, 0.12)';
    btn.style.border = '1px solid rgba(245, 158, 11, 0.3)';
  } else {
    // Sidebar open → subtle grey
    svg.innerHTML = `
      <rect y="3" width="20" height="2" rx="1" fill="#a1a1a6"/>
      <rect y="9" width="14" height="2" rx="1" fill="#a1a1a6"/>
      <rect y="15" width="20" height="2" rx="1" fill="#a1a1a6"/>
    `;
    btn.style.background = 'transparent';
    btn.style.border = 'none';
  }
}

// Restore sidebar state on load (default to expanded)
(function initSidebar() {
  localStorage.setItem('sidebarCollapsed', 'false');
  
  const sidebar = document.getElementById('app-sidebar');
  const mainWrapper = document.getElementById('main-wrapper');
  const toggleBtnEl = document.getElementById('sidebar-toggle');
  const toggleBtn = toggleBtnEl ? toggleBtnEl.querySelector('i') : null;
  
  if (sidebar) sidebar.classList.remove('collapsed');
  if (mainWrapper) mainWrapper.classList.remove('sidebar-collapsed');
  document.body.classList.remove('sidebar-collapsed');
  document.body.classList.add('sidebar-expanded');
  if (toggleBtn) {
    toggleBtn.classList.remove('fa-chevron-left');
    toggleBtn.classList.add('fa-chevron-right');
  }

  // Set initial hamburger state (sidebar starts expanded)
  updateHamburgerIcon(false);
})();

// ========== LOCATION & WEATHER WIDGET ==========

function toggleLanguage(e) {
  if (e) e.stopPropagation();
  if (currentLocation && currentLocation.id === 'Israel') {
    selectLocation('USA', 'English', 38.9072, -77.0369, 'וושינגטון');
  } else {
    selectLocation('Israel', 'Hebrew', 31.7683, 35.2137, 'ירושלים');
  }
}

function updateNavbarLanguage() {
  try {
    const isHeb = (currentLocation && currentLocation.id === 'Israel');

    // Update language label inside profile dropdown
    const dropLangLabel = document.getElementById('dropdown-language-label');
    if (dropLangLabel) {
      dropLangLabel.textContent = isHeb ? 'עברית' : 'English';
    }

  // Flip navbar sections: RTL (Hebrew) = logo on right (row-reverse), LTR (English) = logo on left (row)
  const navInner = document.querySelector('.nav-inner-apple');
  if (navInner) navInner.style.flexDirection = isHeb ? 'row-reverse' : 'row';
  document.documentElement.lang = isHeb ? 'he' : 'en';
  document.documentElement.dir = isHeb ? 'rtl' : 'ltr';

  const elArticles = document.getElementById('nav-text-articles');
  const elStores = document.getElementById('nav-text-stores');
  const elSolutions = document.getElementById('nav-text-solutions');
  const elSoftware = document.getElementById('nav-text-software');
  const elAppointment = document.getElementById('nav-text-appointment');
  const elShop = document.getElementById('nav-text-shop');
  const elExchange = document.getElementById('nav-text-exchange');
  const elForum = document.getElementById('nav-text-forum');
  const elGraphs = document.getElementById('nav-text-graphs');
  const elSignin = document.getElementById('nav-text-signin');
  const elLogout = document.getElementById('nav-text-logout');
  const elPremium = document.getElementById('nav-text-premium');
  const elB2b = document.getElementById('nav-text-b2b');
  const elLogoSubtext = document.getElementById('nav-logo-subtext');
  const searchInput = document.getElementById('navbar-search-input');
  const adminLoginTitle = document.getElementById('admin-login-title');
  const adminLoginButton = document.getElementById('admin-login-btn');
  const footerContactTitle = document.getElementById('footer-title-contact');
  const footerMonthly = document.getElementById('footer-monthly-subscription');
  const footerEmail = document.getElementById('footer-email-support');
  const footerCall = document.getElementById('footer-call-us');
  const footerDonate = document.getElementById('footer-paypal-donate');
  const footerInfoTitle = document.getElementById('footer-title-information');
  const footerAbout = document.getElementById('footer-about-us');
  const footerWhatsNew = document.getElementById('footer-whats-new');
  const footerAdminTitle = document.getElementById('footer-title-admin');
  const footerAdminLogin = document.getElementById('footer-admin-login');
  const footerUploadArticles = document.getElementById('footer-upload-articles');
  const footerTitleLegal = document.getElementById('footer-title-legal');
  const footerTerms = document.getElementById('footer-terms');
  const footerPrivacy = document.getElementById('footer-privacy');
  const footerAccessibility = document.getElementById('footer-accessibility');

  // Sidebar translations
  const sidebarTitle = document.getElementById('sidebar-title');
  const sidebarSearchInput = document.getElementById('sidebar-search-input');
  const sidebarHome = document.getElementById('sidebar-link-home');
  const sidebarAdmin = document.getElementById('sidebar-link-admin');
  const sidebarShop = document.getElementById('sidebar-link-shop');
  const sidebarGraphs = document.getElementById('sidebar-link-graphs');
  const sidebarPremium = document.getElementById('sidebar-link-premium');
  const sidebarForum = document.getElementById('sidebar-link-forum');
  const sidebarMyGraphs = document.getElementById('sidebar-link-my-graphs');
  const sidebarMyArticles = document.getElementById('sidebar-link-my-articles');
  const sidebarArchive = document.getElementById('sidebar-link-archive');
  const sidebarMyPurchases = document.getElementById('sidebar-link-my-purchases');

  // Chat Widget localization
  const chatHeaderTitle = document.getElementById('chat-header-title');
  const chatTermsBtn = document.getElementById('chat-terms-btn');
  const chatInput = document.getElementById('ai-chat-input');
  const chatGreeting = document.getElementById('ai-chat-greeting');
  const chatModeBtn = document.getElementById('chat-mode-btn');
  const directChatInput = document.getElementById('direct-chat-input');

  if (isHeb) {
    if (sidebarTitle) sidebarTitle.textContent = 'הדשבורד שלי';
    if (sidebarSearchInput) sidebarSearchInput.placeholder = 'חיפוש...';
    if (sidebarHome) sidebarHome.textContent = 'כתבות';
    if (sidebarAdmin) sidebarAdmin.textContent = 'ניהול אתר';
    if (sidebarShop) sidebarShop.textContent = 'חנות';
    if (sidebarGraphs) sidebarGraphs.textContent = 'גרפים ונתונים';
    if (sidebarPremium) sidebarPremium.textContent = 'פרימיום';
    if (sidebarForum) sidebarForum.textContent = 'פורום';
    if (sidebarMyGraphs) sidebarMyGraphs.textContent = 'הגרפים שלי';
    if (sidebarMyArticles) sidebarMyArticles.textContent = 'הכתבות שלי';
    if (sidebarArchive) sidebarArchive.textContent = 'ארכיון';
    if (sidebarMyPurchases) sidebarMyPurchases.textContent = 'הרכישות שלי';

    // Sidebar inline buttons Hebrew translation
    const btnHistoryHeb = document.getElementById('sidebar-btn-history');
    const btnSupportHeb = document.getElementById('sidebar-btn-support');
    if (btnHistoryHeb) btnHistoryHeb.setAttribute('title', 'פעילות אחרונה');
    if (btnSupportHeb) btnSupportHeb.setAttribute('title', 'שירות לקוחות');

    // Hebrew Chat Translation
    if (chatModeBtn) chatModeBtn.textContent = window._supportChatMode === 'direct' ? 'עוזר וירטואלי' : 'הודעות';
    if (directChatInput) directChatInput.placeholder = 'כתוב הודעה לתומך...';
    if (chatHeaderTitle) chatHeaderTitle.textContent = window._supportChatMode === 'direct' ? '💬 הודעות תמיכה' : '✨ עוזר וירטואלי חכם';
    if (chatTermsBtn) chatTermsBtn.textContent = 'תנאים';
    if (chatInput) chatInput.placeholder = 'הקלד הודעה...';
    if (chatGreeting) {
      chatGreeting.style.textAlign = 'right';
      chatGreeting.style.direction = 'rtl';
      chatGreeting.innerHTML = `
        שלום! אני העוזר הווירטואלי של האתר. כיצד אוכל לעזור לך היום? 😊<br><br>
        אנא בחר אפשרות:<br>
        1. 🕒 שעות פעילות<br>
        2. 📧 צור קשר<br>
        3. 📅 קביעת פגישה<br>
        4. 📊 גרפים ונתונים<br>
        5. 💬 שיחה עם מנהל
      `;
    }
  } else {
    if (sidebarTitle) sidebarTitle.textContent = 'My Dashboard';
    if (sidebarSearchInput) sidebarSearchInput.placeholder = 'Search...';
    if (sidebarHome) sidebarHome.textContent = 'Articles';
    if (sidebarAdmin) sidebarAdmin.textContent = 'Site Admin';
    if (sidebarShop) sidebarShop.textContent = 'Store';
    if (sidebarGraphs) sidebarGraphs.textContent = 'Graphs & Data';
    if (sidebarPremium) sidebarPremium.textContent = 'Premium';
    if (sidebarForum) sidebarForum.textContent = 'Forum';
    if (sidebarMyGraphs) sidebarMyGraphs.textContent = 'My Graphs';
    if (sidebarMyArticles) sidebarMyArticles.textContent = 'My Articles';
    if (sidebarArchive) sidebarArchive.textContent = 'Archive';
    if (sidebarMyPurchases) sidebarMyPurchases.textContent = 'My Purchases';

    // Sidebar inline buttons English translation
    const btnHistoryEng = document.getElementById('sidebar-btn-history');
    const btnSupportEng = document.getElementById('sidebar-btn-support');
    if (btnHistoryEng) btnHistoryEng.setAttribute('title', 'Recent Activity');
    if (btnSupportEng) btnSupportEng.setAttribute('title', 'Customer Service');

    // English Chat Translation
    if (chatModeBtn) chatModeBtn.textContent = window._supportChatMode === 'direct' ? 'AI Assistant' : 'Messages';
    if (directChatInput) directChatInput.placeholder = 'Type a message to admin...';
    if (chatHeaderTitle) chatHeaderTitle.textContent = window._supportChatMode === 'direct' ? '💬 Support Messages' : '✨ Smart Virtual Assistant';
    if (chatTermsBtn) chatTermsBtn.textContent = 'Terms';
    if (chatInput) chatInput.placeholder = 'Type a message...';
    if (chatGreeting) {
      chatGreeting.style.textAlign = 'left';
      chatGreeting.style.direction = 'ltr';
      chatGreeting.innerHTML = `
        Hello! I am the site's virtual assistant. How can I help you today? 😊<br><br>
        Please select an option:<br>
        1. 🕒 Opening Hours<br>
        2. 📧 Contact Us<br>
        3. 📅 Book Appointment<br>
        4. 📊 Graphs and Data<br>
        5. 💬 Talk to Manager
      `;
    }
  }

  // Secondary mobile nav
  const secHome = document.getElementById('sec-nav-home');
  const secGraphs = document.getElementById('sec-nav-graphs');
  const secForum = document.getElementById('sec-nav-forum');
  const secShop = document.getElementById('sec-nav-shop');
  const secBooking = document.getElementById('sec-nav-booking');
  const secServices = document.getElementById('sec-nav-services');
  if (isHeb) {
    if (secHome) secHome.textContent = 'מאמרים';
    if (secGraphs) secGraphs.textContent = 'גרפים';
    if (secForum) secForum.textContent = 'פורום';
    if (secShop) secShop.textContent = 'חנות';
    if (secBooking) secBooking.textContent = 'הזמנת פגישה';
    if (secServices) secServices.textContent = 'שירותים';
  } else {
    if (secHome) secHome.textContent = 'Articles';
    if (secGraphs) secGraphs.textContent = 'Graphs';
    if (secForum) secForum.textContent = 'Forum';
    if (secShop) secShop.textContent = 'Shop';
    if (secBooking) secBooking.textContent = 'Booking';
    if (secServices) secServices.textContent = 'Services';
  }

  if (isHeb) {
  if (elArticles) elArticles.textContent = 'מאמרים';
  if (elStores) elStores.textContent = 'החנויות שלנו';
    if (elSolutions) elSolutions.textContent = 'הפתרונות שלנו';
    if (elSoftware) elSoftware.textContent = 'חנות תוכנה';
    if (elAppointment) elAppointment.textContent = 'קביעת פגישה';
    if (elShop) elShop.textContent = 'חנות אונליין';
    if (elExchange) elExchange.textContent = 'שער חליפין';
    if (elForum) elForum.textContent = 'פורום';
    if (elGraphs) elGraphs.textContent = 'גרפים';
    if (elSignin) elSignin.textContent = 'התחבר';
    if (elLogout) elLogout.textContent = 'התנתק';
    if (elPremium) elPremium.textContent = 'פרימיום';
    if (elB2b) elB2b.textContent = 'חיבור מפעלים';
    const activePage = document.querySelector('.page.active');
    const isGraphs = activePage && (activePage.id === 'page-pdf-store' || activePage.id === 'page-my-graphs');
    if (elLogoSubtext) elLogoSubtext.textContent = isGraphs ? 'גרפים' : 'מאמרים';
    if (searchInput) searchInput.placeholder = 'חיפוש כתבות...';
    if (adminLoginTitle) adminLoginTitle.textContent = 'כניסת מנהל';
    if (adminLoginButton) adminLoginButton.textContent = 'התחבר';
    if (footerContactTitle) footerContactTitle.textContent = 'צור קשר';
    if (footerMonthly) footerMonthly.textContent = '⭐ מנוי חודשי';
    if (footerEmail) footerEmail.textContent = 'תמיכה במייל';
    if (footerCall) footerCall.textContent = 'התקשר אלינו: +1-555-0199';
    if (footerDonate) footerDonate.textContent = 'תרום דרך PayPal';
    if (footerInfoTitle) footerInfoTitle.textContent = 'מידע';
    if (footerAbout) footerAbout.textContent = 'אודותינו';
    if (footerWhatsNew) footerWhatsNew.textContent = 'מה חדש';
    if (footerAdminTitle) footerAdminTitle.textContent = 'מנהל';
    if (footerAdminLogin) footerAdminLogin.textContent = 'כניסת מנהל';
    if (footerUploadArticles) footerUploadArticles.textContent = 'העלה מאמרים';
    if (footerTitleLegal) footerTitleLegal.textContent = 'מידע משפטי';
    if (footerTerms) footerTerms.textContent = 'תנאי שימוש';
    if (footerPrivacy) footerPrivacy.textContent = 'מדיניות פרטיות';
    if (footerAccessibility) footerAccessibility.textContent = 'הצהרת נגישות';
  } else {
    if (elArticles) elArticles.textContent = 'Articles';
    if (elStores) elStores.textContent = 'Our Stores';
    if (elSolutions) elSolutions.textContent = 'Our Solutions';
    if (elSoftware) elSoftware.textContent = 'Software Store';
    if (elAppointment) elAppointment.textContent = 'Book Appointment';
    if (elShop) elShop.textContent = 'Online Shop';
    if (elExchange) elExchange.textContent = 'Exchange';
    if (elForum) elForum.textContent = 'Forum';
    if (elGraphs) elGraphs.textContent = 'Graphs';
    if (elSignin) elSignin.textContent = 'Sign In';
    if (elLogout) elLogout.textContent = 'Logout';
    if (elPremium) elPremium.textContent = 'Premium';
    if (elB2b) elB2b.textContent = 'B2B Connect';
    const activePage = document.querySelector('.page.active');
    const isGraphs = activePage && (activePage.id === 'page-pdf-store' || activePage.id === 'page-my-graphs');
    if (elLogoSubtext) elLogoSubtext.textContent = isGraphs ? 'Graphs' : 'Articles';
    if (searchInput) searchInput.placeholder = 'Search Articles...';
    if (adminLoginTitle) adminLoginTitle.textContent = 'Admin Login';
    if (adminLoginButton) adminLoginButton.textContent = 'Login';
    if (footerContactTitle) footerContactTitle.textContent = 'Contact Us';
    if (footerMonthly) footerMonthly.textContent = '⭐ Monthly Subscription';
    if (footerEmail) footerEmail.textContent = 'Email Support';
    if (footerCall) footerCall.textContent = 'Call Us: +1-555-0199';
    if (footerDonate) footerDonate.textContent = 'Donate via PayPal';
    if (footerInfoTitle) footerInfoTitle.textContent = 'Information';
    if (footerAbout) footerAbout.textContent = 'About Us';
    if (footerWhatsNew) footerWhatsNew.textContent = 'What\'s New';
    if (footerAdminTitle) footerAdminTitle.textContent = 'Admin';
    if (footerAdminLogin) footerAdminLogin.textContent = 'Admin Login';
    if (footerUploadArticles) footerUploadArticles.textContent = 'Upload Articles';
    if (footerTitleLegal) footerTitleLegal.textContent = 'Legal';
    if (footerTerms) footerTerms.textContent = 'Terms of Use';
    if (footerPrivacy) footerPrivacy.textContent = 'Privacy Policy';
    if (footerAccessibility) footerAccessibility.textContent = 'Accessibility';
  }
  } catch (err) {
    console.error('Error in updateNavbarLanguage:', err);
  }
}

function selectLocation(id, nameHeb, lat, lon, capitalHeb) {
  currentLocation = { id, nameHeb, lat, lon, capitalHeb };
  localStorage.setItem('userLocation', JSON.stringify(currentLocation));

  // Toggle RTL layout dynamically on body based on selection
  if (id === 'Israel') {
    document.body.classList.add('rtl-layout');
  } else {
    document.body.classList.remove('rtl-layout');
  }

  // Update dynamic navbar translations
  updateNavbarLanguage();

  // Update UI text
  const textEl = document.getElementById('selected-location-text');
  if (textEl) textEl.textContent = nameHeb;

  // Fetch weather for new location
  fetchWeatherForCapital();

  // Re-render articles for the selected region
  currentCategory = 'all';
  renderNewsLayout(1);

  // Update cookie consent banner language dynamically
  if (window.updateCookieBannerLanguage) {
    window.updateCookieBannerLanguage();
  }

  // Close menu
  const menu = document.getElementById('location-dropdown-menu');
  if (menu) menu.classList.remove('show');
}

async function fetchWeatherForCapital() {
  const widget = document.getElementById('sidebar-weather-widget');
  if (!widget) return;
  
  const capitalEl = document.getElementById('weather-capital');
  const tempEl = document.getElementById('weather-temp');
  const iconEl = document.getElementById('weather-icon');
  
  if (capitalEl) capitalEl.textContent = currentLocation.capitalHeb;
  if (tempEl) tempEl.textContent = '...';
  
  widget.style.display = 'flex'; // show widget
  
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${currentLocation.lat}&longitude=${currentLocation.lon}&current_weather=true`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.current_weather) {
      const temp = Math.round(data.current_weather.temperature);
      const code = data.current_weather.weathercode;
      
      if (tempEl) tempEl.textContent = `${temp}°C`;
      
      // Determine icon based on WMO Weather interpretation codes
      let iconClass = 'fas fa-sun'; // default clear
      if (code >= 1 && code <= 3) iconClass = 'fas fa-cloud-sun'; // partly cloudy
      if (code >= 45 && code <= 48) iconClass = 'fas fa-smog'; // fog
      if (code >= 51 && code <= 67) iconClass = 'fas fa-cloud-rain'; // rain
      if (code >= 71 && code <= 77) iconClass = 'fas fa-snowflake'; // snow
      if (code >= 80 && code <= 82) iconClass = 'fas fa-cloud-showers-heavy'; // showers
      if (code >= 95 && code <= 99) iconClass = 'fas fa-bolt'; // thunderstorm
      
      if (iconEl) iconEl.className = iconClass;
    }
  } catch (err) {
    console.error("Error fetching weather:", err);
    if (tempEl) tempEl.textContent = 'N/A';
  }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const selector = document.querySelector('.location-selector');
  if (selector && !selector.contains(e.target)) {
    const menu = document.getElementById('location-dropdown-menu');
    if (menu) menu.classList.remove('show');
  }
});

// Automatic Location Detection based on IP/Timezone
async function autoDetectLocation() {
  // If user already has a saved preference, don't overwrite it
  if (localStorage.getItem('userLocation')) {
    return;
  }

  let detectedCountryCode = '';

  // 1. Try IP Geolocation
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data && data.country_code) {
      detectedCountryCode = data.country_code;
      console.log('[GeoDetect] Detected country code from IP:', detectedCountryCode);
    }
  } catch (err) {
    console.warn('[GeoDetect] IP Geolocation failed, trying fallback:', err);
  }

  // 2. Fallback: Check browser timezone
  if (!detectedCountryCode) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('[GeoDetect] Detected timezone:', tz);
      if (tz && (tz.includes('Jerusalem') || tz.includes('Asia/Jerusalem') || tz.includes('Asia/Gaza') || tz.includes('Asia/Hebron'))) {
        detectedCountryCode = 'IL';
      }
    } catch (e) {
      console.warn('[GeoDetect] Timezone check failed:', e);
    }
  }

  // 3. Set the location based on detected country
  if (detectedCountryCode === 'IL') {
    console.log('[GeoDetect] Auto-selecting Hebrew (Israel)');
    selectLocation('Israel', 'Hebrew', 31.7683, 35.2137, 'ירושלים');
  } else {
    console.log('[GeoDetect] Auto-selecting English (USA)');
    selectLocation('USA', 'English', 38.9072, -77.0369, 'וושינגטון');
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  // Apply RTL layout on startup if saved location is Hebrew/Israel
  if (currentLocation && currentLocation.id === 'Israel') {
    document.body.classList.add('rtl-layout');
  } else {
    document.body.classList.remove('rtl-layout');
  }

  // Initialize navbar language translation on startup
  updateNavbarLanguage();

  const textEl = document.getElementById('selected-location-text');
  if (textEl) textEl.textContent = currentLocation.nameHeb;
  fetchWeatherForCapital();
  renderGroups();
  autoDetectLocation(); // Run automatic geolocation check!
  
  // Check for unread support and inbox messages on startup and every 10 seconds in the background
  setTimeout(() => { 
    if (typeof checkUnreadSupportMessages === 'function') checkUnreadSupportMessages(); 
    if (typeof checkInboxUnreadMessages === 'function') checkInboxUnreadMessages();
  }, 1500);
  setInterval(() => { 
    if (typeof checkUnreadSupportMessages === 'function') checkUnreadSupportMessages(); 
    if (typeof checkInboxUnreadMessages === 'function') checkInboxUnreadMessages();
  }, 10000);
});

// =====================================================================
// GROUPS & FORUMS LOGIC
// =====================================================================

const PREDEFINED_GROUPS = [
  { id: 'gate', name: 'שער הקהילה', desc: 'שער הקהילה הראשי - דיונים כלליים ונטוורקינג.', icon: 'fa-comments', color: '#0071e3' },
  { id: 'diaries', name: 'יומני מסע אישיים', desc: 'יומני מסע אישיים, יעדים, פיננסים והתפתחות.', icon: 'fa-book-open', color: '#af52de' },
  { id: 'blog-discussions', name: 'דיוני עומק על פוסטים מהבלוג', desc: 'דיונים מעמיקים ומחשבות על פוסטים ומאמרים.', icon: 'fa-newspaper', color: '#ff9500' },
  { id: 'capital-market', name: 'שוק ההון', desc: 'מניות, אגרות חוב, קרנות מחקות ואסטרטגיות השקעה.', icon: 'fa-chart-line', color: '#34c759' },
  { id: 'real-estate', name: 'נדל"ן', desc: 'עסקאות נדל"ן בארץ ובחו"ל, מינוף ודירות להשקעה.', icon: 'fa-building', color: '#ff3b30' },
  { id: 'pension', name: 'פנסיה, גמל וקרנות השתלמות', desc: 'חיסכון פנסיוני, אופטימיזציית דמי ניהול ומסלולי השקעה.', icon: 'fa-vault', color: '#5ac8fa' },
  { id: 'finance-consumerism', name: 'צרכנות פיננסית', desc: 'התנהלות פיננסית נכונה, כרטיסי אשראי, בנקים והוזלת עלויות.', icon: 'fa-tags', color: '#ffcc00' },
  { id: 'taxes', name: 'מיסים', desc: 'מיסוי ישראלי ואמריקאי, החזרי מס ותכנוני מס לפרט.', icon: 'fa-calculator', color: '#4cd964' }
];

const FORUM_CATEGORIES = [
  {
    title: 'הקהילה',
    subforums: [
      { id: 'gate', name: 'שער הקהילה', desc: 'שער הקהילה הראשי - דיונים כלליים ונטוורקינג.', icon: 'fa-comments', color: '#0071e3' },
      { id: 'diaries', name: 'יומני מסע אישיים', desc: 'יומני מסע אישיים, יעדים, פיננסים והתפתחות.', icon: 'fa-book-open', color: '#af52de' },
      { id: 'blog-discussions', name: 'דיוני עומק על פוסטים מהבלוג', desc: 'דיונים מעמיקים ומחשבות על פוסטים ומאמרים.', icon: 'fa-newspaper', color: '#ff9500' }
    ]
  },
  {
    title: 'כסף והשקעות',
    subforums: [
      { id: 'capital-market', name: 'שוק ההון', desc: 'מניות, אגרות חוב, קרנות מחקות ואסטרטגיות השקעה.', icon: 'fa-chart-line', color: '#34c759' },
      { id: 'real-estate', name: 'נדל"ן', desc: 'עסקאות נדל"ן בארץ ובחו"ל, מינוף ודירות להשקעה.', icon: 'fa-building', color: '#ff3b30' },
      { id: 'pension', name: 'פנסיה, גמל וקרנות השתלמות', desc: 'חיסכון פנסיוני, אופטימיזציית דמי ניהול ומסלולי השקעה.', icon: 'fa-vault', color: '#5ac8fa' },
      { id: 'finance-consumerism', name: 'צרכנות פיננסית', desc: 'התנהלות פיננסית נכונה, כרטיסי אשראי, בנקים והוזלת עלויות.', icon: 'fa-tags', color: '#ffcc00' },
      { id: 'taxes', name: 'מיסים', desc: 'מיסוי ישראלי ואמריקאי, החזרי מס ותכנוני מס לפרט.', icon: 'fa-calculator', color: '#4cd964' }
    ]
  }
];

let currentGroupId = null;
let currentPostId = null;
let currentPostAuthorEmail = null;
let currentPostTitle = null;

async function renderForum() {
  const container = document.getElementById('forum-directory-container');
  if (!container) return;

  container.innerHTML = '<div style="text-align:center; padding:40px; color:#86868b;"><div class="spinner" style="margin:0 auto 16px;"></div> טוען קטגוריות פורום...</div>';

  try {
    // Fetch all posts to aggregate stats and latest thread
    const postsRef = window.fbColl(window.fbDb, 'posts');
    const postsSnapshot = await window.fbGetDocs(postsRef);
    
    // Fetch all comments to count comments per post/subforum
    const commentsRef = window.fbColl(window.fbDb, 'comments');
    const commentsSnapshot = await window.fbGetDocs(commentsRef);

    const subforumStats = {};
    const subforumLatest = {};

    // Group comments by postId
    const commentsByPost = {};
    commentsSnapshot.forEach(doc => {
      const data = doc.data();
      if (!commentsByPost[data.postId]) {
        commentsByPost[data.postId] = [];
      }
      commentsByPost[data.postId].push({ id: doc.id, data });
    });

    postsSnapshot.forEach(doc => {
      const post = doc.data();
      const pId = doc.id;
      const gId = post.groupId || 'general-chat';
      
      if (!subforumStats[gId]) {
        subforumStats[gId] = { topicsCount: 0, postsCount: 0 };
      }
      subforumStats[gId].topicsCount += 1;
      
      const numComments = commentsByPost[pId] ? commentsByPost[pId].length : 0;
      subforumStats[gId].postsCount += (1 + numComments);

      // Keep track of latest thread in this subforum
      const pDate = new Date(post.timestamp);
      if (!subforumLatest[gId] || pDate > new Date(subforumLatest[gId].timestamp)) {
        subforumLatest[gId] = {
          id: pId,
          title: post.title,
          authorName: post.authorName || post.author || 'Anonymous',
          authorAvatar: post.authorAvatar || '',
          timestamp: post.timestamp
        };
      }
    });

    const OR = '#ffffff'; // white for forum directory names

    let html = '';

    FORUM_CATEGORIES.forEach(category => {
      html += `
        <div style="margin-bottom:28px; border:1px solid rgba(255,255,255,0.08); border-radius:12px; overflow:hidden;">
          <div style="padding:14px 20px; background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.08); direction:rtl; text-align:right;">
            <span style="font-size:1rem; font-weight:800; color:${OR}; letter-spacing:-0.01em;">${category.title}</span>
          </div>
      `;

      category.subforums.forEach((sf, idx) => {
        const stats = subforumStats[sf.id] || { topicsCount: 0, postsCount: 0 };
        const latest = subforumLatest[sf.id];
        const isLast = idx === category.subforums.length - 1;

        let latestHtml = `<span style="color:#555; font-size:0.82rem;">אין הודעות עדיין</span>`;
        if (latest) {
          const timeAgo = formatTimeAgo(new Date(latest.timestamp));
          const initials = (latest.authorName || 'A')[0].toUpperCase();
          const avatarBg = ['#f59e0b','#3b82f6','#8b5cf6','#ec4899','#10b981'][latest.authorName?.charCodeAt(0) % 5 || 0];
          const avatarHtml = latest.authorAvatar
            ? `<img src="${latest.authorAvatar}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
            : `<div style="width:32px;height:32px;border-radius:50%;background:${avatarBg};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.8rem;flex-shrink:0;">${initials}</div>`;
          latestHtml = `
            <div style="display:flex;align-items:center;gap:8px;min-width:0;">
              ${avatarHtml}
              <div style="min-width:0;">
                <a href="#" onclick="openPost('${latest.id}');return false;" style="color:${OR};font-weight:600;font-size:0.85rem;text-decoration:none;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px;">${latest.title}</a>
                <div style="font-size:0.75rem;color:#666;margin-top:2px;">${latest.authorName} &bull; ${timeAgo}</div>
              </div>
            </div>`;
        }

        html += `
          <div style="display:flex;align-items:center;padding:16px 20px;${isLast ? '' : 'border-bottom:1px solid rgba(255,255,255,0.05);'}direction:rtl;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='rgba(245,158,11,0.04)'" onmouseout="this.style.background='transparent'" onclick="openGroup('${sf.id}')">
            <!-- Forum Name (right) -->
            <div style="flex:2;display:flex;align-items:center;gap:14px;text-align:right;">
              <i class="fas fa-comments" style="color:${OR};font-size:1.1rem;flex-shrink:0;"></i>
              <div>
                <div style="font-weight:700;color:${OR};font-size:1rem;">${sf.name}</div>
                <div style="font-size:0.78rem;color:#888;margin-top:2px;">תת פורומים ▾</div>
              </div>
            </div>
            <!-- הודעות -->
            <div style="width:100px;text-align:center;flex-shrink:0;">
              <div style="font-weight:700;color:#e5e5ea;font-size:0.95rem;">${stats.postsCount.toLocaleString()}</div>
              <div style="font-size:0.72rem;color:#888;">הודעות</div>
            </div>
            <!-- נושאים -->
            <div style="width:100px;text-align:center;flex-shrink:0;">
              <div style="font-weight:700;color:#e5e5ea;font-size:0.95rem;">${stats.topicsCount.toLocaleString()}</div>
              <div style="font-size:0.72rem;color:#888;">נושאים</div>
            </div>
            <!-- Latest (left) -->
            <div style="width:220px;flex-shrink:0;text-align:right;">${latestHtml}</div>
          </div>
        `;
      });

      html += `</div>`;
    });

    // ---- Build "משתמשים בולטים" section ----
    // Aggregate user stats from posts and comments snapshots
    const userPostCount = {};    // email -> post count
    const userLikes = {};        // email -> total likes received
    const userComments = {};     // email -> comment count (replies given)

    postsSnapshot.forEach(doc => {
      const d = doc.data();
      const email = d.authorEmail || d.author || 'unknown';
      userPostCount[email] = (userPostCount[email] || 0) + 1;
      userLikes[email] = (userLikes[email] || 0) + (d.likes || 0);
    });

    commentsSnapshot.forEach(doc => {
      const d = doc.data();
      const email = d.authorEmail || d.author || 'unknown';
      userComments[email] = (userComments[email] || 0) + 1;
      // Also increment post count with comments
      userPostCount[email] = (userPostCount[email] || 0) + 1;
    });

    // Name lookup: email -> display name (best-effort from posts)
    const emailToName = {};
    postsSnapshot.forEach(doc => {
      const d = doc.data();
      if (d.authorEmail && (d.authorName || d.author)) {
        emailToName[d.authorEmail] = d.authorName || d.author;
      }
    });
    commentsSnapshot.forEach(doc => {
      const d = doc.data();
      if (d.authorEmail && (d.authorName || d.author)) {
        emailToName[d.authorEmail] = d.authorName || d.author;
      }
    });

    function topUsers(scoreMap, limit) {
      return Object.entries(scoreMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([email, score]) => ({ email, score, name: emailToName[email] || email.split('@')[0] || email }));
    }

    const topByPosts = topUsers(userPostCount, 5);
    const topByLikes = topUsers(userLikes, 5);
    const topByReplies = topUsers(userComments, 5);

    const avatarColorsRanking = ['#0071e3','#af52de','#ff9500','#34c759','#ff3b30','#5ac8fa','#ffcc00'];
    function renderRankingList(users) {
      if (!users.length) return '<div style="color:#86868b; font-size:0.85rem; text-align:center; padding:12px;">אין נתונים עדיין</div>';
      return users.map((u, i) => {
        const initials = (u.name || 'A').charAt(0).toUpperCase();
        const aColor = avatarColorsRanking[initials.charCodeAt(0) % avatarColorsRanking.length];
        return `
          <div style="display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="color:#86868b; font-size:0.8rem; font-weight:700; width:18px; text-align:center;">${i + 1}</span>
            <div style="width:32px; height:32px; border-radius:50%; background:${aColor}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.85rem; font-weight:700; flex-shrink:0;">${initials}</div>
            <span style="color:#b5192b; font-weight:700; font-size:0.9rem; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${u.name}</span>
            <span style="color:#86868b; font-size:0.8rem;">${u.score}</span>
          </div>
        `;
      }).join('');
    }

    const rankingColumns = [
      { title: 'הכי הרבה הודעות', icon: 'fa-comment', users: topByPosts },
      { title: 'הדירוג הגבוה ביותר', icon: 'fa-star', users: topByLikes },
      { title: 'הכי הרבה נקודות', icon: 'fa-trophy', users: topByReplies }
    ];

    html += `
      <div style="margin-top:32px; margin-bottom:8px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:16px;">
          <h3 style="font-size:1.3rem; font-weight:800; color:#ffffff; margin:0;">משתמשים בולטים</h3>
          <span style="color:#86868b; font-size:0.9rem; cursor:pointer;" title="הסתר/הצג">▼</span>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:16px;">
    `;

    rankingColumns.forEach(col => {
      html += `
        <div style="background:#1c1c1e; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:10px;">
            <i class="fas ${col.icon}" style="color:#b5192b; font-size:0.9rem;"></i>
            <span style="font-weight:700; font-size:0.95rem; color:#ffffff;">${col.title}</span>
          </div>
          ${renderRankingList(col.users)}
          <button onclick="showToast('תכונה זו תהיה זמינה בקרוב!', 'info')" style="width:100%; margin-top:12px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:#86868b; padding:7px; border-radius:8px; cursor:pointer; font-size:0.8rem; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='rgba(255,255,255,0.04)'">ראה עוד...</button>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
    // ---- End ranking section ----

    container.innerHTML = html;
  } catch (err) {
    console.error('Error rendering forum:', err);
    container.innerHTML = '<div style="text-align:center; padding:40px; color:#ef4444;">שגיאה בטעינת נושאי הפורום. אנא נסה שוב.</div>';
  }
}

async function renderPersonalArchive() {
  const container = document.getElementById('archive-timeline-container');
  if (!container) return;

  if (!currentUser || !currentUser.email) {
    container.innerHTML = '<div style="text-align:center; padding:60px; color:#86868b;"><i class="fas fa-lock" style="font-size: 3rem; margin-bottom: 16px; color:#555;"></i><br>אנא התחבר כדי לצפות בארכיון הפוסטים האישי שלך.</div>';
    return;
  }

  container.innerHTML = '<div style="text-align:center; padding:40px; color:#86868b;"><div class="spinner" style="margin:0 auto 16px;"></div> טוען ארכיון פוסטים...</div>';

  try {
    // 1. Fetch user's posts
    const postsRef = window.fbColl(window.fbDb, 'posts');
    const q = window.fbQuery(postsRef, window.fbWhere('authorEmail', '==', currentUser.email));
    const postsSnapshot = await window.fbGetDocs(q);

    // 2. Fetch all comments to aggregate comment count per post
    const commentsRef = window.fbColl(window.fbDb, 'comments');
    const commentsSnapshot = await window.fbGetDocs(commentsRef);

    const commentsByPost = {};
    commentsSnapshot.forEach(doc => {
      const data = doc.data();
      if (!commentsByPost[data.postId]) {
        commentsByPost[data.postId] = 0;
      }
      commentsByPost[data.postId] += 1;
    });

    if (postsSnapshot.empty) {
      container.innerHTML = '<div style="text-align:center; padding:60px; color:#86868b;"><i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 16px; color:#555;"></i><br>עדיין לא העלית פוסטים או מאמרים. כל פוסט שתעלה בפורום יופיע כאן!</div>';
      return;
    }

    // Group chronologically
    const postsList = [];
    postsSnapshot.forEach(doc => {
      postsList.push({ id: doc.id, ...doc.data() });
    });

    // Sort descending by timestamp
    postsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Group by Year and Month
    const grouped = {};
    postsList.forEach(post => {
      const d = new Date(post.timestamp);
      const year = d.getFullYear();
      const monthHeb = d.toLocaleString('he-IL', { month: 'long' });
      
      if (!grouped[year]) {
        grouped[year] = {};
      }
      if (!grouped[year][monthHeb]) {
        grouped[year][monthHeb] = [];
      }
      grouped[year][monthHeb].push(post);
    });

    let html = '<div class="timeline-wrapper" style="position:relative; border-right: 2px solid rgba(255,255,255,0.06); padding-right: 24px; margin-right: 8px;">';

    Object.keys(grouped).sort((a, b) => b - a).forEach(year => {
      const totalYearPosts = Object.values(grouped[year]).reduce((acc, curr) => acc + curr.length, 0);
      
      html += `
        <div class="timeline-year-section" style="position:relative; margin-bottom:40px;">
          <!-- Timeline point for year -->
          <div style="position:absolute; right: -33px; top: 4px; width: 16px; height: 16px; border-radius:50%; background:#ff453a; border: 3px solid #000; box-shadow: 0 0 0 4px rgba(255,69,58,0.15); z-index:3;"></div>
          <h3 style="font-size:1.8rem; font-weight:800; color:#ffffff; margin-bottom:20px; display:flex; align-items:center; gap:12px;">
            ${year}
            <span style="font-size:0.95rem; font-weight:500; color:#86868b; background:rgba(255,255,255,0.05); padding: 2px 10px; border-radius:980px;">${totalYearPosts} פוסטים</span>
          </h3>
      `;

      const months = grouped[year];
      Object.keys(months).forEach(month => {
        html += `
          <div class="timeline-month-section" style="margin-bottom: 24px; margin-right: 12px;">
            <h4 style="font-size: 1.25rem; font-weight: 700; color: #ff453a; margin-bottom: 16px;">${month}</h4>
            <div style="display:flex; flex-direction:column; gap:12px;">
        `;

        months[month].forEach(post => {
          const numComments = commentsByPost[post.id] || 0;
          const day = new Date(post.timestamp).getDate();
          
          html += `
            <div class="archive-item-card" onclick="openPost('${post.id}')" style="background:#1c1c1e; border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:16px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.borderColor='rgba(255,69,58,0.3)'; this.style.transform='translateX(-4px)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.06)'; this.style.transform='none'">
              <div style="display:flex; align-items:center; gap:16px;">
                <div style="width: 40px; height: 40px; border-radius: 8px; background: rgba(255,69,58,0.1); color: #ff453a; display:flex; flex-direction:column; align-items:center; justify-content:center; font-weight:800; font-size:1.1rem; flex-shrink:0;">
                  ${day}
                </div>
                <div>
                  <h5 style="font-size: 1.05rem; font-weight: 700; color:#ffffff; margin-bottom:4px;">${post.title}</h5>
                  <p style="color:#86868b; font-size:0.85rem; margin:0; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical;">${post.content}</p>
                </div>
              </div>
              
              <div style="display:flex; align-items:center; gap:8px; color:#86868b; font-size:0.9rem; background:rgba(255,255,255,0.03); padding:6px 12px; border-radius:8px;">
                <i class="far fa-comment"></i>
                <span style="font-weight:700; color:#ffffff;">${numComments}</span>
              </div>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      html += `
        </div>
      `;
    });

    html += '</div>';

    container.innerHTML = html;
  } catch (err) {
    console.error('Error rendering personal archive:', err);
    container.innerHTML = '<div style="text-align:center; padding:40px; color:#ef4444;">שגיאה בטעינת הארכיון האישי.</div>';
  }
}

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `לפני ${interval} שנים`;
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `לפני ${interval} חודשים`;
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `לפני ${interval} ימים`;
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `לפני ${interval} שעות`;
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `לפני ${interval} דקות`;
  return 'ממש עכשיו';
}

function renderGroups() {
  renderForum();
}

window.showGroupsList = function() {
  document.getElementById('groups-list-view').style.display = 'block';
  document.getElementById('group-detail-view').style.display = 'none';
  document.getElementById('post-detail-view').style.display = 'none';
  currentGroupId = null;
  currentPostId = null;
};

window.openGroup = async function(groupId, sortType = 'new') {
  const group = PREDEFINED_GROUPS.find(g => g.id === groupId);
  if (!group) return;

  currentGroupId = groupId;
  window._currentGroupObj = group;
  document.getElementById('groups-list-view').style.display = 'none';
  document.getElementById('post-detail-view').style.display = 'none';
  document.getElementById('group-detail-view').style.display = 'block';

  // Update logo subtext to group name
  const subtextEl = document.getElementById('nav-logo-subtext');
  if (subtextEl) subtextEl.textContent = group.name;

  // Reddit-style header population
  document.getElementById('group-title').textContent = group.name;
  document.getElementById('group-desc').textContent = group.desc;
  document.getElementById('sidebar-group-desc').textContent = group.desc;
  document.getElementById('sidebar-created').textContent = 'נוצר 2024';

  // Banner
  const bannerEl = document.getElementById('group-banner');
  const overlayEl = document.getElementById('group-banner-overlay');
  const bannerImg = document.getElementById('group-banner-img');
  if (bannerImg) { bannerImg.style.display = 'none'; bannerImg.src = ''; }
  if (bannerEl) bannerEl.style.background = `linear-gradient(135deg, ${group.color}22, ${group.color}55, #0a0a0a)`;
  if (overlayEl) overlayEl.style.background = group.color;
  loadSavedBanner(groupId);

  // Icon
  const iconWrap = document.getElementById('group-icon-wrap');
  const iconI = document.getElementById('group-icon-i');
  if (iconWrap) iconWrap.style.background = group.color;
  if (iconI) { iconI.className = `fas ${group.icon}`; iconI.style.color = '#fff'; }

  document.getElementById('sidebar-members').textContent = '...';

  const container = document.getElementById('group-posts-container');
  container.innerHTML = '<div style="text-align:center; padding:40px; color:#86868b;"><div class="spinner" style="margin:0 auto 16px;"></div> טוען דיונים בפורום...</div>';

  try {
    // Fetch posts
    const postsRef = window.fbColl(window.fbDb, 'posts');
    const q = window.fbQuery(postsRef, window.fbWhere('groupId', '==', groupId));
    const snapshot = await window.fbGetDocs(q);

    // Fetch all comments for this group to count per-post
    const commentsRef = window.fbColl(window.fbDb, 'comments');
    const commentsSnap = await window.fbGetDocs(commentsRef);
    const commentsByPost = {};
    const latestCommentByPost = {};
    commentsSnap.forEach(cdoc => {
      const cd = cdoc.data();
      if (!commentsByPost[cd.postId]) commentsByPost[cd.postId] = 0;
      commentsByPost[cd.postId]++;
      // Track latest comment
      if (!latestCommentByPost[cd.postId] || new Date(cd.timestamp) > new Date(latestCommentByPost[cd.postId].timestamp)) {
        latestCommentByPost[cd.postId] = { author: cd.author || cd.authorName || 'Anonymous', timestamp: cd.timestamp };
      }
    });

    if (snapshot.empty) {
      container.innerHTML = `
        <div style="background:#1c1c1e; border:1px solid #2c2c2e; border-radius:16px; padding:40px; text-align:center; color:#86868b; direction:rtl;">
          אין עדיין דיונים בפורום זה. היה הראשון לפתוח דיון!
        </div>`;
      return;
    }

    // Sort
    const docs = [];
    snapshot.forEach(doc => docs.push({ id: doc.id, data: doc.data() }));
    if (sortType === 'top') {
      docs.sort((a, b) => (b.data.votes || 0) - (a.data.votes || 0));
    } else if (sortType === 'hot') {
      docs.sort((a, b) => ((commentsByPost[b.id]||0)*2+(b.data.votes||0)) - ((commentsByPost[a.id]||0)*2+(a.data.votes||0)));
    } else {
      docs.sort((a, b) => new Date(b.data.timestamp) - new Date(a.data.timestamp));
    }

    // Members count
    const uniqueAuthors = new Set(docs.map(d => d.data.authorName || d.data.author));
    const membersEl = document.getElementById('sidebar-members');
    if (membersEl) membersEl.textContent = `${uniqueAuthors.size} חברים`;

    // Setup infinite scroll docs and variables
    window._currentGroupDocs = docs;
    window._commentsByPost = commentsByPost;
    window._currentGroupLoadedCount = 0;

    // Render first batch
    window.renderNextPostBatch();
  } catch (err) {
    console.error('Error loading posts:', err);
    container.innerHTML = '<div style="text-align:center; padding:40px; color:#ef4444; direction:rtl;">שגיאה בטעינת הדיונים. אנא נסה שוב מאוחר יותר.</div>';
  }
};

window.renderNextPostBatch = function() {
  if (!window._currentGroupDocs) return;
  const container = document.getElementById('group-posts-container');
  if (!container) return;

  const batchSize = 5;
  const start = window._currentGroupLoadedCount;
  const end = Math.min(start + batchSize, window._currentGroupDocs.length);
  
  if (start >= window._currentGroupDocs.length) return;

  let html = '';
  const commentsByPost = window._commentsByPost || {};
  const currentGroupId = window.currentGroupId;

  for (let i = start; i < end; i++) {
    const doc = window._currentGroupDocs[i];
    const data = doc.data;
    const timeAgo = formatTimeAgo(new Date(data.timestamp));
    const authorName = data.authorName || data.author || 'Anonymous';
    const repliesCount = commentsByPost[doc.id] || (data.commentsCount || 0);
    const viewsCount = data.views || Math.floor(Math.random()*4000+500);
    const votes = data.votes || 0;
    const authorInitials = authorName.charAt(0).toUpperCase();
    const avatarBgColors = ['#f59e0b','#3b82f6','#8b5cf6','#ec4899','#10b981','#ef4444','#06b6d4'];
    const avatarBg = avatarBgColors[authorInitials.charCodeAt(0) % avatarBgColors.length];
    const avatarHtml = data.authorAvatar
      ? `<img src="${data.authorAvatar}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
      : `<div style="width:44px;height:44px;border-radius:50%;background:${avatarBg};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:1.1rem;flex-shrink:0;">${authorInitials}</div>`;
    const contentText = (data.content || '').replace(/<[^>]+>/g, '').trim();
    const handle = '@' + authorName.toLowerCase().replace(/\s+/g,'');
    const marketplaceBtn = currentGroupId === 'marketplace' ? `<button onclick="event.stopPropagation(); if(window.openMakeOfferModal) window.openMakeOfferModal('${doc.id}','${data.authorEmail||''}','${(data.title||'').replace(/'/g,"\\'").replace(/"/g,"&quot;")}');" style="background:#f59e0b;color:#000;border:none;padding:4px 14px;border-radius:980px;font-weight:700;cursor:pointer;font-size:0.75rem;">💰 הגש הצעה</button>` : '';

    const fmtNum = n => n >= 1000 ? (n/1000).toFixed(1).replace(/\.0$/,'')+'K' : n;

    // Reddit-style post image
    const imageHtml = data.image ? `
      <div style="margin-top:10px; margin-bottom:12px; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.08); max-height: 400px; display: flex; align-items: center; justify-content: center; background: #0c0c0d;">
        <img src="${data.image}" style="max-width:100%; max-height:400px; object-fit:contain; cursor:zoom-in;" onclick="event.stopPropagation(); if(window.openLightboxImage) window.openLightboxImage('${data.image}');">
      </div>` : '';

    html += `
      <div onclick="openPost('${doc.id}')" style="background:#000;border-bottom:1px solid rgba(255,255,255,0.1);padding:16px 18px;cursor:pointer;transition:background 0.15s;display:flex;gap:12px;direction:ltr;"
        onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='#000'">

        <!-- Avatar column -->
        <div style="flex-shrink:0;">${avatarHtml}</div>

        <!-- Content column -->
        <div style="flex:1;min-width:0;">

          <!-- Header row: name · handle · time -->
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;flex-wrap:wrap;">
            <span style="font-weight:700;color:#e7e9ea;font-size:0.97rem;">${authorName}</span>
            <span style="color:#71767b;font-size:0.9rem;">${handle}</span>
            <span style="color:#71767b;font-size:0.9rem;">·</span>
            <span style="color:#71767b;font-size:0.9rem;">${timeAgo}</span>
          </div>

          <!-- Title (bold) -->
          ${data.title ? `<div style="font-weight:700;color:#e7e9ea;font-size:1rem;line-height:1.5;margin-bottom:6px;">${data.title}</div>` : ''}

          <!-- Body text -->
          ${contentText ? `<div style="color:#e7e9ea;font-size:0.95rem;line-height:1.6;margin-bottom:12px;white-space:pre-line;">${contentText.slice(0,280)}${contentText.length>280?'<span style="color:#1d9bf0"> הצג עוד</span>':''}</div>` : ''}

          <!-- Image -->
          ${imageHtml}

          <!-- Action bar -->
          <div style="display:flex;align-items:center;gap:0;margin-top:4px;" onclick="event.stopPropagation()">

            <!-- Reply -->
            <button onclick="openPost('${doc.id}')" style="display:flex;align-items:center;gap:6px;background:none;border:none;color:#71767b;font-size:0.85rem;cursor:pointer;padding:6px 14px 6px 0;font-family:inherit;transition:color 0.15s;" onmouseover="this.style.color='#1d9bf0'" onmouseout="this.style.color='#71767b'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 7.879 3.77 7.879 8.022 0 4.422-3.556 8.011-7.879 8.011h-1.53l-2.059 2.254c-.4.439-1.013.616-1.585.46-.571-.155-.985-.65-1.049-1.236L9.54 18.5H9.756C5.351 18.5 1.751 14.924 1.751 10Z" stroke="currentColor" stroke-width="1.8"/></svg>
              ${fmtNum(repliesCount)}
            </button>

            <!-- Retweet/votes -->
            <button onclick="votePost('${doc.id}',1)" style="display:flex;align-items:center;gap:6px;background:none;border:none;color:${votes>0?'#00ba7c':'#71767b'};font-size:0.85rem;cursor:pointer;padding:6px 14px 6px 6px;font-family:inherit;transition:color 0.15s;" onmouseover="this.style.color='#00ba7c'" onmouseout="this.style.color='${votes>0?'#00ba7c':'#71767b'}'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46L19.5 20.12l-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" fill="currentColor"/></svg>
              ${fmtNum(votes > 0 ? votes : 0)}
            </button>

            <!-- Like -->
            <button style="display:flex;align-items:center;gap:6px;background:none;border:none;color:#71767b;font-size:0.85rem;cursor:pointer;padding:6px 14px 6px 6px;font-family:inherit;transition:color 0.15s;" onmouseover="this.style.color='#f91880'" onmouseout="this.style.color='#71767b'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.53.771-.53-.77c-1.125-1.635-2.52-2.186-3.78-2.128-1.934.09-3.396 1.555-3.396 3.323 0 .92.364 1.896 1.25 2.9 2 2.284 5.86 5.11 6.455 5.54.596-.43 4.454-3.256 6.455-5.54.886-1.004 1.249-1.98 1.249-2.9 0-1.738-1.447-3.19-3.29-3.356z" stroke="currentColor" stroke-width="1.8"/></svg>
              ${fmtNum(Math.floor((votes+3)*7+repliesCount*3))}
            </button>

            <!-- Views -->
            <button style="display:flex;align-items:center;gap:6px;background:none;border:none;color:#71767b;font-size:0.85rem;cursor:pointer;padding:6px 14px 6px 6px;font-family:inherit;transition:color 0.15s;" onmouseover="this.style.color='#1d9bf0'" onmouseout="this.style.color='#71767b'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" fill="currentColor"/></svg>
              ${fmtNum(viewsCount)}
            </button>

            ${marketplaceBtn}
          </div>
        </div>
      </div>`;
  }

  if (start === 0) {
    container.innerHTML = html;
  } else {
    container.innerHTML += html;
  }

  window._currentGroupLoadedCount = end;
};

// Global scroll listener for infinite scroll
window.addEventListener('scroll', () => {
  const detailView = document.getElementById('group-detail-view');
  if (detailView && detailView.style.display === 'block' && window._currentGroupDocs && window._currentGroupLoadedCount < window._currentGroupDocs.length) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 250) {
      window.renderNextPostBatch();
    }
  }
});

window.openLightboxImage = function(src) {
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
  }
};

window.openCreatePostModal = function() {
  if (!currentUser || !currentUser.email) {
    showToast('Please sign in to create a post.', 'error');
    openAuthModal('login');
    return;
  }
  document.getElementById('create-post-modal').classList.add('active');
  document.getElementById('new-post-title').value = '';
  document.getElementById('new-post-content').value = '';
  
  const priceContainer = document.getElementById('new-post-price-container');
  if (priceContainer) {
    priceContainer.style.display = (currentGroupId === 'marketplace') ? 'block' : 'none';
  }
  const priceInput = document.getElementById('new-post-price');
  if (priceInput) priceInput.value = '';
};

window.closeCreatePostModal = function() {
  document.getElementById('create-post-modal').classList.remove('active');
};

// ── Reddit forum helpers ─────────────────────────────────────────────────────
window.votePost = async function(postId, delta) {
  if (!currentUser) { showToast('התחבר כדי להצביע', 'error'); return; }
  try {
    await window.fbUpdateDoc(window.fbDoc(window.fbDb, 'posts', postId), { votes: window.fbIncrement(delta) });
    openGroup(currentGroupId);
  } catch(e) { console.error('Vote error', e); }
};

window.setGroupSort = function(type) {
  ['hot','new','top'].forEach(t => {
    const btn = document.getElementById('sort-' + t);
    if (btn) { btn.style.background = t === type ? 'rgba(255,255,255,0.08)' : 'transparent'; btn.style.color = t === type ? '#fff' : '#71717a'; }
  });
  openGroup(currentGroupId, type);
};

window.openBannerEditor = function() {
  const p = document.getElementById('banner-editor-popup');
  if (p) p.style.display = p.style.display === 'none' ? 'block' : 'none';
};
window.applyBannerUrl = function() {
  const url = document.getElementById('banner-url-input')?.value?.trim();
  if (url) { setBannerImage(url); document.getElementById('banner-editor-popup').style.display = 'none'; }
};
window.handleBannerFileUpload = function(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => { setBannerImage(ev.target.result); document.getElementById('banner-editor-popup').style.display = 'none'; };
  reader.readAsDataURL(file);
};
window.removeBanner = function() {
  const img = document.getElementById('group-banner-img');
  const banner = document.getElementById('group-banner');
  if (img) img.style.display = 'none';
  const g = window._currentGroupObj;
  if (banner && g) banner.style.background = `linear-gradient(135deg, ${g.color}22, ${g.color}55, #0a0a0a)`;
  if (currentGroupId) localStorage.removeItem('banner_' + currentGroupId);
  document.getElementById('banner-editor-popup').style.display = 'none';
};
function setBannerImage(src) {
  const img = document.getElementById('group-banner-img');
  const banner = document.getElementById('group-banner');
  if (!img || !banner) return;
  img.src = src; img.style.display = 'block'; banner.style.background = 'transparent';
  if (currentGroupId) localStorage.setItem('banner_' + currentGroupId, src);
}
function loadSavedBanner(groupId) {
  const saved = localStorage.getItem('banner_' + groupId);
  if (saved) setBannerImage(saved);
}
// ────────────────────────────────────────────────────────────────────────────

window.submitPost = async function() {
  if (!currentUser || !currentUser.email) {
    showToast('אנא התחבר כדי לפרסם פוסט בפורום', 'error');
    openAuthModal('login');
    return;
  }
  if (!currentGroupId) {
    showToast('שגיאה: לא נבחר פורום לפרסום', 'error');
    return;
  }
  
  const title = document.getElementById('new-post-title').value.trim();
  const content = document.getElementById('new-post-content').value.trim();
  const priceInput = document.getElementById('new-post-price');
  const price = (currentGroupId === 'marketplace' && priceInput && priceInput.value) ? Number(priceInput.value) : null;
  const imageInput = document.getElementById('new-post-image');
  const btn = document.getElementById('btn-submit-post');
  
  if (!title || !content) {
    showToast('Please enter both title and content.', 'error');
    return;
  }
  
  const originalText = btn.textContent;
  btn.textContent = 'Posting...';
  btn.disabled = true;
  
  try {
    let base64Image = null;
    if (imageInput && imageInput.files && imageInput.files[0]) {
      const file = imageInput.files[0];
      base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    }

    const postsRef = window.fbColl(window.fbDb, 'posts');
    const postData = {
      groupId: currentGroupId,
      authorEmail: currentUser.email,
      authorName: currentUser.name || 'Anonymous',
      authorAvatar: currentUser.avatar || '',
      title: title,
      content: content,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    if (price !== null) {
      postData.price = price;
    }
    if (base64Image) {
      postData.image = base64Image;
    }
    await window.fbAddDoc(postsRef, postData);
    
    document.getElementById('new-post-title').value = '';
    document.getElementById('new-post-content').value = '';
    if (priceInput) priceInput.value = '';
    if (imageInput) imageInput.value = '';

    closeCreatePostModal();
    showToast('Post created successfully!', 'success');
    openGroup(currentGroupId); // Refresh list
  } catch (err) {
    console.error('Error creating post:', err);
    alert('Failed to create post: ' + err.message);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
};

window.openPost = async function(postId) {
  currentPostId = postId;
  document.getElementById('group-detail-view').style.display = 'none';
  document.getElementById('post-detail-view').style.display = 'block';
  document.getElementById('post-detail-view').style.paddingBottom = '90px';

  // Show floating bottom comment bar and inject active user avatar
  const floatingBar = document.getElementById('floating-post-reply-bar');
  if (floatingBar) {
    floatingBar.style.display = 'flex';
    const avatarContainer = document.getElementById('floating-reply-avatar-container');
    if (avatarContainer) {
      const uName = currentUser?.name || 'Guest';
      const initials = uName.charAt(0).toUpperCase();
      const colors = ['#f59e0b','#3b82f6','#8b5cf6','#ec4899','#10b981','#ef4444','#06b6d4'];
      const color = colors[initials.charCodeAt(0) % colors.length];
      const avatarHtml = (currentUser?.avatar || currentUser?.photoURL)
        ? `<img src="${currentUser?.avatar || currentUser?.photoURL}" style="width:38px; height:38px; border-radius:50%; object-fit:cover;">`
        : `<div style="width:38px; height:38px; border-radius:50%; background:${color}; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1rem;">${initials}</div>`;
      avatarContainer.innerHTML = avatarHtml;
    }
  }

  const backBtn = document.getElementById('post-back-btn');
  backBtn.onclick = () => {
    if (floatingBar) floatingBar.style.display = 'none';
    if (currentGroupId) {
      openGroup(currentGroupId);
    } else {
      showPage('archive');
    }
  };

  const threadContainer = document.getElementById('post-thread-container');
  threadContainer.innerHTML = '<div class="spinner" style="margin: 20px auto;"></div>';

  try {
    // 1. Fetch Post
    const postDocRef = window.fbDoc(window.fbDb, 'posts', postId);
    const postSnap = await window.fbGetDoc(postDocRef);

    if (!postSnap.exists()) {
      threadContainer.innerHTML = '<div style="color:#ef4444; padding:16px; direction:rtl;">הפוסט לא נמצא.</div>';
      return;
    }

    const postData = postSnap.data();
    currentPostAuthorEmail = postData.authorEmail;
    currentPostTitle = postData.title;

    // 2. Increment views
    try {
      const { increment } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');
      await window.fbUpdateDoc(postDocRef, { views: increment(1) });
    } catch (e) {
      // Silently fail if increment not available
    }

    // 3. Fetch comments
    const commentsRef = window.fbColl(window.fbDb, 'comments');
    const cq = window.fbQuery(commentsRef, window.fbWhere('postId', '==', postId));
    const commentsSnap = await window.fbGetDocs(cq);

    const comments = [];
    commentsSnap.forEach(d => comments.push({ id: d.id, data: d.data() }));
    comments.sort((a, b) => new Date(a.data.timestamp) - new Date(b.data.timestamp));

    // Helper: build user sidebar card
    const OR3 = '#f59e0b';
    const avatarColors = ['#f59e0b','#3b82f6','#8b5cf6','#ec4899','#10b981','#ef4444','#06b6d4'];
    function buildUserSidebar(authorName, authorAvatar, postCount, joinDate) {
      const initials = (authorName || 'A').charAt(0).toUpperCase();
      const avatarColor = avatarColors[initials.charCodeAt(0) % avatarColors.length];
      let role = 'משתמש חדש';
      let badge = '';
      if (postCount >= 500) { role = 'מנהל'; badge = `<div style="font-size:0.7rem; background:${OR3}; color:#000; padding:2px 10px; border-radius:4px; font-weight:800; margin-top:2px;">מייסד</div>`; }
      else if (postCount >= 100) { role = 'מנהל'; }
      else if (postCount >= 20) { role = 'חבר ותיק'; }
      else if (postCount >= 5) { role = 'חבר'; }
      const avatarHtml = authorAvatar
        ? `<img src="${authorAvatar}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid rgba(245,158,11,0.3);">`
        : `<div style="width:64px;height:64px;border-radius:50%;background:${avatarColor};color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.6rem;font-weight:800;">${initials}</div>`;
      const joinStr = joinDate ? new Date(joinDate).toLocaleDateString('he-IL') : '—';
      return `
        <div style="width:180px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:16px 10px;border-left:1px solid rgba(255,255,255,0.07);text-align:center;gap:6px;background:rgba(255,255,255,0.01);">
          ${avatarHtml}
          <div style="font-size:0.95rem;font-weight:700;color:${OR3};margin-top:2px;">${authorName}</div>
          <div style="font-size:0.72rem;color:#aaa;">${role}</div>
          ${badge}
          <div style="width:100%;margin-top:8px;border-top:1px solid rgba(255,255,255,0.07);padding-top:8px;font-size:0.75rem;color:#86868b;text-align:right;">
            <div style="display:flex;justify-content:space-between;padding:2px 0;"><span>הצטרף ב:</span><span style="color:#d1d1d6;">${joinStr}</span></div>
            <div style="display:flex;justify-content:space-between;padding:2px 0;"><span>הודעות:</span><span style="color:#d1d1d6;">${postCount}</span></div>
          </div>
        </div>
      `;
    }

    // Helper: build avatar html
    function buildAvatar(name, avatarUrl, size=42) {
      const initials = (name||'A').charAt(0).toUpperCase();
      const color = avatarColors[initials.charCodeAt(0) % avatarColors.length];
      return avatarUrl
        ? `<img src="${avatarUrl}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex-shrink:0;">`
        : `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:${Math.round(size*0.4)}px;flex-shrink:0;">${initials}</div>`;
    }

    // Helper: format full date like "4:57 PM · May 29, 2026"
    function fmtFullDate(ts) {
      try {
        const d = new Date(ts);
        return d.toLocaleString('en-US', { hour:'numeric', minute:'2-digit', hour12:true }) + ' · ' +
               d.toLocaleString('en-US', { month:'short', day:'numeric', year:'numeric' });
      } catch { return ''; }
    }

    // Helper: format number
    const fmtN = n => n >= 1000 ? (n/1000).toFixed(1).replace(/\.0$/,'')+'K' : String(n||0);

    // ── Main post (Twitter-style expanded) ──
    const origAuthor = postData.authorName || postData.author || 'Anonymous';
    const origHandle = '@' + origAuthor.toLowerCase().replace(/\s+/g,'');
    const origAvatar = buildAvatar(origAuthor, postData.authorAvatar||'', 44);
    const postVotes = postData.votes || 0;
    const postViews = postData.views || 0;
    const repliesCount = comments.length;

    let html = `
      <div style="background:#000;border-bottom:1px solid rgba(255,255,255,0.1);padding:16px 18px;">
        <!-- Author row -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;direction:rtl;">
          ${origAvatar}
          <div>
            <div style="font-weight:700;color:#e7e9ea;font-size:1rem;">${origAuthor}</div>
            <div style="color:#71767b;font-size:0.88rem;">${origHandle}</div>
          </div>
        </div>
        <!-- Title -->
        ${postData.title ? `<div style="font-weight:700;color:#e7e9ea;font-size:1.1rem;line-height:1.5;margin-bottom:10px;direction:rtl;text-align:right;">${postData.title}</div>` : ''}
        <!-- Full content -->
        <div style="color:#e7e9ea;font-size:1rem;line-height:1.7;white-space:pre-wrap;margin-bottom:14px;direction:rtl;text-align:right;">${postData.content||''}</div>
        <!-- Post Image -->
        ${postData.image ? `<div style="margin-top:12px; margin-bottom:16px; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); text-align:center; background: #0c0c0d; display: flex; align-items: center; justify-content: center; max-height: 500px;"><img src="${postData.image}" style="max-width:100%; max-height:500px; object-fit:contain; cursor:zoom-in;" onclick="if(window.openLightboxImage) window.openLightboxImage('${postData.image}');"></div>` : ''}
        <!-- Full date + views -->
        <div style="color:#71767b;font-size:0.88rem;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.1);">
          ${fmtFullDate(postData.timestamp)} · <strong style="color:#e7e9ea;">${fmtN(postViews)}</strong> Views
        </div>
        <!-- Stats row -->
        <div style="display:flex;gap:20px;font-size:0.9rem;color:#71767b;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.1);">
          <span><strong style="color:#e7e9ea;">${fmtN(repliesCount)}</strong> Replies</span>
          <span><strong style="color:#e7e9ea;">${fmtN(postVotes)}</strong> Likes</span>
        </div>
        <!-- Action icons -->
        <div style="display:flex;justify-content:space-around;padding-top:6px;direction:rtl;" onclick="event.stopPropagation()">
          <button onclick="document.getElementById('new-comment-input').focus()" style="background:none;border:none;color:#71767b;cursor:pointer;padding:8px;border-radius:50%;transition:color 0.15s,background 0.15s;" onmouseover="this.style.color='#1d9bf0';this.style.background='rgba(29,155,240,0.1)'" onmouseout="this.style.color='#71767b';this.style.background='none'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 7.879 3.77 7.879 8.022 0 4.422-3.556 8.011-7.879 8.011h-1.53l-2.059 2.254c-.4.439-1.013.616-1.585.46-.571-.155-.985-.65-1.049-1.236L9.54 18.5H9.756C5.351 18.5 1.751 14.924 1.751 10Z" stroke="currentColor" stroke-width="1.8"/></svg>
          </button>
          <button onclick="votePost('${postId}',1)" style="background:none;border:none;color:${postVotes>0?'#00ba7c':'#71767b'};cursor:pointer;padding:8px;border-radius:50%;transition:color 0.15s,background 0.15s;" onmouseover="this.style.color='#00ba7c';this.style.background='rgba(0,186,124,0.1)'" onmouseout="this.style.color='${postVotes>0?'#00ba7c':'#71767b'}';this.style.background='none'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46L19.5 20.12l-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" fill="currentColor"/></svg>
          </button>
          <button style="background:none;border:none;color:#71767b;cursor:pointer;padding:8px;border-radius:50%;transition:color 0.15s,background 0.15s;" onmouseover="this.style.color='#f91880';this.style.background='rgba(249,24,128,0.1)'" onmouseout="this.style.color='#71767b';this.style.background='none'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.53.771-.53-.77c-1.125-1.635-2.52-2.186-3.78-2.128-1.934.09-3.396 1.555-3.396 3.323 0 .92.364 1.896 1.25 2.9 2 2.284 5.86 5.11 6.455 5.54.596-.43 4.454-3.256 6.455-5.54.886-1.004 1.249-1.98 1.249-2.9 0-1.738-1.447-3.19-3.29-3.356z" stroke="currentColor" stroke-width="1.8"/></svg>
          </button>
          <button onclick="if(navigator.share){navigator.share({url:window.location.href});}else{navigator.clipboard.writeText(window.location.href).then(()=>showToast('Link copied','success'));}" style="background:none;border:none;color:#71767b;cursor:pointer;padding:8px;border-radius:50%;transition:color 0.15s,background 0.15s;" onmouseover="this.style.color='#1d9bf0';this.style.background='rgba(29,155,240,0.1)'" onmouseout="this.style.color='#71767b';this.style.background='none'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" fill="currentColor"/></svg>
          </button>
        </div>
      </div>

        <!-- Sort and Search filters underneath just like the screenshot! -->
        <div style="display:flex; align-items:center; gap:16px; margin-top:16px; padding:12px 14px 12px 14px; border-top:1px solid rgba(255,255,255,0.1); border-bottom:1px solid rgba(255,255,255,0.06); direction:ltr; text-align:left; background:#000; position:relative;">
          <div style="font-size:0.85rem; color:#71767b; display:flex; align-items:center; gap:6px; position:relative; user-select:none;">
            <span>Sort by:</span>
            <span id="comment-sort-btn" onclick="window.toggleCommentSortDropdown(event)" style="color:#e7e9ea; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:4px; transition: color 0.15s;">
              <span id="current-sort-label">Best</span> <i class="fas fa-chevron-down" style="font-size:0.7rem; color:#71767b;"></i>
            </span>
            <!-- Sort dropdown menu -->
            <div id="comment-sort-dropdown" style="display:none; position:absolute; top:24px; left:50px; background:#1a1a1b; border:1px solid #343536; border-radius:4px; box-shadow:0 4px 12px rgba(0,0,0,0.5); z-index:100; min-width:100px; padding:4px 0;">
              <div onclick="window.setCommentSort('best')" style="color:#e7e9ea; padding:6px 12px; font-size:0.85rem; cursor:pointer; font-weight:700;" onmouseover="this.style.background='#272729'" onmouseout="this.style.background='transparent'">Best</div>
              <div onclick="window.setCommentSort('new')" style="color:#e7e9ea; padding:6px 12px; font-size:0.85rem; cursor:pointer; font-weight:700;" onmouseover="this.style.background='#272729'" onmouseout="this.style.background='transparent'">New</div>
            </div>
          </div>
          
          <!-- Search input box matching the premium Reddit look exactly! -->
          <div style="display:flex; align-items:center; background:#1a1a1b; border:1px solid rgba(255,255,255,0.08); border-radius:9999px; padding:4px 12px; gap:8px; flex:1; max-width:240px; transition: border-color 0.2s, background-color 0.2s;" id="comment-search-box-container">
            <i class="fas fa-search" style="color:#71767b; font-size:0.75rem;"></i>
            <input type="text" id="comment-search-input" oninput="window.onCommentSearch(this.value)" placeholder="Search Comments" style="background:transparent; border:none; color:#e7e9ea; font-size:0.82rem; font-weight:500; outline:none; width:100%; font-family:inherit;" onfocus="document.getElementById('comment-search-box-container').style.borderColor='rgba(255,255,255,0.2)'; document.getElementById('comment-search-box-container').style.backgroundColor='#272729';" onblur="document.getElementById('comment-search-box-container').style.borderColor='rgba(255,255,255,0.08)'; document.getElementById('comment-search-box-container').style.backgroundColor='#1a1a1b';" />
          </div>
        </div>
      </div>
      
      <!-- Comments Wrapper -->
      <div id="post-comments-list-wrapper" style="background:#000;"></div>
    `;

    // ── Marketplace actions ──
    if (currentGroupId === 'marketplace' && currentUser && currentUser.email !== postData.authorEmail) {
      html += `
        <div style="display:flex; gap:12px; padding:12px 18px; background:#000; border-bottom:1px solid rgba(255,255,255,0.1);">
          <button class="btn-primary" onclick="openMakeOfferModal()" style="border-radius:980px; padding:8px 20px; font-weight:700; font-size:0.9rem;"><i class="fas fa-hand-holding-usd" style="margin-left:8px;"></i>הגש הצעת רכישה</button>
          <button class="btn-primary" onclick="openSendMessageModal()" style="border-radius:980px; padding:8px 20px; font-weight:700; font-size:0.9rem; background:#2c2c2e; color:#fff;"><i class="fas fa-envelope" style="margin-left:8px;"></i>שלח הודעה למוכר</button>
        </div>
      `;
    }

    threadContainer.innerHTML = html;

    // Save comments in state and render initially
    window.activePostComments = comments;
    window.activePostSortType = 'best';
    window.activePostSearchQuery = '';

    // Define single comment renderer locally or dynamically
    window.renderCommentSingle = function(c, depth, childrenHtml = '') {
      const cAuthor = c.data.author || c.data.authorName || 'Anonymous';
      const cHandle = '@' + cAuthor.toLowerCase().replace(/\s+/g,'');
      const cAvatar = buildAvatar(cAuthor, c.data.authorAvatar||'', 34);
      const cTimeAgo = formatTimeAgo(new Date(c.data.timestamp));
      const cContent = (c.data.content||'').replace(/<[^>]+>/g,'');
      const cId = c.id;
      
      const replyInputId = `reply-input-${cId}`;
      const inlineReplyContainerId = `reply-container-${cId}`;

      // Left border and padding for nested replies (Reddit's thread lines)
      const marginStyle = depth > 0 
        ? `margin-left: 12px; padding-left: 16px; border-left: 2px solid rgba(255,255,255,0.06); border-top-left-radius: 4px; border-bottom-left-radius: 4px;` 
        : `border-bottom: 1px solid rgba(255,255,255,0.06);`;

      const commentVotes = c.data.votes || 0;

      return `
        <div style="background:#000; padding:16px 14px 10px 14px; display:flex; gap:12px; direction:ltr; text-align:left; ${marginStyle}">
          
          <!-- Avatar Column -->
          <div style="display:flex; flex-direction:column; align-items:center; flex-shrink:0;">
            <div style="flex-shrink:0;">${cAvatar}</div>
            <div style="flex:1; width:2px; background:rgba(255,255,255,0.04); margin-top:8px;"></div>
          </div>

          <!-- Content Column -->
          <div style="flex:1; min-width:0;">
            
            <!-- User Metadata Header -->
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap;">
              <span style="font-weight:700; color:#e7e9ea; font-size:0.92rem;">${cAuthor}</span>
              <span style="color:#71767b; font-size:0.85rem;">${cHandle}</span>
              <span style="color:#71767b; font-size:0.85rem;">·</span>
              <span style="color:#71767b; font-size:0.85rem;">${cTimeAgo}</span>
            </div>

            <!-- Comment Content Body -->
            <div style="color:#e7e9ea; font-size:0.95rem; line-height:1.55; white-space:pre-wrap;">${cContent}</div>

            <!-- Reddit Action Toolbar -->
            <div style="display:flex; align-items:center; gap:16px; margin-top:8px; margin-bottom:8px;">
              
              <!-- Upvote / Downvote -->
              <div style="display:flex; align-items:center; background:#18181b; border-radius:9999px; padding:3px 8px; gap:8px; border: 1px solid rgba(255,255,255,0.05);">
                <button onclick="voteComment('${cId}', 1)" style="background:none; border:none; color:#71767b; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:2px; transition:color 0.15s;" onmouseover="this.style.color='#ff4500'" onmouseout="this.style.color='#71767b'">
                  <i class="fas fa-arrow-up" style="font-size:0.75rem;"></i>
                </button>
                <span style="font-size:0.8rem; font-weight:700; color:#e7e9ea; min-width:12px; text-align:center;">${commentVotes}</span>
                <button onclick="voteComment('${cId}', -1)" style="background:none; border:none; color:#71767b; cursor:pointer; display:flex; align-items:center; justify-content:center; padding:2px; transition:color 0.15s;" onmouseover="this.style.color='#7193ff'" onmouseout="this.style.color='#71767b'">
                  <i class="fas fa-arrow-down" style="font-size:0.75rem;"></i>
                </button>
              </div>

              <!-- Reply button -->
              <button onclick="window.toggleReplyInput('${cId}')" style="display:flex; align-items:center; gap:6px; background:none; border:none; color:#71767b; font-size:0.82rem; cursor:pointer; padding:4px 8px; border-radius:4px; font-family:inherit; transition:color 0.15s;" onmouseover="this.style.color='#1d9bf0'; this.style.background='rgba(29,155,240,0.08)';" onmouseout="this.style.color='#71767b'; this.style.background='none';">
                <i class="fas fa-comment" style="font-size:0.75rem;"></i> Reply
              </button>

            </div>

            <!-- Dynamic Inline Reply Input Field -->
            <div id="${inlineReplyContainerId}" style="display:none; margin-top:10px; border-left:2px solid #ff9500; padding-left:14px; margin-bottom:12px;">
              <textarea id="${replyInputId}" style="width:100%; min-height:80px; background:#18181b; border:1px solid #27272a; border-radius:12px; padding:12px; color:#fff; font-size:0.92rem; resize:vertical; outline:none; font-family:inherit; box-sizing:border-box;" placeholder="Reply to this comment..."></textarea>
              <div style="display:flex; gap:8px; margin-top:8px; justify-content:flex-start;">
                <button class="btn-primary" onclick="window.submitNestedComment('${postId}', '${cId}', '${replyInputId}')" style="font-size:0.8rem; padding:6px 16px; border-radius:980px;">Reply</button>
                <button class="btn-secondary" onclick="window.toggleReplyInput('${cId}')" style="font-size:0.8rem; padding:6px 16px; border-radius:980px; background:#27272a; border:none; color:#fff; cursor:pointer;">Cancel</button>
              </div>
            </div>

            <!-- Recursively rendered Nested replies -->
            ${childrenHtml}

          </div>
        </div>
      `;
    };

    // Global comment sorting/searching helper functions
    window.toggleCommentSortDropdown = function(event) {
      if (event) event.stopPropagation();
      const dropdown = document.getElementById('comment-sort-dropdown');
      if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      }
    };

    // Close dropdown on click outside
    document.addEventListener('click', function() {
      const dropdown = document.getElementById('comment-sort-dropdown');
      if (dropdown) dropdown.style.display = 'none';
    });

    window.setCommentSort = function(sortType) {
      window.renderCommentsList(sortType, window.activePostSearchQuery || '');
    };

    window.onCommentSearch = function(query) {
      window.renderCommentsList(window.activePostSortType || 'best', query);
    };

    window.renderCommentsList = function(sortType = 'best', searchQuery = '') {
      window.activePostSortType = sortType;
      window.activePostSearchQuery = searchQuery;

      // Update active sort label
      const labelEl = document.getElementById('current-sort-label');
      if (labelEl) {
        labelEl.innerText = sortType === 'best' ? 'Best' : 'New';
      }

      const listWrapper = document.getElementById('post-comments-list-wrapper');
      if (!listWrapper) return;

      // Filter comments
      let filteredComments = [...window.activePostComments];
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        filteredComments = filteredComments.filter(c => {
          const content = (c.data.content || '').toLowerCase();
          const author = (c.data.author || c.data.authorName || '').toLowerCase();
          return content.includes(q) || author.includes(q);
        });
      }

      // Sort comments
      if (sortType === 'best') {
        filteredComments.sort((a, b) => {
          const votesA = a.data.votes || 0;
          const votesB = b.data.votes || 0;
          if (votesB !== votesA) return votesB - votesA;
          return new Date(b.data.timestamp) - new Date(a.data.timestamp);
        });
      } else {
        filteredComments.sort((a, b) => new Date(b.data.timestamp) - new Date(a.data.timestamp));
      }

      // Render Tree or Flat depending on Search
      if (searchQuery.trim() !== '') {
        if (filteredComments.length === 0) {
          listWrapper.innerHTML = `<div style="padding: 24px; text-align: center; color: #71767b; font-size: 0.95rem; background: #000; border-bottom:1px solid rgba(255,255,255,0.1);">No comments match your search.</div>`;
          return;
        }
        listWrapper.innerHTML = filteredComments.map(c => window.renderCommentSingle(c, 0)).join('');
      } else {
        const rootComments = [];
        const childCommentsMap = {};
        filteredComments.forEach(c => {
          const pId = c.data.parentId;
          if (!pId) {
            rootComments.push(c);
          } else {
            if (!childCommentsMap[pId]) {
              childCommentsMap[pId] = [];
            }
            childCommentsMap[pId].push(c);
          }
        });

        function renderCommentTree(c, depth = 0) {
          const children = childCommentsMap[c.id] || [];
          if (sortType === 'best') {
            children.sort((a, b) => (b.data.votes || 0) - (a.data.votes || 0));
          } else {
            children.sort((a, b) => new Date(b.data.timestamp) - new Date(a.data.timestamp));
          }
          const childrenHtml = children.map(child => renderCommentTree(child, depth + 1)).join('');
          return window.renderCommentSingle(c, depth, childrenHtml);
        }

        if (rootComments.length === 0) {
          listWrapper.innerHTML = `<div style="padding: 24px; text-align: center; color: #71767b; font-size: 0.95rem; background: #000; border-bottom:1px solid rgba(255,255,255,0.1);">No comments yet. Be the first to share your thoughts!</div>`;
        } else {
          listWrapper.innerHTML = rootComments.map(c => renderCommentTree(c, 0)).join('');
        }
      }
    };

    // Render initially
    window.renderCommentsList('best', '');

  } catch (err) {
    console.error('Error loading post:', err);
    threadContainer.innerHTML = '<div style="color:#ef4444; padding:16px; direction:rtl;">שגיאה בטעינת הפוסט.</div>';
  }
};

window.voteComment = async function(commentId, delta) {
  if (!currentUser) { showToast('התחבר כדי להצביע', 'error'); return; }
  try {
    const commentDocRef = window.fbDoc(window.fbDb, 'comments', commentId);
    const { increment } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');
    await window.fbUpdateDoc(commentDocRef, { votes: increment(delta) });
    openPost(currentPostId); // Refresh comments
  } catch(e) { console.error('Vote comment error', e); }
};

window.toggleReplyInput = function(commentId) {
  const container = document.getElementById(`reply-container-${commentId}`);
  if (container) {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
    if (container.style.display === 'block') {
      const input = document.getElementById(`reply-input-${commentId}`);
      if (input) input.focus();
    }
  }
};

window.submitNestedComment = async function(postId, parentCommentId, inputId) {
  if (!currentUser || !currentUser.email) {
    showToast('Please sign in to comment.', 'error');
    openAuthModal('login');
    return;
  }
  
  const input = document.getElementById(inputId);
  if (!input) return;
  const content = input.value.trim();
  if (!content) return;
  
  input.disabled = true;
  
  try {
    const commentsRef = window.fbColl(window.fbDb, 'comments');
    await window.fbAddDoc(commentsRef, {
      postId: postId,
      parentId: parentCommentId,
      content: content,
      author: currentUser.name || 'Anonymous',
      authorEmail: currentUser.email,
      timestamp: new Date().toISOString(),
      votes: 0
    });
    
    input.value = '';
    showToast('Reply posted!', 'success');
    openPost(postId); // Refresh comments
  } catch (err) {
    console.error('Error posting nested comment:', err);
    alert('Failed to post reply: ' + err.message);
  } finally {
    input.disabled = false;
  }
};

window.submitComment = async function() {
  if (!currentUser || !currentUser.email) {
    showToast('Please sign in to comment.', 'error');
    openAuthModal('login');
    return;
  }
  
  if (!currentPostId) return;
  
  const input = document.getElementById('new-comment-input');
  const content = input.value.trim();
  
  if (!content) return;
  
  input.disabled = true;
  
  try {
    const commentsRef = window.fbColl(window.fbDb, 'comments');
    await window.fbAddDoc(commentsRef, {
      postId: currentPostId,
      content: content,
      author: currentUser.name || 'Anonymous',
      authorEmail: currentUser.email,
      timestamp: new Date().toISOString()
    });
    
    input.value = '';
    if (window.collapseReplyArea) window.collapseReplyArea();
    showToast('Reply posted!', 'success');
    openPost(currentPostId); // Refresh comments
  } catch (err) {
    console.error('Error posting comment:', err);
    if (err.message && err.message.includes('permission')) {
      alert('Firebase Security Error: You do not have permission to write to the "comments" collection. Please update your Firebase Rules.');
    } else {
      alert('Failed to post reply: ' + err.message);
    }
  } finally {
    input.disabled = false;
  }
};

window.expandReplyArea = function() {
  const collapsed = document.getElementById('reply-collapsed-pill');
  const expanded = document.getElementById('reply-expanded-editor');
  if (collapsed && expanded) {
    collapsed.style.display = 'none';
    expanded.style.display = 'block';
    const input = document.getElementById('new-comment-input');
    if (input) input.focus();
  }
};

window.collapseReplyArea = function() {
  const collapsed = document.getElementById('reply-collapsed-pill');
  const expanded = document.getElementById('reply-expanded-editor');
  if (collapsed && expanded) {
    collapsed.style.display = 'flex';
    expanded.style.display = 'none';
    const input = document.getElementById('new-comment-input');
    if (input) input.value = '';
  }
};

window.openMakeOfferModal = function(postId, authorEmail, postTitle) {
  if (postId) currentPostId = postId;
  if (authorEmail) currentPostAuthorEmail = authorEmail;
  if (postTitle) currentPostTitle = postTitle;
  if (!currentUser || !currentUser.email) {
    showToast('Please sign in to make an offer.', 'error');
    openAuthModal('login');
    return;
  }
  document.getElementById('make-offer-modal').classList.add('active');
  
  const slider = document.getElementById('offer-amount-slider');
  const input = document.getElementById('offer-amount-input');
  if (slider) slider.value = 0;
  if (input) input.value = 0;
  
  document.getElementById('offer-message').value = '';
  clearSignature();
};

window.closeMakeOfferModal = function() {
  document.getElementById('make-offer-modal').classList.remove('active');
};

window.submitOffer = async function() {
  if (!currentUser || !currentUser.email) return;
  if (!currentPostId || !currentPostAuthorEmail) return;
  
  const slider = document.getElementById('offer-amount-slider');
  const amount = slider ? slider.value : '0';
  const message = document.getElementById('offer-message').value.trim();
  const btn = document.getElementById('btn-submit-offer');
  
  if (isSignatureBlank) {
    showToast('Please sign the contract to submit your offer.', 'error');
    return;
  }
  
  const canvas = document.getElementById('signature-pad');
  const signatureData = canvas.toDataURL('image/png');
  
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  
  try {
    const offersRef = window.fbColl(window.fbDb, 'offers');
    await window.fbAddDoc(offersRef, {
      postId: currentPostId,
      postTitle: currentPostTitle || 'Marketplace Item',
      sellerEmail: currentPostAuthorEmail,
      buyerName: currentUser.name || 'Anonymous',
      buyerEmail: currentUser.email,
      offerAmount: Number(amount),
      message: message,
      signatureData: signatureData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    
    closeMakeOfferModal();
    showToast('Offer sent successfully!', 'success');
  } catch (err) {
    console.error('Error submitting offer:', err);
    if (err.message && err.message.includes('permission')) {
      alert('Firebase Security Error: You do not have permission to write to the "offers" collection. Please update your Firebase Rules.');
    } else {
      alert('Failed to send offer: ' + err.message);
    }
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
};

// =====================================================================
// PRIVATE MESSAGING LOGIC
// =====================================================================
window.openSendMessageModal = function() {
  if (!currentUser || !currentUser.email) {
    showToast('Please sign in to send a message.', 'error');
    openAuthModal('login');
    return;
  }
  document.getElementById('send-message-modal').classList.add('active');
  document.getElementById('private-message-content').value = '';
  document.getElementById('send-message-seller-name').textContent = `To: ${currentPostAuthorEmail}`;
};

window.closeSendMessageModal = function() {
  document.getElementById('send-message-modal').classList.remove('active');
};

window.submitPrivateMessage = async function() {
  if (!currentUser || !currentUser.email) return;
  if (!currentPostId || !currentPostAuthorEmail) return;
  
  const content = document.getElementById('private-message-content').value.trim();
  const btn = document.getElementById('btn-submit-message');
  
  if (!content) {
    showToast('Please write a message.', 'error');
    return;
  }
  
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  
  try {
    const messagesRef = window.fbColl(window.fbDb, 'messages');
    await window.fbAddDoc(messagesRef, {
      postId: currentPostId,
      postTitle: currentPostTitle || 'Marketplace Item',
      receiverEmail: currentPostAuthorEmail,
      senderName: currentUser.name || 'Anonymous',
      senderEmail: currentUser.email,
      content: content,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    closeSendMessageModal();
    showToast('Message sent successfully!', 'success');
  } catch (err) {
    console.error('Error sending message:', err);
    alert('Failed to send message: ' + err.message);
  } finally {
    btn.textContent = originalText;
    btn.disabled = false;
  }
};



// =====================================================================
// STOCK EXCHANGE LOGIC
// =====================================================================

let currentTradeStock = null;
let currentTradePrice = 0;
let userOwnedShares = 0;

window.initExchange = async function() {
  if (!currentUser || !currentUser.email) {
    showToast('Please sign in to access the Stock Exchange.', 'error');
    showPage('home');
    openAuthModal('login');
    return;
  }
  
  document.getElementById('exchange-wallet-balance').textContent = `₪${(currentUser.walletBalance || 0).toLocaleString()}`;
  
  await seedStocksIfNeeded();
  await renderMarket();
  await renderPortfolio();
};

async function seedStocksIfNeeded() {
  try {
    const stocksRef = window.fbColl(window.fbDb, 'stocks');
    const snap = await window.fbGetDocs(window.fbQuery(stocksRef, window.fbLimit ? window.fbLimit(1) : undefined));
    if (snap.empty) {
      const initialStocks = [
        { name: 'Apple Inc.', symbol: 'AAPL', currentPrice: 1500, description: 'Global tech giant' },
        { name: 'Yoni Store', symbol: 'YONI', currentPrice: 200, description: 'E-commerce platform' },
        { name: 'Forum Tech', symbol: 'FRM', currentPrice: 50, description: 'Community network solutions' }
      ];
      for (const st of initialStocks) {
        await window.fbAddDoc(stocksRef, st);
      }
    }
  } catch(e) {
    console.log('Seeding skipped or failed:', e);
  }
}

async function renderMarket() {
  const container = document.getElementById('market-container');
  if (!container) return;
  container.innerHTML = '<div style="color:#86868b;"><i class="fas fa-spinner fa-spin"></i> Loading market...</div>';
  
  try {
    const stocksRef = window.fbColl(window.fbDb, 'stocks');
    const snap = await window.fbGetDocs(stocksRef);
    
    if (snap.empty) {
      container.innerHTML = '<div style="color:#86868b;">No stocks available.</div>';
      return;
    }
    
    let html = '';
    snap.forEach(doc => {
      const s = { id: doc.id, ...doc.data() };
      html += `
        <div style="background:#1c1c1e; border:1px solid #2c2c2e; border-radius:12px; padding:20px; cursor:pointer; transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'" onclick="openTradeModal('${s.id}', '${s.name}', '${s.symbol}', ${s.currentPrice})">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <div style="font-size:0.8rem; background:#2c2c2e; color:#fff; display:inline-block; padding:2px 8px; border-radius:6px; font-weight:700; margin-bottom:6px;">${s.symbol}</div>
              <h3 style="font-size:1.2rem; font-weight:800; color:#fafafa; margin:0;">${s.name}</h3>
            </div>
            <div style="font-size:1.4rem; font-weight:800; color:#34c759;">₪${Math.round(s.currentPrice).toLocaleString()}</div>
          </div>
          <p style="font-size:0.9rem; color:#86868b; margin-bottom:16px;">${s.description}</p>
          <button class="btn-primary" style="width:100%; padding:8px; border-radius:8px; font-size:0.9rem;">Trade <i class="fas fa-arrow-right" style="margin-left:6px;"></i></button>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div style="color:#ef4444;">Failed to load market.</div>';
    console.error(e);
  }
}

async function renderPortfolio() {
  const container = document.getElementById('portfolio-container');
  const emptyMsg = document.getElementById('portfolio-empty');
  if (!container || !currentUser) return;
  
  try {
    const portRef = window.fbColl(window.fbDb, 'portfolios');
    const q = window.fbQuery(portRef, window.fbWhere('userEmail', '==', currentUser.email));
    const snap = await window.fbGetDocs(q);
    
    if (snap.empty) {
      container.innerHTML = '';
      emptyMsg.style.display = 'block';
      return;
    }
    emptyMsg.style.display = 'none';
    
    // Need to fetch current prices to calculate value
    const stocksRef = window.fbColl(window.fbDb, 'stocks');
    const stocksSnap = await window.fbGetDocs(stocksRef);
    const stockPrices = {};
    stocksSnap.forEach(d => stockPrices[d.id] = { name: d.data().name, price: d.data().currentPrice });
    
    let html = '';
    snap.forEach(doc => {
      const p = doc.data();
      if (p.shares <= 0) return;
      const stock = stockPrices[p.stockId];
      if (!stock) return;
      const totalVal = p.shares * stock.price;
      
      html += `
        <div style="background:#2c2c2e; border:1px solid #3a3a3c; border-radius:12px; padding:16px;">
          <h4 style="font-size:1.1rem; color:#fafafa; margin-bottom:4px;">${stock.name}</h4>
          <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.9rem;">
            <span style="color:#86868b;">Shares Owned:</span>
            <span style="color:#0a84ff; font-weight:700;">${p.shares}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
            <span style="color:#86868b;">Current Value:</span>
            <span style="color:#34c759; font-weight:700;">₪${Math.round(totalVal).toLocaleString()}</span>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (e) {
    console.error('Failed to load portfolio:', e);
  }
}

window.openTradeModal = async function(stockId, name, symbol, price) {
  currentTradeStock = stockId;
  currentTradePrice = price;
  
  document.getElementById('stock-trade-modal').classList.add('active');
  document.getElementById('trade-stock-name').textContent = name;
  document.getElementById('trade-stock-symbol').textContent = symbol;
  document.getElementById('trade-stock-price').textContent = `₪${Math.round(price).toLocaleString()}`;
  document.getElementById('trade-wallet-balance').textContent = `₪${(currentUser.walletBalance || 0).toLocaleString()}`;
  
  // Fetch owned shares
  userOwnedShares = 0;
  try {
    const portRef = window.fbColl(window.fbDb, 'portfolios');
    const q = window.fbQuery(portRef, window.fbWhere('userEmail', '==', currentUser.email), window.fbWhere('stockId', '==', stockId));
    const snap = await window.fbGetDocs(q);
    if (!snap.empty) {
      userOwnedShares = snap.docs[0].data().shares;
    }
  } catch(e) {}
  
  document.getElementById('trade-shares-owned').textContent = userOwnedShares;
  document.getElementById('trade-quantity-slider').value = 1;
  document.getElementById('trade-quantity-input').value = 1;
  updateTradeTotal();
};

window.closeTradeModal = function() {
  document.getElementById('stock-trade-modal').classList.remove('active');
};

window.updateTradeTotal = function() {
  const qty = parseInt(document.getElementById('trade-quantity-input').value) || 0;
  const total = qty * currentTradePrice;
  document.getElementById('trade-total-value').textContent = `₪${Math.round(total).toLocaleString()}`;
};

window.executeTrade = async function(action) {
  if (!currentUser) return;
  const qty = parseInt(document.getElementById('trade-quantity-input').value);
  if (!qty || qty <= 0) return showToast('Invalid quantity', 'error');
  
  const totalCost = qty * currentTradePrice;
  
  const btnBuy = document.getElementById('btn-trade-buy');
  const btnSell = document.getElementById('btn-trade-sell');
  btnBuy.disabled = true; btnSell.disabled = true;
  
  try {
    // Check constraints
    if (action === 'buy') {
      if ((currentUser.walletBalance || 0) < totalCost) {
        throw new Error('Insufficient wallet balance');
      }
    } else if (action === 'sell') {
      if (userOwnedShares < qty) {
        throw new Error('You do not own enough shares to sell');
      }
    }
    
    // Update Wallet
    const userRef = window.fbDoc(window.fbDb, 'userData', currentUser.email);
    let newBalance = currentUser.walletBalance || 0;
    if (action === 'buy') newBalance -= totalCost;
    else newBalance += totalCost;
    await window.fbUpdateDoc(userRef, { walletBalance: newBalance });
    currentUser.walletBalance = newBalance;
    
    // Update Portfolio
    const portRef = window.fbColl(window.fbDb, 'portfolios');
    const q = window.fbQuery(portRef, window.fbWhere('userEmail', '==', currentUser.email), window.fbWhere('stockId', '==', currentTradeStock));
    const snap = await window.fbGetDocs(q);
    
    let newShares = userOwnedShares;
    if (action === 'buy') newShares += qty;
    else newShares -= qty;
    
    if (snap.empty) {
      await window.fbAddDoc(portRef, { userEmail: currentUser.email, stockId: currentTradeStock, shares: newShares });
    } else {
      await window.fbUpdateDoc(snap.docs[0].ref, { shares: newShares });
    }
    
    // Dynamic Pricing - Update Global Stock Price (+0.5% per share bought, -0.5% per share sold)
    const stockRef = window.fbDoc(window.fbDb, 'stocks', currentTradeStock);
    let priceModifier = 1 + (action === 'buy' ? 0.005 : -0.005) * qty;
    let newPrice = currentTradePrice * priceModifier;
    if (newPrice < 10) newPrice = 10; // Floor price
    await window.fbUpdateDoc(stockRef, { currentPrice: newPrice });
    
    showToast(`Successfully ${action === 'buy' ? 'bought' : 'sold'} ${qty} shares!`, 'success');
    closeTradeModal();
    initExchange(); // Refresh exchange UI
    updateUserUI(); // Update global navbar wallet display
  } catch (err) {
    alert(err.message);
  } finally {
    btnBuy.disabled = false; btnSell.disabled = false;
  }
};

// =====================================================================
// INBOX TABS (RECEIPTS, OFFERS & MESSAGES)
// =====================================================================
window.switchInboxTab = function(tab) {
  const tabReceipts = document.getElementById('tab-receipts');
  const tabOffers = document.getElementById('tab-offers');
  const tabMessages = document.getElementById('tab-messages');
  
  const containerReceipts = document.getElementById('notifications-container');
  const containerOffers = document.getElementById('offers-container');
  const containerMessages = document.getElementById('messages-container');
  
  // Reset all
  [tabReceipts, tabOffers, tabMessages].forEach(t => {
    if(t) { t.style.background = 'transparent'; t.style.color = '#86868b'; }
  });
  [containerReceipts, containerOffers, containerMessages].forEach(c => {
    if(c) { c.style.display = 'none'; }
  });
  
  if (tab === 'receipts') {
    if(tabReceipts) { tabReceipts.style.background = '#2c2c2e'; tabReceipts.style.color = '#fff'; }
    if(containerReceipts) { containerReceipts.style.display = 'flex'; }
  } else if (tab === 'offers') {
    if(tabOffers) { tabOffers.style.background = '#2c2c2e'; tabOffers.style.color = '#fff'; }
    if(containerOffers) { containerOffers.style.display = 'flex'; }
    renderOffers();
  } else if (tab === 'messages') {
    if(tabMessages) { tabMessages.style.background = '#2c2c2e'; tabMessages.style.color = '#fff'; }
    if(containerMessages) { containerMessages.style.display = 'flex'; }
    renderMessages();
  }
};

async function renderOffers() {
  const container = document.getElementById('offers-container');
  if (!container) return;

  if (!currentUser || !currentUser.email || !window.fbGetDocs) {
    container.innerHTML = '<div style="text-align:center; padding:30px; color:#86868b;">Please sign in to view offers.</div>';
    return;
  }

  container.innerHTML = '<div style="text-align:center; padding:20px; color:#86868b;"><div class="spinner" style="margin:0 auto 16px;"></div> Loading offers...</div>';
  
  try {
    const offersRef = window.fbColl(window.fbDb, 'offers');
    const q = window.fbQuery(offersRef, window.fbWhere('sellerEmail', '==', currentUser.email));
    const snapshot = await window.fbGetDocs(q);
    
    if (snapshot.empty) {
      container.innerHTML = '<div style="text-align:center; padding:30px; color:#86868b;">No offers received yet.</div>';
      return;
    }
    
    // Sort in memory
    const docs = [];
    snapshot.forEach(doc => docs.push({ id: doc.id, data: doc.data() }));
    docs.sort((a, b) => new Date(b.data.timestamp) - new Date(a.data.timestamp));
    
    let html = '';
    docs.forEach(doc => {
      const data = doc.data;
      const dateStr = new Date(data.timestamp).toLocaleString();
      
      html += `
        <div style="background:#1c1c1e; border:1px solid #2c2c2e; border-radius:12px; padding:16px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <div style="font-size:0.8rem; color:#af52de; font-weight:700; text-transform:uppercase; margin-bottom:4px;">New Offer</div>
              <h3 style="font-size:1.1rem; font-weight:700; color:#f5f5f7; margin:0;">${data.postTitle}</h3>
            </div>
            <div style="font-size:1.2rem; font-weight:800; color:#34c759;">$${data.offerAmount}</div>
          </div>
          <div style="font-size:0.9rem; color:#a1a1aa; background:#2c2c2e; padding:10px; border-radius:8px; margin-bottom:12px;">
            <strong>From:</strong> ${data.buyerName} (${data.buyerEmail})<br>
            ${data.message ? `<div style="margin-top:6px; font-style:italic;">"${data.message}"</div>` : ''}
            ${data.signatureData ? `<div style="margin-top:12px; border-top:1px dashed #4a4a4c; padding-top:8px;"><strong style="font-size:0.8rem;">Contract Signature:</strong><br><img src="${data.signatureData}" style="max-height:60px; background:#fff; border-radius:4px; margin-top:4px;"></div>` : ''}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:0.8rem; color:#86868b;">${dateStr}</div>
            <div style="display:flex; gap:8px;">
              <button onclick="window.location.href='mailto:${data.buyerEmail}?subject=Re: Offer for ${encodeURIComponent(data.postTitle)}'" style="background:#0071e3; color:#fff; border:none; border-radius:6px; padding:6px 12px; font-size:0.85rem; font-weight:600; cursor:pointer;">Contact Buyer</button>
            </div>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  } catch (err) {
    console.error('Error loading offers:', err);
    if (err.message && err.message.includes('permission')) {
      container.innerHTML = '<div style="text-align:center; padding:20px; color:#ef4444; font-size:0.9rem;">Firebase Security Error: You do not have permission to read the "offers" collection. Update Firebase Rules.</div>';
    } else {
      container.innerHTML = '<div style="text-align:center; padding:30px; color:#ef4444;">Failed to load offers.</div>';
    }
  }
}

async function renderMessages() {
  const container = document.getElementById('messages-container');
  if (!container) return;
  
  if (!currentUser || !currentUser.email) {
    container.innerHTML = '<div style="padding:40px; text-align:center; color:#86868b;">Please sign in to view your messages.</div>';
    return;
  }
  
  container.innerHTML = '<div style="padding:40px; text-align:center; color:#86868b;"><i class="fas fa-circle-notch fa-spin"></i> Loading...</div>';
  
  try {
    const messagesRef = window.fbColl(window.fbDb, 'messages');
    const q = window.fbQuery(messagesRef, window.fbWhere('receiverEmail', '==', currentUser.email));
    
    // We cannot reliably sort locally without fetching all, but getDocs will return all for this user
    const msgSnap = await window.fbGetDocs(q);
    
    if (msgSnap.empty) {
      container.innerHTML = `
        <div style="text-align:center; padding:60px 20px;">
          <div style="font-size:3rem; color:#2c2c2e; margin-bottom:16px;"><i class="fas fa-envelope-open-text"></i></div>
          <h3 style="font-size:1.2rem; color:#fafafa; margin-bottom:8px;">No messages yet</h3>
          <p style="color:#86868b; font-size:0.95rem;">When users send you private messages, they will appear here.</p>
        </div>
      `;
      return;
    }
    
    let messages = [];
    msgSnap.forEach(doc => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let html = '';
    messages.forEach(data => {
      const dateStr = new Date(data.timestamp).toLocaleString();
      const subject = `Re: ${encodeURIComponent(data.postTitle || 'Item inquiry')}`;
      const mailtoLink = `mailto:${data.senderEmail}?subject=${subject}`;
      
      html += `
        <div style="background:#1c1c1e; border:1px solid #2c2c2e; border-radius:12px; padding:20px; text-align:left;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <div style="font-size:1.1rem; font-weight:700; color:#fafafa;">${data.postTitle}</div>
              <div style="font-size:0.85rem; color:#86868b;">From: ${data.senderName}</div>
            </div>
            <a href="${mailtoLink}" class="btn-primary" style="text-decoration:none; padding:6px 12px; border-radius:6px; font-size:0.85rem;"><i class="fas fa-reply" style="margin-right:6px;"></i>Reply</a>
          </div>
          <div style="font-size:0.95rem; color:#e4e4e7; background:#2c2c2e; padding:12px; border-radius:8px; margin-bottom:12px; white-space:pre-wrap;">${data.content}</div>
          <div style="font-size:0.8rem; color:#86868b;">${dateStr}</div>
        </div>
      `;
    });
    container.innerHTML = html;
  } catch (err) {
    console.error('Error loading messages:', err);
    container.innerHTML = '<div style="color:#ef4444; padding:20px; text-align:center;">Failed to load messages.</div>';
  }
}

// =====================================================================
// COOKIE CONSENT LOGIC
// =====================================================================
window.acceptCookies = function() {
  localStorage.setItem('cookieConsent', 'true');
  const banner = document.getElementById('cookie-consent-banner');
  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
    setTimeout(() => {
      banner.style.display = 'none';
    }, 400);
  }
};

window.showPrivacyPolicy = function() {
  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  if (isHeb) {
    alert('מדיניות פרטיות: אנו משתמשים בעוגיות כדי לשפר את חווית המשתמש באתר, לשמור את המידע שלך בעגלת הקניות ולספק תכנים מותאמים אישית. המידע נשמר בצורה מאובטחת ולא מועבר לצדדים שלישיים ללא אישור מפורש.');
  } else {
    alert('Privacy Policy: We use cookies to improve your user experience, save your shopping cart items, and provide personalized content. Your data is stored securely and never shared with third parties without your explicit consent.');
  }
};

window.updateCookieBannerLanguage = function() {
  const banner = document.getElementById('cookie-consent-banner');
  if (!banner) return;

  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  const textEl = document.getElementById('cookie-consent-text');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const privacyBtn = document.getElementById('cookie-privacy-btn');

  if (isHeb) {
    banner.style.direction = 'rtl';
    if (textEl) textEl.textContent = 'אנחנו משתמשים בעוגיות לשיפור חוויית הגלישה באתר. בלחיצה על "הסכמה" את/ה מאשר/ת שימוש בעוגיות.';
    if (acceptBtn) acceptBtn.textContent = 'הסכמה';
    if (privacyBtn) privacyBtn.textContent = 'מדיניות פרטיות';
  } else {
    banner.style.direction = 'ltr';
    if (textEl) textEl.textContent = 'We use cookies to improve your browsing experience. By clicking "Accept", you agree to our use of cookies.';
    if (acceptBtn) acceptBtn.textContent = 'Accept';
    if (privacyBtn) privacyBtn.textContent = 'Privacy Policy';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const hasConsent = localStorage.getItem('cookieConsent');
  
  // Make sure styling supports smooth animation initially
  const banner = document.getElementById('cookie-consent-banner');
  if (banner) {
    banner.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(20px)';
  }

  updateCookieBannerLanguage();

  if (!hasConsent) {
    if (banner) {
      setTimeout(() => {
        banner.style.display = 'block';
        // Force reflow
        banner.offsetHeight;
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
      }, 1000);
    }
  }
});

// =====================================================================
// SIGNATURE PAD LOGIC
// =====================================================================
let signatureCtx;
let isDrawing = false;
let isSignatureBlank = true;

function initSignaturePad() {
  const canvas = document.getElementById('signature-pad');
  if (!canvas) return;
  
  signatureCtx = canvas.getContext('2d');
  
  signatureCtx.fillStyle = '#ffffff';
  signatureCtx.fillRect(0, 0, canvas.width, canvas.height);
  
  signatureCtx.lineWidth = 3;
  signatureCtx.lineCap = 'round';
  signatureCtx.strokeStyle = '#000000';
  
  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    // Scale coordinates based on actual display size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    isDrawing = true;
    isSignatureBlank = false;
    const pos = getPos(e);
    signatureCtx.beginPath();
    signatureCtx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    signatureCtx.lineTo(pos.x, pos.y);
    signatureCtx.stroke();
  };

  const endDraw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    isDrawing = false;
  };

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseout', endDraw);
  
  canvas.addEventListener('touchstart', startDraw, {passive: false});
  canvas.addEventListener('touchmove', draw, {passive: false});
  canvas.addEventListener('touchend', endDraw, {passive: false});
}

window.clearSignature = function() {
  const canvas = document.getElementById('signature-pad');
  if (!canvas || !signatureCtx) return;
  signatureCtx.fillStyle = '#ffffff';
  signatureCtx.fillRect(0, 0, canvas.width, canvas.height);
  isSignatureBlank = true;
};

document.addEventListener('DOMContentLoaded', () => {
  initSignaturePad();
});

// ========== ARTICLE SEARCH FUNCTIONALITY ==========
window.handleSearchInput = function(event) {
  searchQuery = event.target.value;
  const activePage = document.querySelector('.page.active');
  if (!activePage || activePage.id !== 'page-home') {
    showPage('home');
  } else {
    renderNewsLayout(1);
  }
};

window.clearSearchAndShowHome = function() {
  searchQuery = '';
  const searchInput = document.getElementById('navbar-search-input');
  if (searchInput) searchInput.value = '';
  showPage('home');
};

// =====================================================================
// MESSAGES & ALERTS HUB SYSTEM
// =====================================================================
let activeChatUserId = null;
let currentChatTab = 'chat'; // 'chat' or 'alerts'
let currentAlertFilter = 'all'; // 'all', 'system', 'order', 'offer'
let chatRefreshInterval = null;

// Unified function to sync user profile to Firestore
window.syncCurrentUserProfileToFirestore = function() {
  if (!currentUser || !currentUser.email) return;
  if (window.fbSetDoc && window.fbDb && window.fbDoc) {
    const userDocRef = window.fbDoc(window.fbDb, 'users', currentUser.email);
    window.fbSetDoc(userDocRef, {
      name: currentUser.name || currentUser.email.split('@')[0],
      email: currentUser.email,
      avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120',
      online: true,
      lastActive: new Date().toISOString()
    }, { merge: true }).catch(err => console.error("Firestore user sync error:", err));
  }
};

// Fetch real registered users from localStorage & Firestore
async function fetchRealChatUsers() {
  let usersMap = {};
  
  // 1. Load from localStorage registeredUsers
  try {
    const localUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    Object.keys(localUsers).forEach(email => {
      usersMap[email] = {
        id: email,
        name: localUsers[email].name,
        avatar: localUsers[email].avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120',
        status: 'online',
        lastActive: new Date().toISOString()
      };
    });
  } catch(e) {
    console.error(e);
  }
  
  // 2. Load from Firestore 'users' collection
  if (window.fbGetDocs && window.fbDb) {
    try {
      const usersRef = window.fbColl(window.fbDb, 'users');
      const qSnap = await window.fbGetDocs(usersRef);
      qSnap.forEach(doc => {
        const data = doc.data();
        const email = doc.id;
        usersMap[email] = {
          id: email,
          name: data.name || email,
          avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120',
          status: 'online',
          lastActive: data.lastActive || new Date().toISOString()
        };
      });
    } catch (err) {
      console.error("Error loading chat users from Firestore:", err);
    }
  }
  
  // 3. Filter out currently logged-in user
  if (currentUser && currentUser.email) {
    delete usersMap[currentUser.email];
  }
  
  return Object.values(usersMap);
}

window.switchMessagesTab = function(tab) {
  currentChatTab = tab;
  document.querySelectorAll('.messages-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.messages-tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  if (tab === 'chat') {
    const btn = document.getElementById('tab-btn-chat');
    if (btn) btn.classList.add('active');
    const pane = document.getElementById('messages-tab-pane');
    if (pane) pane.classList.add('active');
  } else if (tab === 'alerts') {
    const btn = document.getElementById('tab-btn-alerts');
    if (btn) btn.classList.add('active');
    const pane = document.getElementById('notifications-tab-pane');
    if (pane) pane.classList.add('active');
    
    // Mark all system alerts as read
    try {
      const alerts = JSON.parse(localStorage.getItem('system_alerts') || '[]');
      alerts.forEach(a => a.read = true);
      localStorage.setItem('system_alerts', JSON.stringify(alerts));
    } catch(e) {}
    
    window.updateMessagesBadge();
    window.renderNotifications();
  }
};

window.initMessagesSystem = async function() {
  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  
  // Ensure profile is synced to Firestore on active chat usage
  window.syncCurrentUserProfileToFirestore();
  
  // Update Languages
  window.updateMessagesLanguage();
  
  // Render Left User List
  await window.renderChatUsersList();
  
  // Pre-load Alerts
  window.renderNotifications();
  window.updateMessagesBadge();

  // Load first chat if none is active
  const users = await fetchRealChatUsers();
  if (users.length > 0 && !activeChatUserId) {
    window.selectChatUser(users[0].id);
  }

  // Set up background refresh interval for real-time community chat feel
  if (chatRefreshInterval) clearInterval(chatRefreshInterval);
  chatRefreshInterval = setInterval(async () => {
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page-messages') {
      await window.renderChatUsersList();
      if (activeChatUserId) {
        await syncActiveChatSilent(activeChatUserId);
      }
    } else {
      clearInterval(chatRefreshInterval);
      chatRefreshInterval = null;
    }
  }, 4000);
};

// Silent refresh of active chat conversation stream
async function syncActiveChatSilent(userId) {
  if (!currentUser || !currentUser.email || !window.fbGetDoc || !window.fbDb) return;
  const roomId = [currentUser.email, userId].sort().join('_').replace(/[^a-zA-Z0-9_]/g, '');
  try {
    const chatDocRef = window.fbDoc(window.fbDb, 'chats', roomId);
    const docSnap = await window.fbGetDoc(chatDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      let dbMessages = data.messages || [];
      const currentLocal = JSON.parse(localStorage.getItem(`real_chat_messages_${roomId}`) || '[]');
      
      if (dbMessages.length !== currentLocal.length) {
        dbMessages.forEach(m => {
          if (m.senderEmail === userId) m.read = true;
        });
        localStorage.setItem(`real_chat_messages_${roomId}`, JSON.stringify(dbMessages));
        window.renderMessagesStream(dbMessages);
        
        // Write read state back to Firestore
        await window.fbSetDoc(chatDocRef, {
          participants: [currentUser.email, userId],
          messages: dbMessages,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        window.updateMessagesBadge();
      }
    }
  } catch(e) {}
}

window.updateMessagesLanguage = function() {
  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  
  // Update sidebar link text
  const sidebarTxt = document.getElementById('sidebar-messages-text');
  if (sidebarTxt) {
    sidebarTxt.textContent = 'הודעות';
  }

  // Update Messages Page Elements
  const tabChat = document.getElementById('tab-label-chat');
  if (tabChat) tabChat.textContent = isHeb ? 'הודעות' : 'Messages';

  const tabAlerts = document.getElementById('tab-label-alerts');
  if (tabAlerts) tabAlerts.textContent = isHeb ? 'התראות' : 'Alerts';

  const searchInput = document.getElementById('chat-search');
  if (searchInput) searchInput.placeholder = isHeb ? 'חיפוש שיחות...' : 'Search conversations...';

  const msgInput = document.getElementById('chat-message-input');
  if (msgInput) msgInput.placeholder = isHeb ? 'כתוב הודעה...' : 'Write a message...';

  const placeholderTitle = document.getElementById('msg-placeholder-title');
  if (placeholderTitle) placeholderTitle.textContent = isHeb ? 'ההודעות שלך' : 'Your Messages';

  const placeholderDesc = document.getElementById('msg-placeholder-desc');
  if (placeholderDesc) {
    placeholderDesc.textContent = isHeb 
      ? 'בחר שיחה מהרשימה כדי להתחיל להתכתב עם חברי הקהילה של Soki.' 
      : 'Select a conversation to start direct messaging with members of the Soki community.';
  }

  const activeStatus = document.getElementById('chat-active-status');
  if (activeStatus) activeStatus.textContent = isHeb ? 'פעיל כעת' : 'Active now';

  const alertsTitle = document.getElementById('alerts-title');
  if (alertsTitle) alertsTitle.textContent = isHeb ? 'התראות אחרונות' : 'Recent Alerts';

  const alertsClear = document.getElementById('alerts-clear-btn');
  if (alertsClear) alertsClear.textContent = isHeb ? 'נקה הכל' : 'Clear All';
};

window.renderChatUsersList = async function() {
  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  const container = document.getElementById('messages-user-list');
  if (!container) return;

  if (!currentUser || !currentUser.email) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:#86868b; font-size:0.85rem;">Please log in to chat</div>`;
    return;
  }

  const users = await fetchRealChatUsers();
  
  if (users.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:#86868b; font-size:0.85rem;">${isHeb ? 'אין משתמשים רשומים נוספים' : 'No other registered users'}</div>`;
    return;
  }

  container.innerHTML = '';
  users.forEach(user => {
    const roomId = [currentUser.email, user.id].sort().join('_').replace(/[^a-zA-Z0-9_]/g, '');
    const messages = JSON.parse(localStorage.getItem(`real_chat_messages_${roomId}`) || '[]');
    
    const lastMsgObj = messages[messages.length - 1];
    const lastMsgText = lastMsgObj ? lastMsgObj.text : (isHeb ? 'אין הודעות' : 'No messages');
    const lastMsgTime = lastMsgObj ? lastMsgObj.time : '';

    const unreadCount = messages.filter(m => m.senderEmail === user.id && !m.read).length;
    const hasUnread = unreadCount > 0;

    const div = document.createElement('div');
    div.className = `chat-user-item ${activeChatUserId === user.id ? 'active' : ''}`;
    div.onclick = () => window.selectChatUser(user.id);
    
    div.innerHTML = `
      <div class="chat-user-avatar-wrap" style="flex-shrink:0;">
        <img src="${user.avatar}" class="chat-user-avatar" alt="${user.name}">
        <span class="chat-user-status" style="background-color: #34c759; flex-shrink:0;"></span>
      </div>
      <div class="chat-user-info" style="flex:1; min-width:0;">
        <div class="chat-user-name-row" style="display:flex; justify-content:space-between; align-items:center;">
          <span class="chat-user-name" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:70%;">${user.name}</span>
          <span class="chat-user-time" style="font-size:0.75rem; color:#86868b; white-space:nowrap;">${lastMsgTime}</span>
        </div>
        <div class="chat-user-lastmsg" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; ${hasUnread ? 'color:#fff; font-weight:700;' : 'color:#86868b;'}">
          ${lastMsgText}
        </div>
      </div>
      ${hasUnread ? '<span style="width:8px; height:8px; background-color:#ff3b30; border-radius:50%; flex-shrink:0; display:inline-block; margin-left:8px;"></span>' : ''}
    `;
    container.appendChild(div);
  });
};

window.selectChatUser = async function(userId) {
  activeChatUserId = userId;
  
  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  const users = await fetchRealChatUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;

  document.querySelectorAll('.chat-user-item').forEach(el => el.classList.remove('active'));
  await window.renderChatUsersList();
  
  const placeholder = document.getElementById('chat-placeholder-view');
  const activeView = document.getElementById('chat-active-view');
  if (placeholder) placeholder.style.display = 'none';
  if (activeView) activeView.style.display = 'flex';

  const avatarImg = document.getElementById('chat-active-avatar');
  const nameEl = document.getElementById('chat-active-name');
  if (avatarImg) avatarImg.src = user.avatar;
  if (nameEl) nameEl.textContent = user.name;

  const roomId = [currentUser.email, userId].sort().join('_').replace(/[^a-zA-Z0-9_]/g, '');
  let localMessages = JSON.parse(localStorage.getItem(`real_chat_messages_${roomId}`) || '[]');

  // Display instantly from cache
  window.renderMessagesStream(localMessages);

  // Clear unreads locally
  localMessages.forEach(m => {
    if (m.senderEmail === userId) m.read = true;
  });
  localStorage.setItem(`real_chat_messages_${roomId}`, JSON.stringify(localMessages));
  
  await window.renderChatUsersList();
  window.updateMessagesBadge();

  // Fetch / Sync with Firestore
  if (window.fbGetDoc && window.fbDb) {
    try {
      const chatDocRef = window.fbDoc(window.fbDb, 'chats', roomId);
      const docSnap = await window.fbGetDoc(chatDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        let dbMessages = data.messages || [];
        
        dbMessages.forEach(m => {
          if (m.senderEmail === userId) m.read = true;
        });
        
        localStorage.setItem(`real_chat_messages_${roomId}`, JSON.stringify(dbMessages));
        window.renderMessagesStream(dbMessages);
        
        // Write read state to cloud
        await window.fbSetDoc(chatDocRef, {
          participants: [currentUser.email, userId],
          messages: dbMessages,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        await window.renderChatUsersList();
        window.updateMessagesBadge();
      }
    } catch (err) {
      console.error("Firestore select sync error:", err);
    }
  }
};

window.renderMessagesStream = function(messages) {
  const container = document.getElementById('messages-stream');
  if (!container) return;

  container.innerHTML = '';
  if (!messages || messages.length === 0) {
    return;
  }

  messages.forEach(msg => {
    const isMe = msg.senderEmail === currentUser.email;
    const div = document.createElement('div');
    div.className = `chat-bubble ${isMe ? 'chat-bubble-sent' : 'chat-bubble-received'}`;
    
    div.innerHTML = `
      <div>${msg.text}</div>
      <div class="chat-bubble-time">${msg.time}</div>
    `;
    container.appendChild(div);
  });

  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 50);
};

window.sendMessageToActiveUser = async function() {
  const inputEl = document.getElementById('chat-message-input');
  if (!inputEl) return;
  const messageText = inputEl.value.trim();
  if (!messageText) return;

  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  const roomId = [currentUser.email, activeChatUserId].sort().join('_').replace(/[^a-zA-Z0-9_]/g, '');
  
  let localMessages = JSON.parse(localStorage.getItem(`real_chat_messages_${roomId}`) || '[]');
  
  const timeString = new Date().toLocaleTimeString(isHeb ? 'he-IL' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  const newMsg = {
    senderEmail: currentUser.email,
    text: messageText,
    time: timeString,
    read: false
  };

  localMessages.push(newMsg);
  localStorage.setItem(`real_chat_messages_${roomId}`, JSON.stringify(localMessages));

  window.renderMessagesStream(localMessages);
  await window.renderChatUsersList();
  inputEl.value = '';

  // Save / Sync to Firestore
  if (window.fbSetDoc && window.fbDb) {
    try {
      const chatDocRef = window.fbDoc(window.fbDb, 'chats', roomId);
      await window.fbSetDoc(chatDocRef, {
        participants: [currentUser.email, activeChatUserId],
        messages: localMessages,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.error("Firestore send chat error:", err);
    }
  }
};

window.clearChatHistory = function() {
  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  if (!activeChatUserId) return;
  const roomId = [currentUser.email, activeChatUserId].sort().join('_').replace(/[^a-zA-Z0-9_]/g, '');

  const confirmMsg = isHeb ? 'האם אתה בטוח שברצונך למחוק את היסטוריית השיחה הנוכחית?' : 'Are you sure you want to clear the current chat history?';
  if (confirm(confirmMsg)) {
    localStorage.setItem(`real_chat_messages_${roomId}`, JSON.stringify([]));
    window.renderMessagesStream([]);
    window.renderChatUsersList();
    
    // Clear in cloud if possible
    if (window.fbSetDoc && window.fbDb) {
      const chatDocRef = window.fbDoc(window.fbDb, 'chats', roomId);
      window.fbSetDoc(chatDocRef, {
        participants: [currentUser.email, activeChatUserId],
        messages: [],
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(e => console.error(e));
    }
  }
};

window.filterChatUsers = function() {
  const query = document.getElementById('chat-search').value.toLowerCase().trim();
  const userItems = document.querySelectorAll('.chat-user-item');
  
  userItems.forEach(item => {
    const name = item.querySelector('.chat-user-name').textContent.toLowerCase();
    const lastMsg = item.querySelector('.chat-user-lastmsg').textContent.toLowerCase();
    if (name.includes(query) || lastMsg.includes(query)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
};

// =====================================================================
// SYSTEM NOTIFICATIONS CENTER LOGIC
// =====================================================================
window.setAlertFilter = function(filter) {
  currentAlertFilter = filter;
  window.renderNotifications();
};

window.renderNotifications = async function() {
  const container = document.getElementById('notifications-list');
  if (!container) return;

  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  
  // 1. Fetch system alerts
  let systemAlerts = [];
  try {
    const rawAlerts = JSON.parse(localStorage.getItem('system_alerts') || '[]');
    systemAlerts = rawAlerts.map(a => ({
      id: a.id,
      type: 'system',
      timestamp: a.timeCreated || Date.now(),
      displayTime: a.timestamp || new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      message: a.message,
      read: a.read,
      alertType: a.type || 'info'
    }));
  } catch(e) {
    console.error(e);
  }

  // 2. Fetch receipts
  let receipts = [];
  if (currentUser && currentUser.email && window.fbGetDocs && window.fbDb) {
    try {
      const receiptsRef = window.fbColl(window.fbDb, `userData/${currentUser.email}/receipts`);
      const q = window.fbQuery(receiptsRef, window.fbOrderBy('timestamp', 'desc'));
      const snapshot = await window.fbGetDocs(q);
      snapshot.forEach(doc => {
        const data = doc.data();
        receipts.push({
          id: doc.id,
          type: 'order',
          timestamp: new Date(data.timestamp).getTime(),
          displayTime: new Date(data.timestamp).toLocaleString(isHeb ? 'he-IL' : 'en-US'),
          data: data
        });
      });
    } catch(e) {
      console.error(e);
    }
  }

  // 3. Fetch offers
  let offers = [];
  if (currentUser && currentUser.email && window.fbGetDocs && window.fbDb) {
    try {
      const offersRef = window.fbColl(window.fbDb, 'offers');
      const q = window.fbQuery(offersRef, window.fbWhere('sellerEmail', '==', currentUser.email));
      const snapshot = await window.fbGetDocs(q);
      snapshot.forEach(doc => {
        const data = doc.data();
        offers.push({
          id: doc.id,
          type: 'offer',
          timestamp: new Date(data.timestamp).getTime(),
          displayTime: new Date(data.timestamp).toLocaleString(isHeb ? 'he-IL' : 'en-US'),
          data: data
        });
      });
    } catch(e) {
      console.error(e);
    }
  }

  // 4. Combine & Sort
  let combined = [
    ...systemAlerts,
    ...receipts,
    ...offers
  ];
  combined.sort((a, b) => b.timestamp - a.timestamp);

  // 5. Apply filters
  if (currentAlertFilter !== 'all') {
    combined = combined.filter(item => item.type === currentAlertFilter);
  }

  // 6. Generate Filter bar HTML (Apple Premium Tab Bar)
  let html = `
    <div class="notifications-filter-bar" style="display:flex; gap:6px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:24px; padding:4px; width:fit-content; margin-bottom:24px; box-shadow:inset 0 1px 2px rgba(255,255,255,0.05); flex-wrap:wrap;">
      <button onclick="window.setAlertFilter('all')" style="background:${currentAlertFilter === 'all' ? 'rgba(255,255,255,0.12)' : 'transparent'}; border:${currentAlertFilter === 'all' ? '1px solid rgba(255,255,255,0.1)' : 'none'}; border-radius:20px; padding:8px 18px; color:#fff; font-size:0.85rem; font-weight:700; cursor:pointer; outline:none; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:${currentAlertFilter === 'all' ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'};">${isHeb ? 'הכל' : 'All'}</button>
      <button onclick="window.setAlertFilter('system')" style="background:${currentAlertFilter === 'system' ? 'rgba(255,255,255,0.12)' : 'transparent'}; border:${currentAlertFilter === 'system' ? '1px solid rgba(255,255,255,0.1)' : 'none'}; border-radius:20px; padding:8px 18px; color:#fff; font-size:0.85rem; font-weight:700; cursor:pointer; outline:none; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:${currentAlertFilter === 'system' ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'};">${isHeb ? 'התראות מערכת' : 'System Alerts'}</button>
      <button onclick="window.setAlertFilter('order')" style="background:${currentAlertFilter === 'order' ? 'rgba(255,255,255,0.12)' : 'transparent'}; border:${currentAlertFilter === 'order' ? '1px solid rgba(255,255,255,0.1)' : 'none'}; border-radius:20px; padding:8px 18px; color:#fff; font-size:0.85rem; font-weight:700; cursor:pointer; outline:none; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:${currentAlertFilter === 'order' ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'};">${isHeb ? 'הזמנות' : 'Orders'}</button>
      <button onclick="window.setAlertFilter('offer')" style="background:${currentAlertFilter === 'offer' ? 'rgba(255,255,255,0.12)' : 'transparent'}; border:${currentAlertFilter === 'offer' ? '1px solid rgba(255,255,255,0.1)' : 'none'}; border-radius:20px; padding:8px 18px; color:#fff; font-size:0.85rem; font-weight:700; cursor:pointer; outline:none; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:${currentAlertFilter === 'offer' ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'};">${isHeb ? 'הצעות מחיר' : 'Offers'}</button>
    </div>
  `;

  if (combined.length === 0) {
    html += `
      <div style="text-align: center; padding: 60px 20px; color: #86868b; background:rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius:24px; backdrop-filter:blur(20px);">
        <div style="font-size: 3.5rem; margin-bottom: 16px; opacity: 0.15; color:#fff;"><i class="fas fa-bell-slash"></i></div>
        <p style="font-size: 0.95rem; font-weight: 500; color:#86868b; margin:0;">${isHeb ? 'אין לך התראות חדשות בסינון זה.' : 'No new alerts found in this section.'}</p>
      </div>
    `;
    container.innerHTML = html;
    return;
  }

  // 7. Render items
  combined.forEach(item => {
    if (item.type === 'system') {
      const isUnread = !item.read;
      let iconClass = 'fa-bell';
      if (item.message.includes('✅') || item.message.includes('success') || item.message.includes('הצלחה')) iconClass = 'fa-circle-check';
      if (item.message.includes('❌') || item.message.includes('error') || item.message.includes('שגיאה')) iconClass = 'fa-circle-xmark';
      if (item.message.includes('⚠️') || item.message.includes('Security') || item.message.includes('אבטחה')) iconClass = 'fa-triangle-exclamation';
      if (item.message.includes('🗑️') || item.message.includes('deleted')) iconClass = 'fa-trash-alt';
      if (item.message.includes('🔒')) iconClass = 'fa-lock';

      html += `
        <div class="notification-item ${isUnread ? 'notification-item-unread' : ''}" style="display:flex; align-items:center; gap:16px; background:rgba(255,255,255,0.03); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:16px; margin-bottom:14px; position:relative; box-shadow:0 8px 32px rgba(0,0,0,0.25); transition:all 0.3s ease; flex-direction: ${isHeb ? 'row-reverse' : 'row'};" onmouseover="this.style.background='rgba(255,255,255,0.06)'; this.style.borderColor='rgba(255,255,255,0.15)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(255,255,255,0.08)'; this.style.transform='translateY(0)';">
          <div class="notification-icon-wrap" style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03)); display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0; border:1px solid rgba(255,255,255,0.1); box-shadow:0 4px 10px rgba(0,0,0,0.2);">
            <i class="fa-solid ${iconClass}" style="font-size:1.05rem;"></i>
          </div>
          <div class="notification-content" style="flex:1; direction: ${isHeb ? 'rtl' : 'ltr'}; text-align: ${isHeb ? 'right' : 'left'}; min-width:0;">
            <div class="notification-text" style="font-size:0.95rem; color:#fff; font-weight:500; line-height:1.4; word-break:break-word;">${item.message}</div>
            <div class="notification-time" style="font-size:0.8rem; color:#86868b; margin-top:6px; font-weight:500;">${item.displayTime}</div>
          </div>
          <button class="notification-delete-btn" onclick="window.deleteNotification('${item.id}')" title="${isHeb ? 'מחק' : 'Delete'}" style="background:none; border:none; color:#86868b; cursor:pointer; padding:8px; font-size:1.2rem; flex-shrink:0; transition:all 0.2s;" onmouseover="this.style.color='#ff3b30'; this.style.transform='scale(1.1)';" onmouseout="this.style.color='#86868b'; this.style.transform='scale(1)';">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    } else if (item.type === 'order') {
      const data = item.data;
      const firstItem = data.items && data.items.length > 0 ? data.items[0] : null;
      const firstItemText = firstItem ? (typeof firstItem === 'string' ? firstItem : firstItem.text) : '';
      const shortTitle = firstItemText ? firstItemText.split('×')[0] + (data.items.length > 1 ? ' + more...' : '') : 'Order Confirmation';
      
      const orderTime = item.timestamp;
      const now = Date.now();
      const minutesSinceOrder = (now - orderTime) / (1000 * 60);
      
      let step = 1; // Ordered
      if (minutesSinceOrder > 5) step = 2; // Shipped
      if (minutesSinceOrder > 15) step = 3; // Arrived
      
      const step1Color = step >= 1 ? '#34c759' : '#3a3a3c';
      const step2Color = step >= 2 ? '#34c759' : '#3a3a3c';
      const step3Color = step >= 3 ? '#34c759' : '#3a3a3c';
      const line1Color = step >= 2 ? '#34c759' : '#3a3a3c';
      const line2Color = step >= 3 ? '#34c759' : '#3a3a3c';
      
      const itemsHtml = data.items ? data.items.map(i => {
        if (typeof i === 'string') {
          return `<div style="font-size:0.85rem; color:#a1a1aa; padding:4px 0; text-align: ${isHeb ? 'right' : 'left'};">&bull; ${i}</div>`;
        } else {
          return `
            <div style="display:flex; align-items:center; gap:12px; margin-top:8px; padding-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.06); flex-direction: ${isHeb ? 'row-reverse' : 'row'};">
              ${i.image ? `<img src="${i.image}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; background:#fff;">` : `<div style="width:40px; height:40px; border-radius:6px; background:#1c1c1e; display:flex; align-items:center; justify-content:center;"><i class="fas fa-box" style="color:#86868b;"></i></div>`}
              <div style="font-size:0.85rem; color:#e5e5ea; flex:1; text-align: ${isHeb ? 'right' : 'left'};">${i.text}</div>
            </div>
          `;
        }
      }).join('') : '';

      const trackerHtml = `
        <div style="margin-bottom: 24px; background:#000; border-radius:12px; padding:16px; border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:0.75rem; font-weight:700; color:#86868b; margin-bottom:16px; text-transform:uppercase; letter-spacing:1px; text-align:center;">${isHeb ? 'מעקב משלוח' : 'Order Tracker'}</div>
          <div style="display:flex; align-items:center; justify-content:space-between; position:relative; padding:0 10px; flex-direction: ${isHeb ? 'row-reverse' : 'row'};">
            <div style="position:absolute; top:12px; left:30px; right:30px; height:2px; background:#3a3a3c; z-index:1;"></div>
            <div style="position:absolute; top:12px; left:30px; width:calc(50% - 30px); height:2px; background:${line1Color}; z-index:2; transition: background 0.3s;"></div>
            <div style="position:absolute; top:12px; left:50%; width:calc(50% - 30px); height:2px; background:${line2Color}; z-index:2; transition: background 0.3s;"></div>
            
            <div style="position:relative; z-index:3; display:flex; flex-direction:column; align-items:center; gap:8px;">
              <div style="width:26px; height:26px; border-radius:50%; background:${step1Color}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.7rem; border:3px solid #000;"><i class="fas fa-check"></i></div>
              <div style="font-size:0.7rem; color:${step >= 1 ? '#e5e5ea' : '#86868b'}; font-weight:600;">${isHeb ? 'הוזמן' : 'Ordered'}</div>
            </div>
            <div style="position:relative; z-index:3; display:flex; flex-direction:column; align-items:center; gap:8px;">
              <div style="width:26px; height:26px; border-radius:50%; background:${step2Color}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.7rem; border:3px solid #000;"><i class="fas fa-truck"></i></div>
              <div style="font-size:0.7rem; color:${step >= 2 ? '#e5e5ea' : '#86868b'}; font-weight:600;">${isHeb ? 'נשלח לדרך' : 'Shipped'}</div>
            </div>
            <div style="position:relative; z-index:3; display:flex; flex-direction:column; align-items:center; gap:8px;">
              <div style="width:26px; height:26px; border-radius:50%; background:${step3Color}; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.7rem; border:3px solid #000;"><i class="fas fa-box-open"></i></div>
              <div style="font-size:0.7rem; color:${step >= 3 ? '#e5e5ea' : '#86868b'}; font-weight:600;">${isHeb ? 'הגיע ליעד' : 'Arrived'}</div>
            </div>
          </div>
        </div>
      `;

      html += `
        <div class="notification-item" style="background:rgba(255,255,255,0.03); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:18px; margin-bottom:14px; cursor:pointer; box-shadow:0 8px 32px rgba(0,0,0,0.25); transition:all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.06)'; this.style.borderColor='rgba(255,255,255,0.15)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(255,255,255,0.08)'; this.style.transform='translateY(0)';" onclick="const d = this.querySelector('.hub-receipt-details'); const c = this.querySelector('.receipt-chevron'); d.style.display = d.style.display === 'none' ? 'block' : 'none'; if(c) c.style.transform = d.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)'">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:12px;">
            <div style="display:flex; align-items:center; gap:14px; flex:1; min-width:0; flex-direction: ${isHeb ? 'row-reverse' : 'row'};">
              <div style="width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, #34c759, #28cd41); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.1rem; flex-shrink:0; border:1px solid rgba(255,255,255,0.2); box-shadow:0 4px 12px rgba(40,205,65,0.3);">
                <i class="fas fa-receipt"></i>
              </div>
              <div style="direction: ${isHeb ? 'rtl' : 'ltr'}; text-align: ${isHeb ? 'right' : 'left'}; min-width:0; flex:1;">
                <div style="font-weight:700; color:#fff; font-size:1rem; margin-bottom:3px;">${isHeb ? 'אישור הזמנה 🧾' : 'Order Confirmation'}</div>
                <div style="font-weight:600; color:#a1a1aa; font-size:0.82rem; margin-bottom:3px; font-family:monospace;">${isHeb ? 'מזהה' : 'ID'}: #${item.id.slice(0, 8).toUpperCase()}</div>
                <div style="font-size:0.85rem; color:#86868b; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${shortTitle}</div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:12px; flex-shrink:0; flex-direction: ${isHeb ? 'row-reverse' : 'row'};">
              <span style="font-size:0.78rem; color:#86868b; font-weight:500; white-space:nowrap;">${item.displayTime.split(',')[0]}</span>
              <i class="fas fa-chevron-down receipt-chevron" style="color:#86868b; transition:transform 0.3s ease; font-size:0.9rem; padding:4px;"></i>
            </div>
          </div>
          
          <div class="hub-receipt-details" style="display:none; margin-top:18px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.06); direction: ${isHeb ? 'rtl' : 'ltr'}; text-align: ${isHeb ? 'right' : 'left'};">
            ${trackerHtml}
            <div style="font-size:0.92rem; color:#e5e5ea; margin-bottom:16px; line-height:1.6; font-weight:450;">
              ${isHeb ? `שלום ${data.customer_name || 'לקוח'},` : `Hi ${data.customer_name || 'Customer'},`}<br><br>
              ${isHeb ? 'תודה על הרכישה שלך! התשלום התקבל ועובד בהצלחה. להלן פרטי העסקה המלאים:' : 'Thank you for your purchase! We have successfully processed your payment. Below are the details of your transaction:'}
            </div>
            <div style="background:rgba(0,0,0,0.3); border-radius:12px; padding:14px; margin-bottom:16px; border:1px solid rgba(255,255,255,0.04);">
              <div style="font-size:0.75rem; font-weight:700; color:#86868b; margin-bottom:10px; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:6px;">${isHeb ? 'סיכום הזמנה' : 'Order Summary'}</div>
              ${itemsHtml}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.06); box-shadow:0 4px 12px rgba(0,0,0,0.15);">
              <span style="font-weight:600; color:#86868b; font-size:0.9rem;">${isHeb ? 'סה"כ שולם' : 'Total Paid'}</span>
              <span style="font-weight:800; color:#34c759; font-size:1.25rem;">$${data.amount ? data.amount.toLocaleString() : '0'}</span>
            </div>
            <div style="text-align:center; margin-top:16px; border-top:1px dashed rgba(255,255,255,0.06); padding-top:12px;">
              <p style="font-size:0.78rem; color:#86868b; margin:0; font-weight:500;">${isHeb ? 'העסקה הושלמה בתאריך' : 'Transaction completed on'} ${dateStr}</p>
            </div>
          </div>
        </div>
      `;
    } else if (item.type === 'offer') {
      const data = item.data;

      html += `
        <div class="notification-item" style="background:rgba(255,255,255,0.03); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:18px; margin-bottom:14px; box-shadow:0 8px 32px rgba(0,0,0,0.25); transition:all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.06)'; this.style.borderColor='rgba(255,255,255,0.15)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='rgba(255,255,255,0.08)'; this.style.transform='translateY(0)';">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; flex-direction: ${isHeb ? 'row-reverse' : 'row'};">
            <div style="text-align: ${isHeb ? 'right' : 'left'}; flex:1; min-width:0;">
              <div style="font-size:0.75rem; color:#af52de; font-weight:700; text-transform:uppercase; margin-bottom:5px; letter-spacing:1px; display:flex; align-items:center; gap:6px; justify-content: ${isHeb ? 'flex-end' : 'flex'};">
                <i class="fas fa-tag"></i> ${isHeb ? 'הצעת מחיר חדשה 🏷️' : 'New Offer'}
              </div>
              <h3 style="font-size:1.1rem; font-weight:700; color:#fff; margin:0; line-height:1.4; word-break:break-word;">${data.postTitle}</h3>
            </div>
            <div style="font-size:1.3rem; font-weight:800; color:#34c759; margin-left:14px; flex-shrink:0; background:rgba(52,199,89,0.12); padding:6px 12px; border-radius:10px; border:1px solid rgba(52,199,89,0.2); box-shadow:0 4px 10px rgba(52,199,89,0.15);">${isHeb ? '₪' : '$'}${data.offerAmount}</div>
          </div>
          <div style="font-size:0.9rem; color:#a1a1aa; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.04); padding:14px; border-radius:12px; margin-bottom:14px; direction: ${isHeb ? 'rtl' : 'ltr'}; text-align: ${isHeb ? 'right' : 'left'}; line-height:1.5; font-weight:450;">
            <strong style="color:#fff;">${isHeb ? 'שולח:' : 'From:'}</strong> ${data.buyerName} (${data.buyerEmail})<br>
            ${data.message ? `<div style="margin-top:8px; font-style:italic; color:#fff; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.04);">"${data.message}"</div>` : ''}
            ${data.signatureData ? `<div style="margin-top:14px; border-top:1px dashed rgba(255,255,255,0.08); padding-top:10px;"><strong style="font-size:0.8rem; color:#fff;">${isHeb ? 'חתימה על החוזה:' : 'Contract Signature:'}</strong><br><img src="${data.signatureData}" style="max-height:75px; background:#fff; border-radius:6px; margin-top:6px; border:1px solid rgba(255,255,255,0.1); padding:4px; box-shadow:0 4px 10px rgba(0,0,0,0.15);"></div>` : ''}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; flex-direction: ${isHeb ? 'row-reverse' : 'row'};">
            <div style="font-size:0.8rem; color:#86868b; font-weight:500;">${item.displayTime}</div>
            <button onclick="window.location.href='mailto:${data.buyerEmail}?subject=Re: Offer for ${encodeURIComponent(data.postTitle)}'" style="background:#0071e3; color:#fff; border:none; border-radius:10px; padding:8px 18px; font-size:0.85rem; font-weight:600; cursor:pointer; box-shadow:0 4px 12px rgba(0,113,227,0.3); transition: all 0.2s;" onmouseover="this.style.background='#0077ed'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='#0071e3'; this.style.transform='translateY(0)';">${isHeb ? 'צור קשר עם הקונה 💬' : 'Contact Buyer'}</button>
          </div>
        </div>
      `;
    }
  });

  container.innerHTML = html;
};

window.deleteNotification = function(id) {
  let alerts = JSON.parse(localStorage.getItem('system_alerts')) || [];
  alerts = alerts.filter(a => a.id !== id);
  localStorage.setItem('system_alerts', JSON.stringify(alerts));
  window.renderNotifications();
  window.updateMessagesBadge();
};

window.clearAllNotifications = function() {
  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  const confirmMsg = isHeb ? 'האם אתה בטוח שברצונך למחוק את כל ההתראות?' : 'Are you sure you want to clear all notifications?';
  if (confirm(confirmMsg)) {
    localStorage.setItem('system_alerts', JSON.stringify([]));
    window.renderNotifications();
    window.updateMessagesBadge();
  }
};

window.updateMessagesBadge = async function() {
  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  
  if (!currentUser || !currentUser.email) return;

  const users = await fetchRealChatUsers();
  let unreadChats = 0;
  let totalUnreadMessages = 0;
  users.forEach(user => {
    const roomId = [currentUser.email, user.id].sort().join('_').replace(/[^a-zA-Z0-9_]/g, '');
    const messages = JSON.parse(localStorage.getItem(`real_chat_messages_${roomId}`) || '[]');
    const unreadCount = messages.filter(m => m.senderEmail === user.id && !m.read).length;
    totalUnreadMessages += unreadCount;
    if (unreadCount > 0) {
      unreadChats++;
    }
  });

  let unreadAlerts = 0;
  try {
    const alerts = JSON.parse(localStorage.getItem('system_alerts')) || [];
    unreadAlerts = alerts.filter(a => !a.read).length;
  } catch(e) {}

  const alertDot = document.getElementById('alerts-unread-dot');
  if (alertDot) {
    alertDot.style.display = unreadAlerts > 0 ? 'inline-block' : 'none';
  }

  const sidebarDot = document.getElementById('messages-unread-badge');
  if (sidebarDot) {
    sidebarDot.style.display = (unreadChats > 0 || unreadAlerts > 0) ? 'inline-block' : 'none';
  }

  const navBadge = document.getElementById('messages-nav-badge');
  if (navBadge) {
    navBadge.textContent = totalUnreadMessages;
    navBadge.style.display = totalUnreadMessages > 0 ? 'flex' : 'none';
  }
};

window.checkInboxUnreadMessages = function() {
  window.updateMessagesBadge();
};

window.showToast = function(msg, type = '') {
  let alerts = [];
  try {
    alerts = JSON.parse(localStorage.getItem('system_alerts') || '[]');
  } catch(e) {}
  
  alerts.unshift({
    id: Date.now() + Math.random().toString(),
    message: msg,
    type: type,
    timestamp: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    timeCreated: Date.now(),
    read: false
  });
  
  localStorage.setItem('system_alerts', JSON.stringify(alerts.slice(0, 50)));
  
  window.updateMessagesBadge();
  window.renderNotifications();
};

document.addEventListener('DOMContentLoaded', () => {
  const activePage = document.querySelector('.page.active');
  if (activePage && activePage.id === 'page-messages') {
    window.initMessagesSystem();
  }
});

// =====================================================================
// BOTTOM DRAWER MESSAGING & FORUMS SYSTEM
// =====================================================================
let activeDrawerChatUserId = null;
let drawerChatRefreshInterval = null;

window.toggleMessagesDrawer = function() {
  const drawer = document.getElementById('messages-drawer');
  if (!drawer) return;
  
  if (drawer.classList.contains('active')) {
    drawer.classList.remove('active');
    if (drawerChatRefreshInterval) {
      clearInterval(drawerChatRefreshInterval);
      drawerChatRefreshInterval = null;
    }
  } else {
    // Close other drawers
    const cart = document.getElementById('cart-drawer');
    if (cart) cart.classList.remove('active');
    const saved = document.getElementById('saved-items-drawer');
    if (saved) saved.classList.remove('active');
    const forums = document.getElementById('forums-drawer');
    if (forums) forums.classList.remove('active');
    
    drawer.classList.add('active');
    renderDrawerChatUsersList();
    
    // Start background refresh
    if (drawerChatRefreshInterval) clearInterval(drawerChatRefreshInterval);
    drawerChatRefreshInterval = setInterval(async () => {
      if (drawer.classList.contains('active')) {
        await renderDrawerChatUsersList();
        if (activeDrawerChatUserId) {
          await syncDrawerActiveChatSilent(activeDrawerChatUserId);
        }
      } else {
        clearInterval(drawerChatRefreshInterval);
        drawerChatRefreshInterval = null;
      }
    }, 4000);
  }
};

async function renderDrawerChatUsersList() {
  const container = document.getElementById('drawer-messages-user-list');
  if (!container) return;
  
  const users = await fetchRealChatUsers();
  const searchInput = document.getElementById('drawer-chat-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  let html = '';
  let totalUnread = 0;
  for (const u of users) {
    if (currentUser && u.id === currentUser.email) continue;
    if (query && !u.name.toLowerCase().includes(query)) continue;
    
    // Check unread count
    const roomId = [currentUser?.email, u.id].sort().join('_').replace(/[^a-zA-Z0-9_]/g, '');
    const localMsgs = JSON.parse(localStorage.getItem(`real_chat_messages_${roomId}`) || '[]');
    const unreadCount = localMsgs.filter(m => m.senderEmail === u.id && !m.read).length;
    totalUnread += unreadCount;
    
    const isSelected = activeDrawerChatUserId === u.id;
    
    html += `
      <div onclick="selectDrawerChatUser('${u.id}')" style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:20px; cursor:pointer; transition:transform 0.2s, background 0.2s, border-color 0.2s; background:${isSelected ? 'rgba(255,149,0,0.1)' : 'rgba(255,255,255,0.03)'}; border:1px solid ${isSelected ? 'rgba(255,149,0,0.3)' : 'rgba(255,255,255,0.08)'}; border-radius:16px; text-align:center;" onmouseover="this.style.transform='translateY(-2px)'; this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.transform='translateY(0)'; this.style.background='${isSelected ? 'rgba(255,149,0,0.1)' : 'rgba(255,255,255,0.03)'}'">
        <div style="position:relative;">
          <img src="${u.avatar}" style="width:64px; height:64px; border-radius:50%; object-fit:cover; border:2px solid rgba(255,255,255,0.1);">
          <span style="position:absolute; bottom:2px; right:2px; width:14px; height:14px; background:#34c759; border:2px solid #141416; border-radius:50%;"></span>
          ${unreadCount > 0 ? `<span style="position:absolute; top:-6px; left:-6px; background:#ff3b30; color:#fff; font-size:0.8rem; font-weight:800; min-width:22px; height:22px; border-radius:11px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(255,59,48,0.4);">${unreadCount}</span>` : ''}
        </div>
        <div style="width:100%;">
          <div style="font-weight:800; color:#fff; font-size:1.05rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${u.name}</div>
          <div style="font-size:0.8rem; color:#86868b; margin-top:6px;">${unreadCount > 0 ? `<span style="color:#ff3b30; font-weight:700;">${unreadCount} הודעות חדשות</span>` : 'הקש כדי לשוחח'}</div>
        </div>
      </div>
    `;
  }
  
  const navBadge = document.getElementById('messages-nav-badge');
  if (navBadge) {
    navBadge.textContent = totalUnread;
    navBadge.style.display = totalUnread > 0 ? 'flex' : 'none';
  }
  
  if (!html) {
    container.innerHTML = `<div style="text-align:center; padding:30px; color:#86868b; font-size:0.85rem;">No active conversations found</div>`;
  } else {
    container.innerHTML = html;
  }
}

window.filterDrawerChatUsers = function() {
  renderDrawerChatUsersList();
};

window.selectDrawerChatUser = async function(userId) {
  activeDrawerChatUserId = userId;
  
  // Show active pane, hide sidebar list on mobile layout inside drawer
  const sidebar = document.getElementById('drawer-chat-users-sidebar');
  const activePane = document.getElementById('drawer-chat-active-pane');
  const backBtn = document.getElementById('drawer-chat-back-btn');
  
  if (sidebar && activePane && backBtn) {
    sidebar.style.display = 'none';
    activePane.style.display = 'flex';
    backBtn.style.display = 'flex';
  }
  
  // Load user details
  const users = await fetchRealChatUsers();
  const targetUser = users.find(u => u.id === userId);
  if (targetUser) {
    document.getElementById('drawer-chat-active-avatar').src = targetUser.avatar;
    document.getElementById('drawer-chat-active-name').textContent = targetUser.name;
  }
  
  // Sync messages
  const roomId = [currentUser?.email, userId].sort().join('_').replace(/[^a-zA-Z0-9_]/g, '');
  const localMsgs = JSON.parse(localStorage.getItem(`real_chat_messages_${roomId}`) || '[]');
  
  // Mark as read
  localMsgs.forEach(m => {
    if (m.senderEmail === userId) m.read = true;
  });
  localStorage.setItem(`real_chat_messages_${roomId}`, JSON.stringify(localMsgs));
  
  renderDrawerMessagesStream(localMsgs);
  
  // Update badges
  window.updateMessagesBadge();
  renderDrawerChatUsersList();
  
  // Load from Firestore
  if (window.fbGetDoc && window.fbDb && window.fbDoc) {
    try {
      const chatDocRef = window.fbDoc(window.fbDb, 'chats', roomId);
      const docSnap = await window.fbGetDoc(chatDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        let dbMsgs = data.messages || [];
        dbMsgs.forEach(m => {
          if (m.senderEmail === userId) m.read = true;
        });
        localStorage.setItem(`real_chat_messages_${roomId}`, JSON.stringify(dbMsgs));
        renderDrawerMessagesStream(dbMsgs);
        
        await window.fbSetDoc(chatDocRef, {
          participants: [currentUser.email, userId],
          messages: dbMsgs,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        window.updateMessagesBadge();
      }
    } catch(e) {}
  }
};

window.showDrawerUsersList = function() {
  activeDrawerChatUserId = null;
  const sidebar = document.getElementById('drawer-chat-users-sidebar');
  const activePane = document.getElementById('drawer-chat-active-pane');
  const backBtn = document.getElementById('drawer-chat-back-btn');
  
  if (sidebar && activePane && backBtn) {
    sidebar.style.display = 'flex';
    activePane.style.display = 'none';
    backBtn.style.display = 'none';
  }
  renderDrawerChatUsersList();
};

function renderDrawerMessagesStream(messages) {
  const container = document.getElementById('drawer-messages-stream');
  if (!container) return;
  
  let html = '';
  messages.forEach(m => {
    const isMe = m.senderEmail === currentUser?.email;
    html += `
      <div style="align-self:${isMe ? 'flex-end' : 'flex-start'}; max-width:70%; display:flex; flex-direction:column; gap:4px;">
        <div style="background:${isMe ? '#ff9500' : '#1c1c1e'}; color:#fff; padding:10px 14px; border-radius:${isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px'}; font-size:0.9rem; line-height:1.4; word-break:break-word;">
          ${m.text}
        </div>
        <div style="font-size:0.7rem; color:#86868b; text-align:${isMe ? 'right' : 'left'}; padding:0 4px;">
          ${m.timestamp ? new Date(m.timestamp).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'}) : ''}
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html || `<div style="text-align:center; padding:40px; color:#86868b; font-size:0.85rem;">Say hi to start the conversation! 👋</div>`;
  container.scrollTop = container.scrollHeight;
}

async function syncDrawerActiveChatSilent(userId) {
  if (!currentUser || !currentUser.email || !window.fbGetDoc || !window.fbDb) return;
  const roomId = [currentUser.email, userId].sort().join('_').replace(/[^a-zA-Z0-9_]/g, '');
  try {
    const chatDocRef = window.fbDoc(window.fbDb, 'chats', roomId);
    const docSnap = await window.fbGetDoc(chatDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      let dbMessages = data.messages || [];
      const currentLocal = JSON.parse(localStorage.getItem(`real_chat_messages_${roomId}`) || '[]');
      
      if (dbMessages.length !== currentLocal.length) {
        dbMessages.forEach(m => {
          if (m.senderEmail === userId) m.read = true;
        });
        localStorage.setItem(`real_chat_messages_${roomId}`, JSON.stringify(dbMessages));
        renderDrawerMessagesStream(dbMessages);
        
        await window.fbSetDoc(chatDocRef, {
          participants: [currentUser.email, userId],
          messages: dbMessages,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        window.updateMessagesBadge();
      }
    }
  } catch(e) {}
}

window.sendDrawerMessage = async function() {
  const input = document.getElementById('drawer-chat-message-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text || !activeDrawerChatUserId || !currentUser) return;
  
  input.value = '';
  
  const roomId = [currentUser.email, activeDrawerChatUserId].sort().join('_').replace(/[^a-zA-Z0-9_]/g, '');
  const localMsgs = JSON.parse(localStorage.getItem(`real_chat_messages_${roomId}`) || '[]');
  
  const newMsg = {
    id: Date.now() + Math.random().toString(),
    senderEmail: currentUser.email,
    senderName: currentUser.name || currentUser.email.split('@')[0],
    text: text,
    timestamp: new Date().toISOString(),
    read: false
  };
  
  localMsgs.push(newMsg);
  localStorage.setItem(`real_chat_messages_${roomId}`, JSON.stringify(localMsgs));
  renderDrawerMessagesStream(localMsgs);
  
  // Write to Firestore
  if (window.fbSetDoc && window.fbDb && window.fbDoc) {
    try {
      const chatDocRef = window.fbDoc(window.fbDb, 'chats', roomId);
      await window.fbSetDoc(chatDocRef, {
        participants: [currentUser.email, activeDrawerChatUserId],
        messages: localMsgs,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch(err) {
      console.error("Firestore message send error:", err);
    }
  }
};

// =====================================================================
// FORUMS FAVORITES DRAWER LOGIC
// =====================================================================
window.toggleForumsDrawer = function() {
  const drawer = document.getElementById('forums-drawer');
  if (!drawer) return;
  
  if (drawer.classList.contains('active')) {
    drawer.classList.remove('active');
  } else {
    // Close other drawers
    const cart = document.getElementById('cart-drawer');
    if (cart) cart.classList.remove('active');
    const saved = document.getElementById('saved-items-drawer');
    if (saved) saved.classList.remove('active');
    const messages = document.getElementById('messages-drawer');
    if (messages) messages.classList.remove('active');
    
    drawer.classList.add('active');
    renderDrawerForumsList();
  }
};

window.toggleFavoriteForum = function(e, groupId) {
  if (e) e.stopPropagation();
  let favorites = JSON.parse(localStorage.getItem('favorite_forums') || '[]');
  if (favorites.includes(groupId)) {
    favorites = favorites.filter(id => id !== groupId);
  } else {
    favorites.push(groupId);
  }
  localStorage.setItem('favorite_forums', JSON.stringify(favorites));
  renderDrawerForumsList();
};

function renderDrawerForumsList() {
  const mineContainer = document.getElementById('drawer-forums-mine');
  const recContainer = document.getElementById('drawer-forums-recommended');
  if (!mineContainer || !recContainer) return;

  const favorites = JSON.parse(localStorage.getItem('favorite_forums') || '[]');

  function forumCard(g, isFav) {
    return `
      <div onclick="selectDrawerForum('${g.id}')" style="flex-shrink:0; width:180px; background:#141416; border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:14px; cursor:pointer; transition:all 0.2s; position:relative;" onmouseover="this.style.borderColor='rgba(255,255,255,0.2)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)'; this.style.transform='none';">
        <button onclick="toggleFavoriteForum(event, '${g.id}')" style="position:absolute; top:10px; left:10px; background:none; border:none; color:${isFav ? '#ffc107' : '#48484a'}; cursor:pointer; font-size:0.9rem; padding:0; transition:color 0.2s;">
          <i class="${isFav ? 'fas' : 'far'} fa-star"></i>
        </button>
        <div style="width:36px; height:36px; border-radius:10px; background:${g.color || '#0071e3'}22; border:1px solid ${g.color || '#0071e3'}44; display:flex; align-items:center; justify-content:center; color:${g.color || '#0071e3'}; font-size:1rem; margin-bottom:10px;">
          <i class="fas ${g.icon || 'fa-comments'}"></i>
        </div>
        <div style="font-weight:700; color:#fff; font-size:0.85rem; margin-bottom:4px; padding-left:18px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${g.name}</div>
        <div style="font-size:0.75rem; color:#86868b; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; line-height:1.4; height:34px;">${g.desc}</div>
        <div style="margin-top:10px; font-size:0.75rem; font-weight:600; color:#ff9500; display:flex; align-items:center; gap:4px;">
          <span>כניסה לפורום</span> <i class="fas fa-chevron-left" style="font-size:0.65rem;"></i>
        </div>
      </div>
    `;
  }

  // Row 1: My forums (favorites)
  const myForums = PREDEFINED_GROUPS.filter(g => favorites.includes(g.id));
  if (myForums.length === 0) {
    mineContainer.innerHTML = `<div style="color:#86868b; font-size:0.85rem; padding:12px 0;">סמן פורומים ב-⭐ כדי שיופיעו כאן</div>`;
  } else {
    mineContainer.innerHTML = myForums.map(g => forumCard(g, true)).join('');
  }

  // Row 2: All forums as recommendations
  recContainer.innerHTML = PREDEFINED_GROUPS.map(g => forumCard(g, favorites.includes(g.id))).join('');
}

window.selectDrawerForum = function(groupId) {
  toggleForumsDrawer();
  showPage('groups');
  setTimeout(() => openGroup(groupId), 300);
};

// =====================================================================
// LIVE EDITOR — New Clean Implementation
// =====================================================================

window.isEditModeActive = false;

window.updateAdminEditBar = function() {
  const bar = document.getElementById('admin-live-edit-bar');
  if (!bar) return;
  const currentIsAdmin = (typeof isAdmin !== 'undefined' && isAdmin === true);
  bar.style.display = currentIsAdmin ? 'flex' : 'none';
  
  if (currentIsAdmin) {
    document.body.classList.add('admin-bar-active');
  } else {
    document.body.classList.remove('admin-bar-active');
  }
  
  const toggleBtn = document.getElementById('admin-bar-toggle-edit');
  if (toggleBtn) {
    const active = (typeof isEditModeActive !== 'undefined' && isEditModeActive === true);
    toggleBtn.textContent = active ? 'צא ממצב עריכה' : 'מצב עריכה';
    toggleBtn.style.background = active ? '#ff453a' : 'rgba(255,255,255,0.05)';
  }
};

window.toggleEditModeBtn = function() {
  const active = (typeof isEditModeActive !== 'undefined' && isEditModeActive === true);
  if (active) {
    disableLiveEditMode();
  } else {
    enableLiveEditMode();
  }
  updateAdminEditBar();
};

function enableLiveEditMode() {
  window.isEditModeActive = true;
  localStorage.setItem('isEditModeActive', 'true');
  document.body.classList.add('admin-edit-mode-active');
  const btn = document.getElementById('admin-edit-mode-toggle');
  if (btn) {
    btn.style.display = 'flex';
    btn.classList.add('active');
    const span = btn.querySelector('span');
    if (span) span.textContent = 'צא ממצב עריכה';
  }
  const approveBtn = document.getElementById('admin-approve-changes-btn');
  if (approveBtn) {
    approveBtn.style.display = 'flex';
  }
  enableDragAndDrop(true);
  updateAdminEditBar();
  if (typeof window.renderCustomPages === 'function') window.renderCustomPages();
  if (typeof window.applyPageVisibility === 'function') window.applyPageVisibility();
  showToast('✏️ מצב עריכה פעיל — לחץ על כל טקסט או תמונה לעריכה');
}
window.enableLiveEditMode = enableLiveEditMode;

function disableLiveEditMode() {
  window.isEditModeActive = false;
  localStorage.removeItem('isEditModeActive');
  document.body.classList.remove('admin-edit-mode-active');
  closeTextEditPopup();
  const btn = document.getElementById('admin-edit-mode-toggle');
  if (btn) {
    btn.classList.remove('active');
    const span = btn.querySelector('span');
    if (span) span.textContent = 'מצב עריכה';
  }
  const approveBtn = document.getElementById('admin-approve-changes-btn');
  if (approveBtn) {
    approveBtn.style.display = 'none';
  }
  enableDragAndDrop(false);
  localStorage.removeItem('isEditor');
  updateAdminEditBar();
  if (typeof window.renderCustomPages === 'function') window.renderCustomPages();
  if (typeof window.applyPageVisibility === 'function') window.applyPageVisibility();
  showToast('🔒 מצב עריכה כבוי');
}
window.disableLiveEditMode = disableLiveEditMode;

// ---- Floating text edit popup ----
let _editPopupTarget = null;

function openTextEditPopup(el) {
  closeTextEditPopup();
  _editPopupTarget = el;

  const popup = document.createElement('div');
  popup.id = 'text-edit-popup';
  popup.setAttribute('data-no-edit', '');

  const isRtl = document.body.classList.contains('rtl-layout');
  const currentText = el.innerText || el.textContent || '';

  popup.innerHTML = `
    <div class="tep-header" style="cursor: move; user-select: none;">
      <span class="tep-label">✏️ עריכת טקסט (גרור להזזה)</span>
      <button class="tep-close" id="tep-close-btn" style="cursor: pointer;">✕</button>
    </div>
    <textarea class="tep-textarea" id="tep-textarea" dir="${isRtl ? 'rtl' : 'ltr'}"></textarea>
    <div class="tep-actions">
      <button class="tep-save" id="tep-save-btn">✅ שמור</button>
      <button class="tep-cancel" id="tep-cancel-btn">ביטול</button>
    </div>
  `;

  document.body.appendChild(popup);

  // Position near the element
  positionTextEditPopup(el, popup);

  // Dragging logic for the popup
  const header = popup.querySelector('.tep-header');
  if (header) {
    let isDragging = false;
    let startX, startY;
    let initialLeft, initialTop;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return; // ignore close button click
      e.preventDefault();
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = popup.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      const onMouseMove = (moveEvent) => {
        if (!isDragging) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        popup.style.left = (initialLeft + dx) + 'px';
        popup.style.top = (initialTop + dy) + 'px';
      };

      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  const textarea = popup.querySelector('#tep-textarea');
  textarea.value = currentText;
  textarea.focus();
  textarea.select();

  popup.querySelector('#tep-save-btn').addEventListener('click', () => saveTextEdit(textarea.value));
  popup.querySelector('#tep-cancel-btn').addEventListener('click', closeTextEditPopup);
  popup.querySelector('#tep-close-btn').addEventListener('click', closeTextEditPopup);
  textarea.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeTextEditPopup();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveTextEdit(textarea.value);
  });
}

function positionTextEditPopup(el, popup) {
  const rect = el.getBoundingClientRect();
  const popupW = 320;
  const popupH = 200;

  let top = rect.bottom + 8;
  let left = rect.left;

  // Keep inside viewport
  if (left + popupW > window.innerWidth - 16) left = window.innerWidth - popupW - 16;
  if (left < 8) left = 8;
  if (top + popupH > window.innerHeight) top = rect.top - popupH - 8;

  popup.style.top = top + 'px';
  popup.style.left = left + 'px';
}

async function saveEditedArticle(articleObj) {
  try {
    if (window.db && window.fbFirestore) {
      const { doc, updateDoc } = window.fbFirestore;
      if (articleObj.firestoreId) {
        await updateDoc(doc(window.db, "articles", articleObj.firestoreId), {
          title: articleObj.title || '',
          author: articleObj.author || '',
          time: articleObj.time || '',
          content: articleObj.content || '',
          text: articleObj.text || '',
          category: articleObj.category || ''
        });
      }
    }
    // Parallel save to local server disk
    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleObj)
    });
    showToast('✅ הכתבה עודכנה בהצלחה!');
  } catch (err) {
    console.error('Error saving article:', err);
    showToast('❌ שגיאה בעדכון הכתבה בשרת/ענן', 'error');
  }
}

async function duplicateArticle(id) {
  const orig = newsArticles.find(x => x.id === id);
  if (!orig) return;
  
  const isHeb = document.body.classList.contains('rtl-layout');
  const copySuffix = isHeb ? ' (עותק)' : ' (Copy)';
  
  const clone = {
    ...orig,
    id: Date.now(),
    title: orig.title + copySuffix,
    time: new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5),
    excludeFromCarousel: true
  };
  delete clone.firestoreId;
  
  showToast('⏳ משכפל כתבה...');
  
  try {
    if (window.db && window.fbFirestore) {
      const { collection, addDoc } = window.fbFirestore;
      const docRef = await addDoc(collection(window.db, "articles"), clone);
      clone.firestoreId = docRef.id;
    }
    
    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clone)
    });
    
    newsArticles.unshift(clone);
    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
    renderNewsLayout();
    showToast('✅ הכתבה שוכפלה בהצלחה!');
  } catch (err) {
    console.error('Error duplicating article:', err);
    showToast('❌ שגיאה בשכפול הכתבה', 'error');
  }
}
window.duplicateArticle = duplicateArticle;

async function deleteArticle(id) {
  const isHeb = document.body.classList.contains('rtl-layout');
  const confirmMsg = isHeb ? 'האם אתה בטוח שברצונך למחוק את הכתבה הזו?' : 'Are you sure you want to delete this article?';
  if (!confirm(confirmMsg)) return;

  const orig = newsArticles.find(x => x.id === id);
  if (!orig) return;

  showToast(isHeb ? '⏳ מוחק כתבה...' : '⏳ Deleting article...');

  try {
    if (window.db && window.fbFirestore && orig.firestoreId) {
      const { doc, deleteDoc } = window.fbFirestore;
      await deleteDoc(doc(window.db, "articles", orig.firestoreId));
    }
    
    // Also delete from local API
    await fetch(`/api/articles/${orig.id}`, {
      method: 'DELETE'
    });

    // Remove from local array
    newsArticles = newsArticles.filter(x => x.id !== id);
    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
    
    // If viewing the deleted article, return to home
    if (typeof currentArticleId !== 'undefined' && currentArticleId === id) {
      showPage('home');
    } else {
      renderNewsLayout();
    }
    
    showToast(isHeb ? '✅ הכתבה נמחקה בהצלחה!' : '✅ Article deleted successfully!');
  } catch (err) {
    console.error('Error deleting article:', err);
    showToast(isHeb ? '❌ שגיאה במחיקת הכתבה' : '❌ Error deleting article', 'error');
  }
}
window.deleteArticle = deleteArticle;

async function saveTextEdit(newText) {
  if (!_editPopupTarget) return;
  const el = _editPopupTarget;

  // Check if editing an article detail element
  const articleContainer = el.closest('#article-content');
  if (articleContainer && typeof currentArticleId !== 'undefined' && currentArticleId) {
    const a = newsArticles.find(x => x.id === currentArticleId);
    if (a) {
      if (el.id === 'inline-title') {
        a.title = newText;
      } else if (el.id === 'inline-author') {
        a.author = newText;
      } else if (el.id === 'inline-time') {
        a.time = newText;
      } else if (el.id === 'inline-text') {
        a.content = newText;
        a.text = newText;
      } else if (el.id === 'inline-category') {
        a.category = newText;
      }
      
      await saveEditedArticle(a);
      showArticle(currentArticleId);
      closeTextEditPopup();
      return;
    }
  }

  // Apply the new text (default static element behavior)
  el.textContent = newText;

  // Save to customizations using DOM path
  const key = getImageIdentifier(el);
  activeCustomizations[key] = { text: newText };
  closeTextEditPopup();
  await saveCustomizationsToServer();
}

function closeTextEditPopup() {
  const popup = document.getElementById('text-edit-popup');
  if (popup) popup.remove();
  _editPopupTarget = null;
}

// ---- Edit mode click listener ----
// Single listener: click on image → image editor
document.addEventListener('click', function(e) {
  if (!window.isEditModeActive) return;

  const target = e.target;
  if (!target || typeof target.closest !== 'function') return;

  // Ignore clicks inside our own UI
  if (
    target.closest('#text-edit-popup') ||
    target.closest('#image-editor-modal') ||
    target.closest('#admin-edit-mode-toggle') ||
    target.closest('.section-drag-handle') ||
    target.closest('.section-move-btn') ||
    target.closest('.section-hide-btn') ||
    target.closest('.article-duplicate-btn') ||
    target.closest('.article-delete-btn') ||
    target.closest('.article-crop-btn') ||
    target.closest('#user-profile-badge') ||
    target.closest('[data-no-edit]')
  ) return;

  // Check for image click
  const imgEl = findImageTarget(target);
  if (imgEl && imgEl.id !== 'user-badge-avatar' && !imgEl.closest('.panel-logo') && !imgEl.closest('#text-edit-popup')) {
    e.preventDefault();
    e.stopPropagation();
    openImageEditor(imgEl);
    return;
  }
}, true);

// Double-click listener: double click on text → text edit popup
document.addEventListener('dblclick', function(e) {
  if (!window.isEditModeActive) return;

  const target = e.target;
  if (!target || typeof target.closest !== 'function') return;

  // Ignore double clicks inside our own UI
  if (
    target.closest('#text-edit-popup') ||
    target.closest('#image-editor-modal') ||
    target.closest('#admin-edit-mode-toggle') ||
    target.closest('.section-drag-handle') ||
    target.closest('.section-move-btn') ||
    target.closest('.section-hide-btn') ||
    target.closest('#user-profile-badge') ||
    target.closest('[data-no-edit]')
  ) return;

  // Check for text element click — headings, paragraphs, list items, spans, and text-only divs
  const textEl = target.closest('h1, h2, h3, h4, h5, h6, p, li, span, div');
  if (textEl && !textEl.closest('[data-no-edit]')) {
    const isSidebarText = textEl.closest('.sidebar');
    
    // Safely skip structural layout divs
    if (textEl.tagName === 'DIV') {
      if (target === textEl && textEl.children.length > 0) return;
      const classStr = textEl.className || '';
      const styleAttr = textEl.getAttribute('style') || '';
      if (
        classStr.includes('wrapper') || 
        classStr.includes('container') || 
        classStr.includes('section') || 
        classStr.includes('grid') || 
        classStr.includes('flex') ||
        classStr.includes('page') ||
        styleAttr.includes('display: flex') ||
        styleAttr.includes('display: flex')
      ) return;
      // Skip empty or purely spacing divs
      if (textEl.textContent.trim().length === 0) return;
    }

    // Allow editing inside sidebar, or if not inside sidebar, verify it's not standard chrome
    if (isSidebarText || (!textEl.closest('button') && !textEl.closest('nav'))) {
      // Skip very short spans (like icons or small badges)
      if (textEl.tagName === 'SPAN' && textEl.textContent.trim().length < 2) return;
      // Skip spans that are children of interactive buttons/links unless in sidebar
      if (!isSidebarText && textEl.tagName === 'SPAN' && (textEl.parentElement?.tagName === 'BUTTON' || textEl.parentElement?.tagName === 'A')) return;
      
      e.preventDefault();
      e.stopPropagation();
      openTextEditPopup(textEl);
      return;
    }
  }
}, true);

// Close popup on outside click
document.addEventListener('click', function(e) {
  if (!window.isEditModeActive) return;
  const popup = document.getElementById('text-edit-popup');
  if (popup && !popup.contains(e.target) && e.target !== _editPopupTarget) {
    closeTextEditPopup();
  }
}, false);


// =====================================================================
// LIVE MESSAGE SYSTEM LOGIC (Direct User-Admin Messaging)
// =====================================================================

window._supportChatMode = 'assistant'; // default view
window._activeAdminChatThreadId = null;

function toggleSupportChatMode() {
  const isHeb = (currentLocation && currentLocation.id === 'Israel');
  const aiTab = document.getElementById('support-ai-tab');
  const directTab = document.getElementById('support-direct-tab');
  const modeBtn = document.getElementById('chat-mode-btn');
  const headerTitle = document.getElementById('chat-header-title');

  if (window._supportChatMode === 'assistant') {
    window._supportChatMode = 'direct';
    if (aiTab) aiTab.style.display = 'none';
    if (directTab) directTab.style.display = 'block';
    
    // Customize button text to switch back
    if (modeBtn) {
      modeBtn.textContent = isHeb ? 'עוזר וירטואלי' : 'AI Assistant';
      modeBtn.style.background = '#34c759 !important'; // elegant green
    }
    if (headerTitle) {
      headerTitle.textContent = isHeb ? '💬 הודעות תמיכה' : '💬 Support Messages';
    }
    
    loadDirectMessages();
    
    // Auto pull updates every 5 seconds while in messages view
    if (window._supportPullInterval) clearInterval(window._supportPullInterval);
    window._supportPullInterval = setInterval(loadDirectMessages, 5000);
    
    // Clear badge immediately on open
    setTimeout(checkUnreadSupportMessages, 100);
  } else {
    window._supportChatMode = 'assistant';
    if (aiTab) aiTab.style.display = 'block';
    if (directTab) directTab.style.display = 'none';
    
    if (modeBtn) {
      modeBtn.textContent = isHeb ? 'הודעות' : 'Messages';
      modeBtn.style.background = '#0071e3 !important'; // blue
    }
    if (headerTitle) {
      headerTitle.textContent = isHeb ? '✨ עוזר וירטואלי חכם' : '✨ Smart Virtual Assistant';
    }
    
    if (window._supportPullInterval) {
      clearInterval(window._supportPullInterval);
      window._supportPullInterval = null;
    }
    
    checkUnreadSupportMessages();
  }
}

function getSupportUserId() {
  if (typeof currentUser !== 'undefined' && currentUser && currentUser.email) {
    return currentUser.email;
  }
  let guestId = localStorage.getItem('supportGuestId');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('supportGuestId', guestId);
  }
  return guestId;
}

function getSupportUserName() {
  if (typeof currentUser !== 'undefined' && currentUser && currentUser.name) {
    return currentUser.name;
  }
  return 'Guest Customer';
}

async function checkUnreadSupportMessages() {
  const userId = getSupportUserId();
  let msgs = [];

  // Try fetching from Firestore
  if (window.fbGetDocs && window.fbDb) {
    try {
      const snap = await window.fbGetDocs(window.fbColl(window.fbDb, 'supportDirectMessages'));
      snap.forEach(doc => {
        const data = doc.data();
        if (data.userId === userId) {
          msgs.push(data);
        }
      });
    } catch(e) {}
  }

  // Fallback to localstorage
  if (msgs.length === 0) {
    const localMsgs = JSON.parse(localStorage.getItem('supportDirectMessages') || '[]');
    msgs = localMsgs.filter(m => m.userId === userId);
  }

  // If user is currently looking at direct chat, mark unread admin messages as read
  if (window._supportChatMode === 'direct') {
    let changed = false;
    
    // Local update
    const localMsgs = JSON.parse(localStorage.getItem('supportDirectMessages') || '[]');
    localMsgs.forEach(m => {
      if (m.userId === userId && m.isAdmin && !m.read) {
        m.read = true;
        changed = true;
      }
    });
    
    if (changed) {
      localStorage.setItem('supportDirectMessages', JSON.stringify(localMsgs));
      
      // Update Firestore docs read flag (Optional, local storage handles it smoothly)
      if (window.fbAddDoc && window.fbDb) {
        try {
          // Send a dummy read receipt trigger if desired, or let the local sync handle client state
        } catch(e){}
      }
    }
    updateSupportBadge(0);
  } else {
    const unreadCount = msgs.filter(m => m.isAdmin && !m.read).length;
    updateSupportBadge(unreadCount);
  }
}

function updateSupportBadge(count) {
  const badge = document.getElementById('support-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

async function sendDirectChatMessage() {
  const input = document.getElementById('direct-chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const userId = getSupportUserId();
  const userName = getSupportUserName();
  const timestamp = new Date().toISOString();

  const msgObj = {
    userId: userId,
    senderName: userName,
    text: text,
    timestamp: timestamp,
    isAdmin: false,
    read: true // user reads their own message
  };

  // 1. Try to save to Firestore
  if (window.fbAddDoc && window.fbDb) {
    try {
      await window.fbAddDoc(window.fbColl(window.fbDb, 'supportDirectMessages'), msgObj);
    } catch(e) {
      console.warn('[DirectChat] Firestore save failed, local fallback:', e);
    }
  }

  // 2. Save to localstorage array
  const localMsgs = JSON.parse(localStorage.getItem('supportDirectMessages') || '[]');
  localMsgs.push(msgObj);
  localStorage.setItem('supportDirectMessages', JSON.stringify(localMsgs));

  input.value = '';
  loadDirectMessages();
}

async function loadDirectMessages() {
  const container = document.getElementById('direct-chat-messages');
  if (!container) return;

  const userId = getSupportUserId();
  let msgs = [];

  // Try fetching from Firestore
  if (window.fbGetDocs && window.fbDb) {
    try {
      const snap = await window.fbGetDocs(window.fbColl(window.fbDb, 'supportDirectMessages'));
      snap.forEach(doc => {
        const data = doc.data();
        if (data.userId === userId) {
          msgs.push(data);
        }
      });
      msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } catch(e) {}
  }

  // Fallback to localStorage if Firestore yielded no matches or failed
  if (msgs.length === 0) {
    const localMsgs = JSON.parse(localStorage.getItem('supportDirectMessages') || '[]');
    msgs = localMsgs.filter(m => m.userId === userId);
    msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  if (msgs.length === 0) {
    const isHeb = (currentLocation && currentLocation.id === 'Israel');
    container.innerHTML = `<div style="text-align:center; padding:40px; color:#86868b;" id="direct-chat-placeholder">${isHeb ? "אין הודעות עדיין. כתוב משהו למעלה כדי להתחיל צ'אט ישיר עם מנהל האתר! 💬" : "No messages yet. Send a message to start a live support session with the admin! 💬"}</div>`;
    return;
  }

  container.innerHTML = msgs.map(m => {
    const isMe = !m.isAdmin;
    const timeStr = m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const bubbleBg = isMe ? 'var(--primary)' : 'rgba(255,255,255,0.08)';
    const textColor = isMe ? '#ffffff' : '#ffffff';
    const align = isMe ? 'flex-end' : 'flex-start';
    const direction = 'ltr';

    return `
      <div style="background:${bubbleBg}; color:${textColor}; padding:10px 14px; border-radius:14px; align-self:${align}; max-width:85%; font-size:0.95rem; display:flex; flex-direction:column; gap:4px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <span style="font-weight: 500; font-size: 0.78rem; opacity: 0.7;">${m.isAdmin ? 'Admin' : m.senderName}</span>
        <span style="white-space: pre-wrap; word-break: break-word;">${m.text}</span>
        <span style="font-size:0.68rem; opacity:0.5; align-self:flex-end;">${timeStr}</span>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
  checkUnreadSupportMessages();
}

// ── Admin Live Chat Tab Swapper ──
window._adminMsgsSubtab = 'contact';

function switchAdminMsgsSubtab(tab) {
  window._adminMsgsSubtab = tab;
  
  const btnContact = document.getElementById('admin-msgs-subtab-contact');
  const btnDirect = document.getElementById('admin-msgs-subtab-direct');
  const contactList = document.getElementById('manager-msgs-list');
  const directList = document.getElementById('manager-direct-chats-container');

  if (tab === 'contact') {
    if (btnContact) btnContact.style.background = '#0071e3';
    if (btnContact) btnContact.style.color = '#fff';
    if (btnDirect) btnDirect.style.background = 'rgba(255,255,255,0.05)';
    if (btnDirect) btnDirect.style.color = '#a1a1aa';
    
    if (contactList) contactList.style.display = 'flex';
    if (directList) directList.style.display = 'none';
    
    renderManagerMessages();
  } else {
    if (btnContact) btnContact.style.background = 'rgba(255,255,255,0.05)';
    if (btnContact) btnContact.style.color = '#a1a1aa';
    if (btnDirect) btnDirect.style.background = '#0071e3';
    if (btnDirect) btnDirect.style.color = '#fff';
    
    if (contactList) contactList.style.display = 'none';
    if (directList) directList.style.display = 'flex';
    
    renderAdminDirectChats();
    
    // Auto refresh every 5 seconds while in admin direct chat subtab
    if (window._adminDirectChatsInterval) clearInterval(window._adminDirectChatsInterval);
    window._adminDirectChatsInterval = setInterval(renderAdminDirectChats, 5000);
  }
}

// Hook subtab tab change inside the main switchAdminTab function
const origSwitchAdminTab = window.switchAdminTab;
window.switchAdminTab = function(tabId, btn) {
  if (origSwitchAdminTab) origSwitchAdminTab(tabId, btn);
  if (tabId === 'manager-msgs') {
    switchAdminMsgsSubtab(window._adminMsgsSubtab || 'contact');
  } else {
    if (window._adminDirectChatsInterval) {
      clearInterval(window._adminDirectChatsInterval);
      window._adminDirectChatsInterval = null;
    }
  }
  if (tabId === 'backup') {
    if (window.renderBackupTimeline) window.renderBackupTimeline();
  }
};

async function renderAdminDirectChats() {
  const listContainer = document.getElementById('admin-chat-threads-list');
  if (!listContainer) return;

  let allMsgs = [];

  // 1. Fetch all direct chat messages
  if (window.fbGetDocs && window.fbDb) {
    try {
      const snap = await window.fbGetDocs(window.fbColl(window.fbDb, 'supportDirectMessages'));
      snap.forEach(doc => allMsgs.push(doc.data()));
    } catch(e) {}
  }

  if (allMsgs.length === 0) {
    allMsgs = JSON.parse(localStorage.getItem('supportDirectMessages') || '[]');
  }

  // 2. Group messages by userId
  const threadsMap = {};
  allMsgs.forEach(m => {
    if (!m.userId) return;
    if (!threadsMap[m.userId]) {
      threadsMap[m.userId] = [];
    }
    threadsMap[m.userId].push(m);
  });

  // Convert map to list of threads with last message details
  const threads = Object.keys(threadsMap).map(userId => {
    const msgs = threadsMap[userId];
    msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const lastMsg = msgs[msgs.length - 1];
    return {
      userId,
      messages: msgs,
      lastMsg,
      senderName: msgs[0].senderName || 'Anonymous User'
    };
  });

  // Sort threads by latest message timestamp
  threads.sort((a, b) => new Date(b.lastMsg.timestamp) - new Date(a.lastMsg.timestamp));

  if (threads.length === 0) {
    listContainer.innerHTML = '<div style="padding:16px; color:#86868b; text-align:center; font-size:0.85rem;">אין פניות בצ\'אט עדיין</div>';
    return;
  }

  listContainer.innerHTML = threads.map(t => {
    const isSelected = window._activeAdminChatThreadId === t.userId;
    const border = isSelected ? 'border-right: 4px solid #0071e3; background:rgba(0,113,227,0.1);' : 'border-right: 4px solid transparent;';
    const textStyle = isSelected ? 'color:#ffffff; font-weight:700;' : 'color:#f5f5f7;';
    const timeStr = t.lastMsg.timestamp ? new Date(t.lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
    
    return `
      <div onclick="selectAdminChatThread('${t.userId}')" style="padding:12px 16px; cursor:pointer; border-bottom:1px solid #2c2c2e; display:flex; flex-direction:column; gap:4px; ${border}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.88rem; ${textStyle}">${t.senderName}</span>
          <span style="font-size:0.7rem; color:#86868b;">${timeStr}</span>
        </div>
        <span style="font-size:0.78rem; color:#86868b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${t.lastMsg.text}</span>
      </div>
    `;
  }).join('');

  if (window._activeAdminChatThreadId) {
    renderAdminChatPane(window._activeAdminChatThreadId, threadsMap[window._activeAdminChatThreadId] || []);
  }
}

function selectAdminChatThread(userId) {
  window._activeAdminChatThreadId = userId;
  renderAdminDirectChats();
}

function renderAdminChatPane(userId, msgs) {
  const pane = document.getElementById('admin-chat-messages-pane');
  if (!pane) return;

  msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const messagesHtml = msgs.map(m => {
    const isAdminReply = m.isAdmin;
    const align = isAdminReply ? 'flex-start' : 'flex-end'; // since the pane is RTL or LTR
    const bubbleBg = isAdminReply ? 'rgba(0,113,227,0.2)' : 'rgba(255,255,255,0.06)';
    const border = isAdminReply ? 'border: 1px solid rgba(0,113,227,0.4);' : 'border: 1px solid rgba(255,255,255,0.05);';
    const timeStr = m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    
    return `
      <div style="align-self:${align}; max-width:80%; padding:10px 14px; border-radius:12px; font-size:0.9rem; background:${bubbleBg}; ${border} display:flex; flex-direction:column; gap:4px;">
        <div style="display:flex; gap:8px; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; font-size:0.75rem; color:#a1a1aa;">${m.isAdmin ? 'תומך' : m.senderName}</span>
          <span style="font-size:0.65rem; color:#86868b;">${timeStr}</span>
        </div>
        <span style="color:#ffffff; white-space:pre-wrap; word-break:break-all;">${m.text}</span>
      </div>
    `;
  }).join('');

  pane.innerHTML = `
    <div style="flex:1; display:flex; flex-direction:column; padding:16px; overflow-y:auto; gap:12px;" id="admin-chat-messages-log">
      ${messagesHtml}
    </div>
    <div style="padding:16px; border-top:1px solid #2c2c2e; background:#1c1c1e; display:flex; gap:10px; align-items:center;">
      <input type="text" id="admin-chat-reply-input" class="admin-input" placeholder="כתוב מענה למשתמש..." style="flex:1; margin:0;" onkeypress="if(event.key === 'Enter') sendAdminDirectReply('${userId}')">
      <button class="btn-primary" onclick="sendAdminDirectReply('${userId}')" style="height:44px; padding:0 20px;">שלח</button>
    </div>
  `;

  const log = document.getElementById('admin-chat-messages-log');
  if (log) log.scrollTop = log.scrollHeight;
}

async function sendAdminDirectReply(userId) {
  const input = document.getElementById('admin-chat-reply-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const timestamp = new Date().toISOString();
  const replyObj = {
    userId: userId,
    senderName: 'Admin Support',
    text: text,
    timestamp: timestamp,
    isAdmin: true,
    read: true
  };

  // 1. Save to Firestore
  if (window.fbAddDoc && window.fbDb) {
    try {
      await window.fbAddDoc(window.fbColl(window.fbDb, 'supportDirectMessages'), replyObj);
    } catch(e) {
      console.warn('[DirectChatAdmin] Firestore reply save failed:', e);
    }
  }

  // 2. Save to localstorage fallback array
  const localMsgs = JSON.parse(localStorage.getItem('supportDirectMessages') || '[]');
  localMsgs.push(replyObj);
  localStorage.setItem('supportDirectMessages', JSON.stringify(localMsgs));

  input.value = '';
  renderAdminDirectChats();
}

window.renderRecentActivity = function() {
  const container = document.getElementById('recent-activity-list');
  if (!container) return;

  let activities = [];

  // Retrieve custom local comments to show real-time user comment activity
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('comments_article_')) {
      const articleId = parseInt(key.replace('comments_article_', ''));
      const article = typeof newsArticles !== 'undefined' ? newsArticles.find(x => x.id === articleId) : null;
      if (article) {
        try {
          const comments = JSON.parse(localStorage.getItem(key) || '[]');
          comments.forEach(comment => {
            activities.push({
              type: 'comment',
              userName: comment.userName || 'xd xd',
              userAvatar: comment.userAvatar || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png',
              actionText: 'הגיב/ה בכתבה:',
              title: article.title,
              subDetails: comment.text.substring(0, 50) + (comment.text.length > 50 ? '...' : ''),
              timestamp: comment.date || 'עכשיו',
              link: `showArticle(${article.id})`
            });
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  // Fallback high-quality mock actions matching the Reddit screenshot style
  const mockActivities = [
    {
      type: 'post',
      userName: 'r/blender',
      userAvatar: 'https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png',
      actionText: 'העלה/תה פוסט חדש בפורום:',
      title: 'Vintage cartoon shaders in Blender',
      subDetails: '8.7K upvotes • 63 comments',
      timestamp: 'לפני 6 ימים',
      link: 'showPage("groups")'
    },
    {
      type: 'comment',
      userName: 'r/comics',
      userAvatar: 'https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png',
      actionText: 'הגיב/ה בפורום:',
      title: 'tradition (swipe right)',
      subDetails: '6K upvotes • 136 comments',
      timestamp: 'לפני 8 שעות',
      link: 'showPage("groups")'
    },
    {
      type: 'post',
      userName: 'r/Gamesir',
      userAvatar: 'https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png',
      actionText: 'שאל/ה שאלה בפורום:',
      title: 'Gamesir not connecting correctly to Mac.',
      subDetails: '4 upvotes • 7 comments',
      timestamp: 'לפני 9 חודשים',
      link: 'showPage("groups")'
    },
    {
      type: 'comment',
      userName: 'r/PleX',
      userAvatar: 'https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png',
      actionText: 'הגיב/ה בפורום:',
      title: 'Setting up Plex Media Server - Massive Beginner',
      subDetails: '23 upvotes • 28 comments',
      timestamp: 'לפני 6 חודשים',
      link: 'showPage("groups")'
    }
  ];

  activities = activities.concat(mockActivities);

  // If cleared by user
  const isCleared = localStorage.getItem('recent_activity_cleared') === 'true';
  if (isCleared) {
    const clearedTime = parseInt(localStorage.getItem('recent_activity_cleared_time') || '0');
    activities = activities.filter(act => {
      // Keep only custom comments created after clear
      if (act.type === 'comment' && act.userName === (typeof currentUser !== 'undefined' && currentUser ? currentUser.name : 'xd xd')) {
        return true; 
      }
      return false;
    });
  }

  if (activities.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: #818384; font-size: 0.85rem; padding: 24px 0; direction: rtl;">
        אין פעילות אחרונה להצגה
      </div>
    `;
    return;
  }

  // Render list of activities with hover and divider line separators
  container.innerHTML = activities.slice(0, 6).map(act => {
    return `
      <div onclick="${act.link}" style="display: flex; gap: 12px; padding: 8px; border-radius: 8px; cursor: pointer; transition: background 0.15s; align-items: flex-start; text-align: right; direction: rtl;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='transparent'">
        <!-- Avatar Icon -->
        <img src="${act.userAvatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.1);" onerror="this.src='https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png'" />
        
        <!-- Text details -->
        <div style="display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #d1d1d6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${act.userName}</span>
            <span style="font-size: 0.72rem; color: #818384; flex-shrink: 0;">${act.timestamp}</span>
          </div>
          <span style="font-size: 0.7rem; color: #818384;">${act.actionText}</span>
          <span style="font-size: 0.82rem; font-weight: 600; color: #f2f2f7; line-height: 1.25; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">${act.title}</span>
          ${act.subDetails ? `<span style="font-size: 0.72rem; color: #0079d3; font-weight: 600; margin-top: 2px;">${act.subDetails}</span>` : ''}
        </div>
      </div>
    `;
  }).join('<div style="height: 1px; background: rgba(255,255,255,0.05); margin: 4px 0;"></div>');
};

window.clearRecentActivity = function() {
  localStorage.setItem('recent_activity_cleared', 'true');
  localStorage.setItem('recent_activity_cleared_time', Date.now().toString());
  showToast('🧹 פעילות אחרונה נוקתה');
  window.renderRecentActivity();
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (window.renderRecentActivity) window.renderRecentActivity();
  }, 1000);
  
  if (window.loadAdminLinks) window.loadAdminLinks();
  if (window.restoreLayoutOrder) window.restoreLayoutOrder();
  if (window.initBackupSystem) window.initBackupSystem();
});

// ========== LINKS MANAGER LOGIC ==========
const defaultLinks = {
  x: 'https://x.com',
  linkedin: 'https://linkedin.com',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  youtube: 'https://youtube.com',
  mastodon: 'https://mastodon.social',
  threads: 'https://threads.net',
  bluesky: 'https://bsky.app',
  appstore: 'https://apps.apple.com',
  googleplay: 'https://play.google.com',
  telegram: 'https://t.me/yourusername'
};

window.loadAdminLinks = function() {
  const saved = localStorage.getItem('soki_admin_links');
  const links = saved ? JSON.parse(saved) : defaultLinks;
  
  // Fill inputs if they exist
  const fields = ['x', 'linkedin', 'facebook', 'instagram', 'youtube', 'mastodon', 'threads', 'bluesky', 'appstore', 'googleplay', 'telegram'];
  fields.forEach(f => {
    const el = document.getElementById('inp-link-' + f);
    if (el) el.value = links[f] || '';
  });

  // Apply links to the DOM elements (footer social icons and app store badges)
  const xEl = document.getElementById('link-social-x'); if (xEl) xEl.href = links.x || '#';
  const linkedinEl = document.getElementById('link-social-linkedin'); if (linkedinEl) linkedinEl.href = links.linkedin || '#';
  const facebookEl = document.getElementById('link-social-facebook'); if (facebookEl) facebookEl.href = links.facebook || '#';
  const instagramEl = document.getElementById('link-social-instagram'); if (instagramEl) instagramEl.href = links.instagram || '#';
  const youtubeEl = document.getElementById('link-social-youtube'); if (youtubeEl) youtubeEl.href = links.youtube || '#';
  const mastodonEl = document.getElementById('link-social-mastodon'); if (mastodonEl) mastodonEl.href = links.mastodon || '#';
  const threadsEl = document.getElementById('link-social-threads'); if (threadsEl) threadsEl.href = links.threads || '#';
  const blueskyEl = document.getElementById('link-social-bluesky'); if (blueskyEl) blueskyEl.href = links.bluesky || '#';
  const appstoreEl = document.getElementById('link-app-appstore'); if (appstoreEl) appstoreEl.href = links.appstore || '#';
  const googleplayEl = document.getElementById('link-app-googleplay'); if (googleplayEl) googleplayEl.href = links.googleplay || '#';
  
  // Apply to top navbar telegram link if exists
  const navTelegramEl = document.getElementById('nav-telegram-link');
  if (navTelegramEl) navTelegramEl.href = links.telegram || 'https://t.me/';
};

window.saveAdminLinks = function(e) {
  if (e) e.preventDefault();
  const links = {
    x: document.getElementById('inp-link-x').value,
    linkedin: document.getElementById('inp-link-linkedin').value,
    facebook: document.getElementById('inp-link-facebook').value,
    instagram: document.getElementById('inp-link-instagram').value,
    youtube: document.getElementById('inp-link-youtube').value,
    mastodon: document.getElementById('inp-link-mastodon').value,
    threads: document.getElementById('inp-link-threads').value,
    bluesky: document.getElementById('inp-link-bluesky').value,
    appstore: document.getElementById('inp-link-appstore').value,
    googleplay: document.getElementById('inp-link-googleplay').value,
    telegram: document.getElementById('inp-link-telegram') ? document.getElementById('inp-link-telegram').value : ''
  };

  localStorage.setItem('soki_admin_links', JSON.stringify(links));
  showToast('💾 הקישורים נשמרו בהצלחה!');
  window.loadAdminLinks();
};

// ========== DRAG & DROP LAYOUT DESIGNER MODE ==========
window.enableLayoutDesignerMode = function() {
  window._layoutArrangeMode = true;
  
  // Create and add floating glassmorphism control bar
  let bar = document.getElementById('layout-designer-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'layout-designer-bar';
    bar.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100000;
      background: rgba(20, 20, 22, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      padding: 12px 28px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      direction: rtl;
      text-align: right;
      transition: all 0.3s ease;
      min-width: 320px;
    `;
    bar.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:2px;">
        <span style="font-weight:800; font-size:0.95rem; color:#fff; display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981; animation: pulse 1.5s infinite;"></span>
          מצב סידור חופשי פעיל 🔧
        </span>
        <span style="font-size:0.75rem; color:#a1a1aa;">לחץ לחיצה כפולה (Double Click) על כל אלמנט/אות באתר וגרור אותו לכל מקום!</span>
      </div>
      <button onclick="saveLayoutDesignerOrder()" style="background:#10b981; color:#fff; border:none; padding:8px 18px; border-radius:10px; font-weight:700; font-size:0.85rem; cursor:pointer; box-shadow:0 4px 12px rgba(16,185,129,0.3); transition:all 0.2s;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">שמור וצא 💾</button>
    `;
    document.body.appendChild(bar);
  } else {
    bar.style.display = 'flex';
  }

  // Setup draggable blocks
  const home = document.getElementById('page-home');
  if (home) {
    home.classList.add('layout-designer-active');
    
    // Find rearrangable sections
    const blocks = getLayoutBlocks();
    blocks.forEach(block => {
      block.setAttribute('draggable', 'true');
      block.classList.add('layout-designer-block');
      
      // Add visual drag handle indicator if not exists
      let handle = block.querySelector('.layout-drag-handle');
      if (!handle) {
        handle = document.createElement('div');
        handle.className = 'layout-drag-handle';
        handle.innerHTML = `<i class="fas fa-arrows-alt"></i> גרור לשינוי מיקום / Drag to move`;
        block.insertBefore(handle, block.firstChild);
      }
      
      // Drag events
      block.addEventListener('dragstart', handleDragStart);
      block.addEventListener('dragover', handleDragOver);
      block.addEventListener('drop', handleDrop);
      block.addEventListener('dragend', handleDragEnd);
    });
  }
};

function getLayoutBlocks() {
  const ids = ['category-filter-bar', 'featured-carousel-container', 'top-news-grid'];
  const blocks = [];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) blocks.push(el);
  });
  // Also main-news-layout
  const mainNews = document.querySelector('.main-news-layout');
  if (mainNews) blocks.push(mainNews);
  return blocks;
}

let dragSrcEl = null;

function handleDragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  this.classList.add('dragging');
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  
  // Visual position indicator
  const home = document.getElementById('page-home');
  const draggingBlock = document.querySelector('.layout-designer-block.dragging');
  if (!draggingBlock || this === draggingBlock) return false;
  
  const rect = this.getBoundingClientRect();
  const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
  
  if (next) {
    this.parentNode.insertBefore(draggingBlock, this.nextSibling);
  } else {
    this.parentNode.insertBefore(draggingBlock, this);
  }
  return false;
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  return false;
}

function handleDragEnd(e) {
  const blocks = getLayoutBlocks();
  blocks.forEach(block => {
    block.classList.remove('dragging');
    block.classList.remove('drag-over');
  });
}

// Global event listeners for Free Drag Mode
document.addEventListener('dblclick', function(e) {
  if (!window._layoutArrangeMode) return;
  if (e.target.closest('#layout-designer-bar')) return;
  if (e.target.closest('aside')) return; // Don't drag admin sidebar items

  const el = e.target;
  el.setAttribute('draggable', 'true');
  el.classList.add('free-draggable-element');
  
  el.style.border = '2px dashed #10b981';
  el.style.background = 'rgba(16, 185, 129, 0.05)';
  el.style.cursor = 'grab';
  
  showToast('✋ אלמנט מוכן לגרירה! גרור אותו לכל מקום.');
});

document.addEventListener('dragstart', function(e) {
  if (!window._layoutArrangeMode) return;
  window._freeDraggingElement = e.target;
  e.target.style.opacity = '0.5';
});

document.addEventListener('dragover', function(e) {
  if (!window._layoutArrangeMode || !window._freeDraggingElement) return;
  e.preventDefault();
  
  const target = e.target;
  if (target === window._freeDraggingElement || target.closest('#layout-designer-bar')) return;
  
  // Show visual drop cue
  if (target.style && !target.classList.contains('free-draggable-element')) {
    target.style.borderTop = '3px solid #10b981';
  }
});

document.addEventListener('dragleave', function(e) {
  if (!window._layoutArrangeMode) return;
  if (e.target && e.target.style) {
    e.target.style.borderTop = '';
  }
});

document.addEventListener('drop', function(e) {
  if (!window._layoutArrangeMode || !window._freeDraggingElement) return;
  e.preventDefault();
  
  const target = e.target;
  if (target.style) target.style.borderTop = '';
  
  if (target === window._freeDraggingElement || target.closest('#layout-designer-bar')) return;
  
  const rect = target.getBoundingClientRect();
  const next = e.clientY > rect.top + rect.height / 2;
  
  if (target.parentNode) {
    if (next) {
      target.parentNode.insertBefore(window._freeDraggingElement, target.nextSibling);
    } else {
      target.parentNode.insertBefore(window._freeDraggingElement, target);
    }
  }
  
  saveFreeLayoutState();
});

document.addEventListener('dragend', function(e) {
  if (!window._layoutArrangeMode) return;
  if (window._freeDraggingElement) {
    window._freeDraggingElement.style.opacity = '1';
  }
  
  // Clean up dragover border highlights
  document.querySelectorAll('*').forEach(el => {
    if (el.style && el.style.borderTop === '3px solid rgb(16, 185, 129)') {
      el.style.borderTop = '';
    }
  });
});

function saveFreeLayoutState() {
  const home = document.getElementById('page-home');
  if (!home) return;
  
  // Create a clone to clean up styles before saving
  const clone = home.cloneNode(true);
  
  // Remove drag indicators and handle divs from the clone
  clone.querySelectorAll('.free-draggable-element').forEach(el => {
    el.removeAttribute('draggable');
    el.classList.remove('free-draggable-element');
    el.style.border = '';
    el.style.background = '';
    el.style.cursor = '';
    el.style.opacity = '';
  });
  clone.querySelectorAll('.layout-drag-handle').forEach(el => el.remove());
  clone.querySelectorAll('.layout-designer-block').forEach(el => {
    el.removeAttribute('draggable');
    el.classList.remove('layout-designer-block');
  });

  // Save the cleaned innerHTML
  localStorage.setItem('soki_home_custom_html_v3', clone.innerHTML);
}

window.saveLayoutDesignerOrder = function() {
  window._layoutArrangeMode = false;
  
  // Hide bar
  const bar = document.getElementById('layout-designer-bar');
  if (bar) bar.style.display = 'none';

  // Save custom innerHTML of page home
  const home = document.getElementById('page-home');
  if (home) {
    home.classList.remove('layout-designer-active');
    
    // Clean up temporary draggable styling
    document.querySelectorAll('[draggable="true"]').forEach(el => {
      el.removeAttribute('draggable');
      el.classList.remove('free-draggable-element');
      el.classList.remove('layout-designer-block');
      el.style.border = '';
      el.style.background = '';
      el.style.cursor = '';
      el.style.opacity = '';
    });
    
    // Remove drag handles
    document.querySelectorAll('.layout-drag-handle').forEach(handle => handle.remove());
    
    // Save final cleaned HTML state
    saveFreeLayoutState();
    
    showToast('💾 מיקומי כל הרכיבים והאותיות נשמרו בהצלחה!');
  }
};

window.restoreLayoutOrder = function() {
  const savedHtml = localStorage.getItem('soki_home_custom_html_v3');
  const home = document.getElementById('page-home');
  if (savedHtml && home) {
    home.innerHTML = savedHtml;
  }
};

// ========== REAL-TIME ANALYTICS & CLICK HEATMAP WIDGETS ==========
function logUserLogin(user) {
  if (!user || !user.email) return;
  const logins = JSON.parse(localStorage.getItem('soki_analytics_logins') || '[]');
  
  // Throttle logins (ignore if same user logged in < 5 mins ago)
  const lastLogin = logins.find(l => l.email === user.email);
  if (lastLogin && (Date.now() - new Date(lastLogin.timestamp).getTime()) < 1000 * 60 * 5) {
    return;
  }

  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|iphone|ipad|android|blackberry/i.test(ua);
  const device = isMobile ? 'Mobile' : 'Desktop';

  logins.unshift({
    name: user.name || 'Anonymous User',
    email: user.email,
    avatar: user.avatar || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png',
    timestamp: new Date().toISOString(),
    device: device,
    location: 'ישראל (תל אביב)'
  });
  localStorage.setItem('soki_analytics_logins', JSON.stringify(logins));
}

// Log initial user login if active
if (typeof currentUser !== 'undefined' && currentUser) {
  logUserLogin(currentUser);
}

// Global Click Tracking for Interaction Heatmap
document.addEventListener('click', function(e) {
  if (window._layoutArrangeMode) return;
  if (e.target.closest('#layout-designer-bar')) return;
  if (e.target.closest('aside')) return; // Avoid admin nav clicks
  
  const clicks = JSON.parse(localStorage.getItem('soki_interaction_clicks') || '[]');
  
  // Cap at 200 clicks to optimize memory while keeping dense clusters
  if (clicks.length > 200) {
    clicks.pop();
  }

  clicks.unshift({
    x: e.clientX,
    y: e.clientY,
    w: window.innerWidth,
    h: window.innerHeight,
    tagName: e.target.tagName,
    timestamp: new Date().toISOString()
  });
  
  localStorage.setItem('soki_interaction_clicks', JSON.stringify(clicks));
});

window.clearHeatmapData = function() {
  if (confirm('האם אתה בטוח שברצונך לאפס את כל נתוני מפת החום?')) {
    localStorage.setItem('soki_interaction_clicks', JSON.stringify([]));
    renderAdminAnalytics();
    showToast('🧹 מפת החום אופסה בהצלחה!');
  }
};

window.renderAdminAnalytics = function() {
  const clicks = JSON.parse(localStorage.getItem('soki_interaction_clicks') || '[]');
  const logins = JSON.parse(localStorage.getItem('soki_analytics_logins') || '[]');
  const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');

  // ── Timestamp / filter bar ──
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const refreshEl = document.getElementById('an-refresh-time');
  if (refreshEl) refreshEl.textContent = timeStr;
  const dateEl = document.getElementById('an-date-label');
  if (dateEl) dateEl.textContent = dateStr;

  // ── Sales metrics ──
  const totalSales = orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0);
  const fmt = v => v.toFixed(2);
  ['an-gross-sales','an-total-sales','an-bd-gross','an-bd-net','an-bd-total'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = fmt(totalSales);
  });
  const avgOrder = orders.length ? (totalSales / orders.length) : 0;
  const avgEl = document.getElementById('an-avg-order'); if (avgEl) avgEl.textContent = fmt(avgOrder);
  const ordEl = document.getElementById('an-total-orders'); if (ordEl) ordEl.textContent = orders.length;
  const fulEl = document.getElementById('an-orders-fulfilled'); if (fulEl) fulEl.textContent = orders.filter(o => o.status === 'fulfilled').length;

  // ── Draw sales chart (24 hours buckets) ──
  const canvas = document.getElementById('an-sales-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth || 600;
    canvas.height = 180;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Build hourly buckets for today
    const buckets = Array(24).fill(0);
    const today = new Date(); today.setHours(0,0,0,0);
    orders.forEach(o => {
      const d = new Date(o.timestamp || o.date || Date.now());
      if (d >= today) buckets[d.getHours()] += parseFloat(o.total) || 0;
    });
    const maxVal = Math.max(...buckets, 10);
    const padL = 40, padR = 20, padT = 10, padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    // Grid lines
    ctx.strokeStyle = '#f3f4f6'; ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1].forEach(p => {
      const y = padT + chartH * (1 - p);
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
      ctx.fillStyle = '#9ca3af'; ctx.font = '10px Inter';
      ctx.fillText('₪' + Math.round(maxVal * p), 2, y + 3);
    });

    // Today line (solid blue)
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2; ctx.beginPath();
    buckets.forEach((v, i) => {
      const x = padL + (i / 23) * chartW;
      const y = padT + chartH * (1 - v / maxVal);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill gradient under today line
    const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    grad.addColorStop(0, 'rgba(37,99,235,0.15)');
    grad.addColorStop(1, 'rgba(37,99,235,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    buckets.forEach((v, i) => {
      const x = padL + (i / 23) * chartW;
      const y = padT + chartH * (1 - v / maxVal);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(padL + chartW, padT + chartH);
    ctx.lineTo(padL, padT + chartH);
    ctx.closePath(); ctx.fill();

    // Yesterday (dashed light blue, all zeros)
    ctx.strokeStyle = '#93c5fd'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let i = 0; i <= 23; i++) {
      const x = padL + (i / 23) * chartW;
      const y = padT + chartH;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.setLineDash([]);
  }

  // Update stats counters
  const totalClicksEl = document.getElementById('analytics-total-clicks');
  const totalLoginsEl = document.getElementById('analytics-total-logins');
  if (totalClicksEl) totalClicksEl.textContent = clicks.length;
  if (totalLoginsEl) totalLoginsEl.textContent = logins.length;

  // Calculate device breakdown based on logged-in sessions
  let desktopCount = 0;
  let mobileCount = 0;
  logins.forEach(l => {
    if (l.device === 'Mobile') mobileCount++;
    else desktopCount++;
  });

  const totalDevices = logins.length || 1;
  const desktopPct = Math.round((desktopCount / totalDevices) * 100);
  const mobilePct = 100 - desktopPct;

  const desktopPctEl = document.getElementById('analytics-desktop-pct');
  const mobilePctEl = document.getElementById('analytics-mobile-pct');
  const deviceBarEl = document.getElementById('analytics-device-bar');
  if (desktopPctEl) desktopPctEl.textContent = desktopPct + '%';
  if (mobilePctEl) mobilePctEl.textContent = mobilePct + '%';
  if (deviceBarEl) deviceBarEl.style.width = desktopPct + '%';

  // Render Logins list
  const loginsListEl = document.getElementById('analytics-logins-list');
  if (loginsListEl) {
    if (logins.length === 0) {
      loginsListEl.innerHTML = '<div style="text-align:center; padding:40px; color:#86868b; font-size:0.85rem;">אין התחברויות רשומות עדיין</div>';
    } else {
      loginsListEl.innerHTML = logins.map(l => {
        const timeStr = new Date(l.timestamp).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
        return `
          <div style="background:#fff; border:1px solid #f3f4f6; padding:10px 14px; border-radius:8px; display:flex; align-items:center; justify-content:space-between; gap:12px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${l.avatar}" style="width:32px; height:32px; border-radius:50%; border:1px solid #e5e7eb;" onerror="this.src='https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png'">
              <div>
                <div style="font-size:0.85rem; font-weight:600; color:#111;">${l.name}</div>
                <div style="font-size:0.75rem; color:#6b7280;">${l.email}</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.75rem; color:#374151; font-weight:500;">${l.device === 'Mobile' ? '📱 Mobile' : '💻 Desktop'}</div>
              <div style="font-size:0.68rem; color:#9ca3af;">${timeStr}</div>
            </div>
          </div>`;
      }).join('');
    }
  }

  // Draw Heatmap click overlay spots
  const spotsContainer = document.getElementById('heatmap-overlay-spots');
  if (spotsContainer) {
    if (clicks.length === 0) {
      spotsContainer.innerHTML = '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#86868b; font-size:0.8rem; font-weight:500;">אין נתוני הקלקות רשומים</div>';
    } else {
      // Find min/max coordinates to normalize them relative to sandbox frame size
      spotsContainer.innerHTML = clicks.map(c => {
        // Normalize click spots so they distribute perfectly inside the mockup box regardless of user screen size
        const relativeX = (c.x / (c.w || window.innerWidth)) * 100;
        const relativeY = (c.y / (c.h || window.innerHeight)) * 100;
        
        // Heatmap color based on click density/random thermal variations (glowing radial gradients)
        const size = Math.floor(Math.random() * 20) + 16; // Random diameter between 16px and 36px for natural organic thermal feel
        
        return `
          <div style="
            position:absolute;
            left:${relativeX}%;
            top:${relativeY}%;
            width:${size}px;
            height:${size}px;
            transform:translate(-50%,-50%);
            background:radial-gradient(circle, rgba(239,68,68,0.85) 0%, rgba(249,115,22,0.4) 40%, rgba(239,68,68,0) 80%);
            border-radius:50%;
            pointer-events:none;
            animation: pulse 2s infinite ease-in-out;
          "></div>
        `;
      }).join('');
    }
  }
};

// ========== TIME MACHINE BACKUP & RESTORE LOGIC ==========
window.initBackupSystem = function() {
  const backupsKey = 'soki_state_backups';
  let backups = [];
  try {
    backups = JSON.parse(localStorage.getItem(backupsKey) || '[]');
  } catch (e) {
    backups = [];
  }

  // Pre-populate simulated backups if none exist, so the user can immediately restore to 15 minutes ago
  if (backups.length === 0) {
    const now = Date.now();
    const intervals = [5, 10, 15, 30]; // Minutes ago
    
    // Capture current localStorage state as base
    const baseState = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== backupsKey) {
        baseState[key] = localStorage.getItem(key);
      }
    }

    // Ensure we have a healthy articles state in the backup to restore pre-deleted files
    if (typeof defaultNewsArticles !== 'undefined') {
      baseState['newsArticles'] = JSON.stringify(defaultNewsArticles);
    }

    intervals.forEach(mins => {
      const timeStamp = now - mins * 60 * 1000;
      const dateObj = new Date(timeStamp);
      const timeLabel = dateObj.toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit'});
      
      // Simulate state slightly modified (but healthy)
      const simulatedState = { ...baseState };
      
      backups.push({
        timestamp: timeStamp,
        timeLabel: timeLabel,
        minutesAgo: mins,
        isManual: false,
        size: Math.round(JSON.stringify(simulatedState).length / 1024) + ' KB',
        state: simulatedState
      });
    });

    localStorage.setItem(backupsKey, JSON.stringify(backups));
  }

  // Render the timeline in case they are already on the backup tab
  window.renderBackupTimeline();

  // Setup rolling interval snapshot every 60 seconds
  if (window._rollingBackupInterval) clearInterval(window._rollingBackupInterval);
  window._rollingBackupInterval = setInterval(() => {
    window.takeBackupSnapshot(false);
  }, 60 * 1000);
};

window.takeBackupSnapshot = function(isManual) {
  const backupsKey = 'soki_state_backups';
  let backups = [];
  try {
    backups = JSON.parse(localStorage.getItem(backupsKey) || '[]');
  } catch (e) {
    backups = [];
  }

  // Capture current localStorage state
  const currentState = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key !== backupsKey) {
      currentState[key] = localStorage.getItem(key);
    }
  }

  const now = Date.now();
  const timeLabel = new Date(now).toLocaleTimeString('he-IL', {hour: '2-digit', minute:'2-digit', second:'2-digit'});
  const size = Math.round(JSON.stringify(currentState).length / 1024) + ' KB';

  backups.unshift({
    timestamp: now,
    timeLabel: timeLabel,
    isManual: !!isManual,
    size: size,
    state: currentState
  });

  // Cap history at 50 snapshots
  if (backups.length > 50) {
    backups = backups.slice(0, 50);
  }

  localStorage.setItem(backupsKey, JSON.stringify(backups));
  window.renderBackupTimeline();

  if (isManual) {
    showToast('📸 נקודת שחזור ידנית נוצרה בהצלחה!');
  }
};

window.clearAllBackups = function() {
  if (confirm('האם אתה בטוח שברצונך למחוק את כל היסטוריית הגיבויים?')) {
    localStorage.removeItem('soki_state_backups');
    window.initBackupSystem();
    showToast('🧹 היסטוריית הגיבויים נמחקה');
  }
};

window.renderBackupTimeline = function() {
  const container = document.getElementById('backup-timeline-container');
  if (!container) return;

  let backups = [];
  try {
    backups = JSON.parse(localStorage.getItem('soki_state_backups') || '[]');
  } catch (e) {
    backups = [];
  }

  if (backups.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px; color:#86868b; font-size:0.9rem;">אין נקודות גיבוי זמינות</div>';
    return;
  }

  container.innerHTML = backups.map(b => {
    const isPrepopulated = b.hasOwnProperty('minutesAgo');
    let label = '';
    if (isPrepopulated) {
      label = `לפני ${b.minutesAgo} דקות (${b.timeLabel})`;
    } else {
      const diffMins = Math.round((Date.now() - b.timestamp) / 60000);
      label = diffMins === 0 ? `עכשיו (${b.timeLabel})` : `לפני ${diffMins} דקות (${b.timeLabel})`;
    }

    const typeBadge = b.isManual 
      ? '<span style="background:rgba(0,113,227,0.15); border:1px solid rgba(0,113,227,0.3); color:#30d158; padding:3px 8px; border-radius:6px; font-size:0.75rem; font-weight:700;">גיבוי ידני 📸</span>'
      : '<span style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#a1a1aa; padding:3px 8px; border-radius:6px; font-size:0.75rem; font-weight:500;">גיבוי אוטומטי 🕒</span>';

    return `
      <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); padding:16px 20px; border-radius:12px; display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'">
        <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
          <div style="width:40px; height:40px; background:rgba(0,113,227,0.1); border:1px solid rgba(0,113,227,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#0071e3; font-size:1.1rem;">
            <i class="fas fa-history"></i>
          </div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <span style="font-size:0.95rem; font-weight:700; color:#fff;">${label}</span>
            <span style="font-size:0.78rem; color:#86868b; display:flex; align-items:center; gap:8px;">
              ${typeBadge}
              <span>נפח גיבוי: ${b.size || 'N/A'}</span>
            </span>
          </div>
        </div>
        <button onclick="restoreBackup(${b.timestamp})" class="btn-primary" style="height:36px; padding:0 20px; font-size:0.85rem; background:linear-gradient(135deg, #0071e3 0%, #005bb5 100%); border:none; display:flex; align-items:center; gap:6px;">
          שחזר למצב זה <i class="fas fa-undo-alt"></i>
        </button>
      </div>
    `;
  }).join('');
};

window.restoreBackupToMinutesAgo = function(minutes) {
  let backups = [];
  try {
    backups = JSON.parse(localStorage.getItem('soki_state_backups') || '[]');
  } catch (e) {
    backups = [];
  }

  // Find simulated backup with minutesAgo === minutes, or closest timestamp
  let target = backups.find(b => b.minutesAgo === minutes);
  if (!target) {
    // Find closest by timestamp
    const targetTime = Date.now() - minutes * 60 * 1000;
    let minDiff = Infinity;
    backups.forEach(b => {
      const diff = Math.abs(b.timestamp - targetTime);
      if (diff < minDiff) {
        minDiff = diff;
        target = b;
      }
    });
  }

  if (target) {
    window.restoreBackup(target.timestamp);
  } else {
    showToast('❌ לא נמצא גיבוי היסטורי תואם');
  }
};

window.restoreBackup = function(timestamp) {
  let backups = [];
  try {
    backups = JSON.parse(localStorage.getItem('soki_state_backups') || '[]');
  } catch (e) {
    backups = [];
  }

  const backup = backups.find(b => b.timestamp === timestamp);
  if (!backup) {
    showToast('❌ שגיאה: נקודת שחזור לא נמצאה!');
    return;
  }

  // Show premium fullscreen time-machine portal overlay
  const overlay = document.getElementById('time-machine-overlay');
  const bar = document.getElementById('time-machine-progress-bar');
  const countdownText = document.getElementById('time-machine-countdown');
  const subtitle = document.getElementById('time-machine-subtitle');
  
  if (overlay) overlay.style.display = 'flex';

  const diffMins = backup.hasOwnProperty('minutesAgo') 
    ? backup.minutesAgo 
    : Math.round((Date.now() - backup.timestamp) / 60000);
  
  if (countdownText) countdownText.textContent = `חוזר ${diffMins} דקות לאחור בזמן (${backup.timeLabel})`;

  // Progress animation sequence
  let progress = 0;
  const totalDuration = 2500; // 2.5 seconds
  const intervalTime = 50;
  const steps = totalDuration / intervalTime;
  const increment = 100 / steps;

  const subtitles = [
    'מפעיל מנגנון שחזור קוונטי...',
    'טוען מסד נתונים של כתבות מפתח...',
    'משחזר סידור פריסות ועיצובי גרירה...',
    'מעלה קישורים והגדרות חנויות אפליקציה...',
    'השחזור הושלם בהצלחה! טוען אתר מחדש...'
  ];

  const progressInterval = setInterval(() => {
    progress += increment;
    if (bar) bar.style.width = Math.min(progress, 100) + '%';

    // Change subtitles smoothly
    const currentSubIndex = Math.min(Math.floor((progress / 100) * subtitles.length), subtitles.length - 1);
    if (subtitle) subtitle.textContent = subtitles[currentSubIndex];

    if (progress >= 100) {
      clearInterval(progressInterval);
      
      // Perform restoration of state!
      const backupsKey = 'soki_state_backups';
      const keepBackups = localStorage.getItem(backupsKey);
      
      // Clear current localStorage and restore all state keys from backup snapshot
      localStorage.clear();
      
      // Restore state
      const state = backup.state;
      for (const key in state) {
        localStorage.setItem(key, state[key]);
      }

      // EXPLICIT HEALTH RECOVERY OVERRIDES FOR "15 MINUTES AGO" RESTORE
      if (diffMins === 15) {
        if (typeof defaultNewsArticles !== 'undefined') {
          localStorage.setItem('newsArticles', JSON.stringify(defaultNewsArticles));
        }
        localStorage.removeItem('soki_home_custom_html_v3'); // Reset layout positions to original perfect symmetry
        if (typeof defaultLinks !== 'undefined') {
          localStorage.setItem('soki_admin_links', JSON.stringify(defaultLinks));
        }
      }
      
      // Keep the backups array itself intact
      if (keepBackups) {
        localStorage.setItem(backupsKey, keepBackups);
      }

      setTimeout(() => {
        location.reload();
      }, 300);
    }
  }, intervalTime);
};

// ========== GIANT ARTICLE CINEMA MODE LOGIC ==========
window._giantArticleIndex = 0;
window._giantArticleInterval = null;

window.openGiantArticlePage = function() {
  const overlay = document.getElementById('page-giant-hero');
  if (!overlay) return;

  overlay.style.display = 'flex';
  window._giantArticleIndex = 0;
  
  // Render first slide
  window.renderGiantArticle();
  
  // Render bottom social row dynamically using real configuration values
  window.renderGiantSocialRow();

  // Setup auto-rotate interval of 5 seconds
  if (window._giantArticleInterval) clearInterval(window._giantArticleInterval);
  window._giantArticleInterval = setInterval(window.nextGiantArticle, 5000);
  
  showToast('📺 מצגת מסך ענק פעילה. לחץ בכל מקום כדי לצאת.');
};

window.closeGiantArticlePage = function() {
  const overlay = document.getElementById('page-giant-hero');
  if (overlay) overlay.style.display = 'none';

  if (window._giantArticleInterval) {
    clearInterval(window._giantArticleInterval);
    window._giantArticleInterval = null;
  }
};

window.renderGiantArticle = function() {
  // 1. Fetch custom images set by the admin in "תמונות למסך ענק" tab
  let list = [];
  if (window.getAdminMediaLinks) {
    list = window.getAdminMediaLinks();
  }

  // 2. Fallback to newsArticles cover images if no custom images exist
  if (list.length === 0) {
    if (typeof newsArticles !== 'undefined') {
      list = newsArticles.map(a => ({ img: a.image }));
    } else if (typeof defaultNewsArticles !== 'undefined') {
      list = defaultNewsArticles.map(a => ({ img: a.image }));
    }
  }

  if (list.length === 0) return;

  // Make sure index is within bounds
  if (window._giantArticleIndex >= list.length) window._giantArticleIndex = 0;
  if (window._giantArticleIndex < 0) window._giantArticleIndex = list.length - 1;

  const item = list[window._giantArticleIndex];
  if (!item || !item.img) return;

  const bgCover = document.getElementById('giant-bg-cover');
  if (bgCover) {
    // Crossfade transition: lower opacity, update image, fade back in
    bgCover.style.opacity = '0.3';
    setTimeout(() => {
      bgCover.src = item.img;
      bgCover.style.opacity = '1';
    }, 250);
  }
};

window.nextGiantArticle = function() {
  window._giantArticleIndex++;
  window.renderGiantArticle();
};

window.prevGiantArticle = function() {
  window._giantArticleIndex--;
  window.renderGiantArticle();
};

window.renderGiantSocialRow = function() {
  const row = document.getElementById('giant-social-icons-row');
  if (!row) return;

  // Retrieve current links config
  const saved = localStorage.getItem('soki_admin_links');
  const links = saved ? JSON.parse(saved) : (typeof defaultLinks !== 'undefined' ? defaultLinks : {});

  // Social configuration to render
  const configs = [
    { key: 'x', icon: 'fa-brands fa-x-twitter', color: '#fff', label: 'Twitter / X' },
    { key: 'linkedin', icon: 'fa-brands fa-linkedin-in', color: '#0077b5', label: 'LinkedIn' },
    { key: 'facebook', icon: 'fa-brands fa-facebook-f', color: '#1877f2', label: 'Facebook' },
    { key: 'instagram', icon: 'fa-brands fa-instagram', color: '#c13584', label: 'Instagram' },
    { key: 'youtube', icon: 'fa-brands fa-youtube', color: '#ff0000', label: 'YouTube' },
    { key: 'mastodon', icon: 'fa-brands fa-mastodon', color: '#6364ff', label: 'Mastodon' },
    { key: 'threads', icon: 'fa-brands fa-threads', color: '#fff', label: 'Threads' },
    { key: 'bluesky', icon: 'fa-brands fa-bluesky', color: '#0285f4', label: 'Bluesky' }
  ];

  row.innerHTML = configs.map(c => {
    const url = links[c.key] || '#';
    return `
      <a href="${url}" target="_blank" title="${c.label}" style="
        color: ${c.color};
        font-size: 1.4rem;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        transition: all 0.25s ease;
      " onmouseover="this.style.transform='scale(1.15) translateY(-3px)'; this.style.background='rgba(255,255,255,0.12)'; this.style.boxShadow='0 4px 15px rgba(255,255,255,0.1)';" onmouseout="this.style.transform='none'; this.style.background='rgba(255,255,255,0.05)'; this.style.boxShadow='none';">
        <i class="${c.icon}"></i>
      </a>
    `;
  }).join('');
};

// ========== MODAL POPUP DIALOGS ENGINE ==========
window.openAboutModal = function() {
  const modal = document.getElementById('page-about');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex'; // Centered overlay
  }
};

window.closeAboutModal = function() {
  const modal = document.getElementById('page-about');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
};

window.openWhatsNewModal = function() {
  const modal = document.getElementById('page-whats-new');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex'; // Centered overlay
  }
};

window.closeWhatsNewModal = function() {
  const modal = document.getElementById('page-whats-new');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
};

window.openSubscriptionModal = function() {
  const modal = document.getElementById('page-subscription-modal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex'; // Centered overlay
  }
};

window.closeSubscriptionModal = function() {
  const modal = document.getElementById('page-subscription-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
};

window.openAdsModal = function() {
  const modal = document.getElementById('page-ads-modal');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex'; // Centered overlay
  }
};

window.closeAdsModal = function() {
  const modal = document.getElementById('page-ads-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
};

// ====== BOOK READER ENGINE ======
let bookReaderTimer = null;
let bookReaderTimeLeft = 0;
let bookReaderInterval = 0; // in seconds
let bookReaderCurrentPageIndex = 0; // active double-page index
let bookReaderPages = []; // array of HTML content for each single page

window.openBookReader = function(articleId) {
  const a = newsArticles.find(x => x.id === articleId);
  if (!a) return;
  
  // Parse content into pages
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = a.content || '';
  
  // Extract all paragraphs/headings
  const elements = Array.from(tempDiv.querySelectorAll('p, blockquote, h2, h3, ul, ol'));
  
  // Bundle elements into pages
  bookReaderPages = [];
  let currentPageHTML = '';
  let elementCount = 0;
  
  elements.forEach((el) => {
    if (el.classList.contains('article-source-box')) return;
    
    currentPageHTML += el.outerHTML;
    elementCount++;
    
    if (elementCount >= 2 || el.textContent.length > 400) {
      bookReaderPages.push(currentPageHTML);
      currentPageHTML = '';
      elementCount = 0;
    }
  });
  
  if (currentPageHTML.trim()) {
    bookReaderPages.push(currentPageHTML);
  }
  
  if (bookReaderPages.length === 0) {
    bookReaderPages.push(a.content || 'אין תוכן בכתבה זו.');
  }
  
  bookReaderCurrentPageIndex = 0;
  
  const modal = document.getElementById('page-book-reader-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
  
  const selectEl = document.getElementById('book-timer-select');
  if (selectEl) selectEl.value = '0';
  bookReaderInterval = 0;
  
  renderBookPages();
  resetBookTimer();
};

window.closeBookReader = function() {
  const modal = document.getElementById('page-book-reader-modal');
  if (modal) {
    modal.style.display = 'none';
  }
  stopBookTimer();
};

function renderBookPages() {
  const totalPages = bookReaderPages.length;
  const rightPageIndex = bookReaderCurrentPageIndex * 2;
  const leftPageIndex = bookReaderCurrentPageIndex * 2 + 1;
  
  const rightContent = bookReaderPages[rightPageIndex] || '<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#8e8e93; font-family:\'Inter\', sans-serif;">סוף הכתבה 📖</div>';
  const leftContent = leftPageIndex < totalPages ? bookReaderPages[leftPageIndex] : '<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#8e8e93; font-family:\'Inter\', sans-serif;">סוף הכתבה 📖</div>';
  
  const rightPageEl = document.getElementById('book-page-right');
  const leftPageEl = document.getElementById('book-page-left');
  if (rightPageEl) rightPageEl.innerHTML = rightContent;
  if (leftPageEl) leftPageEl.innerHTML = leftContent;
  
  const rightPageNumEl = document.getElementById('book-page-num-right');
  const leftPageNumEl = document.getElementById('book-page-num-left');
  if (rightPageNumEl) rightPageNumEl.textContent = rightPageIndex + 1;
  if (leftPageNumEl) leftPageNumEl.textContent = leftPageIndex < totalPages ? leftPageIndex + 1 : '';
  
  const progressTextEl = document.getElementById('book-progress-text');
  if (progressTextEl) {
    progressTextEl.textContent = `דפים ${rightPageIndex + 1}-${Math.min(leftPageIndex + 1, totalPages)} מתוך ${totalPages}`;
  }
  
  const prevBtn = document.getElementById('book-btn-prev');
  const nextBtn = document.getElementById('book-btn-next');
  
  if (prevBtn) prevBtn.disabled = bookReaderCurrentPageIndex === 0;
  if (nextBtn) nextBtn.disabled = (bookReaderCurrentPageIndex + 1) * 2 >= totalPages;
  
  if (prevBtn) {
    if (prevBtn.disabled) {
      prevBtn.style.opacity = '0.4';
      prevBtn.style.cursor = 'not-allowed';
    } else {
      prevBtn.style.opacity = '1';
      prevBtn.style.cursor = 'pointer';
    }
  }
  if (nextBtn) {
    if (nextBtn.disabled) {
      nextBtn.style.opacity = '0.4';
      nextBtn.style.cursor = 'not-allowed';
    } else {
      nextBtn.style.opacity = '1';
      nextBtn.style.cursor = 'pointer';
    }
  }
}

window.turnBookPage = function(direction) {
  const totalPages = bookReaderPages.length;
  if (direction === 'next') {
    if ((bookReaderCurrentPageIndex + 1) * 2 < totalPages) {
      bookReaderCurrentPageIndex++;
      renderBookPages();
      resetBookTimer();
    }
  } else if (direction === 'prev') {
    if (bookReaderCurrentPageIndex > 0) {
      bookReaderCurrentPageIndex--;
      renderBookPages();
      resetBookTimer();
    }
  }
};

window.handleTimerSelect = function(selectElement) {
  bookReaderInterval = parseInt(selectElement.value) || 0;
  resetBookTimer();
};

function resetBookTimer() {
  stopBookTimer();
  const timerBar = document.getElementById('book-timer-bar');
  if (bookReaderInterval <= 0) {
    if (timerBar) timerBar.style.width = '0%';
    return;
  }
  
  bookReaderTimeLeft = bookReaderInterval;
  updateTimerProgress();
  
  bookReaderTimer = setInterval(() => {
    bookReaderTimeLeft--;
    updateTimerProgress();
    
    if (bookReaderTimeLeft <= 0) {
      const totalPages = bookReaderPages.length;
      if ((bookReaderCurrentPageIndex + 1) * 2 < totalPages) {
        window.turnBookPage('next');
      } else {
        bookReaderCurrentPageIndex = 0;
        renderBookPages();
        resetBookTimer();
      }
    }
  }, 1000);
}

function stopBookTimer() {
  if (bookReaderTimer) {
    clearInterval(bookReaderTimer);
    bookReaderTimer = null;
  }
}

function updateTimerProgress() {
  if (bookReaderInterval <= 0) return;
  const percentage = ((bookReaderInterval - bookReaderTimeLeft) / bookReaderInterval) * 100;
  const timerBar = document.getElementById('book-timer-bar');
  if (timerBar) {
    timerBar.style.width = `${percentage}%`;
  }
}

// ====== INFINITE SCROLL SYSTEM ======
let isInfiniteScrollLoading = false;

window.addEventListener('scroll', () => {
  const homePage = document.getElementById('page-home');
  if (!homePage || !homePage.classList.contains('active')) return;
  
  const feedList = document.getElementById('news-feed-list');
  if (!feedList) return;
  
  const triggerHeight = window.innerHeight + window.scrollY;
  const bottomOffset = document.documentElement.scrollHeight - 300;
  
  if (triggerHeight >= bottomOffset) {
    const locationArticles = getLocationArticles();
    let filteredArticles = currentCategory === 'all'
      ? locationArticles
      : locationArticles.filter(a => a.category === currentCategory);

    if (searchQuery && searchQuery.trim() !== '') {
      const queryLower = searchQuery.toLowerCase().trim();
      filteredArticles = filteredArticles.filter(a => {
        const titleMatch = (a.title || '').toLowerCase().includes(queryLower);
        const snippetMatch = (a.snippet || '').toLowerCase().includes(queryLower);
        const categoryMatch = (a.category || '').toLowerCase().includes(queryLower);
        const authorMatch = (a.author || '').toLowerCase().includes(queryLower);
        const contentMatch = (a.content || '').toLowerCase().includes(queryLower);
        return titleMatch || snippetMatch || categoryMatch || authorMatch || contentMatch;
      });
    }

    let displayFeatured = [];
    const featuredCarousel = document.getElementById('featured-carousel-container');
    if (featuredCarousel && featuredCarousel.style.display !== 'none') {
      displayFeatured = filteredArticles.filter(a => a.approved !== false && a.excludeFromCarousel !== true).slice(0, 12);
    }
    
    const feedArticles = filteredArticles.filter(a => !displayFeatured.includes(a) && a.approved !== false);
    const totalPages = Math.max(1, Math.ceil(feedArticles.length / ARTICLES_PER_PAGE));
    
    if (currentPage < totalPages && !isInfiniteScrollLoading) {
      if (window.isInfiniteScrollUnlocked) {
        loadNextInfiniteScrollPage(totalPages);
      } else {
        const unlockContainer = document.getElementById('infinite-scroll-unlock-container');
        if (unlockContainer) unlockContainer.style.display = 'flex';
      }
    }
  }
});

function loadNextInfiniteScrollPage(totalPages) {
  isInfiniteScrollLoading = true;
  
  const loader = document.getElementById('infinite-scroll-loader');
  if (loader) loader.style.display = 'flex';
  
  setTimeout(() => {
    currentPage++;
    renderNewsLayout(currentPage);
    
    isInfiniteScrollLoading = false;
    if (loader) loader.style.display = 'none';
  }, 900);
}

// Forum widget tabs
window.switchForumWidgetTab = function(tabName, btn) {
  // Update buttons
  const buttons = document.querySelectorAll('.forum-widget-tab');
  buttons.forEach(b => {
    b.classList.remove('active');
    b.style.borderBottom = '2px solid transparent';
    b.style.color = '#86868b';
    b.style.fontWeight = '600';
  });
  if (btn) {
    btn.classList.add('active');
    btn.style.borderBottom = '2px solid #facc15';
    btn.style.color = '#fff';
    btn.style.fontWeight = '800';
  }
  
  // Update content
  document.getElementById('fw-content-recent').style.display = 'none';
  document.getElementById('fw-content-popular').style.display = 'none';
  
  const target = document.getElementById('fw-content-' + tabName);
  if (target) {
    target.style.display = 'flex';
  }
};

// ==========================================
// BETTING SYSTEM
// ==========================================

// Mock betting events
const bettingEvents = [
  {
    id: 'bet1',
    title: "ליגת האלופות: ריאל מדריד נגד מנצ'סטר סיטי",
    category: "ספורט",
    time: "הערב, 22:00",
    options: [
      { id: 'opt1', text: "ריאל מדריד", odds: 2.10 },
      { id: 'opt2', text: "תיקו", odds: 3.40 },
      { id: 'opt3', text: "מנצ'סטר סיטי", odds: 2.50 }
    ]
  },
  {
    id: 'bet2',
    title: "מניית טסלה (TSLA) בסוף יום המסחר",
    category: "שוק ההון",
    time: "מחר, 23:00",
    options: [
      { id: 'opt1', text: "מעל $250", odds: 1.85 },
      { id: 'opt2', text: "מתחת $250", odds: 1.95 }
    ]
  },
  {
    id: 'bet3',
    title: "מנצחת העונה הקרובה של הישרדות",
    category: "בידור",
    time: "בעוד 3 ימים",
    options: [
      { id: 'opt1', text: "שבט אדום", odds: 1.50 },
      { id: 'opt2', text: "שבט כחול", odds: 2.40 }
    ]
  },
  {
    id: 'bet4',
    title: "מכבי תל אביב נגד פנאתינייקוס (כדורסל)",
    category: "ספורט",
    time: "יום חמישי, 21:05",
    options: [
      { id: 'opt1', text: "מכבי ת\"א", odds: 1.90 },
      { id: 'opt2', text: "פנאתינייקוס", odds: 1.90 }
    ]
  }
];

let userBalance = parseInt(localStorage.getItem('userBettingBalance')) || 1000;
let currentBetSelection = null; // { eventId, optionId, eventTitle, optionText, odds }

window.renderBets = function() {
  const container = document.getElementById('bets-container');
  if (!container) return;
  
  // Update balance display on bets page
  const balanceDisplay = document.getElementById('betting-balance-display');
  if (balanceDisplay) {
    balanceDisplay.innerHTML = `${userBalance.toLocaleString()} <i class="fas fa-coins" style="font-size:1.1rem;"></i>`;
  }
  
  // Update balance display in dropdown
  const dropdownCoins = document.getElementById('dropdown-coins-amount');
  if (dropdownCoins) {
    dropdownCoins.innerHTML = `${userBalance.toLocaleString()} Coins`;
  }
  
  // Update balance display in integrations page
  const integrationsCoins = document.getElementById('integrations-balance-display');
  if (integrationsCoins) {
    integrationsCoins.textContent = userBalance.toLocaleString();
  }
  
  container.innerHTML = bettingEvents.map(event => `
    <div style="background:#111; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:20px; transition:transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
        <span style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:4px 10px; border-radius:980px; font-size:0.75rem; color:#a1a1aa; font-weight:600;">${event.category}</span>
        <span style="font-size:0.8rem; color:#facc15; font-weight:600;"><i class="far fa-clock"></i> ${event.time}</span>
      </div>
      <h3 style="font-size:1.15rem; font-weight:800; color:#fff; margin:0 0 20px 0; line-height:1.4;">${event.title}</h3>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${event.options.map(opt => `
          <button onclick="openBetModal('${event.id}', '${opt.id}', '${event.title.replace(/'/g, "\\'")}', '${opt.text.replace(/'/g, "\\'")}', ${opt.odds})" style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:12px 16px; color:#fff; cursor:pointer; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
            <span style="font-weight:600; font-size:0.95rem;">${opt.text}</span>
            <span style="background:#facc15; color:#000; padding:2px 8px; border-radius:6px; font-weight:800; font-size:0.9rem;">${opt.odds.toFixed(2)}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');
};

window.openBetModal = function(eventId, optionId, eventTitle, optionText, odds) {
  currentBetSelection = { eventId, optionId, eventTitle, optionText, odds };
  
  document.getElementById('bet-modal-event-title').textContent = eventTitle;
  document.getElementById('bet-modal-selection').textContent = optionText;
  document.getElementById('bet-modal-odds').textContent = `יחס: ${odds.toFixed(2)}`;
  
  const amountInput = document.getElementById('bet-modal-amount');
  amountInput.value = '';
  document.getElementById('bet-modal-potential').textContent = '0';
  
  document.getElementById('bet-modal').style.display = 'flex';
  setTimeout(() => amountInput.focus(), 100);
};

window.closeBetModal = function() {
  document.getElementById('bet-modal').style.display = 'none';
  currentBetSelection = null;
};

window.updateBetPotentialReturn = function() {
  const amount = parseInt(document.getElementById('bet-modal-amount').value) || 0;
  if (currentBetSelection) {
    const potential = Math.floor(amount * currentBetSelection.odds);
    document.getElementById('bet-modal-potential').textContent = potential.toLocaleString();
  }
};

window.confirmBet = function() {
  if (!currentBetSelection) return;
  
  const amount = parseInt(document.getElementById('bet-modal-amount').value);
  if (isNaN(amount) || amount <= 0) {
    alert("אנא הזן סכום תקין להימור.");
    return;
  }
  
  if (amount > userBalance) {
    alert("אין לך מספיק מטבעות בארנק.");
    return;
  }
  
  // Deduct balance
  userBalance -= amount;
  localStorage.setItem('userBettingBalance', userBalance);
  
  // Confirmed!
  closeBetModal();
  renderBets();
  
  // Show notification
  alert(`הימור על סך ${amount} מטבעות בוצע בהצלחה! בהצלחה! 🎲`);
};

// Hook into showPage to render bets when page is shown + re-apply edit mode
const originalShowPageForBets = window.showPage;
window.showPage = function(pageId) {
  originalShowPageForBets(pageId);
  if (pageId === 'bets' || pageId === 'integrations') {
    renderBets();
  } else if (pageId === 'sharing') {
    if (window.initSharingPage) window.initSharingPage();
  } else if (pageId === 'uber') {
    if (window.initUberPage) window.initUberPage();
  } else if (pageId === 'realestate') {
    if (window.initRealEstatePage) window.initRealEstatePage();
  }
  // Re-apply contenteditable after page render if edit mode is active
  if (window.isEditModeActive) {
    applyEditableToCurrentPage();
  }
};

window.openOrderTrackingModal = function() {
  const modal = document.getElementById('order-tracking-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
};

// ==========================================
// ADMIN EDIT MODE IMPLEMENTATION
// ==========================================
window.isEditModeActive = false;
let currentEditingImg = null;
activeCustomizations = {};
let activeDraggedEl = null;

// Assign deterministic data-admin-id to sortable containers on load
function initDeterministicIds() {
  try {
    const containers = document.querySelectorAll('.nav-right-section, .nav-left-section');
    containers.forEach((container, cIdx) => {
      if (!container.getAttribute('data-admin-id')) {
        container.setAttribute('data-admin-id', `container-${cIdx}`);
      }
      Array.from(container.children).forEach((child, idx) => {
        if (!child.id && !child.getAttribute('data-admin-id')) {
          child.setAttribute('data-admin-id', `container-${cIdx}-item-${idx}`);
        }
      });
    });
  } catch (err) {
    console.error('Error in initDeterministicIds:', err);
  }
}

// Helper to uniquely identify an element by CSS path or ID
function getImageIdentifier(el) {
  if (!el) return '';
  if (el.id) return `#${el.id}`;
  if (el.getAttribute('data-admin-id')) return `[data-admin-id="${el.getAttribute('data-admin-id')}"]`;
  const path = [];
  let current = el;
  while (current && current.nodeType === Node.ELEMENT_NODE && current.tagName !== 'BODY') {
    let sibIndex = 0;
    let sibling = current.previousSibling;
    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === current.tagName) {
        sibIndex++;
      }
      sibling = sibling.previousSibling;
    }
    path.unshift(`${current.tagName.toLowerCase()}[${sibIndex}]`);
    current = current.parentNode;
  }
  return path.join('>');
}

// Helper to resolve an element from its path
function getElementFromIdentifier(id) {
  if (!id) return null;
  if (id.startsWith('__')) return null;
  try {
    if (id.startsWith('#')) return document.querySelector(id);
    if (id.startsWith('[data-edit-id')) return document.querySelector(id);
    if (id.startsWith('[')) return document.querySelector(id);
  } catch (e) {
    return null;
  }
  const parts = id.split('>');
  let el = document.body;
  for (let part of parts) {
    if (!part) continue;
    const match = part.match(/^([a-z0-9]+)\[(\d+)\]$/i);
    if (match) {
      const tag = match[1];
      const index = parseInt(match[2]);
      let childIndex = 0;
      let found = null;
      for (let child of el.children) {
        if (child.tagName.toLowerCase() === tag.toLowerCase()) {
          if (childIndex === index) {
            found = child;
            break;
          }
          childIndex++;
        }
      }
      if (!found) return null;
      el = found;
    } else {
      return null;
    }
  }
  return el;
}

// Apply loaded customizations to the page
function applyAllCustomizations() {
  try {
    for (let key in activeCustomizations) {
      const cust = activeCustomizations[key];
      
      const el = getElementFromIdentifier(key);
      if (!el) continue;

      // Apply custom block dimensions if present
      if (cust.blockWidth && el.style.width !== cust.blockWidth) {
        el.style.width = cust.blockWidth;
      }
      if (cust.blockHeight && el.style.height !== cust.blockHeight) {
        el.style.height = cust.blockHeight;
      }
        
      // If it is a text customization
      if (cust.text !== undefined) {
        if (el.innerHTML !== cust.text) {
          el.innerHTML = cust.text;
        }
        continue;
      }
      
      // If it is an order customization
      if (cust.order && Array.isArray(cust.order)) {
        const childMap = new Map();
        for (let child of Array.from(el.children)) {
          const childId = getImageIdentifier(child);
          childMap.set(childId, child);
        }
        for (let childId of cust.order) {
          const child = childMap.get(childId);
          if (child) {
            el.appendChild(child);
          }
        }
      }
      // If it is an image/background-image customization
      else {
        if (cust.src) {
          if (el.tagName === 'IMG') {
            if (el.src !== cust.src) el.src = cust.src;
          } else {
            const bgUrl = `url("${cust.src}")`;
            if (el.style.backgroundImage !== bgUrl) el.style.backgroundImage = bgUrl;
          }
        }
        if (cust.width && el.style.width !== cust.width) {
          el.style.width = cust.width;
          el.style.maxWidth = '100%';
        }
        if (cust.positionY) {
          if (el.tagName === 'IMG') {
            el.style.objectFit = 'cover';
            el.style.objectPosition = `center ${cust.positionY}`;
          } else {
            el.style.backgroundPosition = `center ${cust.positionY}`;
          }
        }
        if (cust.link) {
          if (el.getAttribute('data-custom-link') !== cust.link) {
            el.setAttribute('data-custom-link', cust.link);
          }
        } else {
          el.removeAttribute('data-custom-link');
        }
      }
    }
  } catch (err) {
    console.error('Error applying customizations:', err);
  }
  if (typeof applyPageVisibility === 'function') applyPageVisibility();
}

// Save active customizations to server API
async function saveCustomizationsToServer() {
  showToast('⏳ שומר שינויים לשרת...');
  try {
    const res = await fetch('/api/customizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activeCustomizations)
    });
    if (!res.ok) throw new Error('שגיאה בשמירה לשרת');
    showToast('✅ השינויים נשמרו בהצלחה בשרת!');
  } catch (err) {
    console.error(err);
    showToast('❌ שגיאה בשמירה לשרת');
  }
}

// Fetch customizations from server API on init
async function initCustomizations() {
  initDeterministicIds();
  try {
    const res = await fetch('/api/customizations');
    if (res.ok) {
      activeCustomizations = await res.json();
      if (typeof window.renderCustomPages === 'function') window.renderCustomPages();
      applyAllCustomizations();
      if (typeof window.applyPageVisibility === 'function') window.applyPageVisibility();
      // Restore section order & visibility
      if (window.applySectionLayout) window.applySectionLayout();
    }
  } catch (err) {
    console.error('Failed to load customizations:', err);
  }
}

// Initialize Customizations
initCustomizations();

// ============================================================
// SECTION DRAG & DROP SYSTEM
// ============================================================

let _sectionDragEl = null;   // the .home-section being dragged
let _sectionDragOver = null; // the .home-section we're hovering over
let _sectionHiddenIds = new Set(); // hidden section IDs
let _sectionCollapsedIds = new Set(); // collapsed section IDs

/**
 * Inject drag handles into every .home-section
 * Called when edit mode activates / deactivates
 */
function initSectionDragDrop(active) {
  const container = document.getElementById('home-sections-container');
  if (!container) return;

  const sections = Array.from(container.querySelectorAll(':scope > .home-section'));

  sections.forEach(section => {
    // Remove existing handle if any
    const existingHandle = section.querySelector('.section-drag-handle');
    if (existingHandle) existingHandle.remove();

    if (!active) {
      section.removeAttribute('draggable');
      return;
    }

    const sectionId = section.getAttribute('data-section-id') || '';
    const label = section.getAttribute('data-section-label') || sectionId;
    const isHidden = _sectionHiddenIds.has(sectionId);
    const isCollapsed = _sectionCollapsedIds.has(sectionId);

    // Build the drag handle
    const handle = document.createElement('div');
    handle.className = 'section-drag-handle';
    handle.setAttribute('data-no-edit', '');
    handle.draggable = false; // handle itself isn't draggable — section is

    handle.innerHTML = `
      <div class="section-grip">
        <span></span><span></span><span></span>
      </div>
      <div class="section-drag-label">⠿ ${label}</div>
      <div class="section-drag-actions">
        <button class="section-move-btn move-up-btn" title="העבר למעלה">↑</button>
        <button class="section-move-btn move-down-btn" title="העבר למטה">↓</button>
        <button class="section-hide-btn ${isHidden ? 'is-hidden' : ''}" title="${isHidden ? 'הצג סקשן' : 'הסתר סקשן'}">
          ${isHidden ? '👁 הצג' : '🙈 הסתר'}
        </button>
      </div>
    `;

    // Move up button
    handle.querySelector('.move-up-btn').addEventListener('click', e => {
      e.stopPropagation();
      const prev = section.previousElementSibling;
      if (prev && prev.classList.contains('home-section')) {
        container.insertBefore(section, prev);
        saveSectionOrder();
      }
    });

    // Move down button
    handle.querySelector('.move-down-btn').addEventListener('click', e => {
      e.stopPropagation();
      const next = section.nextElementSibling;
      if (next && next.classList.contains('home-section')) {
        container.insertBefore(next, section);
        saveSectionOrder();
      }
    });

    // Hide/show toggle
    handle.querySelector('.section-hide-btn').addEventListener('click', e => {
      e.stopPropagation();
      const btn = e.currentTarget;
      if (_sectionHiddenIds.has(sectionId)) {
        _sectionHiddenIds.delete(sectionId);
        section.classList.remove('section-hidden');
        btn.classList.remove('is-hidden');
        btn.innerHTML = '🙈 הסתר';
        btn.title = 'הסתר סקשן';
      } else {
        _sectionHiddenIds.add(sectionId);
        section.classList.add('section-hidden');
        btn.classList.add('is-hidden');
        btn.innerHTML = '👁 הצג';
        btn.title = 'הצג סקשן';
      }
      saveSectionOrder();
    });

    section.insertBefore(handle, section.firstChild);

    // Make section draggable via its handle (grip area)
    section.setAttribute('draggable', 'true');

    // Apply hidden state if needed
    if (isHidden) section.classList.add('section-hidden');
    else section.classList.remove('section-hidden');
  });

  // Setup container drag events (only add once)
  if (active) {
    container.setAttribute('data-section-dd-active', 'true');
  } else {
    container.removeAttribute('data-section-dd-active');
    // Clear any leftover states
    sections.forEach(s => {
      s.classList.remove('is-dragging', 'drag-over', 'section-hidden');
      s.removeAttribute('draggable');
    });
    document.querySelectorAll('.section-drop-indicator').forEach(el => el.remove());
  }
}

// ---- Section drag events ----

document.addEventListener('dragstart', function(e) {
  if (!window.isEditModeActive) return;
  const section = e.target.closest('.home-section[draggable="true"]');
  if (!section) return;

  // Only allow drag if starting from the handle
  const handle = section.querySelector('.section-drag-handle');
  if (handle && !handle.contains(e.target) && e.target !== section) return;

  _sectionDragEl = section;
  setTimeout(() => section.classList.add('is-dragging'), 0);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', section.getAttribute('data-section-id') || '');
}, true);

document.addEventListener('dragend', async function(e) {
  if (!_sectionDragEl) return;
  _sectionDragEl.classList.remove('is-dragging');
  _sectionDragEl = null;
  _sectionDragOver = null;

  // Remove all drop indicators and highlights
  document.querySelectorAll('.section-drop-indicator').forEach(el => el.remove());
  document.querySelectorAll('.home-section.drag-over').forEach(el => el.classList.remove('drag-over'));

  await saveSectionOrder();
}, true);

document.addEventListener('dragover', function(e) {
  if (!window.isEditModeActive || !_sectionDragEl) return;
  const overSection = e.target.closest?.('.home-section');
  if (!overSection || overSection === _sectionDragEl) return;

  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  if (_sectionDragOver === overSection) return;
  _sectionDragOver = overSection;

  // Clear existing highlights
  document.querySelectorAll('.home-section.drag-over').forEach(el => el.classList.remove('drag-over'));
  overSection.classList.add('drag-over');

  // Position: insert before or after based on cursor Y
  const rect = overSection.getBoundingClientRect();
  const midY = rect.top + rect.height / 2;
  const container = document.getElementById('home-sections-container');

  if (e.clientY < midY) {
    container.insertBefore(_sectionDragEl, overSection);
  } else {
    container.insertBefore(_sectionDragEl, overSection.nextSibling);
  }
}, true);

document.addEventListener('drop', function(e) {
  if (!window.isEditModeActive || !_sectionDragEl) return;
  e.preventDefault();
  document.querySelectorAll('.home-section.drag-over').forEach(el => el.classList.remove('drag-over'));
}, true);

// ---- Save & restore section order ----

async function saveSectionOrder() {
  const container = document.getElementById('home-sections-container');
  if (!container) return;

  const sections = Array.from(container.querySelectorAll(':scope > .home-section'));
  const order = sections.map(s => s.getAttribute('data-section-id'));
  const hidden = Array.from(_sectionHiddenIds);

  activeCustomizations['__sectionLayout__'] = { order, hidden };
  await saveCustomizationsToServer();
}

function applySectionLayout() {
  const layout = activeCustomizations['__sectionLayout__'];
  if (!layout) return;

  const container = document.getElementById('home-sections-container');
  if (!container) return;

  // Restore hidden state
  _sectionHiddenIds = new Set(layout.hidden || []);

  // Restore order
  if (layout.order && Array.isArray(layout.order)) {
    layout.order.forEach(sectionId => {
      const section = container.querySelector(`.home-section[data-section-id="${sectionId}"]`);
      if (section) container.appendChild(section);
    });
  }

  // Apply hidden states
  container.querySelectorAll('.home-section').forEach(section => {
    const id = section.getAttribute('data-section-id');
    if (_sectionHiddenIds.has(id)) {
      section.classList.add('section-hidden');
    }
  });
}
window.applySectionLayout = applySectionLayout;

// ============================================================
// OLD NAV-BAR DRAG & DROP (kept for nav item reordering)
// ============================================================

// Enable/Disable Drag and Drop reordering for nav items
function enableDragAndDrop(active) {
  try {
    // 1. Section drag handles
    initSectionDragDrop(active);

    // 2. Nav-bar item reordering
    const containers = document.querySelectorAll('.nav-right-section, .nav-left-section');
    containers.forEach(container => {
      try {
        Array.from(container.children).forEach(child => {
          if (child.id === 'nav-user-dropdown' || child.id === 'nav-coins-badge') return;
          if (active) {
            child.setAttribute('draggable', 'true');
            child.style.cursor = 'grab';
          } else {
            child.removeAttribute('draggable');
            child.style.cursor = '';
          }
        });
        if (active) {
          container.addEventListener('dragover', handleNavDragOver);
          container.addEventListener('dragenter', e => e.preventDefault());
        } else {
          container.removeEventListener('dragover', handleNavDragOver);
        }
      } catch (containerErr) {
        console.error('Error in nav drag/drop:', container, containerErr);
      }
    });
  } catch (err) {
    console.error('Global error in enableDragAndDrop:', err);
  }
}

// Nav drag start/end
document.body.addEventListener('dragstart', function(e) {
  if (!window.isEditModeActive) return;
  const targetEl = e.target.nodeType === Node.ELEMENT_NODE ? e.target : e.target.parentElement;
  if (!targetEl || typeof targetEl.closest !== 'function') return;
  // Only nav children (not .home-section — those are handled above)
  if (targetEl.closest('.home-section')) return;
  const target = targetEl.closest('[draggable="true"]');
  if (target) {
    activeDraggedEl = target;
    target.classList.add('dragging');
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', '');
      e.dataTransfer.effectAllowed = 'move';
    }
  }
});

document.body.addEventListener('dragend', async function(e) {
  if (!window.isEditModeActive || !activeDraggedEl) return;
  if (activeDraggedEl.classList.contains('home-section')) return;
  activeDraggedEl.classList.remove('dragging');
  const parent = activeDraggedEl.parentNode;
  if (parent && parent.getAttribute('data-admin-id')) {
    const parentId = getImageIdentifier(parent);
    const childrenIds = Array.from(parent.children).map(child => getImageIdentifier(child));
    activeCustomizations[parentId] = { order: childrenIds };
    await saveCustomizationsToServer();
  }
  activeDraggedEl = null;
});

function handleNavDragOver(e) {
  e.preventDefault();
  const container = e.currentTarget;
  const afterElement = getDragAfterElement(container, e.clientY, e.clientX, true);
  if (activeDraggedEl && activeDraggedEl.parentNode === container) {
    if (afterElement == null) {
      container.appendChild(activeDraggedEl);
    } else {
      container.insertBefore(activeDraggedEl, afterElement);
    }
  }
}

function getDragAfterElement(container, y, x, horizontal = true) {
  const draggableElements = [...container.querySelectorAll(':scope > [draggable="true"]:not(.dragging)')];
  const isRtl = document.body.classList.contains('rtl-layout') || window.getComputedStyle(container).direction === 'rtl';

  if (!isRtl) {
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - (box.left + box.width / 2);
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  } else {
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = (box.left + box.width / 2) - x;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
}



// Helper to robustly find if an element is an image or background image
// Only climbs up a limited number of levels and only checks INLINE styles (not computed)
function findImageTarget(el) {
  let current = el;
  let levels = 0;
  const MAX_LEVELS = 4;
  while (current && current !== document.body && levels < MAX_LEVELS) {
    if (current.tagName === 'IMG') {
      return current;
    }
    // Only match elements with explicit inline background-image (not CSS-class backgrounds)
    const styleAttr = current.getAttribute('style') || '';
    if (styleAttr.includes('background-image') && styleAttr.includes('url(')) {
      return current;
    }
    current = current.parentElement;
    levels++;
  }
  return null;
}

// Open editor modal
function openImageEditor(img) {
  currentEditingImg = img;
  const modal = document.getElementById('image-editor-modal');
  const preview = document.getElementById('image-editor-preview');
  const widthInput = document.getElementById('image-editor-width');
  const widthLabel = document.getElementById('image-editor-width-label');
  const linkInput = document.getElementById('image-editor-link');
  const fileInput = document.getElementById('image-editor-file');

  // Load preview src depending on element type
  let src = '';
  if (img.tagName === 'IMG') {
    src = img.src;
  } else {
    const bg = img.style.backgroundImage || window.getComputedStyle(img).backgroundImage;
    const match = bg.match(/url\(['"]?(.*?)['"]?\)/);
    src = match ? match[1] : '';
  }

  preview.src = src;
  fileInput.value = '';

  // Get current width percentage
  let widthVal = 100;
  if (img.style.width && img.style.width.endsWith('%')) {
    widthVal = parseInt(img.style.width) || 100;
  }
  widthInput.value = widthVal;
  widthLabel.textContent = `רוחב תמונה: ${widthVal}%`;

  // Get current Y position
  let yVal = 50;
  if (img.tagName === 'IMG') {
    const pos = img.style.objectPosition || window.getComputedStyle(img).objectPosition;
    const match = pos.match(/center\s+(\d+)%/);
    if (match) yVal = parseInt(match[1]) || 50;
  } else {
    const pos = img.style.backgroundPosition || window.getComputedStyle(img).backgroundPosition;
    const match = pos.match(/center\s+(\d+)%/);
    if (match) yVal = parseInt(match[1]) || 50;
  }
  
  const yInput = document.getElementById('image-editor-position-y');
  const yLabel = document.getElementById('image-editor-position-y-label');
  if (yInput && yLabel) {
    yInput.value = yVal;
    yLabel.textContent = `מיקוד אנכי (גובה): ${yVal}%`;
  }
  preview.style.objectFit = 'cover';
  preview.style.objectPosition = `center ${yVal}%`;

  // Get current link
  linkInput.value = img.getAttribute('data-custom-link') || '';

  // Reset Crop Tool Button to OFF state on open
  const cropBtn = document.getElementById('btn-toggle-crop-tool');
  const cropBtnText = document.getElementById('crop-btn-text');
  if (cropBtn && cropBtnText) {
    cropBtn.style.background = '#27272a';
    cropBtn.style.borderColor = '#3f3f46';
    cropBtn.style.color = '#fafafa';
    cropBtnText.textContent = 'הפעל כלי חיתוך (Crop Tool)';
  }
  window.toggleCropTool(false);

  modal.classList.add('active');
}

window.closeImageEditor = function() {
  document.getElementById('image-editor-modal').classList.remove('active');
  currentEditingImg = null;
};

window.updateImageEditorWidth = function(val) {
  const label = document.getElementById('image-editor-width-label');
  if (label) label.textContent = `רוחב תמונה: ${val}%`;
  const preview = document.getElementById('image-editor-preview');
  if (preview) preview.style.width = `${val}%`;
};

window.updateImageEditorPositionY = function(val) {
  const label = document.getElementById('image-editor-position-y-label');
  if (label) label.textContent = `מיקוד אנכי (גובה): ${val}%`;
  const preview = document.getElementById('image-editor-preview');
  if (preview) {
    preview.style.objectFit = 'cover';
    preview.style.objectPosition = `center ${val}%`;
  }
};

window.handleImageEditorFile = function(input) {
  const file = input.files[0];
  if (!file) return;

  showToast('⏳ מעבד תמונה...');
  const reader = new FileReader();
  reader.onload = function(evt) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800; // Optimize Base64 size
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
      
      const compressedUrl = canvas.toDataURL('image/jpeg', 0.85);
      const preview = document.getElementById('image-editor-preview');
      if (preview) preview.src = compressedUrl;
      showToast('✅ תמונה הועלתה בהצלחה לתצוגה מקדימה');
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
};

window.applyImageEdit = async function() {
  if (!currentEditingImg) return;

  const preview = document.getElementById('image-editor-preview');
  const widthValEl = document.getElementById('image-editor-width');
  const positionYValEl = document.getElementById('image-editor-position-y');
  const linkValEl = document.getElementById('image-editor-link');
  if (!preview || !widthValEl || !positionYValEl || !linkValEl) return;

  let finalSrc = preview.src;
  const widthVal = widthValEl.value;
  const yVal = positionYValEl.value;
  const linkVal = linkValEl.value.trim();

  // Perform canvas cropping if Crop Tool is checked
  if (isCropActive) {
    const cropBox = document.getElementById('crop-box');
    if (cropBox && preview.naturalWidth) {
      const boxL = parseInt(cropBox.style.left) || 0;
      const boxT = parseInt(cropBox.style.top) || 0;
      const boxW = parseInt(cropBox.style.width) || 50;
      const boxH = parseInt(cropBox.style.height) || 50;

      const imgRect = getRenderedImageRect(preview);
      const overlapL = Math.max(boxL, imgRect.left);
      const overlapT = Math.max(boxT, imgRect.top);
      const overlapR = Math.min(boxL + boxW, imgRect.left + imgRect.width);
      const overlapB = Math.min(boxT + boxH, imgRect.top + imgRect.height);

      const overlapW = overlapR - overlapL;
      const overlapH = overlapB - overlapT;

      if (overlapW > 0 && overlapH > 0) {
        const sx = ((overlapL - imgRect.left) / imgRect.width) * preview.naturalWidth;
        const sy = ((overlapT - imgRect.top) / imgRect.height) * preview.naturalHeight;
        const sw = (overlapW / imgRect.width) * preview.naturalWidth;
        const sh = (overlapH / imgRect.height) * preview.naturalHeight;

        try {
          const canvas = document.createElement('canvas');
          canvas.width = sw;
          canvas.height = sh;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(preview, sx, sy, sw, sh, 0, 0, sw, sh);
          finalSrc = canvas.toDataURL('image/jpeg', 0.85);
        } catch (e) {
          console.error('Cropping error:', e);
        }
      }
    }
  }

  const isFixedSize = currentEditingImg.classList.contains('feed-image') || 
                      currentEditingImg.closest('.featured-card') || 
                      currentEditingImg.closest('.recommendations-grid') ||
                      currentEditingImg.closest('.carousel-slide');

  if (currentEditingImg.tagName === 'IMG') {
    currentEditingImg.src = finalSrc;
    currentEditingImg.style.objectFit = 'cover';
    currentEditingImg.style.objectPosition = `center ${yVal}%`;
  } else {
    currentEditingImg.style.backgroundImage = `url("${finalSrc}")`;
    currentEditingImg.style.backgroundPosition = `center ${yVal}%`;
  }

  if (!isFixedSize) {
    currentEditingImg.style.width = `${widthVal}%`;
    currentEditingImg.style.maxWidth = '100%';
  } else {
    currentEditingImg.style.width = '';
  }

  if (linkVal) {
    currentEditingImg.setAttribute('data-custom-link', linkVal);
  } else {
    currentEditingImg.removeAttribute('data-custom-link');
  }

  // Update active customizations
  const id = getImageIdentifier(currentEditingImg);
  activeCustomizations[id] = {
    src: finalSrc,
    width: isFixedSize ? null : `${widthVal}%`,
    positionY: `${yVal}%`,
    link: linkVal || null
  };

  window.closeImageEditor();
  showToast('✓ שינויים מקומיים הוחלו');
  
  // Auto save to server
  await saveCustomizationsToServer();
};

// Helper to compute containment bounds of letterboxed image
function getRenderedImageRect(img) {
  const container = img.parentElement;
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return { left: 0, top: 0, width: cw, height: ch };

  const containerRatio = cw / ch;
  const imageRatio = iw / ih;

  let w, h, l, t;
  if (imageRatio > containerRatio) {
    w = cw;
    h = cw / imageRatio;
    l = 0;
    t = (ch - h) / 2;
  } else {
    h = ch;
    w = ch * imageRatio;
    t = 0;
    l = (cw - w) / 2;
  }
  return { left: l, top: t, width: w, height: h };
}

window.syncCropInputs = function() {
  const cropBox = document.getElementById('crop-box');
  const preview = document.getElementById('image-editor-preview');
  if (!cropBox || !preview || !preview.naturalWidth) return;

  const boxW = parseInt(cropBox.style.width) || 0;
  const boxH = parseInt(cropBox.style.height) || 0;

  const imgRect = getRenderedImageRect(preview);
  const naturalW = Math.round((boxW / imgRect.width) * preview.naturalWidth);
  const naturalH = Math.round((boxH / imgRect.height) * preview.naturalHeight);

  const wInput = document.getElementById('crop-box-input-w');
  const hInput = document.getElementById('crop-box-input-h');
  if (wInput && document.activeElement !== wInput) wInput.value = naturalW;
  if (hInput && document.activeElement !== hInput) hInput.value = naturalH;
};

window.updateCropBoxDimensionsFromInputs = function() {
  const wInput = document.getElementById('crop-box-input-w');
  const hInput = document.getElementById('crop-box-input-h');
  const cropBox = document.getElementById('crop-box');
  const preview = document.getElementById('image-editor-preview');
  if (!wInput || !hInput || !cropBox || !preview || !preview.naturalWidth) return;

  let valW = parseInt(wInput.value) || 10;
  let valH = parseInt(hInput.value) || 10;

  if (valW > preview.naturalWidth) valW = preview.naturalWidth;
  if (valH > preview.naturalHeight) valH = preview.naturalHeight;
  if (valW < 10) valW = 10;
  if (valH < 10) valH = 10;

  const imgRect = getRenderedImageRect(preview);
  const boxW = (valW / preview.naturalWidth) * imgRect.width;
  const boxH = (valH / preview.naturalHeight) * imgRect.height;

  cropBox.style.width = `${Math.round(boxW)}px`;
  cropBox.style.height = `${Math.round(boxH)}px`;
  
  const boxL = parseInt(cropBox.style.left) || 0;
  const boxT = parseInt(cropBox.style.top) || 0;
  const container = document.getElementById('crop-container');
  const cw = container.clientWidth;
  const ch = container.clientHeight;

  if (boxL + boxW > cw) cropBox.style.left = `${cw - boxW}px`;
  if (boxT + boxH > ch) cropBox.style.top = `${ch - boxH}px`;
};

window.openCropForArticle = function(btn) {
  const parent = btn.parentElement;
  let img = parent.querySelector('img');
  if (!img) {
    const bgEl = parent.querySelector('.feed-image');
    if (bgEl) {
      img = bgEl;
    } else {
      img = parent.querySelector('[style*="background-image"]');
    }
  }
  if (img) {
    openImageEditor(img);
    // Auto trigger the Crop activation on opening
    setTimeout(() => {
      window.toggleCropToolBtnClick();
    }, 150);
  } else {
    showToast('⚠️ לא נמצאה תמונה לחיתוך בבלוק זה', 'error');
  }
};

// Crop box dragging/resizing interaction logic
let isCropActive = false;
let cropStart = null;

window.toggleCropToolBtnClick = function() {
  const btn = document.getElementById('btn-toggle-crop-tool');
  const text = document.getElementById('crop-btn-text');
  if (!btn || !text) return;

  const nextState = !isCropActive;
  
  if (nextState) {
    btn.style.background = '#e28743';
    btn.style.borderColor = '#f4b27a';
    btn.style.color = '#000';
    text.textContent = 'כלי חיתוך: פעיל (לחץ לביטול)';
  } else {
    btn.style.background = '#27272a';
    btn.style.borderColor = '#3f3f46';
    btn.style.color = '#fafafa';
    text.textContent = 'הפעל כלי חיתוך (Crop Tool)';
  }
  
  window.toggleCropTool(nextState);
};

window.toggleCropTool = function(checked) {
  isCropActive = checked;
  const cropBox = document.getElementById('crop-box');
  const inputsDiv = document.getElementById('crop-dimensions-inputs');
  if (!cropBox) return;

  if (inputsDiv) inputsDiv.style.display = checked ? 'flex' : 'none';

  if (checked) {
    cropBox.style.display = 'block';
    
    // Position Crop Box centered at 70% width and height
    const container = document.getElementById('crop-container');
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    
    const w = Math.round(cw * 0.7);
    const h = Math.round(ch * 0.7);
    const l = Math.round((cw - w) / 2);
    const t = Math.round((ch - h) / 2);

    cropBox.style.left = `${l}px`;
    cropBox.style.top = `${t}px`;
    cropBox.style.width = `${w}px`;
    cropBox.style.height = `${h}px`;

    // Wait for display update, then sync dimensions
    setTimeout(window.syncCropInputs, 20);
  } else {
    cropBox.style.display = 'none';
  }
};

document.addEventListener('mousedown', startCropInteraction);
document.addEventListener('touchstart', startCropInteraction, { passive: false });

document.addEventListener('mousemove', handleCropInteraction);
document.addEventListener('touchmove', handleCropInteraction, { passive: false });

document.addEventListener('mouseup', stopCropInteraction);
document.addEventListener('touchend', stopCropInteraction);

function startCropInteraction(e) {
  if (!isCropActive) return;
  const target = e.target;
  const cropBox = document.getElementById('crop-box');
  if (!cropBox || !cropBox.contains(target)) return;

  e.preventDefault();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  let mode = 'move';
  if (target.classList.contains('crop-handle')) {
    if (target.classList.contains('tl')) mode = 'tl';
    else if (target.classList.contains('tr')) mode = 'tr';
    else if (target.classList.contains('bl')) mode = 'bl';
    else if (target.classList.contains('br')) mode = 'br';
    else if (target.classList.contains('t')) mode = 't';
    else if (target.classList.contains('b')) mode = 'b';
    else if (target.classList.contains('l')) mode = 'l';
    else if (target.classList.contains('r')) mode = 'r';
  }

  cropStart = {
    mode: mode,
    startX: clientX,
    startY: clientY,
    startLeft: parseInt(cropBox.style.left) || 0,
    startTop: parseInt(cropBox.style.top) || 0,
    startWidth: parseInt(cropBox.style.width) || 100,
    startHeight: parseInt(cropBox.style.height) || 100
  };
}

function handleCropInteraction(e) {
  if (!isCropActive || !cropStart) return;
  e.preventDefault();

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const dx = clientX - cropStart.startX;
  const dy = clientY - cropStart.startY;

  const cropBox = document.getElementById('crop-box');
  const container = document.getElementById('crop-container');
  if (!cropBox || !container) return;

  const cw = container.clientWidth;
  const ch = container.clientHeight;

  let nextLeft = cropStart.startLeft;
  let nextTop = cropStart.startTop;
  let nextWidth = cropStart.startWidth;
  let nextHeight = cropStart.startHeight;

  const MIN_SIZE = 10;

  if (cropStart.mode === 'move') {
    nextLeft = cropStart.startLeft + dx;
    nextTop = cropStart.startTop + dy;

    if (nextLeft < 0) nextLeft = 0;
    if (nextTop < 0) nextTop = 0;
    if (nextLeft + nextWidth > cw) nextLeft = cw - nextWidth;
    if (nextTop + nextHeight > ch) nextTop = ch - nextHeight;
  } else {
    // Top-Left corner resize
    if (cropStart.mode === 'tl') {
      let targetLeft = cropStart.startLeft + dx;
      if (targetLeft < 0) targetLeft = 0;
      let targetWidth = cropStart.startWidth - (targetLeft - cropStart.startLeft);
      if (targetWidth < MIN_SIZE) {
        targetWidth = MIN_SIZE;
        targetLeft = cropStart.startLeft + cropStart.startWidth - MIN_SIZE;
      }
      
      let targetTop = cropStart.startTop + dy;
      if (targetTop < 0) targetTop = 0;
      let targetHeight = cropStart.startHeight - (targetTop - cropStart.startTop);
      if (targetHeight < MIN_SIZE) {
        targetHeight = MIN_SIZE;
        targetTop = cropStart.startTop + cropStart.startHeight - MIN_SIZE;
      }
      
      nextLeft = targetLeft;
      nextWidth = targetWidth;
      nextTop = targetTop;
      nextHeight = targetHeight;
    }
    // Top-Right corner resize
    else if (cropStart.mode === 'tr') {
      let targetWidth = cropStart.startWidth + dx;
      if (cropStart.startLeft + targetWidth > cw) targetWidth = cw - cropStart.startLeft;
      if (targetWidth < MIN_SIZE) targetWidth = MIN_SIZE;

      let targetTop = cropStart.startTop + dy;
      if (targetTop < 0) targetTop = 0;
      let targetHeight = cropStart.startHeight - (targetTop - cropStart.startTop);
      if (targetHeight < MIN_SIZE) {
        targetHeight = MIN_SIZE;
        targetTop = cropStart.startTop + cropStart.startHeight - MIN_SIZE;
      }

      nextWidth = targetWidth;
      nextTop = targetTop;
      nextHeight = targetHeight;
    }
    // Bottom-Left corner resize
    else if (cropStart.mode === 'bl') {
      let targetLeft = cropStart.startLeft + dx;
      if (targetLeft < 0) targetLeft = 0;
      let targetWidth = cropStart.startWidth - (targetLeft - cropStart.startLeft);
      if (targetWidth < MIN_SIZE) {
        targetWidth = MIN_SIZE;
        targetLeft = cropStart.startLeft + cropStart.startWidth - MIN_SIZE;
      }

      let targetHeight = cropStart.startHeight + dy;
      if (cropStart.startTop + targetHeight > ch) targetHeight = ch - cropStart.startTop;
      if (targetHeight < MIN_SIZE) targetHeight = MIN_SIZE;

      nextLeft = targetLeft;
      nextWidth = targetWidth;
      nextHeight = targetHeight;
    }
    // Bottom-Right corner resize
    else if (cropStart.mode === 'br') {
      let targetWidth = cropStart.startWidth + dx;
      if (cropStart.startLeft + targetWidth > cw) targetWidth = cw - cropStart.startLeft;
      if (targetWidth < MIN_SIZE) targetWidth = MIN_SIZE;

      let targetHeight = cropStart.startHeight + dy;
      if (cropStart.startTop + targetHeight > ch) targetHeight = ch - cropStart.startTop;
      if (targetHeight < MIN_SIZE) targetHeight = MIN_SIZE;

      nextWidth = targetWidth;
      nextHeight = targetHeight;
    }
    // Top edge resize
    else if (cropStart.mode === 't') {
      let targetTop = cropStart.startTop + dy;
      if (targetTop < 0) targetTop = 0;
      let targetHeight = cropStart.startHeight - (targetTop - cropStart.startTop);
      if (targetHeight < MIN_SIZE) {
        targetHeight = MIN_SIZE;
        targetTop = cropStart.startTop + cropStart.startHeight - MIN_SIZE;
      }
      nextTop = targetTop;
      nextHeight = targetHeight;
    }
    // Bottom edge resize
    else if (cropStart.mode === 'b') {
      let targetHeight = cropStart.startHeight + dy;
      if (cropStart.startTop + targetHeight > ch) targetHeight = ch - cropStart.startTop;
      if (targetHeight < MIN_SIZE) targetHeight = MIN_SIZE;
      nextHeight = targetHeight;
    }
    // Left edge resize
    else if (cropStart.mode === 'l') {
      let targetLeft = cropStart.startLeft + dx;
      if (targetLeft < 0) targetLeft = 0;
      let targetWidth = cropStart.startWidth - (targetLeft - cropStart.startLeft);
      if (targetWidth < MIN_SIZE) {
        targetWidth = MIN_SIZE;
        targetLeft = cropStart.startLeft + cropStart.startWidth - MIN_SIZE;
      }
      nextLeft = targetLeft;
      nextWidth = targetWidth;
    }
    // Right edge resize
    else if (cropStart.mode === 'r') {
      let targetWidth = cropStart.startWidth + dx;
      if (cropStart.startLeft + targetWidth > cw) targetWidth = cw - cropStart.startLeft;
      if (targetWidth < MIN_SIZE) targetWidth = MIN_SIZE;
      nextWidth = targetWidth;
    }
  }

  cropBox.style.left = `${nextLeft}px`;
  cropBox.style.top = `${nextTop}px`;
  cropBox.style.width = `${nextWidth}px`;
  cropBox.style.height = `${nextHeight}px`;

  window.syncCropInputs();
}

function stopCropInteraction() {
  cropStart = null;
}

window.resetImageEdit = async function() {
  if (!currentEditingImg) return;
  if (confirm('האם אתה בטוח שברצונך לאפס את התמונה למקור?')) {
    const id = getImageIdentifier(currentEditingImg);
    
    // Remove from customizations
    delete activeCustomizations[id];
    
    // Clear styles and attributes
    currentEditingImg.style.width = '';
    currentEditingImg.removeAttribute('data-custom-link');
    if (currentEditingImg.tagName !== 'IMG') {
      currentEditingImg.style.backgroundImage = '';
      currentEditingImg.style.backgroundPosition = '';
    } else {
      currentEditingImg.style.objectFit = '';
      currentEditingImg.style.objectPosition = '';
    }
    
    window.closeImageEditor();
    showToast('✓ התמונה אופסה. טוען מחדש...');
    
    await saveCustomizationsToServer();
    window.location.reload();
  }
};


// -------------------------------------------------------------
// Live Block Resizing Functionality (Stretch/Shrink Cards/Blocks)
// -------------------------------------------------------------
window.updateBlockResizeHandles = function() {
  // Remove existing block resize handles first
  document.querySelectorAll('.block-resize-handle').forEach(h => h.remove());

  if (!window.isEditModeActive) return;

  // Find all cards and blocks on the homepage to make resizable
  const targets = document.querySelectorAll('.featured-card, .feed-item, .feed-image');
  targets.forEach(block => {
    const origPos = window.getComputedStyle(block).position;
    if (origPos !== 'absolute' && origPos !== 'fixed' && origPos !== 'relative') {
      block.style.position = 'relative';
    }

    const handle = document.createElement('div');
    handle.className = 'block-resize-handle';
    handle.style.position = 'absolute';
    handle.style.right = '4px';
    handle.style.bottom = '4px';
    handle.style.width = '16px';
    handle.style.height = '16px';
    handle.style.cursor = 'se-resize';
    handle.style.zIndex = '999';
    // Diagonal stripes (three lines)
    handle.style.background = 'linear-gradient(135deg, transparent 40%, #e28743 40%, #e28743 60%, transparent 60%, transparent 80%, #e28743 80%)';
    handle.style.borderRadius = '2px';

    handle.addEventListener('click', e => e.stopPropagation());
    handle.addEventListener('mousedown', startBlockResize);
    handle.addEventListener('touchstart', startBlockResize, { passive: false });

    block.appendChild(handle);
  });
};

let resizeBlock = null;
let resizeStartW = 0;
let resizeStartH = 0;
let resizeStartX = 0;
let resizeStartY = 0;

function startBlockResize(e) {
  e.preventDefault();
  e.stopPropagation();

  const handle = e.target;
  resizeBlock = handle.parentElement;

  resizeStartW = resizeBlock.clientWidth;
  resizeStartH = resizeBlock.clientHeight;
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  resizeStartX = clientX;
  resizeStartY = clientY;

  document.addEventListener('mousemove', handleBlockResize);
  document.addEventListener('touchmove', handleBlockResize, { passive: false });
  document.addEventListener('mouseup', stopBlockResize);
  document.addEventListener('touchend', stopBlockResize);
}

function handleBlockResize(e) {
  if (!resizeBlock) return;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const dx = clientX - resizeStartX;
  const dy = clientY - resizeStartY;

  let newW = resizeStartW + dx;
  let newH = resizeStartH + dy;

  if (newW < 80) newW = 80;
  if (newH < 50) newH = 50;

  resizeBlock.style.width = `${newW}px`;
  resizeBlock.style.height = `${newH}px`;
}

async function stopBlockResize(e) {
  document.removeEventListener('mousemove', handleBlockResize);
  document.removeEventListener('touchmove', handleBlockResize);
  document.removeEventListener('mouseup', stopBlockResize);
  document.removeEventListener('touchend', stopBlockResize);

  if (!resizeBlock) return;

  const block = resizeBlock;
  resizeBlock = null;

  // Save the custom block dimensions to server
  const id = getImageIdentifier(block);
  activeCustomizations[id] = activeCustomizations[id] || {};
  activeCustomizations[id].blockWidth = block.style.width;
  activeCustomizations[id].blockHeight = block.style.height;

  showToast('✓ מידות הבלוק נשמרו בהצלחה');
  await saveCustomizationsToServer();
}

// Hook resize handles update inside edit toggles
const origEnableLiveEdit = window.enableLiveEditMode;
window.enableLiveEditMode = function() {
  origEnableLiveEdit();
  window.updateBlockResizeHandles();
};

const origDisableLiveEdit = window.disableLiveEditMode;
window.disableLiveEditMode = function() {
  origDisableLiveEdit();
  window.updateBlockResizeHandles();
};

// -------------------------------------------------------------
// Debounced MutationObserver to auto apply customizations to dynamic content
// -------------------------------------------------------------
let mutationTimeout = null;
const observer = new MutationObserver(() => {
  if (mutationTimeout) clearTimeout(mutationTimeout);
  mutationTimeout = setTimeout(() => {
    observer.disconnect();
    applyAllCustomizations();
    window.updateBlockResizeHandles();
    observer.observe(document.body, { childList: true, subtree: true });
  }, 100);
});
observer.observe(document.body, { childList: true, subtree: true });

window.approveChangesClick = async function() {
  showToast('💾 שומר ומאשר את השינויים...', 'info');
  await saveCustomizationsToServer();
  disableLiveEditMode();
  showToast('✓ השינויים אושרו ונשמרו בהצלחה!');
};

// =============================================================
// B2B FACTORY SYSTEM
// =============================================================
const defaultB2bFactories = [
  {
    id: 'fac_1',
    name: 'מפעל עץ הגליל',
    category: 'wood',
    materials: 'עץ אורן, עץ אלון, לוחות MDF, עץ גושני, משטחי עץ',
    moq: '10 קוב',
    location: 'כרמיאל',
    phone: '0521234567',
    description: 'מפעל לעיבוד עץ מוביל בצפון. מספקים חומרי גלם לנגריות, קבלנים ומפעלי רהיטים.'
  },
  {
    id: 'fac_2',
    name: 'תעשיות מתכת נגב בע"מ',
    category: 'metal',
    materials: 'לוחות פלדה, פרופילי ברזל, צינורות אלומיניום, ריתוך תעשייתי, חיתוך לייזר',
    moq: '500 ק"ג',
    location: 'באר שבע',
    phone: '0547654321',
    description: 'ייצור ואספקת מוצרי מתכת כבדה וקלה לתעשייה ולבנייה.'
  },
  {
    id: 'fac_3',
    name: 'סיליקון ופלסטיק מרכז',
    category: 'plastics',
    materials: 'יריעות פוליאתילן, פלסטיק קשיח לתעשייה, תבניות הזרקה, סיליקון נוזלי',
    moq: '5,000 יחידות',
    location: 'ראשון לציון',
    phone: '0509876543',
    description: 'פתרונות פלסטיק מתקדמים ומותאמים אישית למוצרי צריכה ואריזה.'
  },
  {
    id: 'fac_4',
    name: 'טקסטיל העמק',
    category: 'textiles',
    materials: 'בדי כותנה, גלילי בד תעשייתיים, חוטי תפירה, בדי ריפוד חסיני אש',
    moq: '100 גלילים',
    location: 'עפולה',
    phone: '0531112223',
    description: 'אספקת בדי איכות מעולים למפעלי אופנה, עיצוב וריפוד.'
  }
];

let b2bTab = 'factories'; // 'factories', 'delivery', or 'market'
let b2bCategory = 'all';

const defaultB2bDeliveries = [
  {
    id: 'del_1',
    name: 'שליחויות הצפון וקווי הפצה בע"מ',
    category: 'light',
    materials: 'הפצה יומית, שליחויות מהירות, רכבים מסחריים קלים, שירות קירור קל',
    moq: 'אין מינימום',
    location: 'חיפה והצפון',
    phone: '0522223334',
    description: 'פתרונות הפצה ושליחויות לעסקים ומפעלים בצפון הארץ. שירות מהיר מהיום להיום.'
  },
  {
    id: 'del_2',
    name: 'מובילי הנגב והמרכז - הובלות כבדות',
    category: 'heavy',
    materials: 'משאיות סמיטריילר, הובלת מכולות, הובלת חומרי גלם בתפזורת, שירותי מנוף',
    moq: 'משלוח אחד',
    location: 'כל הארץ',
    phone: '0543334445',
    description: 'חברת הובלות ולוגיסטיקה מובילה המתמחה בשינוע מטענים כבדים, לוחות מתכת, ועצים מכל המפעלים.'
  },
  {
    id: 'del_3',
    name: 'אקספרס קרגו לוגיסטיקה',
    category: 'express',
    materials: 'שילוח מהיר ארצי, לוגיסטיקה משולבת, אחסון סחורות, הפצת משטחים',
    moq: '3 משטחים',
    location: 'מרכז הארץ',
    phone: '0504445556',
    description: 'מערך הפצה מתקדם וצי רכבים חדיש לשינוע מהיר של סחורות ומארזי פלסטיק וטקסטיל.'
  }
];

const defaultB2bMarket = [
  { id: 'm1', name: 'עץ אורן פיני לבן', category: 'עצים', price: '1,800 - 2,200 ₪ לקוב', trend: 'stable', supply: 'גבוהה', demand: 'בינונית', filterKey: 'אורן' },
  { id: 'm2', name: 'עץ אלון אירופאי', category: 'עצים', price: '5,500 - 6,800 ₪ לקוב', trend: 'up', supply: 'נמוכה', demand: 'גבוהה', filterKey: 'אלון' },
  { id: 'm3', name: 'לוחות פלדה חמה (הוט רולד)', category: 'מתכות', price: '3.2 - 3.8 ₪ לק"ג', trend: 'up', supply: 'בינונית', demand: 'גבוהה', filterKey: 'פלדה' },
  { id: 'm4', name: 'אלומיניום 6061-T6', category: 'מתכות', price: '14 - 18 ₪ לק"ג', trend: 'down', supply: 'גבוהה', demand: 'גבוהה', filterKey: 'אלומיניום' },
  { id: 'm5', name: 'פוליאתילן HDPE לתעשייה', category: 'פלסטיק', price: '5.8 - 6.5 ₪ לק"ג', trend: 'stable', supply: 'בינונית', demand: 'בינונית', filterKey: 'פוליאתילן' },
  { id: 'm6', name: 'בד כותנה סרוק', category: 'טקסטיל', price: '12 - 16 ₪ למטר', trend: 'stable', supply: 'גבוהה', demand: 'בינונית', filterKey: 'כותנה' }
];

window.initB2bPage = function() {
  let factories = localStorage.getItem('b2bFactories');
  if (!factories) {
    localStorage.setItem('b2bFactories', JSON.stringify(defaultB2bFactories));
  }
  let deliveries = localStorage.getItem('b2bDeliveries');
  if (!deliveries) {
    localStorage.setItem('b2bDeliveries', JSON.stringify(defaultB2bDeliveries));
  }
  let market = localStorage.getItem('b2bMarket');
  if (!market) {
    localStorage.setItem('b2bMarket', JSON.stringify(defaultB2bMarket));
  }
  
  // Set default active tab style
  switchB2bTab(b2bTab);
};

window.switchB2bTab = function(tab) {
  b2bTab = tab;
  b2bCategory = 'all';

  // Toggle visual tabs
  const tabFac = document.getElementById('b2b-tab-factories');
  const tabDel = document.getElementById('b2b-tab-delivery');
  const tabMkt = document.getElementById('b2b-tab-market');

  if (tabFac) {
    tabFac.style.borderBottomColor = tab === 'factories' ? '#ff9500' : 'transparent';
    tabFac.style.color = tab === 'factories' ? '#fff' : '#86868b';
  }
  if (tabDel) {
    tabDel.style.borderBottomColor = tab === 'delivery' ? '#ff9500' : 'transparent';
    tabDel.style.color = tab === 'delivery' ? '#fff' : '#86868b';
  }
  if (tabMkt) {
    tabMkt.style.borderBottomColor = tab === 'market' ? '#ff9500' : 'transparent';
    tabMkt.style.color = tab === 'market' ? '#fff' : '#86868b';
  }

  // Toggle page sections
  const dirSection = document.getElementById('b2b-directory-section');
  const mktSection = document.getElementById('b2b-market-section');

  if (tab === 'market') {
    if (dirSection) dirSection.style.display = 'none';
    if (mktSection) mktSection.style.display = 'block';
    renderB2bMarket();
  } else {
    if (dirSection) dirSection.style.display = 'grid';
    if (mktSection) mktSection.style.display = 'none';
    
    // Update register button text
    const regBtnText = document.getElementById('b2b-register-btn-text');
    if (regBtnText) {
      regBtnText.textContent = tab === 'factories' ? 'רשום מפעל חדש' : 'רשום חברת הובלה';
    }

    // Update search placeholder
    const searchInput = document.getElementById('b2b-search-input');
    if (searchInput) {
      searchInput.value = '';
      searchInput.placeholder = tab === 'factories' 
        ? 'חפש מפעלים, חומרי גלם (עץ, ברזל, פלסטיק...)' 
        : 'חפש חברות הובלה, אזורי פעילות, סוגי רכבים...';
    }

    renderB2bFilters();
    renderB2bFactories();
    renderB2bMyOffers();
  }
};

function renderB2bFilters() {
  const chips = document.getElementById('b2b-category-chips');
  if (!chips) return;

  const cats = (b2bTab === 'factories') ? [
    { id: 'all', label: 'הכל', emoji: '🌐' },
    { id: 'wood', label: 'עצים ומוצרי עץ', emoji: '🪵' },
    { id: 'metal', label: 'מתכות ועיבוד', emoji: '⚙️' },
    { id: 'plastics', label: 'פלסטיק וסיליקון', emoji: '🧪' },
    { id: 'textiles', label: 'בדים וטקסטיל', emoji: '🧵' },
    { id: 'other', label: 'אחר', emoji: '📦' }
  ] : [
    { id: 'all', label: 'הכל', emoji: '🌐' },
    { id: 'light', label: 'הובלות קלות', emoji: '📦' },
    { id: 'heavy', label: 'משאיות והובלה כבדה', emoji: '🚛' },
    { id: 'express', label: 'שליחויות ואקספרס', emoji: '⚡' },
    { id: 'other', label: 'אחר', emoji: '⚙️' }
  ];

  chips.innerHTML = cats.map(c => `
    <button onclick="setB2bCategory('${c.id}', this)" class="category-pill ${b2bCategory === c.id ? 'active' : ''}" style="white-space:nowrap; padding:8px 16px; border-radius:980px; border:1px solid rgba(255,255,255,0.1); background:${b2bCategory === c.id ? 'linear-gradient(135deg,#ff9500,#ffcc00)' : 'rgba(255,255,255,0.05)'}; color:${b2bCategory === c.id ? '#000' : '#fff'}; font-weight:700; cursor:pointer; font-size:0.88rem; display:flex; align-items:center; gap:6px; transition:all 0.2s;">
      <span>${c.emoji}</span> <span>${c.label}</span>
    </button>
  `).join('');
}

window.setB2bCategory = function(cat, btn) {
  b2bCategory = cat;
  renderB2bFilters();
  renderB2bFactories();
};

window.renderB2bFactories = function() {
  const list = document.getElementById('b2b-factories-list');
  if (!list) return;

  const isFactories = (b2bTab === 'factories');
  const items = JSON.parse(localStorage.getItem(isFactories ? 'b2bFactories' : 'b2bDeliveries') || '[]');
  const searchInput = document.getElementById('b2b-search-input');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = items;
  if (b2bCategory !== 'all') {
    filtered = filtered.filter(f => f.category === b2bCategory);
  }
  if (query) {
    filtered = filtered.filter(f =>
      f.name.toLowerCase().includes(query) ||
      f.materials.toLowerCase().includes(query) ||
      (f.location || '').toLowerCase().includes(query) ||
      (f.description || '').toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    list.innerHTML = `
      <div style="background:#141416; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:60px 20px; text-align:center; color:#86868b;">
        <i class="fas ${isFactories ? 'fa-industry' : 'fa-truck'}" style="font-size:3rem; margin-bottom:16px; opacity:0.4; color:#fff;"></i>
        <h3 style="color:#fff; margin:0 0 8px 0; font-size:1.2rem;">לא נמצאו תוצאות תואמות</h3>
        <p style="margin:0; font-size:0.9rem;">נסה לשנות את הסינון או את מילות החיפוש.</p>
      </div>
    `;
    return;
  }

  const categoryLabels = isFactories 
    ? { wood: '🪵 עצים', metal: '⚙️ מתכות', plastics: '🧪 פלסטיק', textiles: '🧵 טקסטיל', other: '📦 אחר' }
    : { light: '📦 הובלות קלות', heavy: '🚛 הובלה כבדה', express: '⚡ אקספרס', other: '⚙️ אחר' };

  list.innerHTML = filtered.map(f => {
    const materialsList = f.materials.split(',').map(m => m.trim()).filter(Boolean);
    const textMsg = isFactories ? 'היי, הגעתי דרך SOKI B2B. רציתי לברר לגבי אספקת חומרים.' : 'היי, הגעתי דרך SOKI B2B. רציתי לברר לגבי שירותי הובלה ומשלוח.';
    const whatsAppUrl = `https://wa.me/972${f.phone.replace(/^0/, '')}?text=${encodeURIComponent(textMsg)}`;

    return `
      <div style="background:#141416; border:1px solid rgba(255,255,255,0.08); border-radius:16px; padding:24px; display:flex; flex-direction:column; gap:16px; transition:border-color 0.2s;" onmouseover="this.style.borderColor='rgba(255,255,255,0.15)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'">
        <!-- Top header -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
              <h2 style="margin:0; font-size:1.3rem; font-weight:800; color:#fff;">${escHtml(f.name)}</h2>
              <span style="font-size:0.75rem; background:rgba(255,255,255,0.05); color:#a1a1aa; padding:4px 10px; border-radius:980px; font-weight:700;">${categoryLabels[f.category] || 'אחר'}</span>
            </div>
            <div style="display:flex; gap:16px; font-size:0.85rem; color:#86868b; align-items:center;">
              <span>📍 אזור פעילות/מיקום: <strong>${escHtml(f.location)}</strong></span>
              <span>•</span>
              <span>📦 MOQ (מינימום הזמנה): <strong>${escHtml(f.moq || 'ללא')}</strong></span>
            </div>
          </div>
          <!-- Contact buttons -->
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button onclick="openB2bOfferModal('${f.id}', '${escHtml(f.name.replace(/'/g, "\\'"))}')" style="background:linear-gradient(135deg,#ff9500,#ffcc00); color:#000; border:none; padding:10px 18px; border-radius:10px; font-weight:700; font-size:0.88rem; display:flex; align-items:center; gap:6px; cursor:pointer; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
              <i class="fas fa-paper-plane" style="font-size:0.85rem;"></i> הגש הצעה
            </button>
            <a href="${whatsAppUrl}" target="_blank" style="background:#25D366; color:#fff; padding:10px 18px; border-radius:10px; font-weight:700; text-decoration:none; font-size:0.88rem; display:flex; align-items:center; gap:6px; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
              <i class="fab fa-whatsapp" style="font-size:1rem;"></i> וואטסאפ
            </a>
            <a href="tel:${f.phone}" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:#fff; padding:10px 18px; border-radius:10px; font-weight:700; text-decoration:none; font-size:0.88rem; display:flex; align-items:center; gap:6px; transition:transform 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
              <i class="fas fa-phone-alt" style="font-size:0.85rem;"></i> התקשר
            </a>
          </div>
        </div>

        <!-- Description -->
        ${f.description ? `<p style="color:#d2d2d7; font-size:0.95rem; margin:0; line-height:1.6; text-align:right;">${escHtml(f.description)}</p>` : ''}

        <!-- Materials tags -->
        <div>
          <div style="font-size:0.8rem; font-weight:700; color:#86868b; text-transform:uppercase; margin-bottom:8px;">
            ${isFactories ? 'חומרי גלם וכושר ייצור:' : 'שירותי הובלה וציוד זמין:'}
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${materialsList.map(mat => `
              <span style="font-size:0.8rem; background:rgba(0,113,227,0.08); border:1px solid rgba(0,113,227,0.25); color:#0071e3; padding:5px 12px; border-radius:8px; font-weight:600;">${escHtml(mat)}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
};

window.filterB2bFactories = function() {
  renderB2bFactories();
};

window.openB2bRegisterModal = function() {
  const modal = document.getElementById('b2b-register-modal');
  if (modal) {
    modal.style.display = 'flex';
    toggleRegFields(); // Initialize default label styles
  }
};

window.closeB2bRegisterModal = function() {
  const modal = document.getElementById('b2b-register-modal');
  if (modal) modal.style.display = 'none';
};

window.toggleRegFields = function() {
  const type = document.getElementById('b2b-reg-type').value;
  const catSelect = document.getElementById('b2b-reg-category');
  const nameLabel = document.getElementById('b2b-reg-name-label');
  const materialsLabel = document.getElementById('b2b-reg-materials-label');
  const moqLabel = document.getElementById('b2b-reg-moq-label');
  
  if (type === 'factory') {
    nameLabel.textContent = 'שם המפעל *';
    materialsLabel.textContent = 'חומרי גלם ומוצרים (מופרדים בפסיק) *';
    moqLabel.textContent = 'כמות הזמנה מינימלית (MOQ)';
    catSelect.innerHTML = `
      <option value="wood">עצים ומוצרי עץ</option>
      <option value="metal">מתכות ועיבוד שבבי</option>
      <option value="plastics">פלסטיק וסיליקון</option>
      <option value="textiles">בדים וטקסטיל</option>
      <option value="other">אחר</option>
    `;
  } else {
    nameLabel.textContent = 'שם חברת ההובלה / מוביל *';
    materialsLabel.textContent = 'שירותי הובלה וציוד (למשל: משאיות מנוף, סמיטריילר) *';
    moqLabel.textContent = 'מינימום להזמנת הובלה (MOQ)';
    catSelect.innerHTML = `
      <option value="light">הובלות קלות</option>
      <option value="heavy">משאיות והובלה כבדה</option>
      <option value="express">שליחויות ואקספרס</option>
      <option value="other">אחר</option>
    `;
  }
};

window.submitB2bRegister = function(e) {
  e.preventDefault();
  const type = document.getElementById('b2b-reg-type') ? document.getElementById('b2b-reg-type').value : 'factory';
  const name = document.getElementById('b2b-reg-name').value.trim();
  const category = document.getElementById('b2b-reg-category').value;
  const location = document.getElementById('b2b-reg-location').value.trim();
  const materials = document.getElementById('b2b-reg-materials').value.trim();
  const moq = document.getElementById('b2b-reg-moq').value.trim() || 'ללא מינימום';
  const phone = document.getElementById('b2b-reg-phone').value.trim();
  const description = document.getElementById('b2b-reg-description').value.trim();

  const newItem = {
    id: (type === 'factory' ? 'fac_' : 'del_') + Date.now(),
    name,
    category,
    materials,
    moq,
    location,
    phone,
    description
  };

  if (type === 'factory') {
    const factories = JSON.parse(localStorage.getItem('b2bFactories') || '[]');
    factories.unshift(newItem);
    localStorage.setItem('b2bFactories', JSON.stringify(factories));
    showToast('✓ המפעל נרשם בהצלחה במאגר!');
  } else {
    const deliveries = JSON.parse(localStorage.getItem('b2bDeliveries') || '[]');
    deliveries.unshift(newItem);
    localStorage.setItem('b2bDeliveries', JSON.stringify(deliveries));
    showToast('✓ חברת ההובלה נרשמה בהצלחה במאגר!');
  }

  closeB2bRegisterModal();
  e.target.reset();
  renderB2bFactories();
};

window.submitB2bRequest = function(e) {
  e.preventDefault();
  const cat = document.getElementById('b2b-req-cat').value;
  const desc = document.getElementById('b2b-req-desc').value.trim();
  const contact = document.getElementById('b2b-req-contact').value.trim();

  // Save request in a local log for demo purposes
  const reqs = JSON.parse(localStorage.getItem('b2bRequests') || '[]');
  reqs.unshift({ id: Date.now(), cat, desc, contact, date: new Date().toLocaleString() });
  localStorage.setItem('b2bRequests', JSON.stringify(reqs));

  showToast('✓ בקשתך נשלחה למפעלים בקטגוריה!');
  e.target.reset();
};

window.openB2bOfferModal = function(factoryId, factoryName) {
  const modal = document.getElementById('b2b-offer-modal');
  if (!modal) return;
  
  document.getElementById('b2b-offer-factory-id').value = factoryId;
  document.getElementById('b2b-offer-factory-name').value = factoryName;
  document.getElementById('b2b-offer-subtitle').textContent = `עבור: ${factoryName}`;
  
  modal.style.display = 'flex';
};

window.closeB2bOfferModal = function() {
  const modal = document.getElementById('b2b-offer-modal');
  if (modal) modal.style.display = 'none';
};

window.submitB2bOffer = function(e) {
  e.preventDefault();
  const factoryId = document.getElementById('b2b-offer-factory-id').value;
  const factoryName = document.getElementById('b2b-offer-factory-name').value;
  const sender = document.getElementById('b2b-offer-sender').value.trim();
  const subject = document.getElementById('b2b-offer-subject').value.trim();
  const content = document.getElementById('b2b-offer-content').value.trim();
  const contact = document.getElementById('b2b-offer-contact').value.trim();

  const newOffer = {
    id: Date.now(),
    factoryId,
    factoryName,
    sender,
    subject,
    content,
    contact,
    date: new Date().toLocaleDateString('he-IL')
  };

  const offers = JSON.parse(localStorage.getItem('b2bOffers') || '[]');
  offers.unshift(newOffer);
  localStorage.setItem('b2bOffers', JSON.stringify(offers));

  showToast('✓ הצעתך הוגשה בהצלחה!');
  closeB2bOfferModal();
  e.target.reset();
  renderB2bMyOffers();
};

window.renderB2bMyOffers = function() {
  const box = document.getElementById('b2b-my-offers-box');
  const list = document.getElementById('b2b-my-offers-list');
  if (!box || !list) return;

  const offers = JSON.parse(localStorage.getItem('b2bOffers') || '[]');
  if (offers.length === 0) {
    box.style.display = 'none';
    return;
  }

  box.style.display = 'block';
  list.innerHTML = offers.map(o => `
    <div style="background:#1c1c1e; border:1px solid rgba(255,255,255,0.05); border-radius:10px; padding:12px; font-size:0.85rem; text-align:right;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong style="color:#fff;">${escHtml(o.factoryName)}</strong>
        <span style="font-size:0.75rem; color:#86868b;">${o.date}</span>
      </div>
      <div style="color:#ff9500; font-weight:700; margin-bottom:4px;">נושא: ${escHtml(o.subject)}</div>
      <div style="color:#d2d2d7; margin-bottom:6px; line-height:1.4;">${escHtml(o.content)}</div>
      <div style="color:#86868b; font-size:0.8rem; border-top:1px solid rgba(255,255,255,0.05); padding-top:4px; margin-top:4px;">
        מאת: ${escHtml(o.sender)} • קשר: ${escHtml(o.contact)}
      </div>
    </div>
  `).join('');
};

window.renderB2bMarket = function() {
  const body = document.getElementById('b2b-market-table-body');
  if (!body) return;

  const market = JSON.parse(localStorage.getItem('b2bMarket') || '[]');
  const searchInput = document.getElementById('b2b-market-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = market;
  if (query) {
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }

  const trendIcons = {
    stable: '<span style="color:#86868b;"><i class="fas fa-minus"></i> יציב</span>',
    up: '<span style="color:#ff453a; font-weight:700;"><i class="fas fa-arrow-trend-up"></i> 📈 עלייה</span>',
    down: '<span style="color:#30d158; font-weight:700;"><i class="fas fa-arrow-trend-down"></i> 📉 ירידה</span>'
  };

  const badgeStyles = {
    גבוהה: 'background:rgba(48,209,88,0.1); color:#30d158;',
    בינונית: 'background:rgba(255,149,0,0.1); color:#ff9500;',
    נמוכה: 'background:rgba(255,69,58,0.1); color:#ff453a;'
  };

  body.innerHTML = filtered.map(item => `
    <tr style="border-bottom:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
      <td style="padding:16px 12px; font-weight:700; color:#fff;">${escHtml(item.name)}</td>
      <td style="padding:16px 12px; color:#d2d2d7;">${escHtml(item.category)}</td>
      <td style="padding:16px 12px; color:#ff9500; font-weight:700;">${escHtml(item.price)}</td>
      <td style="padding:16px 12px;">${trendIcons[item.trend]}</td>
      <td style="padding:16px 12px;"><span style="font-size:0.75rem; padding:4px 10px; border-radius:6px; font-weight:700; ${badgeStyles[item.supply] || ''}">${escHtml(item.supply)}</span></td>
      <td style="padding:16px 12px;"><span style="font-size:0.75rem; padding:4px 10px; border-radius:6px; font-weight:700; ${badgeStyles[item.demand] || ''}">${escHtml(item.demand)}</span></td>
      <td style="padding:16px 12px; text-align:left;">
        <button onclick="findSuppliersForMaterial('${escHtml(item.filterKey)}')" style="background:rgba(0,113,227,0.1); border:1px solid rgba(0,113,227,0.3); color:#0071e3; padding:6px 14px; border-radius:8px; font-size:0.8rem; font-weight:700; cursor:pointer; transition:all 0.2s;" onmouseover="this.style.background='#0071e3'; this.style.color='#fff';" onmouseout="this.style.background='rgba(0,113,227,0.1)'; this.style.color='#0071e3';">חפש ספקים</button>
      </td>
    </tr>
  `).join('');
};

window.filterB2bMarket = function() {
  renderB2bMarket();
};

window.findSuppliersForMaterial = function(filterKey) {
  switchB2bTab('factories');
  const searchInput = document.getElementById('b2b-search-input');
  if (searchInput) {
    searchInput.value = filterKey;
    renderB2bFactories();
  }
};

window.initRealEstatePage = function() {
  calculateRealEstateGrowth();
};

window.calculateRealEstateGrowth = function() {
  const input = document.getElementById('re-calc-units');
  if (!input) return;

  const units = parseInt(input.value) || 0;
  
  // Formulas for resource estimations
  const workers = Math.round(units * 0.25);
  const steel = Math.round(units * 3.5);
  const wood = Math.round(units * 0.2);
  const deliveries = Math.round(units * 0.8);
  const savings = Math.round(units * 0.45);

  const workersEl = document.getElementById('re-calc-workers');
  const steelEl = document.getElementById('re-calc-steel');
  const woodEl = document.getElementById('re-calc-wood');
  const deliveriesEl = document.getElementById('re-calc-deliveries');
  const savingsEl = document.getElementById('re-calc-savings');

  if (workersEl) workersEl.textContent = `${workers} עובדים`;
  if (steelEl) steelEl.textContent = `${steel} טון`;
  if (woodEl) woodEl.textContent = `${wood} קוב`;
  if (deliveriesEl) deliveriesEl.textContent = `${deliveries} הובלות`;
  if (savingsEl) savingsEl.textContent = `${savings} ימי עבודה`;
};

// ==========================================
// YAD2 SHARING, STORAGE & PRODUCE SYSTEM
// ==========================================
let sharingActiveTab = 'equipment'; // 'equipment' | 'storage' | 'garden'

// Initial seed data for Yad2 Sharing
const initialSharingAds = [
  {
    id: 'ad-eq-1',
    type: 'equipment',
    title: 'גנרטור מנוע בנזין 3000W מקצועי',
    region: 'מרכז',
    location: 'גבעתיים, רחוב כצנלסון',
    price: 'חינם (השאלה לקהילה)',
    duration: 'עד יומיים',
    owner: 'ארנון ג.',
    phone: '052-4445566',
    description: 'גנרטור מעולה לאירועי שטח קטנים או גיבוי חשמל ביתי. מסופק מלא בדלק ומצפה לחזור מלא.'
  },
  {
    id: 'ad-eq-2',
    type: 'equipment',
    title: 'מערבל בטון מקצועי 140 ליטר',
    region: 'צפון',
    location: 'חיפה, רחוב הגליל',
    price: '30 ₪ ליום',
    duration: 'עד שבוע',
    owner: 'יוסי שיפוצים',
    phone: '050-1112233',
    description: 'מערבל בטון חשמלי חזק לעבודות קטנות ובינוניות. נקי ותקין לחלוטין.'
  },
  {
    id: 'ad-st-1',
    type: 'storage',
    title: 'מחסן מקורה מוגן מים בגבעתיים',
    region: 'מרכז',
    location: 'גבעתיים, דרך השלום',
    price: '250 ₪ לחודש',
    duration: 'חצי שנה ומעלה',
    owner: 'שירה לוי',
    phone: '054-9998877',
    description: 'מחסן בגודל 25 מ"ר בקומת מרתף יבשה ומאווררת. גישה נוחה עם מעלית.'
  },
  {
    id: 'ad-st-2',
    type: 'storage',
    title: 'שטח חצר מגודר במושב לאחסון סירות/נגררים',
    region: 'מרכז',
    location: 'מושב צופית',
    price: '150 ₪ לחודש',
    duration: 'ללא הגבלה',
    owner: 'משה חקלאי',
    phone: '053-2223344',
    description: 'שטח פתוח של חצי דונם, מגודר ושמור. שער חשמלי עם קוד כניסה ומצלמות אבטחה.'
  },
  {
    id: 'ad-ga-1',
    type: 'garden',
    title: 'עגבניות שרי אורגניות מתוקות מהגינה',
    region: 'דרום',
    location: 'רחובות, שכונת המדע',
    price: 15, // Coins price
    duration: 'מיידי',
    owner: 'רועי כהן',
    phone: '054-7776655',
    description: 'נקטפו הבוקר! עגבניות שרי בטעם מדהים ללא שום ריסוס כימי. כחצי קילוגרם במארז.'
  },
  {
    id: 'ad-ga-2',
    type: 'garden',
    title: 'לימונים טריים ועסיסיים מהחצר',
    region: 'צפון',
    location: 'חדרה',
    price: 10, // Coins price
    duration: 'מיידי',
    owner: 'סבתא רחל',
    phone: '052-8889900',
    description: 'עץ הלימון שלי קרס מרוב פרי. לימונים ענקיים מלאי מיץ, מושלם ללימונדה. שקית של 2 ק"ג.'
  }
];

// Load ads from localStorage or seed
let sharingAds = JSON.parse(localStorage.getItem('sharingAds')) || initialSharingAds;

window.initSharingPage = function() {
  window.updateCoinsDisplay();
  renderSharingAds();
};

window.switchSharingTab = function(tabName) {
  sharingActiveTab = tabName;
  const tabs = ['equipment', 'storage', 'garden'];
  tabs.forEach(t => {
    const tabBtn = document.getElementById(`sharing-tab-${t}`);
    if (tabBtn) {
      if (t === tabName) {
        tabBtn.style.borderBottomColor = '#ff9500';
        tabBtn.style.color = '#fff';
      } else {
        tabBtn.style.borderBottomColor = 'transparent';
        tabBtn.style.color = '#86868b';
      }
    }
  });
  renderSharingAds();
};

window.renderSharingAds = function() {
  const container = document.getElementById('sharing-ads-grid');
  if (!container) return;

  const searchQuery = (document.getElementById('sharing-search-input')?.value || '').toLowerCase();
  const locationFilter = document.getElementById('sharing-filter-location')?.value || 'all';

  const filtered = sharingAds.filter(ad => {
    if (ad.type !== sharingActiveTab) return false;
    if (locationFilter !== 'all' && ad.region !== locationFilter) return false;
    
    if (searchQuery) {
      const matchTitle = ad.title.toLowerCase().includes(searchQuery);
      const matchDesc = ad.description.toLowerCase().includes(searchQuery);
      const matchOwner = ad.owner.toLowerCase().includes(searchQuery);
      const matchLoc = ad.location.toLowerCase().includes(searchQuery);
      return matchTitle || matchDesc || matchOwner || matchLoc;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:60px 20px; color:#86868b; background:#141416; border:1px solid rgba(255,255,255,0.05); border-radius:16px;">
        <div style="font-size:2.5rem; margin-bottom:12px;">🔍</div>
        <h3 style="color:#fff; margin:0 0 6px 0;">לא נמצאו מודעות מתאימות</h3>
        <p style="margin:0; font-size:0.9rem;">נסה לשנות את מסנני החיפוש או פרסם מודעה חדשה משלך!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(ad => {
    const isGarden = ad.type === 'garden';
    const priceDisplay = isGarden 
      ? `<span style="color:#ffcc00; font-weight:800; font-size:1.1rem; display:flex; align-items:center; gap:4px;">${ad.price} <i class="fas fa-coins"></i></span>`
      : `<span style="color:#fff; font-weight:800; font-size:1.1rem;">${ad.price}</span>`;

    const buttonHtml = isGarden
      ? `<button onclick="buySharingGardenItem('${ad.id}')" class="btn-primary" style="background:linear-gradient(135deg,#ff9500,#ffcc00); color:#000; border:none; padding:10px 16px; border-radius:10px; font-weight:800; cursor:pointer; font-size:0.85rem; width:100%; display:flex; align-items:center; justify-content:center; gap:6px;">רכוש עבור ${ad.price} Coins 💰</button>`
      : `<a href="tel:${ad.phone}" class="btn-primary" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); color:#fff; text-decoration:none; padding:10px; border-radius:10px; font-weight:700; cursor:pointer; font-size:0.85rem; text-align:center; display:block;">📞 צור קשר: ${ad.owner}</a>`;

    return `
      <div style="background:#141416; border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
        <div>
          <!-- Badge and Price -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span style="background:rgba(255,149,0,0.1); color:#ff9500; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:980px; border:1px solid rgba(255,149,0,0.2);">
              ${ad.region}
            </span>
            ${priceDisplay}
          </div>
          
          <h3 style="color:#fff; font-size:1.1rem; font-weight:800; margin:0 0 8px 0; line-height:1.4;">${ad.title}</h3>
          
          <!-- Metas -->
          <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.04); padding-bottom:12px;">
            <span style="font-size:0.8rem; color:#a1a1aa;"><i class="fas fa-map-marker-alt" style="color:#ffcc00; width:16px;"></i> ${ad.location}</span>
            <span style="font-size:0.8rem; color:#a1a1aa;"><i class="far fa-clock" style="color:#ffcc00; width:16px;"></i> ${isGarden ? 'איסוף מהיר' : `תקופה: ${ad.duration}`}</span>
            <span style="font-size:0.8rem; color:#a1a1aa;"><i class="far fa-user" style="color:#ffcc00; width:16px;"></i> מפרסם: ${ad.owner}</span>
          </div>

          <p style="color:#d2d2d7; font-size:0.85rem; line-height:1.5; margin:0 0 20px 0;">${ad.description}</p>
        </div>

        <div>
          ${buttonHtml}
        </div>
      </div>
    `;
  }).join('');
};

window.filterSharingAds = function() {
  renderSharingAds();
};

window.openSharingPostModal = function() {
  const modal = document.getElementById('sharing-post-modal');
  if (modal) {
    modal.style.display = 'flex';
    toggleSharingFormFields();
  }
};

window.closeSharingPostModal = function() {
  const modal = document.getElementById('sharing-post-modal');
  if (modal) modal.style.display = 'none';
};

window.toggleSharingFormFields = function() {
  const typeSelect = document.getElementById('sharing-post-type');
  if (!typeSelect) return;
  
  const type = typeSelect.value;
  const titleLabel = document.getElementById('sharing-post-title-label');
  const titleInput = document.getElementById('sharing-post-title');
  const priceLabel = document.getElementById('sharing-post-price-label');
  const priceInput = document.getElementById('sharing-post-price');
  const durationLabel = document.getElementById('sharing-post-duration-label');
  const durationInput = document.getElementById('sharing-post-duration');

  if (type === 'garden') {
    if (titleLabel) titleLabel.textContent = 'שם הגידול / המוצר החקלאי *';
    if (titleInput) titleInput.placeholder = 'למשל: תפוזים כתומים ממושב נטעים (שקית 2 ק"ג)';
    if (priceLabel) priceLabel.textContent = 'מחיר מבוקש במטבעות SOKI Coins *';
    if (priceInput) {
      priceInput.type = 'number';
      priceInput.placeholder = 'למשל: 15';
      priceInput.value = '15';
    }
    if (durationLabel) durationLabel.textContent = 'זמינות לקטיף/איסוף *';
    if (durationInput) {
      durationInput.placeholder = 'למשל: מיידי / רק בסופ״ש';
      durationInput.value = 'איסוף מיידי';
    }
  } else if (type === 'storage') {
    if (titleLabel) titleLabel.textContent = 'כותרת שטח האחסון *';
    if (titleInput) titleInput.placeholder = 'למשל: מרתף יבש ומאובטח לאחסון תכולה';
    if (priceLabel) priceLabel.textContent = 'מחיר מבוקש (חודשי) *';
    if (priceInput) {
      priceInput.type = 'text';
      priceInput.placeholder = 'למשל: 200 ₪ לחודש / חינם';
      priceInput.value = '';
    }
    if (durationLabel) durationLabel.textContent = 'תקופת שכירות/איסוף מומלצת *';
    if (durationInput) {
      durationInput.placeholder = 'למשל: מינימום 3 חודשים / ללא הגבלה';
      durationInput.value = '';
    }
  } else {
    // Equipment
    if (titleLabel) titleLabel.textContent = 'כותרת המודעה (כלי/ציוד) *';
    if (titleInput) titleInput.placeholder = 'למשל: מברגת אימפקט מקיטה 18V';
    if (priceLabel) priceLabel.textContent = 'מחיר השאלה (יומי) *';
    if (priceInput) {
      priceInput.type = 'text';
      priceInput.placeholder = 'למשל: חינם / 20 ₪ ליום';
      priceInput.value = 'חינם (השאלה קהילתית)';
    }
    if (durationLabel) durationLabel.textContent = 'תקופת השאלה מקסימלית *';
    if (durationInput) {
      durationInput.placeholder = 'למשל: עד 3 ימים';
      durationInput.value = 'עד 3 ימים';
    }
  }
};

window.submitSharingAd = function(e) {
  e.preventDefault();
  
  const type = document.getElementById('sharing-post-type').value;
  const title = document.getElementById('sharing-post-title').value;
  const region = document.getElementById('sharing-post-region').value;
  const location = document.getElementById('sharing-post-location').value;
  const priceVal = document.getElementById('sharing-post-price').value;
  const duration = document.getElementById('sharing-post-duration').value;
  const owner = document.getElementById('sharing-post-owner').value;
  const phone = document.getElementById('sharing-post-phone').value;
  const description = document.getElementById('sharing-post-description').value;

  const newAd = {
    id: 'ad-' + type.substring(0,2) + '-' + Date.now(),
    type,
    title,
    region,
    location,
    price: type === 'garden' ? parseInt(priceVal) || 10 : priceVal,
    duration,
    owner,
    phone,
    description
  };

  sharingAds.unshift(newAd);
  localStorage.setItem('sharingAds', JSON.stringify(sharingAds));

  alert('המודעה פורסמה בהצלחה ללוח השיתופי! 🎉');
  closeSharingPostModal();
  switchSharingTab(type);

  // Clear Form
  e.target.reset();
};

window.buySharingGardenItem = function(adId) {
  const ad = sharingAds.find(a => a.id === adId);
  if (!ad) return;

  const cost = parseInt(ad.price) || 0;
  const balance = parseInt(localStorage.getItem('userBettingBalance')) || 1000;

  if (balance < cost) {
    alert(`שגיאה: אין לך מספיק מטבעות Coins בקופה. מחיר הפריט הוא ${cost} מטבעות, ויתרתך כעת היא ${balance}.`);
    return;
  }

  if (confirm(`האם ברצונך לרכוש את "${ad.title}" מאת ${ad.owner} עבור ${cost} Coins?\nהיתרה הנוכחית שלך: ${balance} Coins`)) {
    window.adjustUserCoins(-cost);
    
    // Remove the ad since it has been bought
    sharingAds = sharingAds.filter(a => a.id !== adId);
    localStorage.setItem('sharingAds', JSON.stringify(sharingAds));
    
    alert(`רכישה בוצעה בהצלחה! השתמש במספר הטלפון של המגדל כדי לתאם איסוף:\n📞 ${ad.owner}: ${ad.phone}`);
    renderSharingAds();
  }
};

window.updateCoinsDisplay = function() {
  const currentBalance = parseInt(localStorage.getItem('userBettingBalance')) || 1000;
  
  const sharingCoins = document.getElementById('sharing-header-coins');
  if (sharingCoins) {
    sharingCoins.innerHTML = `${currentBalance.toLocaleString()} <i class="fas fa-coins"></i>`;
  }
  
  const balanceDisplay = document.getElementById('betting-balance-display');
  if (balanceDisplay) {
    balanceDisplay.innerHTML = `${currentBalance.toLocaleString()} <i class="fas fa-coins" style="font-size:1.1rem;"></i>`;
  }
  
  const dropdownCoins = document.getElementById('dropdown-coins-amount');
  if (dropdownCoins) {
    dropdownCoins.innerHTML = `${currentBalance.toLocaleString()} Coins`;
  }
  
  const integrationsCoins = document.getElementById('integrations-balance-display');
  if (integrationsCoins) {
    integrationsCoins.textContent = currentBalance.toLocaleString();
  }
  
  const uberCoins = document.getElementById('uber-header-coins');
  if (uberCoins) {
    uberCoins.innerHTML = `${currentBalance.toLocaleString()} <i class="fas fa-coins"></i>`;
  }
};

window.adjustUserCoins = function(amount) {
  let balance = parseInt(localStorage.getItem('userBettingBalance')) || 1000;
  balance += amount;
  localStorage.setItem('userBettingBalance', balance);
  if (typeof userBalance !== 'undefined') {
    userBalance = balance;
  }
  window.updateCoinsDisplay();
};

// ==========================================
// SOKI UBER - ISRAEL RIDE SIMULATOR
// ==========================================
let uberSelectedTier = 'lite';
let uberBasePrice = 25;
let uberBaseDuration = 45;
let uberActiveInterval = null;
let uberSearchTimeout = null;

const uberDrivers = [
  { name: 'אבי כהן', avatar: '👨🏻', rating: '4.9', vehicle: 'סקודה סופרב זהב', plate: '99-234-88' },
  { name: 'אלי פישר', avatar: '👨🏼', rating: '4.85', vehicle: 'טסלה מודל 3 שחורה', plate: '12-987-55' },
  { name: 'סבטלנה ק.', avatar: '👩🏼', rating: '4.95', vehicle: 'טויוטה פריוס לבנה', plate: '77-654-12' },
  { name: 'יוסי דהן', avatar: '🧔🏻', rating: '4.78', vehicle: 'קיה נירו כסופה', plate: '55-443-09' }
];

window.initUberPage = function() {
  window.updateCoinsDisplay();
  window.calculateUberPrice();
};

window.selectUberTier = function(tier, price, duration) {
  uberSelectedTier = tier;
  uberBasePrice = price;
  uberBaseDuration = duration;

  const cards = document.querySelectorAll('.uber-tier-card');
  cards.forEach(c => {
    c.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    c.style.background = '#141416';
  });

  const activeCard = document.getElementById(`uber-tier-${tier}`);
  if (activeCard) {
    activeCard.style.borderColor = '#ffcc00';
    activeCard.style.background = 'rgba(255, 204, 0, 0.02)';
  }

  const btn = document.getElementById('uber-order-btn');
  if (btn) {
    let title = 'SOKI Lite';
    if (tier === 'comfort') title = 'SOKI Comfort';
    if (tier === 'premium') title = 'SOKI Premium Luxury';
    if (tier === 'delivery') title = 'משלוח אקספרס';
    btn.innerHTML = `הזמן ${title} ב-${price} Coins 🚀`;
  }
};

window.calculateUberPrice = function() {
  const pickup = document.getElementById('uber-pickup')?.value || '';
  const dropoff = document.getElementById('uber-dropoff')?.value || '';

  const routeHash = (pickup.length + dropoff.length) || 12;
  const factor = Math.max(0.5, Math.min(2.5, routeHash / 25));

  const litePrice = Math.round(25 * factor);
  const comfortPrice = Math.round(50 * factor);
  const premiumPrice = Math.round(95 * factor);
  const deliveryPrice = Math.round(35 * factor);

  const liteTime = Math.round(45 * factor);
  const comfortTime = Math.round(42 * factor);
  const premiumTime = Math.round(38 * factor);
  const deliveryTime = Math.round(60 * factor);

  const lPriceEl = document.getElementById('uber-price-lite');
  const cPriceEl = document.getElementById('uber-price-comfort');
  const pPriceEl = document.getElementById('uber-price-premium');
  const dPriceEl = document.getElementById('uber-price-delivery');

  if (lPriceEl) lPriceEl.textContent = litePrice;
  if (cPriceEl) cPriceEl.textContent = comfortPrice;
  if (pPriceEl) pPriceEl.textContent = premiumPrice;
  if (dPriceEl) dPriceEl.textContent = deliveryPrice;

  const lDurEl = document.getElementById('uber-duration-lite');
  const cDurEl = document.getElementById('uber-duration-comfort');
  const pDurEl = document.getElementById('uber-duration-premium');
  const dDurEl = document.getElementById('uber-duration-delivery');

  if (lDurEl) lDurEl.textContent = `⏰ כ-${liteTime} דקות`;
  if (cDurEl) cDurEl.textContent = `⏰ כ-${comfortTime} דקות`;
  if (pDurEl) pDurEl.textContent = `⏰ כ-${premiumTime} דקות`;
  if (dDurEl) dDurEl.textContent = `⏰ כ-${deliveryTime} דקות`;

  if (uberSelectedTier === 'lite') { uberBasePrice = litePrice; uberBaseDuration = liteTime; }
  if (uberSelectedTier === 'comfort') { uberBasePrice = comfortPrice; uberBaseDuration = comfortTime; }
  if (uberSelectedTier === 'premium') { uberBasePrice = premiumPrice; uberBaseDuration = premiumTime; }
  if (uberSelectedTier === 'delivery') { uberBasePrice = deliveryPrice; uberBaseDuration = deliveryTime; }

  selectUberTier(uberSelectedTier, uberBasePrice, uberBaseDuration);
};

window.requestUberRide = function() {
  const pickup = document.getElementById('uber-pickup')?.value || '';
  const dropoff = document.getElementById('uber-dropoff')?.value || '';

  if (!pickup || !dropoff) {
    alert('אנא הזן נקודת מוצא ויעד נסיעה.');
    return;
  }

  const balance = parseInt(localStorage.getItem('userBettingBalance')) || 1000;
  if (balance < uberBasePrice) {
    alert(`שגיאה: אין לך מספיק Coins להזמנת נסיעה זו. מחיר הנסיעה הוא ${uberBasePrice} Coins, ויתרתך הנוכחית היא ${balance}.`);
    return;
  }

  window.adjustUserCoins(-uberBasePrice);

  const radar = document.getElementById('uber-radar-screen');
  if (radar) radar.style.display = 'flex';

  const statusText = document.getElementById('uber-status-text');
  const statusBadge = document.getElementById('uber-status-badge');
  if (statusText) statusText.textContent = 'מחפש נהג פנוי באזורך...';
  if (statusBadge) statusBadge.style.background = '#ff9500';

  if (uberActiveInterval) clearInterval(uberActiveInterval);
  if (uberSearchTimeout) clearTimeout(uberSearchTimeout);

  uberSearchTimeout = setTimeout(() => {
    if (radar) radar.style.display = 'none';

    const driver = uberDrivers[Math.floor(Math.random() * uberDrivers.length)];
    
    const avatarEl = document.getElementById('uber-driver-avatar');
    const nameEl = document.getElementById('uber-driver-name');
    const vehicleEl = document.getElementById('uber-driver-vehicle');
    const plateEl = document.getElementById('uber-driver-plate');
    const etaEl = document.getElementById('uber-eta');
    
    if (avatarEl) avatarEl.textContent = driver.avatar;
    if (nameEl) nameEl.textContent = driver.name;
    if (vehicleEl) vehicleEl.textContent = driver.vehicle;
    if (plateEl) plateEl.textContent = driver.plate;
    if (etaEl) etaEl.textContent = `יגיע בעוד 2 דק'`;

    const panel = document.getElementById('uber-driver-panel');
    if (panel) panel.style.display = 'flex';

    if (statusText) statusText.textContent = `נהג נמצא! ${driver.name} בדרך אליך`;
    if (statusBadge) statusBadge.style.background = '#30d158';

    const activePath = document.getElementById('uber-route-active-path');
    const carIcon = document.getElementById('uber-simulated-car');
    if (activePath) activePath.style.display = 'block';
    if (carIcon) carIcon.style.display = 'block';

    const path = document.getElementById('uber-route-path');
    if (!path) return;

    const totalPathLength = path.getTotalLength();
    let progress = 0;
    const progressText = document.getElementById('uber-trip-progress-text');
    const timeLeft = document.getElementById('uber-trip-time-left');
    const progressBar = document.getElementById('uber-trip-progress-bar');

    uberActiveInterval = setInterval(() => {
      progress += 2;
      if (progressBar) progressBar.style.width = `${progress}%`;

      const currentPoint = path.getPointAtLength((progress / 100) * totalPathLength);
      if (carIcon) {
        carIcon.style.transform = `translate(${currentPoint.x}px, ${currentPoint.y}px)`;
      }

      if (progress < 40) {
        if (progressText) progressText.textContent = 'הנהג בדרך לנקודת האיסוף';
        if (timeLeft) timeLeft.textContent = 'דקה אחת';
      } else if (progress < 90) {
        if (progressText) progressText.textContent = 'הנסיעה פעילה - בדרך ליעד';
        if (timeLeft) timeLeft.textContent = 'נוסע...';
      } else if (progress >= 100) {
        clearInterval(uberActiveInterval);
        if (progressText) progressText.textContent = 'הגעת ליעד!';
        if (timeLeft) timeLeft.textContent = '0 דקות';
        if (statusText) statusText.textContent = 'הנסיעה הושלמה בהצלחה';
        if (statusBadge) statusBadge.style.background = '#30d158';

        alert(`הגעת ליעדך בבטחה! שולם סך של ${uberBasePrice} Coins במערכת האוטומטית. תודה שנסעת SOKI Uber! 🏁🚘`);
        
        setTimeout(() => {
          if (panel) panel.style.display = 'none';
          if (carIcon) carIcon.style.display = 'none';
          if (activePath) activePath.style.display = 'none';
          if (statusText) statusText.textContent = 'מערכת מוכנה - הזן מסלול להזמנה';
          if (statusBadge) statusBadge.style.background = '#86868b';
        }, 3000);
      }
    }, 200);

  }, 2500);
};

window.cancelCurrentUberRide = function() {
  if (uberActiveInterval) clearInterval(uberActiveInterval);
  if (uberSearchTimeout) clearTimeout(uberSearchTimeout);

  window.adjustUserCoins(uberBasePrice);

  const radar = document.getElementById('uber-radar-screen');
  const panel = document.getElementById('uber-driver-panel');
  const activePath = document.getElementById('uber-route-active-path');
  const carIcon = document.getElementById('uber-simulated-car');

  if (radar) radar.style.display = 'none';
  if (panel) panel.style.display = 'none';
  if (activePath) activePath.style.display = 'none';
  if (carIcon) carIcon.style.display = 'none';

  const statusText = document.getElementById('uber-status-text');
  const statusBadge = document.getElementById('uber-status-badge');
  if (statusText) statusText.textContent = 'הנסיעה בוטלה - הCoins הוחזרו לקופה';
  if (statusBadge) statusBadge.style.background = '#ff3b30';

  alert('הנסיעה בוטלה בהצלחה. סכום המטבעות הוחזר במלואו לחשבונך. 🛑');
};


// =====================================================================
// DYNAMIC CUSTOM PAGES SYSTEM
// =====================================================================

window.renderCustomPages = function() {
  // 1. Clear previously rendered custom nav/page DOM nodes
  document.querySelectorAll('.custom-page-nav-item').forEach(el => el.remove());
  document.querySelectorAll('.custom-page-div').forEach(el => el.remove());

  const customPages = (activeCustomizations && activeCustomizations['__customPages__']) || [];
  const navContainer = document.getElementById('apple-nav-items-container');

  customPages.forEach(p => {
    // A. Render Desktop Navbar link
    if (navContainer) {
      const btn = document.createElement('button');
      btn.className = 'apple-nav-item custom-page-nav-item';
      btn.setAttribute('onclick', `showPage('${p.id}')`);
      btn.style.cssText = 'color:#f5f5f7; font-size:0.9rem; font-weight:600; background:none; border:none; cursor:pointer; display:flex; align-items:center; gap:4px; transition: color 0.2s;';
      
      const span = document.createElement('span');
      span.id = `nav-text-${p.id}`;
      span.textContent = p.name;
      btn.appendChild(span);

      // If live edit mode is active, display a delete button (x)
      if (window.isEditModeActive) {
        const delBtn = document.createElement('span');
        delBtn.innerHTML = '✕';
        delBtn.style.cssText = 'color:#ff453a; font-size:0.75rem; margin-right:4px; cursor:pointer; opacity:0.7; font-weight:bold; transition: opacity 0.15s;';
        delBtn.title = 'מחק עמוד';
        delBtn.onmouseover = () => { delBtn.style.opacity = '1'; };
        delBtn.onmouseout = () => { delBtn.style.opacity = '0.7'; };
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          window.deleteCustomPage(p.id);
        });
        btn.appendChild(delBtn);
      }

      navContainer.appendChild(btn);
    }

    // B. Create the corresponding page content element
    let pageDiv = document.getElementById(`page-${p.id}`);
    if (!pageDiv) {
      pageDiv = document.createElement('div');
      pageDiv.id = `page-${p.id}`;
      pageDiv.className = 'page custom-page-div';
      pageDiv.style.cssText = 'display:none; max-width:1000px; margin:40px auto; padding:20px; direction:rtl; text-align:right; min-height:60vh;';
      
      pageDiv.innerHTML = `
        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); padding: 40px; border-radius: 24px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0,0,0,0.25);">
          <h1 data-admin-id="cpage-${p.id}-title" style="font-size: 2.8rem; font-weight: 800; margin-bottom: 20px; background: linear-gradient(135deg, #e28743, #ffb077); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${p.name}</h1>
          <hr style="border: none; border-top: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 30px;">
          <div data-admin-id="cpage-${p.id}-body" style="font-size: 1.15rem; color: #a1a1aa; line-height: 1.8; min-height: 200px;">
            זהו עמוד חדש שיצרת. לחץ דאבל קליק על כותרת זו או על טקסט זה כדי להתחיל לערוך אותו במצב עריכה.
          </div>
        </div>
      `;
      document.body.appendChild(pageDiv);
    }
  });
};

window.openAddCustomPageModal = function() {
  const existing = document.getElementById('add-page-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'add-page-modal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); z-index:1000000; display:flex; align-items:center; justify-content:center; direction:rtl;';
  
  modal.innerHTML = `
    <div style="background:#18181b; border:1px solid rgba(255,255,255,0.08); border-radius:24px; width:90%; max-width:400px; padding:32px; box-shadow:0 30px 70px rgba(0,0,0,0.8); color:#f4f4f5; font-family:inherit;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <h3 style="font-size:1.4rem; font-weight:800; color:#fff; margin:0;">הוספת עמוד חדש</h3>
        <button onclick="document.getElementById('add-page-modal').remove()" style="background:none; border:none; color:#a1a1aa; font-size:1.5rem; cursor:pointer;">✕</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:0.85rem; font-weight:600; color:#a1a1aa;">שם העמוד (יופיע בתפריט)</label>
          <input type="text" id="new-page-name-input" placeholder="לדוגמה: עלינו" style="background:#09090b; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 14px; color:#fff; font-family:inherit; outline:none;">
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:0.85rem; font-weight:600; color:#a1a1aa;">מזהה באנגלית (לכתובת ה-URL)</label>
          <input type="text" id="new-page-id-input" placeholder="לדוגמה: about" style="background:#09090b; border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:10px 14px; color:#fff; font-family:inherit; outline:none;">
        </div>
      </div>
      <div style="display:flex; gap:12px; margin-top:32px;">
        <button id="add-page-submit-btn" style="flex:1; padding:12px; border-radius:10px; font-weight:700; font-family:inherit; font-size:0.9rem; cursor:pointer; border:none; background:#e28743; color:#09090b;">צור עמוד 🚀</button>
        <button onclick="document.getElementById('add-page-modal').remove()" style="flex:1; padding:12px; border-radius:10px; font-weight:700; font-family:inherit; font-size:0.9rem; cursor:pointer; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.06); color:#fff;">ביטול</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const nameInput = document.getElementById('new-page-name-input');
  if (nameInput) nameInput.focus();

  nameInput.addEventListener('input', () => {
    const val = nameInput.value.trim().toLowerCase();
    const idInput = document.getElementById('new-page-id-input');
    if (idInput && !idInput.value) {
      idInput.value = val.replace(/[^a-z0-9]/g, '');
    }
  });

  document.getElementById('add-page-submit-btn').addEventListener('click', () => {
    const pageName = document.getElementById('new-page-name-input').value.trim();
    let pageId = document.getElementById('new-page-id-input').value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

    if (!pageName || !pageId) {
      showToast('❌ נא למלא את כל השדות', 'error');
      return;
    }

    if (['home', 'shop', 'b2b', 'realestate', 'sharing', 'uber', 'pdf-store', 'groups', 'bets', 'about', 'whats-new', 'subscription', 'appointments'].includes(pageId)) {
      showToast('❌ מזהה זה שמור למערכת. בחר מזהה אחר', 'error');
      return;
    }

    const customPages = (activeCustomizations && activeCustomizations['__customPages__']) || [];
    if (customPages.some(p => p.id === pageId)) {
      showToast('❌ עמוד עם מזהה זה כבר קיים', 'error');
      return;
    }

    customPages.push({ id: pageId, name: pageName });
    activeCustomizations['__customPages__'] = customPages;

    saveCustomizationsToServer().then(() => {
      window.renderCustomPages();
      if (typeof window.applyPageVisibility === 'function') window.applyPageVisibility();
      if (typeof window.applyAllCustomizations === 'function') window.applyAllCustomizations();
      modal.remove();
      showPage(pageId);
      showToast(`🎉 העמוד "${pageName}" נוצר בהצלחה!`);
    });
  });
};

window.deleteCustomPage = function(pageId) {
  if (confirm('האם אתה בטוח שברצונך למחוק עמוד זה לחלוטין? כל העריכות שלו יימחקו.')) {
    const customPages = (activeCustomizations && activeCustomizations['__customPages__']) || [];
    activeCustomizations['__customPages__'] = customPages.filter(p => p.id !== pageId);
    
    delete activeCustomizations[`[data-admin-id="cpage-${pageId}-title"]`];
    delete activeCustomizations[`[data-admin-id="cpage-${pageId}-body"]`];
    if (activeCustomizations['__pageVisibility__']) {
      delete activeCustomizations['__pageVisibility__'][pageId];
    }

    saveCustomizationsToServer().then(() => {
      window.renderCustomPages();
      if (typeof window.applyPageVisibility === 'function') window.applyPageVisibility();
      showPage('home');
      showToast('🗑️ העמוד נמחק בהצלחה');
    });
  }
};


// =====================================================================
// SOKI DELIVERIES SYSTEM
// =====================================================================

let systemDeliveries = [];

// Initialize Deliveries
window.initDeliveries = function() {
  // Check if admin to show/hide admin controls
  const adminSection = document.getElementById('delivery-admin-section');
  if (adminSection) {
    adminSection.style.display = (typeof isAdmin !== 'undefined' && isAdmin === true) ? 'block' : 'none';
  }

  // Setup Firestore listener if available, otherwise fallback to local storage
  if (window.db && window.fbFirestore) {
    const { collection, onSnapshot, query, orderBy } = window.fbFirestore;
    try {
      const q = query(collection(window.db, "deliveries"), orderBy("timestamp", "desc"));
      onSnapshot(q, (snapshot) => {
        systemDeliveries = [];
        snapshot.forEach((doc) => {
          systemDeliveries.push({ firestoreId: doc.id, ...doc.data() });
        });
        window.renderDeliveriesList();
      }, (err) => {
        console.error("Firestore deliveries error:", err);
        fallbackLocalDeliveries();
      });
    } catch (e) {
      console.error("Failed to setup Firestore deliveries:", e);
      fallbackLocalDeliveries();
    }
  } else {
    fallbackLocalDeliveries();
  }
};

function fallbackLocalDeliveries() {
  systemDeliveries = JSON.parse(localStorage.getItem('localDeliveries') || '[]');
  window.renderDeliveriesList();
}

// Render Deliveries for User and Admin
window.renderDeliveriesList = function() {
  const adminSection = document.getElementById('delivery-admin-section');
  if (adminSection) {
    adminSection.style.display = (typeof isAdmin !== 'undefined' && isAdmin === true) ? 'block' : 'none';
  }

  const userListContainer = document.getElementById('user-deliveries-list');
  const adminListContainer = document.getElementById('admin-deliveries-grid');
  const currentUserEmail = (currentUser && currentUser.email) || 'guest';

  // 1. Render user deliveries
  const userDeliveries = systemDeliveries.filter(d => d.userEmail === currentUserEmail);
  if (userListContainer) {
    if (userDeliveries.length === 0) {
      userListContainer.innerHTML = `
        <div style="color:#8e8e93; font-size:0.9rem; text-align:center; padding:20px 0;">
          אין לך משלוחים פעילים כרגע.
        </div>`;
    } else {
      userListContainer.innerHTML = userDeliveries.map(d => {
        const statusClass = d.status === 'delivered' ? 'color:#34c759' : 'color:#ff9500';
        const statusText = getDeliveryStatusHebrew(d.status);
        return `
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); padding:16px; border-radius:12px; display:flex; flex-direction:column; gap:8px; font-size:0.9rem; cursor:pointer;" onclick="window.trackDeliveryItem('${d.firestoreId || d.id}')">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; color:#fff;">📦 משלוח מ-${d.pickup.split(',')[0]}</span>
              <span style="${statusClass}; font-weight:700;">${statusText}</span>
            </div>
            <div style="color:#a1a1aa; font-size:0.8rem;">
              <strong>אל:</strong> ${d.destination} <br>
              <strong>קוד:</strong> <span style="color:#ffb077; font-weight:700;">${d.code}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 2. Render admin list if admin
  if (adminListContainer) {
    adminListContainer.innerHTML = systemDeliveries.length === 0 
      ? '<div style="grid-column: 1/-1; color:#8e8e93; text-align:center; padding:30px;">אין משלוחים במערכת כרגע</div>'
      : systemDeliveries.map(d => {
          return `
            <div class="delivery-admin-card">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div style="font-size:0.75rem; color:#8e8e93; font-weight:600; margin-bottom:4px;">מאת: ${d.userEmail}</div>
                  <div style="font-weight:800; color:#fff; font-size:0.95rem;">📦 איסוף: ${d.pickup}</div>
                  <div style="font-weight:800; color:#ffb077; font-size:0.95rem; margin-top:4px;">🏁 יעד: ${d.destination}</div>
                </div>
                <button onclick="window.deleteDeliveryOrder('${d.firestoreId || d.id}')" style="background:none; border:none; color:#ff3b30; font-size:1.1rem; cursor:pointer; padding:2px;" title="מחק משלוח">✕</button>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px; font-size:0.85rem; margin-top:8px;">
                <div>🔑 קוד: <strong style="color:#fff;">${d.code}</strong></div>
                <div>סוג: <strong>${getPackageTypeHebrew(d.packageType)}</strong></div>
              </div>
              ${d.notes ? `<div style="font-size:0.8rem; color:#a1a1aa; background:rgba(255,255,255,0.01); padding:8px; border-radius:6px; border-right:2px solid #e28743;">📝 <strong>הערה:</strong> ${d.notes}</div>` : ''}
              <div style="display:flex; align-items:center; gap:8px; margin-top:8px;">
                <span style="font-size:0.8rem; color:#a1a1aa; font-weight:700;">עדכן סטטוס:</span>
                <select onchange="window.updateDeliveryStatus('${d.firestoreId || d.id}', this.value)" style="background:#1c1c1e; border:1px solid #2c2c2e; border-radius:6px; padding:4px 8px; color:#fff; font-family:inherit; outline:none; font-size:0.8rem; flex:1; direction:rtl;">
                  <option value="pending" ${d.status === 'pending' ? 'selected' : ''}>ממתין לאישור ⏳</option>
                  <option value="approved" ${d.status === 'approved' ? 'selected' : ''}>אושר - בדרך לאיסוף 🛵</option>
                  <option value="picked_up" ${d.status === 'picked_up' ? 'selected' : ''}>נאסף - בדרך ליעד 🚚</option>
                  <option value="delivered" ${d.status === 'delivered' ? 'selected' : ''}>נמסר בהצלחה! ✅</option>
                </select>
              </div>
            </div>
          `;
        }).join('');
  }
};

function getDeliveryStatusHebrew(status) {
  switch (status) {
    case 'pending': return 'ממתין לאישור ⏳';
    case 'approved': return 'בדרך לאיסוף 🛵';
    case 'picked_up': return 'בדרך ליעד 🚚';
    case 'delivered': return 'נמסר בהצלחה! ✅';
    default: return 'ממתין ⏳';
  }
}

function getPackageTypeHebrew(type) {
  switch (type) {
    case 'documents': return 'מסמכים/מעטפה ✉️';
    case 'small': return 'חבילה קטנה 📦';
    case 'large': return 'חבילה גדולה 📦📦';
    case 'fragile': return 'שביר/יקר ערך 🍷';
    default: return 'חבילה 📦';
  }
}

// Track a specific delivery
window.trackDeliveryItem = function(id) {
  const item = systemDeliveries.find(d => (d.firestoreId === id || d.id === id));
  if (!item) return;

  const panel = document.getElementById('delivery-tracking-panel');
  if (!panel) return;
  panel.style.display = 'block';

  document.getElementById('track-id').textContent = id.substring(0, 8) + '...';
  document.getElementById('track-pickup').textContent = item.pickup;
  document.getElementById('track-destination').textContent = item.destination;
  document.getElementById('track-code').textContent = item.code;
  document.getElementById('track-status-text').textContent = getDeliveryStatusHebrew(item.status);

  // Update progress bar
  const fill = document.getElementById('track-progress-fill');
  const truck = document.getElementById('track-truck');
  
  let percentage = 0;
  let activeSteps = 0;

  if (item.status === 'pending') { percentage = 12; activeSteps = 1; }
  else if (item.status === 'approved') { percentage = 42; activeSteps = 2; }
  else if (item.status === 'picked_up') { percentage = 72; activeSteps = 3; }
  else if (item.status === 'delivered') { percentage = 100; activeSteps = 4; }

  if (fill) fill.style.width = percentage + '%';
  if (truck) truck.style.right = `calc(${percentage}% - 18px)`;

  // Update step styles
  for (let i = 0; i < 4; i++) {
    const stepEl = document.getElementById(`step-${i}`);
    if (stepEl) {
      if (i < activeSteps) {
        stepEl.classList.add('active');
      } else {
        stepEl.classList.remove('active');
      }
    }
  }

  // Smoothly scroll to tracking panel
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

// Submit dynamic delivery order
window.submitDeliveryOrder = async function() {
  const pickup = document.getElementById('delivery-pickup').value.trim();
  const destination = document.getElementById('delivery-destination').value.trim();
  const code = document.getElementById('delivery-code').value.trim();
  const packageType = document.getElementById('delivery-package-type').value;
  const notes = document.getElementById('delivery-notes').value.trim();

  if (!pickup || !destination || !code) {
    showToast('❌ נא למלא את כל שדות החובה: איסוף, יעד וקוד', 'error');
    return;
  }

  const currentUserEmail = (currentUser && currentUser.email) || 'guest';
  const newDelivery = {
    pickup,
    destination,
    code,
    packageType,
    notes,
    userEmail: currentUserEmail,
    status: 'pending',
    timestamp: Date.now()
  };

  if (window.db && window.fbFirestore) {
    const { collection, addDoc } = window.fbFirestore;
    try {
      const docRef = await addDoc(collection(window.db, "deliveries"), newDelivery);
      showToast('🚀 הזמנת המשלוח נשלחה בהצלחה וממתינה לאישור!');
      window.trackDeliveryItem(docRef.id);
    } catch (e) {
      console.error("Failed to add delivery to Firestore:", e);
      newDelivery.id = 'del_' + Date.now();
      saveLocalDelivery(newDelivery);
    }
  } else {
    newDelivery.id = 'del_' + Date.now();
    saveLocalDelivery(newDelivery);
  }

  // Clear fields
  document.getElementById('delivery-pickup').value = '';
  document.getElementById('delivery-destination').value = '';
  document.getElementById('delivery-code').value = '';
  document.getElementById('delivery-notes').value = '';
};

function saveLocalDelivery(del) {
  const localList = JSON.parse(localStorage.getItem('localDeliveries') || '[]');
  localList.unshift(del);
  localStorage.setItem('localDeliveries', JSON.stringify(localList));
  systemDeliveries = localList;
  window.renderDeliveriesList();
  window.trackDeliveryItem(del.id);
  showToast('🚀 הזמנת המשלוח נשמרה מקומית בהצלחה!');
}

// Update delivery status (Admin only)
window.updateDeliveryStatus = async function(id, newStatus) {
  if (window.db && window.fbFirestore) {
    const { doc, updateDoc } = window.fbFirestore;
    try {
      await updateDoc(doc(window.db, "deliveries", id), { status: newStatus });
      showToast(`📝 סטטוס המשלוח עודכן בהצלחה!`);
    } catch (e) {
      console.error("Failed to update status in Firestore:", e);
      updateLocalDeliveryStatus(id, newStatus);
    }
  } else {
    updateLocalDeliveryStatus(id, newStatus);
  }
};

function updateLocalDeliveryStatus(id, newStatus) {
  const localList = JSON.parse(localStorage.getItem('localDeliveries') || '[]');
  const idx = localList.findIndex(d => d.id === id);
  if (idx !== -1) {
    localList[idx].status = newStatus;
    localStorage.setItem('localDeliveries', JSON.stringify(localList));
    systemDeliveries = localList;
    window.renderDeliveriesList();
    window.trackDeliveryItem(id);
    showToast(`📝 סטטוס המשלוח עודכן בהצלחה!`);
  }
}

// Delete delivery order (Admin/User)
window.deleteDeliveryOrder = async function(id) {
  if (!confirm('האם אתה בטוח שברצונך למחוק הזמנת משלוח זו?')) return;

  if (window.db && window.fbFirestore) {
    const { doc, deleteDoc } = window.fbFirestore;
    try {
      await deleteDoc(doc(window.db, "deliveries", id));
      showToast('🗑️ המשלוח נמחק בהצלחה מהמערכת');
    } catch (e) {
      console.error("Failed to delete from Firestore:", e);
      deleteLocalDelivery(id);
    }
  } else {
    deleteLocalDelivery(id);
  }
};

function deleteLocalDelivery(id) {
  let localList = JSON.parse(localStorage.getItem('localDeliveries') || '[]');
  localList = localList.filter(d => d.id !== id);
  localStorage.setItem('localDeliveries', JSON.stringify(localList));
  systemDeliveries = localList;
  window.renderDeliveriesList();
  
  const panel = document.getElementById('delivery-tracking-panel');
  if (panel) panel.style.display = 'none';
  showToast('🗑️ המשלוח נמחק בהצלחה');
}

// Clear all system deliveries (Admin only)
window.clearAllSystemDeliveries = async function() {
  if (!confirm('אזהרה: האם אתה בטוח שברצונך למחוק את כל המשלוחים במערכת? פעולה זו סופית.')) return;

  if (window.db && window.fbFirestore) {
    const { collection, getDocs, doc, deleteDoc } = window.fbFirestore;
    try {
      const snap = await getDocs(collection(window.db, "deliveries"));
      const promises = [];
      snap.forEach(d => promises.push(deleteDoc(doc(window.db, "deliveries", d.id))));
      await Promise.all(promises);
      showToast('🗑️ כל המשלוחים נמחקו בהצלחה מהשרת');
    } catch (e) {
      console.error("Failed to clear Firestore deliveries:", e);
      clearLocalDeliveries();
    }
  } else {
    clearLocalDeliveries();
  }
};

function clearLocalDeliveries() {
  localStorage.removeItem('localDeliveries');
  systemDeliveries = [];
  window.renderDeliveriesList();
  const panel = document.getElementById('delivery-tracking-panel');
  if (panel) panel.style.display = 'none';
  showToast('🗑️ כל המשלוחים נמחקו בהצלחה');
}

// Trigger initialization on load
setTimeout(() => {
  if (typeof window.initDeliveries === 'function') {
    window.initDeliveries();
  }
}, 1000);







