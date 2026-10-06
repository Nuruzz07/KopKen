/* ==========================================================================
   BINTANG STORE - THE OBSIDIAN GATE CONTROLLER (EXACT CONCEPT 6C SVG)
   ========================================================================== */

(function () {
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
  document.body.appendChild(overlay);

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
        sessionStorage.setItem('bs_transition_label', labelText);
        window.location.href = targetUrl;
      }, duration || 480);
    }
  }

  // 4. Membuka Tirai Halus Saat Halaman Tujuan Terbuka (Entrance Reveal)
  function handlePageEntrance() {
    isNavigating = false;
    const incomingTheme = sessionStorage.getItem('bs_transition_incoming');
    const incomingLabel = sessionStorage.getItem('bs_transition_label');

    if (incomingTheme) {
      overlay.className = 'active closing ' + incomingTheme;
      const statusLabel = document.getElementById('gate-status-text');
      if (statusLabel && incomingLabel) statusLabel.textContent = incomingLabel;

      sessionStorage.removeItem('bs_transition_incoming');
      sessionStorage.removeItem('bs_transition_label');

      if (incomingTheme === 'theme-canva') {
        document.body.classList.add('canva-gate-opening');
        // Destination Reveal: keep brief obsidian hold (150ms), then open shutters and trigger content reveal
        requestAnimationFrame(() => {
          setTimeout(() => {
            overlay.classList.remove('closing');
            document.body.classList.add('canva-content-reveal');
            setTimeout(() => {
              overlay.className = '';
              document.body.classList.remove('canva-gate-opening');
            }, 500);
          }, 150);
        });
      } else {
        // Buka tirai belah atas-bawah standar (Coffee, Digital, Tracking - UNCHANGED)
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
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    handlePageEntrance();
  } else {
    document.addEventListener('DOMContentLoaded', handlePageEntrance);
  }
  window.addEventListener('pageshow', function () {
    isNavigating = false;
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