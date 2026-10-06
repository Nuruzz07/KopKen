/* ==========================================================================
   BINTANG STORE - THE OBSIDIAN GATE CONTROLLER (EXACT CONCEPT 6C SVG)
   ========================================================================== */

(function () {
  if (window.__bs_transition_initialized) return;
  window.__bs_transition_initialized = true;

  const isCanvaPage = window.location.pathname.toLowerCase().includes('canva') || 
                      window.location.href.toLowerCase().includes('canva');

  // 1. Inisialisasi Elemen Tirai Gerbang dengan Bentuk Asli Logo Bintang Store
  const overlay = document.createElement('div');
  overlay.id = 'bs-transition-layer';
  overlay.innerHTML = `
    <div class="gate-shutter gate-shutter-top"></div>
    <div class="gate-shutter gate-shutter-bottom"></div>
    <div class="trans-center-stage">
      <div class="trans-emblem-wrap">
        <div class="trans-aura-glow" id="gate-glow"></div>
        
        <!-- LOGO ASLI BINTANG STORE (CONCEPT 6C) -->
        <svg class="trans-logo-svg" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Garis Horizon Tipis -->
          <line class="trans-horizon-base" x1="8" y1="64" x2="120" y2="64" stroke="#44403c" stroke-width="1.5" stroke-opacity="0.6"/>
          <line class="trans-horizon-amber" x1="32" y1="64" x2="96" y2="64" stroke="#d97706" stroke-width="2.5" stroke-linecap="round"/>
          <line class="trans-horizon-violet" x1="44" y1="64" x2="84" y2="64" stroke="#a78bfa" stroke-width="2" stroke-linecap="round"/>

          <!-- Chevron Atas (Obsidian Dark Metal) -->
          <path d="M28 54L64 18L100 54" stroke="#292524" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M28 54L64 18L100 54" stroke="#57534e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- Chevron Bawah (Warm Roasted Amber / Bronze) -->
          <path d="M28 74L64 110L100 74" stroke="#9a3412" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M28 74L64 110L100 74" stroke="#ea580c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- Belah Ketupat Tengah (Deep Black Center Core) -->
          <path d="M64 36L82 64L64 92L46 64L64 36Z" fill="#0c0a09" stroke="#1c1917" stroke-width="2"/>

          <!-- Bintang Pendar 4-Sudut Emas (Amber Star) -->
          <path d="M64 46 C64 58 52 64 52 64 C52 64 64 70 64 82 C64 70 76 64 76 64 C76 64 64 58 64 46 Z" fill="#f59e0b"/>

          <!-- Inti Titik Putih Bersih di Tengah -->
          <circle cx="64" cy="64" r="2.8" fill="#ffffff"/>
        </svg>
      </div>

      <div class="gate-brand-title">BINTANG STORE</div>
      <div class="gate-sub-label" id="gate-status-text">BREWING CONCIERGE ACCESS</div>
    </div>
  `;

  function attachOverlay() {
    if (!document.getElementById('bs-transition-layer')) {
      if (document.body) {
        document.body.appendChild(overlay);
      } else if (document.documentElement) {
        document.documentElement.appendChild(overlay);
      }
    }
  }

  // If Canva page: arm immediately so shutters are closed from frame 1
  if (isCanvaPage) {
    overlay.className = 'active closing theme-canva';
    const statusLabel = overlay.querySelector('#gate-status-text');
    if (statusLabel) statusLabel.textContent = 'CANVA ACCESS GATEWAY';
    if (document.body) {
      document.body.classList.add('canva-internal-entrance', 'canva-gate-opening');
    }
  }

  attachOverlay();

  // 2. Helper Resolusi URL Halaman Lokal & Web Server
  function resolveDestination(href) {
    if (window.location.protocol === 'file:') {
      if (href === '/' || href === '/home' || href === './' || href === '') return './home.html';
      if (href.startsWith('/kopken')) return href.replace(/^\/kopken/, './kopken.html');
      if (href.startsWith('/tracking')) return href.replace(/^\/tracking/, './tracking.html');
      if (href.startsWith('/digital-legacy')) return href.replace(/^\/digital-legacy/, './digital-legacy.html');
      if (href.startsWith('/studio')) return href.replace(/^\/studio/, './studio/index.html');
      if (href.startsWith('/canva')) return href.replace(/^\/canva/, './canva.html');
    }
    return href;
  }
  window.resolveDestination = resolveDestination;

  // 3. Menutup Tirai Secara Sinematik Saat Tombol Diklik
  let isNavigating = false;

  function runCinematicTransition(targetUrl, themeClass, labelText, duration) {
    if (isNavigating && targetUrl) return; // Prevent accidental double navigation
    isNavigating = true;

    const statusLabel = document.getElementById('gate-status-text');
    if (statusLabel) statusLabel.textContent = labelText;

    overlay.className = 'active ' + (themeClass || '');
    void overlay.offsetHeight; // Force reflow agar animasi berjalan detik itu juga
    overlay.classList.add('closing');

    if (targetUrl) {
      setTimeout(() => {
        sessionStorage.setItem('bs_transition_incoming', themeClass || 'theme-coffee');
        sessionStorage.setItem('bs_transition_source', 'internal');
        sessionStorage.setItem('bs_transition_label', labelText);
        window.location.href = targetUrl;
      }, duration || 480);
    }
  }

  // 4. Membuka Tirai Halus Saat Halaman Tujuan Terbuka (Entrance Reveal)
  let canvaEntranceRunning = false;

  function playCanvaEntrance() {
    if (canvaEntranceRunning) return;
    canvaEntranceRunning = true;
    isNavigating = false;
    attachOverlay();

    // Clean up any session storage flags
    sessionStorage.removeItem('bs_transition_incoming');
    sessionStorage.removeItem('bs_transition_source');
    sessionStorage.removeItem('bs_transition_label');

    // Armed overlay with Canva Aurora theme
    overlay.className = 'active closing theme-canva';
    const statusLabel = document.getElementById('gate-status-text');
    if (statusLabel) statusLabel.textContent = 'CANVA ACCESS GATEWAY';

    if (document.body) {
      document.body.classList.remove('canva-content-reveal');
      document.body.classList.add('canva-internal-entrance', 'canva-gate-opening');
    }

    void overlay.offsetHeight; // Force reflow

    // Hold closed for 260ms of obsidian depth, then open shutters & trigger reveal
    setTimeout(() => {
      overlay.classList.remove('closing');
      if (document.body) {
        document.body.classList.add('canva-content-reveal');
      }
      setTimeout(() => {
        overlay.className = '';
        if (document.body) {
          document.body.classList.remove('canva-gate-opening');
        }
        canvaEntranceRunning = false;
      }, 500);
    }, 260);
  }

  function handlePageEntrance() {
    isNavigating = false;

    // CANVA PAGE: ALWAYS play the Obsidian Gate - Canva Aurora entrance animation
    // Regardless of source: direct URL, refresh, new tab, bookmark, external link, or menu/CTA click
    if (isCanvaPage) {
      playCanvaEntrance();
      return;
    }

    // OTHER THEMES (Coffee, Digital, Tracking - UNCHANGED):
    const incomingTheme = sessionStorage.getItem('bs_transition_incoming');
    const incomingLabel = sessionStorage.getItem('bs_transition_label');
    sessionStorage.removeItem('bs_transition_incoming');
    sessionStorage.removeItem('bs_transition_source');
    sessionStorage.removeItem('bs_transition_label');

    if (incomingTheme) {
      overlay.className = 'active closing ' + incomingTheme;
      const statusLabel = document.getElementById('gate-status-text');
      if (statusLabel && incomingLabel) statusLabel.textContent = incomingLabel;

      requestAnimationFrame(() => {
        setTimeout(() => {
          overlay.classList.remove('closing');
          setTimeout(() => {
            overlay.className = '';
          }, 450);
        }, 150);
      });
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    handlePageEntrance();
  } else {
    document.addEventListener('DOMContentLoaded', handlePageEntrance);
  }

  window.addEventListener('pageshow', function (e) {
    isNavigating = false;
    // On Canva page: always run the entrance reveal (including back/forward navigation)
    if (isCanvaPage) {
      canvaEntranceRunning = false;
      playCanvaEntrance();
      return;
    }
    // On other pages: if restored from bfcache, clear overlay and do not replay
    if (e.persisted) {
      overlay.className = '';
      return;
    }
    handlePageEntrance();
  });

  // 5. Interceptor Navigasi Menu
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    if (!link) return;

    let href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('mailto') || href.startsWith('tel') || link.target === '_blank') {
      return;
    }
    if (href.startsWith('http://') || href.startsWith('https://')) return;

    e.preventDefault();
    const destination = resolveDestination(href);

    // Context-Aware Transition (Label & Nuansa Sesuai Produk)
    if (destination.includes('kopken') || destination.includes('coffee')) {
      runCinematicTransition(destination, 'theme-coffee', 'BREWING CONCIERGE ACCESS', 500);
    } else if (destination.includes('digital-legacy')) {
      runCinematicTransition(destination, 'theme-digital', 'INITIALIZING DIGITAL VAULT', 500);
    } else if (destination.includes('tracking')) {
      runCinematicTransition(destination, 'theme-coffee', 'FETCHING ORDER DISPATCH', 500);
    } else if (destination.includes('canva')) {
      runCinematicTransition(destination, 'theme-canva', 'CANVA ACCESS GATEWAY', 500);
    } else {
      runCinematicTransition(destination, 'theme-coffee', 'PORTAL OVERVIEW', 500);
    }
  });

  // Global Trigger untuk Checkout QRIS
  window.triggerTransition = function (theme, subtitle, callback) {
    runCinematicTransition(null, 'theme-coffee', subtitle || "SECURING TRANSACTION", 0);
    setTimeout(() => {
      if (typeof callback === 'function') callback();
    }, 750);
  };
})();