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

const SERVER_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:4242' 
  : window.location.origin;

let storedArticles = localStorage.getItem('newsArticles');
let newsArticles = storedArticles ? JSON.parse(storedArticles) : [...defaultNewsArticles];

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

// Admin Security Variables
let adminLoginAttempts = 0;
let adminIsBlocked = false;

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

  onSnapshot(q, (snapshot) => {
    const firestoreArticles = snapshot.docs.map(doc => ({ ...doc.data(), firestoreId: doc.id }));
    
    // Merge with defaults/scraped if needed, but Firestore takes precedence for user articles
    // For now, let's just combine them
    fetch('articles.json?ts=' + Date.now())
      .then(r => r.json())
      .catch(() => [])
      .then(scraped => {
        const combined = [...firestoreArticles, ...scraped];
        const uniqueMap = new Map();
        combined.forEach(a => {
          if (!uniqueMap.has(a.id)) uniqueMap.set(a.id, a);
        });
        newsArticles = Array.from(uniqueMap.values());
        localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
        renderNewsLayout();
        console.log(`[Firestore] Synced ${firestoreArticles.length} articles.`);

        // ONE-TIME MIGRATION: If local articles exist that are NOT in Firestore, upload them
        const storedLocal = JSON.parse(localStorage.getItem('newsArticles_localBackup') || '[]');
        if (storedLocal.length > 0) {
          const { addDoc, collection } = window.fbFirestore;
          storedLocal.forEach(localArt => {
            if (!firestoreArticles.some(f => f.id === localArt.id)) {
              addDoc(collection(window.db, "articles"), localArt);
              console.log(`[Migration] Uploading article ${localArt.id} to Cloud`);
            }
          });
          localStorage.removeItem('newsArticles_localBackup');
        }
      });
  });
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
function showPage(pageId) {
  // Navigation active state logic
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageId) {
      link.classList.add('active');
    }
  });

  if (pageId === 'checkout') {
    openCheckoutModal();
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

  // Scroll to top
  window.scrollTo(0, 0);

  // Close sidebar on mobile if open
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar && window.innerWidth <= 1024) {
    sidebar.classList.remove('active');
  }

  // Trigger rendering logic based on pageId
  if (pageId === 'home') renderNewsLayout();
  if (pageId === 'store') renderStoreLayout();
  if (pageId === 'pdf-store') { syncPdfItemsFromFirebase(); renderPdfStoreGrid(); }
  if (pageId === 'shop') { loadAliExpressProducts(); renderShopGrid(); }
  if (pageId === 'services') renderServicesGrid();
  if (pageId === 'subscription') window.scrollTo({ top: 0, behavior: 'smooth' });
  if (pageId === 'appointments') initBookingWidget();
  if (pageId === 'my-graphs') renderMyGraphsWatchlist();
  
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

  if (pageId === 'admin') {
    if (typeof isAdmin !== 'undefined' && !isAdmin) {
      showPage('admin-login');
      return;
    }
    if (typeof initAdminDashboard === 'function') initAdminDashboard();
  }

  updateFloatingButtons(pageId);
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

function renderNewsLayout(page = 1) {
  currentPage = page;
  const topGrid = document.getElementById('top-news-grid');
  const feedList = document.getElementById('news-feed-list');
  const paginationEl = document.getElementById('news-pagination');
  
  // Only return if at least the main feed list is missing
  if(!feedList) return;

  // Featured 3-column top grid only on first page
  if (page === 1) {
    const artRight = newsArticles.find(a => a.topPosition === 'right' && a.approved !== false);
    const artCenter = newsArticles.find(a => a.topPosition === 'center' && a.approved !== false);
    const artLeft = newsArticles.find(a => a.topPosition === 'left' && a.approved !== false);

    const renderFeaturedCard = (a, className) => {
      if (!a) return `<div class="featured-card ${className}" style="background:#f5f5f7; display:flex; align-items:center; justify-content:center; color:#86868b; font-weight:600; font-size:0.9rem;">No article in this position</div>`;
      const isSaved = myArticlesList.some(x => x.id === a.id);
      return `
        <div class="featured-card ${className} ${isSaved ? 'saved-highlight' : ''}" onclick="showArticle(${a.id})">
          <img src="${a.image}" alt="${escHtml(a.title)}">
          <div class="featured-overlay">
            <span class="featured-tag">${escHtml(a.category)}</span>
            ${a.isPremium ? `<div style="font-size:0.75rem; font-weight:800; color:#f9b233; margin-bottom:-4px; display:flex; align-items:center; gap:4px; text-transform:uppercase;"><i class="fas fa-crown"></i> PREMIUM</div>` : ''}
            <div class="featured-title">${escHtml(a.title)}</div>
          </div>
        </div>
      `;
    };

    const featuredGrid = document.getElementById('featured-top-grid');
    if (featuredGrid) {
      featuredGrid.innerHTML = `
        <div class="featured-col">${renderFeaturedCard(artRight, 'right')}</div>
        <div class="featured-col">${renderFeaturedCard(artCenter, 'center')}</div>
        <div class="featured-col">${renderFeaturedCard(artLeft, 'left')}</div>
      `;
    }
    // Hide old topGrid if it exists
    if (topGrid) topGrid.style.display = 'none';
  }

  const feedArticles = newsArticles.filter(x => !x.topPosition && x.approved !== false);
  const totalPages = Math.max(1, Math.ceil(feedArticles.length / ARTICLES_PER_PAGE));
  const start = (page - 1) * ARTICLES_PER_PAGE;
  const pageArticles = feedArticles.slice(start, start + ARTICLES_PER_PAGE);

  feedList.innerHTML = pageArticles.map(a => {
    const isSaved = myArticlesList.some(x => x.id === a.id);
    return `
      <div class="feed-item ${isSaved ? 'saved-highlight' : ''}" onclick="showArticle(${a.id})">
        <div class="feed-image" style="background-image: url('${a.image}')"></div>
        <div class="feed-content">
          <h2 class="feed-title">${escHtml(a.title)}</h2>
          <div class="feed-meta" style="display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; overflow: hidden;">
            <span class="author-name" style="white-space: nowrap;">${escHtml(a.author)}</span> 
            <span class="meta-sep">|</span> 
            <span class="meta-date" style="white-space: nowrap;">${escHtml(a.time)}</span>
            <button class="meta-bookmark-btn ${isSaved ? 'active' : ''}" 
              onclick="event.stopPropagation(); toggleMyArticle(${a.id}, ${page});"
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
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <div class="article-category">${escHtml(a.category)}</div>
        <button class="btn-save-article ${myArticlesList.includes(a.id) ? 'active' : ''}" 
          onclick="toggleMyArticle(${a.id});" 
          style="background:none; border:1px solid #d2d2d7; padding:8px 16px; border-radius:980px; font-size:0.85rem; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all 0.2s;">
          <i class="${myArticlesList.includes(a.id) ? 'fas' : 'far'} fa-bookmark" style="color:${myArticlesList.includes(a.id) ? '#f9b233' : 'inherit'};"></i>
          ${myArticlesList.includes(a.id) ? 'Saved' : 'Save for later'}
        </button>
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
        ${a.content ? a.content : `
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

async function adminLogin() {
  if (adminIsBlocked) {
    showToast('❌ Account blocked due to multiple failed attempts. Refresh the page to try again.');
    return;
  }

  const user = document.getElementById('admin-user')?.value;
  const pass = document.getElementById('admin-pass')?.value;

  showToast('🔄 Verifying admin credentials...');

  try {
    const response = await fetch(`${SERVER_URL}/api/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass })
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      adminLoginAttempts = 0;
      localStorage.setItem('isAdmin', 'true');
      isAdmin = true;
      showToast('✅ Admin logged in successfully');
      showPage('admin');
    } else {
      // If we got a 429 (Too many requests), data.message will contain the block info
      adminLoginAttempts++;
      if (response.status === 429 || adminLoginAttempts >= 3) {
        adminIsBlocked = true;
        showToast(`⚠️ Security Alert: ${data.message || 'Too many failed attempts. You are now blocked.'}`);
      } else {
        showToast(`❌ ${data.message || 'Invalid credentials'}. (${adminLoginAttempts}/3 attempts)`);
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast('❌ Error connecting to security server');
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
      userList.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 20px; color:#86868b;">No registered users</td></tr>';
    } else {
      userList.innerHTML = emails.map(email => `
        <tr>
          <td><img src="${users[email].avatar}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;"></td>
          <td><strong>${escHtml(users[email].name)}</strong></td>
          <td>${escHtml(email)}</td>
          <td>
            <button class="remove-btn" style="padding: 4px 12px; font-size: 0.85rem; border: none; background: transparent; color: #ef4444;" onclick="deleteUser('${email}')">Delete</button>
          </td>
        </tr>
      `).join('');
    }
  }


  const ordersList = document.getElementById('admin-orders-list');
  if (ordersList) {
    const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    if (orders.length === 0) {
      ordersList.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 20px; color:#86868b;">No new orders</td></tr>';
    } else {
      ordersList.innerHTML = orders.map((o, i) => `
        <tr>
          <td style="white-space: nowrap;">${escHtml(o.date)}</td>
          <td><strong>${escHtml(o.email)}</strong></td>
          <td style="font-size: 0.85rem;">${o.items.join('<br>')}</td>
          <td>$${parseFloat(o.total).toLocaleString('en-US')}</td>
          <td>
            <button class="remove-btn" style="padding: 4px 12px; font-size: 0.85rem; border: none; background: transparent; color: #ef4444;" onclick="deleteOrder(${i})">Delete</button>
          </td>
        </tr>
      `).join('');
    }
  }

  const articlesList = document.getElementById('admin-articles-list');
  if (articlesList) {
    articlesList.innerHTML = newsArticles.map(a => `
      <tr style="${a.approved === false ? 'background-color: #fff8e1;' : ''}">
        <td>${a.id}</td>
        <td><strong>${escHtml(a.title)}</strong> ${a.isTop ? '🌟' : ''} ${a.approved === false ? '<span style="color:#d97706; font-size:0.8rem; margin-right:8px; background:#fef3c7; padding:2px 6px; border-radius:4px;">Pending</span>' : ''}</td>
        <td>${escHtml(a.category)}</td>
        <td>${escHtml(a.author)}</td>
        <td style="display:flex; gap:8px;">
          <button class="btn-primary" style="padding: 4px 12px; font-size: 0.85rem; background: #0071e3;" onclick="editArticle(${a.id})">Edit</button>
          ${a.approved === false ? `<button class="btn-primary" style="padding: 4px 12px; font-size: 0.85rem;" onclick="approveArticle(${a.id})">Approve</button>` : ''}
          <button class="btn-secondary" style="padding: 4px 12px; font-size: 0.85rem; border: 1px solid #d2d2d7;" onclick="toggleFeatured(${a.id})">${a.isTop ? 'Remove Featured' : 'Make Featured'}</button>
          <button class="remove-btn" style="padding: 4px 12px; font-size: 0.85rem; border: none; background: transparent;" onclick="deleteArticle(${a.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  // FEATURED ARTICLES LIST
  const featuredList = document.getElementById('admin-featured-articles-list');
  if (featuredList) {
    const featured = newsArticles.filter(a => a.isTop);
    if (featured.length === 0) {
      featuredList.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 20px; color:#86868b;">No featured articles at the moment</td></tr>';
    } else {
      featuredList.innerHTML = featured.map(a => `
        <tr>
          <td><strong>${escHtml(a.title)}</strong></td>
          <td>${escHtml(a.category)}</td>
          <td>
            <button class="remove-btn" style="padding: 4px 12px; font-size: 0.85rem; border: none; background: transparent; color: #ef4444;" onclick="toggleFeatured(${a.id})">Remove</button>
          </td>
        </tr>
      `).join('');
    }
  }

  const sc = JSON.parse(localStorage.getItem('storeConfig')) || { title: 'My Professional Software', version: 'Version 1.0', desc: 'Access the most advanced tools with our software. A must-have tool for every professional looking to streamline work and save time.', image: '', downloadLink: '', youtube: '' };
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
        preview.innerHTML = '<span style="color:#86868b; font-size:0.85rem;">No Image</span>';
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
  showToast('AI settings saved successfully');
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

  // --- PREDEFINED ANSWERS LOGIC ---
  const predefinedAnswers = {
    '1': 'We are available 24/7 on our site! All articles and products are available anytime.',
    '2': 'You can email us at: support@project11.com or use the contact form on the site.',
    '3': 'You can easily book an appointment via the "Book Appointment" page in our navigation menu.',
    '4': 'On the "Graphs" page, you can find advanced analytics, charts, and data files for direct download.'
  };

  if (predefinedAnswers[message]) {
    setTimeout(() => {
      chatContainer.innerHTML += `
        <div style="background:#f1f1f1; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.95rem; text-align:right;">
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
  chatContainer.innerHTML += `<div id="${typingId}" style="background:#f1f1f1; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.95rem; text-align:left;">Assistant is thinking...</div>`;
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const systemPrompt = localStorage.getItem('aiSystemPrompt') || "You are a virtual assistant on the site. Answer in English politely.";
    
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
      if (typingElem) typingElem.innerHTML = `<span style="color:red;">Server error (not JSON): ${responseText.substring(0, 100)}...</span>`;
      return;
    }

    const typingElem = document.getElementById(typingId);
    if (typingElem) typingElem.remove();

    if (res.ok && data.text) {
      chatContainer.innerHTML += `
        <div style="background:#f1f1f1; padding:10px 14px; border-radius:14px; align-self:flex-start; max-width:85%; font-size:0.95rem; text-align:left;">
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
        <h3 style="font-size:1.4rem; font-weight:800; margin-bottom:12px;">Ad Space</h3>
        <p style="color:var(--text-muted); font-size:1rem; margin-bottom:24px; line-height: 1.5;">Great opportunity to reach thousands of daily readers. Contact us for a competitive quote.</p>
        <button class="btn-primary" style="margin-top:auto; width:100%; border-radius:980px;" onclick="openContactModal()">Advertise with us</button>
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



function saveAdminArticle() {
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
      showToast('Updated successfully');
    }
  } else {
    newsArticles.unshift(articleObj);
    showToast('Created successfully');
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
  const c = JSON.parse(localStorage.getItem('storeConfig')) || { title: 'My Professional Software', version: 'Version 1.0', desc: 'Access the most advanced tools with our software. A must-have tool for every professional looking to streamline work and save time.', image: '', downloadLink: '', youtube: '' };
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
              Download for Mac
            </button>
            <button class="btn-download-android" onclick="downloadStorePlatform('Android')" style="padding: 20px 48px; font-size: 1.2rem; border-radius: 20px; flex: 1; max-width: 320px; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 15px 35px rgba(52, 199, 89, 0.15);">
              <span class="platform-icon" style="font-size: 1.5rem;">🤖</span>
              Download for Android
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
    grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:80px; color:#86868b; font-size:1.1rem;">No approved graphs yet. Admin will approve soon!</div>';
    return;
  }
  grid.innerHTML = visibleItems.map((item) => {
    const icon = typeEmoji[item.type] || '📊';
    const mainImg = (item.images && item.images.length > 0) ? item.images[0] : '';
    const isUserLoggedIn = !!currentUser && !!currentUser.email;
    const isSaved = myGraphsList.some(x => x.id === item.id);
    
    return `
      <div class="pdf-card" onclick="showProductDetailById('${item.id}')">
        <div class="pdf-card-icon">
          ${mainImg ? `<img src="${mainImg}" style="width:100%; height:100%; object-fit:cover; border-radius:10px;" alt="thumb" />` : icon}
        </div>
        <div style="display:flex; flex-direction:column; gap:2px; flex-grow:1; text-align: center;">
          <div class="pdf-card-title">${escHtml(item.title)}</div>
          <div class="pdf-card-date">${item.date ? new Date(item.date).toLocaleDateString('en-US') : 'Recently uploaded'}</div>
        </div>
        <div class="pdf-card-ticker-wrapper">
          ${isUserLoggedIn ? `
            <button class="pdf-card-bookmark-btn ${isSaved ? 'active' : ''}" 
                    onclick="event.stopPropagation(); addToMyGraphs('${item.id}', this)">
              <i class="${isSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i>
            </button>
          ` : ''}
        </div>
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
      localStorage.setItem('myGraphsList', JSON.stringify(myGraphsList));
      localStorage.setItem('myArticlesList', JSON.stringify(myArticlesList));
      renderSidebarWatchlist();
      renderSidebarArticles();
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

function toggleMyGraphsDropdown(event) {
  if (event) event.preventDefault();
  const dropdown = document.getElementById('my-graphs-dropdown');
  const chevron = document.getElementById('my-graphs-chevron');
  const isHidden = dropdown.style.display === 'none';
  
  dropdown.style.display = isHidden ? 'flex' : 'none';
  if (chevron) {
    chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  }
  
  if (isHidden) {
    renderSidebarWatchlist();
  }
}

function renderSidebarWatchlist() {
  const container = document.getElementById('my-graphs-dropdown');
  if (!container) return;
  
  if (myGraphsList.length === 0) {
    container.innerHTML = `
      <div style="padding: 10px; font-size: 0.75rem; color: #86868b; text-align: center;">
        No saved graphs
      </div>
    `;
    return;
  }
  
  const graphIds = myGraphsList.map(x => x.id);
  const savedItems = pdfStoreItems.filter(item => graphIds.includes(item.id));
  
  container.innerHTML = savedItems.map(item => {
    const savedItem = myGraphsList.find(x => x.id === item.id);
    const displayName = savedItem.customName || item.title;
    const shortName = displayName.length > 15 ? displayName.substring(0, 15) + '...' : displayName;
    return `
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <a href="#" class="submenu-link" onclick="event.preventDefault(); showProductDetailById('${item.id}')" style="flex:1;">
          <i class="fas fa-chart-bar" style="font-size: 0.7rem; opacity: 0.7;"></i>
          <span ondblclick="event.stopPropagation(); inlineRename(this, 'graph', '${item.id}')" title="Double-click to rename">${shortName}</span>
        </a>
        <button onclick="removeFromMyGraphs('${item.id}')" style="background:none; border:none; color:#ff3b30; padding:10px; cursor:pointer; font-size:0.8rem;">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  }).join('');
}

// ========== MY ARTICLES LOGIC ==========
function toggleMyArticlesDropdown(event) {
  if (event) event.preventDefault();
  const dropdown = document.getElementById('my-articles-dropdown');
  const chevron = document.getElementById('my-articles-chevron');
  const isHidden = dropdown.style.display === 'none';
  
  dropdown.style.display = isHidden ? 'flex' : 'none';
  if (chevron) {
    chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
  }
  
  if (isHidden) {
    renderSidebarArticles();
  }
}

function renderSidebarArticles() {
  const container = document.getElementById('my-articles-dropdown');
  if (!container) return;

  if (myArticlesList.length === 0) {
    container.innerHTML = '<div style="padding:10px 45px; font-size:0.8rem; color:#86868b;">No saved articles</div>';
    return;
  }

  const artIds = myArticlesList.map(x => x.id);
  const items = newsArticles.filter(art => artIds.includes(art.id));
  container.innerHTML = items.map(art => {
    const savedItem = myArticlesList.find(x => x.id === art.id);
    const displayName = savedItem.customName || art.title;
    const shortName = displayName.length > 20 ? displayName.substring(0, 20) + '...' : displayName;
    return `
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <a href="#" class="submenu-link" onclick="showArticle(${art.id}); return false;" style="flex:1;">
          <span ondblclick="event.stopPropagation(); inlineRename(this, 'article', ${art.id})" title="Double-click to rename">${shortName}</span>
        </a>
        <button onclick="toggleMyArticle(${art.id})" style="background:none; border:none; color:#ff3b30; padding:10px; cursor:pointer; font-size:0.8rem;">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
  }).join('');
}

function toggleMyArticle(id, page) {
  const existing = myArticlesList.find(x => x.id === id);
  if (existing) {
    myArticlesList = myArticlesList.filter(art => art.id !== id);
    showToast('🗑️ Removed from My Articles');
  } else {
    const art = newsArticles.find(x => x.id === id);
    myArticlesList.push({ id, customName: art ? art.title : id.toString() });
    showToast('✅ Added to My Articles');
  }
  localStorage.setItem('myArticlesList', JSON.stringify(myArticlesList));
  renderSidebarArticles();
  syncUserPersonalDataToFirebase();
  if (page) renderNewsLayout(page);
  else if (!existing) {
    const a = newsArticles.find(x => x.id === id);
    if (a) showArticle(id);
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
    <a href="#" class="submenu-link" onclick="showPage('store'); return false;">
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
  if (savedTheme === 'dark') {
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
    btnLogoutNav.style.display = 'block'; // User connected -> Show logout

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
    }
  } else {
    btnJoin.style.display = 'block';
    profileBadge.style.display = 'none';
    btnLogoutNav.style.display = 'none';
    
    document.querySelectorAll('[id$="-comment-input-area"]').forEach(el => el.style.display = 'none');
    document.querySelectorAll('[id$="-comment-join-prompt"]').forEach(el => el.style.display = 'block');
    
    // Hide "My Graphs" for guests/logged-out
    const myGraphsLink = document.getElementById('link-my-graphs');
    if (myGraphsLink) myGraphsLink.style.display = 'none';

    const myArticlesLink = document.getElementById('link-my-articles');
    if (myArticlesLink) myArticlesLink.style.display = 'none';

    const myPurchasesLink = document.getElementById('link-my-purchases');
    if (myPurchasesLink) myPurchasesLink.style.display = 'none';
  }
}

function submitComment(type) {
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
    id: 'p1',
    title: 'Sports Shoes Pro 3D',
    cat: 'Fashion',
    desc: 'Advanced running shoes with shock absorption technology. Rotate to see the sole!',
    price: '$450',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
    model3d: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb' // Example model (Astronaut for illustration)
  },
  {
    id: 'p2',
    title: 'Designer Chair 360',
    cat: 'Home',
    desc: 'Ergonomic chair providing perfect back support. Luxury minimalist design.',
    price: '$890',
    img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600',
    model3d: 'https://modelviewer.dev/shared-assets/models/Chair.glb' // Real chair model
  },
  {
    id: 'p3',
    title: 'Studio Headphones 3D',
    cat: 'Electronics',
    desc: 'Immersive sound experience. Rotate to see the metallic finish.',
    price: '$1,200',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'
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

let pendingOrderItem = null;

function renderShopGrid() {
  const grid = document.getElementById('shop-grid');
  if (!grid) return;
  grid.innerHTML = shopProducts.map(p => `
    <div class="shop-card">
      <div class="shop-card-image" style="position:relative; overflow:hidden;">
        ${p.model3d ? `
          <model-viewer 
            src="${p.model3d}" 
            camera-controls 
            auto-rotate 
            shadow-intensity="1" 
            style="width:100%; height:250px; background:#f5f5f7;"
            alt="${p.title}">
          </model-viewer>
        ` : `
          <img src="${p.img}" alt="${p.title}" loading="lazy">
        `}
      </div>
      <div class="shop-card-body">
        <span class="shop-card-cat">${p.cat}</span>
        <h3 class="shop-card-title">${p.title}</h3>
        <p class="shop-card-desc">${p.desc}</p>
        <div class="shop-card-footer">
          <span class="shop-card-price">${p.price}</span>
          <button class="shop-card-btn" onclick="addToCart('${p.id}', 'product')">+ Add to Cart</button>
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
          <button class="service-card-btn" onclick="addToCart('${s.id}', 'service')">+ Add to Cart</button>
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

// Cart is always empty on page load (fresh session)
let shoppingCart = [];
localStorage.removeItem('shoppingCart');

function saveCart() {
  localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
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
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:6px;">Your cart is empty</h3>
        <p style="font-size:0.95rem;">Add products from the shop or services to continue</p>
      </div>`;
    totalEl.textContent = '$0';
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
          <button onclick="changeCartQty('${c.id}','${c.type}',-1)" aria-label="decrease">−</button>
          <span>${c.qty}</span>
          <button onclick="changeCartQty('${c.id}','${c.type}',1)" aria-label="increase">+</button>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${c.id}','${c.type}')" title="Remove from cart">×</button>
      </div>
    `;
  }).join('');
  totalEl.textContent = '$' + total.toLocaleString('en-US');
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

    const itemsEl = document.getElementById('payment-success-items');
    if (itemsEl) {
      itemsEl.innerHTML = summaryLines.join('<br>') +
        `<br><strong style="color:#1d1d1f;">Total Paid: $${parseFloat(total).toLocaleString('en-US')}</strong>`;
    }

    // Save order to history for admin
    const orderData = {
      email: (currentUser && currentUser.email) ? currentUser.email : 'Guest',
      items: summaryLines,
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
          items: summaryLines,
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
  const toggleBtn = document.getElementById('sidebar-toggle').querySelector('i');

  sidebar.classList.toggle('collapsed');
  mainWrapper.classList.toggle('sidebar-collapsed');

  const isCollapsed = sidebar.classList.contains('collapsed');
  localStorage.setItem('sidebarCollapsed', isCollapsed);

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

  // Update toggle icon
  if (isCollapsed) {
    toggleBtn.classList.remove('fa-chevron-right');
    toggleBtn.classList.add('fa-chevron-left');
  } else {
    toggleBtn.classList.remove('fa-chevron-left');
    toggleBtn.classList.add('fa-chevron-right');
  }
}

// Restore sidebar state on load
(function initSidebar() {
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (isCollapsed) {
    const sidebar = document.getElementById('app-sidebar');
    const mainWrapper = document.getElementById('main-wrapper');
    const toggleBtn = document.getElementById('sidebar-toggle').querySelector('i');
    
    if (sidebar) sidebar.classList.add('collapsed');
    if (mainWrapper) mainWrapper.classList.add('sidebar-collapsed');
    if (toggleBtn) {
      toggleBtn.classList.remove('fa-chevron-right');
      toggleBtn.classList.add('fa-chevron-left');
    }
  }
})();
