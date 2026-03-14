/* ===========================
   MAIN.JS — Prof. Gad Dgani
   =========================== */

// ── Path detection ───────────────
const isRoot = !window.location.pathname.replace(/\\/g, '/').includes('/pages/');
const basePath = isRoot ? '' : '../';

// ── Language ─────────────────────
const LANG_KEY = 'dgani_lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'en';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';

  // Update all bilingual elements
  document.querySelectorAll('[data-en], [data-he]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text !== null) el.textContent = text;
  });

  // Update placeholder attributes
  document.querySelectorAll('[data-en-placeholder], [data-he-placeholder]').forEach(el => {
    const ph = el.getAttribute(`data-${lang}-placeholder`);
    if (ph !== null) el.placeholder = ph;
  });

  // Update lang toggle button text
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'en' ? 'עברית' : 'English';
}

function toggleLanguage() {
  applyLanguage(currentLang === 'en' ? 'he' : 'en');
}

// ── Navigation HTML ───────────────
function buildNav() {
  const pages = [
    { href: `${basePath}index.html`,              en: 'Home',         he: 'בית' },
    { href: `${basePath}pages/about.html`,        en: 'About',        he: 'אודות' },
    { href: `${basePath}pages/research.html`,     en: 'Research',     he: 'מחקר' },
    { href: `${basePath}pages/publications.html`, en: 'Publications', he: 'פרסומים' },
    { href: `${basePath}pages/cv.html`,           en: 'CV',           he: 'קו״ח' },
    { href: `${basePath}pages/lectures.html`,     en: 'Lectures',     he: 'הרצאות' },
    { href: `${basePath}pages/gallery.html`,      en: 'Gallery',      he: 'גלריה' },
    { href: `${basePath}pages/contact.html`,      en: 'Contact',      he: 'צור קשר' },
  ];

  const navLinks = pages.map(p =>
    `<li><a href="${p.href}" data-en="${p.en}" data-he="${p.he}">${currentLang === 'he' ? p.he : p.en}</a></li>`
  ).join('\n');

  return `
<nav class="main-nav" id="mainNav">
  <div class="nav-container">
    <a href="${basePath}index.html" class="nav-logo">
      <span data-en="Prof. Gad Degani" data-he="פרופ׳ גד דגני">${currentLang === 'he' ? 'פרופ׳ גד דגני' : 'Prof. Gad Degani'}</span>
    </a>
    <ul class="nav-links" id="navLinks">
      ${navLinks}
    </ul>
    <div class="nav-actions">
      <button class="lang-toggle" id="langToggle" onclick="toggleLanguage()" aria-label="Toggle language">
        ${currentLang === 'en' ? 'עברית' : 'English'}
      </button>
      <button class="mobile-menu-toggle" id="menuToggle" aria-label="Toggle menu" onclick="toggleMobileMenu()">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>`;
}

// ── Footer HTML ───────────────────
function buildFooter() {
  return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-name" data-en="Professor Gad Degani" data-he="פרופסור גד דגני">
      ${currentLang === 'he' ? 'פרופסור גד דגני' : 'Professor Gad Degani'}
    </div>
    <p class="footer-text"
       data-en="Professor Emeritus of Biology · Tel-Hai Academic College"
       data-he="פרופסור אמריטוס לביולוגיה · המכללה האקדמית תל-חי">
       ${currentLang === 'he' ? 'פרופסור אמריטוס לביולוגיה · המכללה האקדמית תל-חי' : 'Professor Emeritus of Biology · Tel-Hai Academic College'}
    </p>
    <ul class="footer-links">
      <li><a href="${basePath}index.html" data-en="Home" data-he="בית">${currentLang === 'he' ? 'בית' : 'Home'}</a></li>
      <li><a href="${basePath}pages/about.html" data-en="About" data-he="אודות">${currentLang === 'he' ? 'אודות' : 'About'}</a></li>
      <li><a href="${basePath}pages/publications.html" data-en="Publications" data-he="פרסומים">${currentLang === 'he' ? 'פרסומים' : 'Publications'}</a></li>
      <li><a href="${basePath}pages/cv.html" data-en="CV" data-he="קורות חיים">${currentLang === 'he' ? 'קורות חיים' : 'CV'}</a></li>
      <li><a href="${basePath}pages/contact.html" data-en="Contact" data-he="צור קשר">${currentLang === 'he' ? 'צור קשר' : 'Contact'}</a></li>
    </ul>
    <p class="footer-copy">
      &copy; ${new Date().getFullYear()} Gad Dgani. All rights reserved.
    </p>
  </div>
</footer>
<button class="scroll-top" id="scrollTop" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Scroll to top">↑</button>`;
}

// ── Inject nav & footer ───────────
function injectLayout() {
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) navPlaceholder.outerHTML = buildNav();
  else {
    const nav = document.createElement('div');
    nav.innerHTML = buildNav();
    document.body.prepend(nav.firstElementChild);
  }

  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) footerPlaceholder.outerHTML = buildFooter();
  else {
    const ft = document.createElement('div');
    ft.innerHTML = buildFooter();
    document.body.appendChild(ft.firstElementChild);
  }

  markActiveLink();
}

// ── Active nav link ───────────────
function markActiveLink() {
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    const hrefPath = href.replace(/\.\.\//g, '').replace(/^\//,'');
    const cur = currentPath.split('/').pop() || 'index.html';
    const hrefFile = href.split('/').pop() || 'index.html';
    if (cur === hrefFile) a.classList.add('active');
    else a.classList.remove('active');
  });
}

// ── Mobile menu ───────────────────
function toggleMobileMenu() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}

// ── Scroll effects ────────────────
function initScrollEffects() {
  const nav = document.getElementById('mainNav');
  const scrollBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    if (scrollBtn) {
      if (window.scrollY > 400) scrollBtn.classList.add('visible');
      else scrollBtn.classList.remove('visible');
    }
  }, { passive: true });
}

// ── Publications loader ───────────
let _allPubs = [];

async function loadPublications() {
  const container = document.getElementById('pubContainer');
  if (!container) return;

  try {
    const res = await fetch(`${basePath}data/publications.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    _allPubs = data.publications || [];
    initYearDropdown(_allPubs);
    initSearch();
    renderPublications(_allPubs);
  } catch (e) {
    console.error('Publications load error:', e);
    container.innerHTML = `<div class="no-results">
      ⚠️ ${currentLang === 'he' ? 'לא ניתן לטעון את הפרסומים. ודא שהאתר רץ דרך שרת.' : 'Could not load publications. Make sure the site is served via a local server (not opened as a file://).'}
      <br><small style="color:var(--text-muted);margin-top:0.5rem;display:block">${e.message}</small>
    </div>`;
  }
}

// ── Render publication cards ───────
function renderPublications(pubs) {
  const container = document.getElementById('pubContainer');
  if (!container) return;

  const yearSel  = document.getElementById('yearSelect');
  const searchEl = document.getElementById('pubSearch');
  const countEl  = document.getElementById('pubCount');

  const yearVal  = yearSel  ? yearSel.value           : 'all';
  const query    = searchEl ? searchEl.value.trim().toLowerCase() : '';

  let filtered = pubs;

  // Year filter
  if (yearVal !== 'all') {
    filtered = filtered.filter(p => String(p.year) === yearVal);
  }

  // Text search — title + authors
  if (query) {
    filtered = filtered.filter(p =>
      (p.title   || '').toLowerCase().includes(query) ||
      (p.authors || '').toLowerCase().includes(query)
    );
  }

  // Sort newest first
  filtered = [...filtered].sort((a, b) => (b.year || 0) - (a.year || 0));

  // Update count badge
  if (countEl) {
    countEl.textContent = currentLang === 'he'
      ? `${filtered.length} מתוך ${pubs.length} פרסומים`
      : `${filtered.length} of ${pubs.length} publications`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="no-results">
      ${currentLang === 'he' ? 'לא נמצאו פרסומים תואמים.' : 'No matching publications found.'}
    </div>`;
    return;
  }

  container.innerHTML = `<div class="pub-list-cards">
    ${filtered.map(p => pubCardHTML(p)).join('')}
  </div>`;
}

// Build a single publication card
function pubCardHTML(p) {
  const hasLink = p.drive_url && p.drive_url.trim() !== '';

  const titleEl = hasLink
    ? `<a class="pub-card-title" href="${escAttr(p.drive_url)}" target="_blank" rel="noopener">${escHtml(p.title)}</a>`
    : `<span class="pub-card-title no-link">${escHtml(p.title)}</span>`;

  const authorsEl = p.authors
    ? `<div class="pub-card-authors">${escHtml(p.authors)}</div>`
    : '';

  const metaParts = [];
  if (p.journal) metaParts.push(escHtml(p.journal));
  if (p.year)    metaParts.push(`<span class="pub-year">${p.year}</span>`);
  const metaEl = metaParts.length
    ? `<div class="pub-card-meta">${metaParts.join(' · ')}</div>`
    : '';

  const readBtn = hasLink
    ? `<a class="btn-read" href="${escAttr(p.drive_url)}" target="_blank" rel="noopener">
         📄 ${currentLang === 'he' ? 'קרא מאמר' : 'Read Paper'}
       </a>`
    : '';

  return `
  <div class="pub-card">
    ${titleEl}
    ${authorsEl}
    ${metaEl}
    ${readBtn ? `<div class="pub-card-footer">${readBtn}</div>` : ''}
  </div>`;
}

// ── Escape helpers ────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
}

// ── Year dropdown ─────────────────
function initYearDropdown(pubs) {
  const sel = document.getElementById('yearSelect');
  if (!sel) return;

  const years = [...new Set(pubs.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);

  // Clear existing options except "All Years"
  while (sel.options.length > 1) sel.remove(1);

  years.forEach(y => {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    sel.appendChild(opt);
  });

  sel.addEventListener('change', () => renderPublications(_allPubs));
}

// ── Search box ────────────────────
function initSearch() {
  const input = document.getElementById('pubSearch');
  if (!input) return;
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => renderPublications(_allPubs), 200);
  });
}

function getActiveFilter(type) {
  const active = document.querySelector(`[data-${type}].active`);
  return active ? active.dataset[type] : 'all';
}

// ── CV loader ─────────────────────
async function loadCV() {
  const container = document.getElementById('cvContainer');
  if (!container) return;

  try {
    const res = await fetch(`${basePath}data/cv.json`);
    const data = await res.json();
    renderCV(data);
  } catch (e) {
    container.innerHTML = `<p class="text-muted">Could not load CV data.</p>`;
  }
}

function renderCV(data) {
  const container = document.getElementById('cvContainer');
  if (!container) return;

  const sectionIcons = {
    education: '🎓', positions: '🏛️', awards: '🏆',
    grants: '💡', service: '🌐', teaching: '📚',
    'invited-talks': '🎤', memberships: '🔬'
  };

  let html = '';
  (data.sections || []).forEach(sec => {
    const icon = sectionIcons[sec.id] || '📌';
    html += `
    <div class="cv-section">
      <div class="cv-section-heading">
        <div class="cv-section-icon">${icon}</div>
        <h3 data-en="${sec.title_en}" data-he="${sec.title_he}">
          ${currentLang === 'he' ? sec.title_he : sec.title_en}
        </h3>
      </div>
      ${(sec.entries || []).map(e => `
      <div class="cv-entry">
        <div class="cv-year">${e.years}</div>
        <div>
          <div class="cv-entry-title" data-en="${e.title_en}" data-he="${e.title_he || e.title_en}">
            ${currentLang === 'he' ? (e.title_he || e.title_en) : e.title_en}
          </div>
          ${e.institution ? `<div class="cv-entry-sub">${e.institution}</div>` : ''}
          ${e.desc_en ? `<div class="cv-entry-desc" data-en="${e.desc_en}" data-he="${e.desc_he || e.desc_en}">
            ${currentLang === 'he' ? (e.desc_he || e.desc_en) : e.desc_en}
          </div>` : ''}
        </div>
      </div>`).join('')}
    </div>`;
  });

  container.innerHTML = html;
}

// ── Lectures loader ───────────────
async function loadLectures() {
  const container = document.getElementById('lectureContainer');
  if (!container) return;

  try {
    const res = await fetch(`${basePath}data/lectures.json`);
    const data = await res.json();
    renderLectures(data.lectures);
  } catch (e) {
    container.innerHTML = `<p class="text-muted">Could not load lectures.</p>`;
  }
}

function renderLectures(lectures) {
  const container = document.getElementById('lectureContainer');
  if (!container) return;

  container.innerHTML = `<div class="pub-list">
    ${lectures.map((l, i) => `
    <div class="lecture-item">
      <div class="lecture-num">${i + 1}</div>
      <div class="lecture-body">
        <div class="lecture-title" data-en="${l.title_en}" data-he="${l.title_he}">
          ${currentLang === 'he' ? l.title_he : l.title_en}
        </div>
        <div class="lecture-meta">
          <span data-en="${l.course_en}" data-he="${l.course_he}">${currentLang === 'he' ? l.course_he : l.course_en}</span>
          ${l.year ? ` · ${l.year}` : ''}
          ${l.level ? ` · <span class="badge">${l.level}</span>` : ''}
        </div>
        <div class="lecture-desc" data-en="${l.desc_en}" data-he="${l.desc_he}">
          ${currentLang === 'he' ? l.desc_he : l.desc_en}
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

// ── Contact form ──────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('formSuccess');
    if (msg) {
      msg.style.display = 'block';
      setTimeout(() => { msg.style.display = 'none'; }, 5000);
    }
    form.reset();
  });
}

// ── Animate on scroll ─────────────
function initAOS() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .pub-item, .lecture-item, .cv-section, .research-area').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ── Init ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectLayout();
  applyLanguage(currentLang);
  initScrollEffects();
  initContactForm();

  // Page-specific loaders
  if (document.getElementById('pubContainer')) loadPublications();
  if (document.getElementById('cvContainer'))  loadCV();
  if (document.getElementById('lectureContainer')) loadLectures();

  // Slight delay so DOM is settled
  setTimeout(initAOS, 100);
});
