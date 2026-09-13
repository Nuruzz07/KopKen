// ==========================================
// BINTANG STORE - CORE APPLICATION LOGIC (app.js)
// ==========================================

class SoundEffectsEngine {
    constructor() { this.ctx = null; }
    init() {
        try {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
        } catch(e) {}
    }
    playTap() {
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        } catch(err) {}
    }
    playSuccess() {
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === 'suspended') this.ctx.resume();
            const now = this.ctx.currentTime;
            const osc1 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            osc1.type = 'triangle';
            osc1.frequency.setValueAtTime(523.25, now);
            gain1.gain.setValueAtTime(0.08, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc1.connect(gain1);
            gain1.connect(this.ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.15);
            
            setTimeout(() => {
                const osc2 = this.ctx.createOscillator();
                const gain2 = this.ctx.createGain();
                osc2.type = 'triangle';
                osc2.frequency.setValueAtTime(659.25, this.ctx.currentTime);
                gain2.gain.setValueAtTime(0.08, this.ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
                osc2.connect(gain2);
                gain2.connect(this.ctx.destination);
                osc2.start();
                osc2.stop(this.ctx.currentTime + 0.2);
            }, 80);
        } catch(err) {}
    }
}
const sfx = new SoundEffectsEngine();

// Kredensial Bot Telegram & WA
const botToken = "8765196047:AAGSnN7VoGnXxQK5rl5459ifGqBVE3EKsWo";
const chatId = "6731058601";
const waNumber = "6285959633342";
const formatRp = (num) => 'Rp ' + parseInt(num || 0).toLocaleString('id-ID');
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Supabase Endpoint & Client
const SUPABASE_TOMORO_URL = "https://axaoagzveujcgoxybdmp.supabase.co";
const SUPABASE_TOMORO_KEY = "sb_publishable_GQ19XRT7yWIBido0iXJvCQ_ybZ_I7ju";
let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_TOMORO_URL, SUPABASE_TOMORO_KEY);
    } catch (e) {
        console.warn("Inisialisasi Supabase client gagal:", e);
    }
}

// Admin Secret Settings
const ADMIN_PIN_CODE = "310107";
let currentAdminStoreStatus = "online";
let secretLogoTapCount = 0;
let secretLogoTapTimer = null;

// Konfigurasi Jam Agenda Terjadwal
const SCHEDULE_BUSY = [
  { day: 2, start: "07:00", end: "08:40" },
  { day: 2, start: "14:20", end: "16:00" },
  { day: 4, start: "08:40", end: "10:20" },
  { day: 4, start: "16:10", end: "17:50" }
];

function checkAdminSchedule() {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const slot of SCHEDULE_BUSY) {
    if (slot.day === currentDay) {
      const [sh, sm] = slot.start.split(":").map(Number);
      const [eh, em] = slot.end.split(":").map(Number);
      const startMinutes = sh * 60 + sm;
      const endMinutes = eh * 60 + em;

      if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        return { isBusy: true, availableAt: slot.end };
      }
    }
  }
  return { isBusy: false, availableAt: null };
}

function updateBusyStatusUI() {
  const status = checkAdminSchedule();
  const manualBusy = localStorage.getItem("adminManualBusy") === "true";
  
  const banner = document.getElementById("admin-busy-banner");
  const bannerTitle = document.getElementById("admin-busy-title");
  const bannerText = document.getElementById("admin-busy-text");

  if (banner && bannerText) {
    if (manualBusy) {
      if (bannerTitle) bannerTitle.innerText = "Admin Sedang Ada Agenda Khusus (Slow Response)";
      bannerText.innerText = "Admin sedang offline sementara. Pesanan tetap diterima dan akan diproses begitu admin online kembali. Terima kasih atas pengertiannya! 🫶";
      banner.classList.remove("hidden");
    } else if (status.isBusy) {
      if (bannerTitle) bannerTitle.innerText = "Admin Sedang Agenda Luar (Slow Response)";
      bannerText.innerText = `Pesanan tetap kami terima dan akan langsung diproses mulai pukul ${status.availableAt} WIB ya Kak. Terima kasih! 🫶`;
      banner.classList.remove("hidden");
    } else {
      banner.classList.add("hidden");
    }
  }
}

// Peta Harga Asli Resmi Aplikasi Kopi Kenangan
const officialOriginalPriceMap = {
    'kopi kenangan mantan': 19000,
    'kopi kenangan mantan (aren)': 19000,
    'americano': 17000,
    'latte': 22000,
    'cappuccino': 22000,
    'vanilla latte': 26000,
    'hazelnut latte': 26000,
    'caramel latte': 26000,
    'caramel macchiato': 28000,
    'mocha latte': 28000,
    'kopi susu black aren': 21000,
    'creamy aren latte': 22000,
    'spanish latte': 19000,
    'butterscotch aren latte': 20000,
    'dua shot iced shaken': 28000,
    'dua shot og aren': 25000,
    'matcha espresso': 26000,
    'mocha caramel': 26000,
    'pistachio aren latte': 19000,
    'cafe malt latte': 23000,
    'butterscotch sea salt latte': 25000,
    'blueberry americano': 19000,
    'kenangan milk tea': 21000,
    'og thai tea': 19000,
    'thai tea loaded': 27000,
    'dutch chocolate': 26000,
    'hazelnut dutch choco': 28000,
    'caramel dutch choco': 28000,
    'hazelnut choco milk tea': 22000,
    'choco caramel': 19000,
    'milo dinosaurus': 23000,
    'oreo shake': 26000,
    'milk oreo crumble': 26000,
    'matcha latte': 25000,
    'raspberry hibiscus': 20000,
    'lemon black tea': 17000,
    'susu grass jelly': 24000,
    'babyccino': 19000,
    'air mineral': 9000,
    'butterscotch sea salt (non coffee)': 22000,
    'oatside kopi kenangan mantan': 22000,
    'oatside latte': 25000,
    'oatside matcha latte': 25000,
    'kopi kenangan mantan frappe': 27000,
    'choco caramel frappe': 28000,
    'blueberry frappe': 23000,
    'chocoberry frappe': 27000,
    'coffeeberry frappe': 25000,
    'butterscotch kenangan frappe': 30000,
    'matcha kenangan frappe': 32000,
    'vanilla kenangan frappe': 25000,
    'dutch choco kenangan frappe': 29000,
    'seliter kenangan - americano': 75000,
    'seliter kenangan - kopi kenangan mantan': 90000,
    'seliter kenangan - latte': 90000,
    'seliter kenangan - caramel latte': 100000,
    'seliter kenangan - thai tea': 85000,
    'seliter kenangan - kopi susu black aren': 95000,
    'roti coklat klasik': 9000,
    'bambang choco cheese toast': 17000,
    'adam ayam toast': 19000,
    'wahyu sapi toast': 19000,
    'butter croissant': 15000,
    'chocolate croissant': 19000,
    'chocolate donut': 13000,
    'sugar donut': 10000,
    'choco chip cookies': 14000,
    'bananachoco soft baked cookie': 19000,
    'sweet honey soft baked cookie': 18000,
    'oatmeal raisin soft baked cookie': 19000,
    'join the dark side cookie': 21000,
    'friend chip cookie': 17000,
    'canele aren': 16000,
    'sandwich smoked beef': 22000,
    'salt bread sausage': 15000,
    'combo single ngopi & toast': 44000,
    'paket kencan berdua (2 cup large)': 60000,
    'duo mantan reguler + toast kenyang': 60000,
    'paket nongkrong bertiga (3 cup reguler)': 57000,
    'paket mabar sultan (3 cup + 1 roti/pastry)': 70000
};

function getOfficialOriginalPrice(itemName, fallbackPrice = 0) {
    if (!itemName) return fallbackPrice * 1.35;
    const cleanKey = itemName.toLowerCase().replace(/✍️\s*\[request\]\s*/i, '').trim();
    if (officialOriginalPriceMap[cleanKey]) {
        return officialOriginalPriceMap[cleanKey];
    }
    for (const key in officialOriginalPriceMap) {
        if (cleanKey.includes(key) || key.includes(cleanKey)) {
            return officialOriginalPriceMap[key];
        }
    }
    return fallbackPrice > 0 ? Math.round(fallbackPrice * 1.35) : 22000;
}

const wifiPasswords = {
    1: "TemanKenangan#01", 2: "SelaluSeru@02", 3: "WorkFromKenangan+03",
    4: "SahabatSetia=4", 5: "PaduanPas!05", 6: "AndalanMantan#06",
    7: "NyantaiNgopi@07", 8: "KenanganNyaman+08", 9: "SepenuhHati=09",
    10: "AsliAsik!10", 11: "KopiKenanganMantan#11", 12: "CafeMaltLatte@12",
    13: "SparksAmericano+13", 14: "KenanganFrappe=14", 15: "SusuGrassJelly!15",
    16: "AdamAyam#16", 17: "FriendChip@17", 18: "CoklatKlasik+18",
    19: "SaudiSpicy=19", 20: "ChiMateNikmat!20", 21: "ColorpopBubble#21",
    22: "TwinsTumbler@22", 23: "CuteCapybara+23", 24: "BaliKintamani=24",
    25: "JuwaraBeans!25", 26: "SelfRewardDulu#26", 27: "WorkLifeNgopi@27",
    28: "SetegukEspresso+28", 29: "JajanKenangan=29", 30: "SehidupSehati!30",
    31: "KopiFavoritmu#31"
};

const addOnToppings = [
    'Espresso Shot (Kenangan Blend)',
    'Espresso Shot (Juwara Blend)',
    'Golden Boba',
    'Grass Jelly',
    'Oreo Crumble',
    'Whipped Cream Chocolate',
    'Whipped Cream Vanilla',
    'Caramel Crumble',
    'Gula Aren'
];

const addOnSyrups = [
    'Vanilla Syrup',
    'Hazelnut Syrup',
    'Caramel Syrup',
    'Salted Caramel Sauce',
    'Choco Sauce',
    'Butterscotch Sauce'
];

let allOutlets = [];
let allMenu = [];
let currentOrderType = 'takeaway';
let selectedOutlet = null;
let cart = [];
let currentModalItem = null;
let modalPriceCache = 0;
let editingCartIndex = null;
let pickupMode = 'now';
let selectedOrderType = 'now';
let activeVoucherDiscount = 0;
let appliedVoucherId = null;

function handleSecretLogoTap() {
    secretLogoTapCount++;
    clearTimeout(secretLogoTapTimer);
    secretLogoTapTimer = setTimeout(() => {
        secretLogoTapCount = 0;
    }, 2000);

    if (secretLogoTapCount >= 5) {
        secretLogoTapCount = 0;
        sfx.playSuccess();
        openAdminModal();
    }
}

function openAdminModal() {
    const modal = document.getElementById('modal-admin-panel');
    const card = document.getElementById('modal-admin-card');
    const pinStep = document.getElementById('admin-step-pin');
    const ctrlStep = document.getElementById('admin-step-controls');
    const pinInput = document.getElementById('admin-pin-input');

    pinInput.value = '';
    pinStep.classList.remove('hidden');
    ctrlStep.classList.add('hidden');

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
        pinInput.focus();
    }, 10);
}

function closeAdminModal() {
    const modal = document.getElementById('modal-admin-panel');
    const card = document.getElementById('modal-admin-card');
    modal.classList.add('opacity-0');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 250);
}

function verifyAdminPin() {
    const pinInput = document.getElementById('admin-pin-input').value.trim();
    if (pinInput === ADMIN_PIN_CODE) {
        sfx.playSuccess();
        document.getElementById('admin-step-pin').classList.add('hidden');
        document.getElementById('admin-step-controls').classList.remove('hidden');
        refreshAdminControlUI();
        showToast("Akses Admin Terbuka ✅");
    } else {
        sfx.playTap();
        showToast("⚠️ PIN Admin Salah!");
        const input = document.getElementById('admin-pin-input');
        input.value = '';
        input.focus();
    }
}

function refreshAdminControlUI() {
    const display = document.getElementById('admin-current-status-display');
    if (!display) return;

    if (currentAdminStoreStatus === 'busy') {
        display.className = "mt-1 font-black text-xs text-amber-400 flex items-center justify-center gap-1.5";
        display.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span><span>SIBUK / KULIAH (Slow Response)</span>';
    } else {
        display.className = "mt-1 font-black text-xs text-emerald-400 flex items-center justify-center gap-1.5";
        display.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span><span>ONLINE (Gercep)</span>';
    }
}

async function updateStoreAdminStatus(newStatus) {
    sfx.playTap();
    const isOnlineBool = newStatus === 'online';
    const statusLabel = isOnlineBool ? 'Admin Online & Proses Cepat' : 'Admin Sedang Kuliah/Sibuk (Proses ±15-30 Mnt)';

    try {
        if (supabaseClient) {
            await supabaseClient
                .from('store_settings')
                .upsert({ id: 'main', is_online: isOnlineBool, status_label: statusLabel, updated_at: new Date() });
        }
        currentAdminStoreStatus = newStatus;
        applyAdminStatusToUI(newStatus);
        refreshAdminControlUI();
        showToast(`Status toko diubah ke: <b>${newStatus.toUpperCase()}</b>`);
    } catch (err) {
        currentAdminStoreStatus = newStatus;
        applyAdminStatusToUI(newStatus);
        refreshAdminControlUI();
        showToast(`Status tersimpan lokal: <b>${newStatus.toUpperCase()}</b>`);
    }
}

async function fetchStoreAdminStatus() {
    try {
        let isOnline = true;
        if (supabaseClient) {
            const { data } = await supabaseClient.from('store_settings').select('*').eq('id', 'main').single();
            if (data) isOnline = data.is_online !== false;
        }
        currentAdminStoreStatus = isOnline ? 'online' : 'busy';
        applyAdminStatusToUI(currentAdminStoreStatus);
    } catch (e) {
        applyAdminStatusToUI('online');
    }
}

function initSupabaseRealtimeStatus() {
    if (!supabaseClient) return;
    try {
        supabaseClient
            .channel('public:store_settings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, payload => {
                if (payload.new) {
                    const isOnline = payload.new.is_online !== false;
                    currentAdminStoreStatus = isOnline ? 'online' : 'busy';
                    applyAdminStatusToUI(currentAdminStoreStatus);
                    refreshAdminControlUI();
                }
            })
            .subscribe();
    } catch(e) {}
}

function applyAdminStatusToUI(status) {
    const badge = document.getElementById('portal-status-badge');
    const busyBanner = document.getElementById('admin-busy-banner');

    if (status === 'busy') {
        if (badge && !isMidnightHour()) {
            badge.className = "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-5 shadow-[0_0_15px_rgba(245,158,11,0.15)]";
            badge.innerHTML = `
                <span class="relative flex h-2.5 w-2.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span>🟡 Admin Sedang Kuliah/Sibuk (Proses ±15-30 Mnt)</span>
            `;
        }
        if (busyBanner) busyBanner.classList.remove('hidden');
    } else {
        if (badge && !isMidnightHour()) {
            badge.className = "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-5 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
            badge.innerHTML = `
                <span class="relative flex h-2.5 w-2.5">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Admin Online & Proses Cepat</span>
            `;
        }
        if (busyBanner) busyBanner.classList.add('hidden');
    }
}

function getWIBDate() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 7));
}

function isMidnightHour() {
    const wib = getWIBDate();
    const hour = wib.getHours();
    return hour >= 0 && hour < 6;
}

function checkNightHours() {
    const banner = document.getElementById('night-hours-banner');
    const portalBadge = document.getElementById('portal-status-badge');

    if (isMidnightHour()) {
        if (banner) banner.classList.remove('hidden');
        if (portalBadge) {
            portalBadge.innerHTML = `
                <span class="relative flex h-2.5 w-2.5">
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                </span>
                <span>🌙 Layanan Jam Malam (Order Tetap Buka)</span>
            `;
            portalBadge.className = "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-5 shadow-sm";
        }
    } else {
        if (banner) banner.classList.add('hidden');
        applyAdminStatusToUI(currentAdminStoreStatus);
    }
}

function checkOutletClosingSoon() {
    const banner = document.getElementById('outlet-closing-soon-banner');
    const textEl = document.getElementById('outlet-closing-soon-text');
    if (!banner || !selectedOutlet) return;

    if (!isOutletOpenNow(selectedOutlet) || isSignatureOutlet(selectedOutlet)) {
        banner.classList.add('hidden');
        return;
    }

    const closeTimeStr = selectedOutlet.order_close_time || selectedOutlet.real_close_time || selectedOutlet.hours?.order_close_time || "22:00";
    const closeMin = parseTimeToMinutes(closeTimeStr);
    const wib = getWIBDate();
    const curMin = wib.getHours() * 60 + wib.getMinutes();

    let diffMin = closeMin - curMin;
    if (diffMin < 0) diffMin += 1440;

    if (diffMin > 0 && diffMin <= 45) {
        if (textEl) {
            textEl.innerHTML = `Cabang <b>${selectedOutlet.name}</b> akan tutup order dalam <b>${diffMin} menit</b> lagi (pukul ${closeTimeStr.slice(0, 5)} WIB). Segera selesaikan pesanan agar tidak keburu closing kasir ya Kak!`;
        }
        banner.classList.remove('hidden');
    } else {
        banner.classList.add('hidden');
    }
}

function switchPortalTab(tab) {
    sfx.playTap();
    const btnFnb = document.getElementById('portal-tab-btn-fnb');
    const btnDig = document.getElementById('portal-tab-btn-digital');
    const tabFnb = document.getElementById('portal-tab-fnb');
    const tabDig = document.getElementById('portal-tab-digital');

    if (tab === 'fnb') {
        btnFnb.className = "py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 bg-amber-500 text-kenangan-dark shadow-md";
        btnDig.className = "py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 text-gray-400 hover:text-white";
        tabFnb.classList.remove('hidden');
        tabDig.classList.add('hidden');
    } else {
        btnDig.className = "py-2 px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 bg-sky-500 text-portal-dark shadow-md";
        btnFnb.className = "py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 text-gray-400 hover:text-white";
        tabDig.classList.remove('hidden');
        tabFnb.classList.add('hidden');
    }
}

function showComingSoonToast(brandName) {
    sfx.playTap();
    showToast(`<b>${brandName}</b><br>Layanan segera hadir dengan diskon spesial! Ditunggu ya Kak ✨`);
}

function switchView(target, pushToHistory = true) {
    sfx.playTap();
    const viewPortal = document.getElementById('view-portal');
    const viewKopken = document.getElementById('view-kopken');
    const viewTomoro = document.getElementById('view-tomoro');

    if (viewPortal) viewPortal.classList.add('hidden');
    if (viewKopken) viewKopken.classList.add('hidden');
    if (viewTomoro) viewTomoro.classList.add('hidden');

    const targetEl = document.getElementById(`view-${target}`);
    if (targetEl) targetEl.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const body = document.body;

    if (target === 'portal') {
        body.style.backgroundColor = '#0F172A';
        const pContainer = document.getElementById('particle-container');
        if (pContainer) pContainer.innerHTML = '';
    } else if (target === 'kopken') {
        body.style.backgroundColor = '#F9F1E7';
        initKopkenParticles();
    } else if (target === 'tomoro') {
        body.style.backgroundColor = '#FFF7ED';
        const pContainer = document.getElementById('particle-container');
        if (pContainer) pContainer.innerHTML = '';
    }

    if (pushToHistory) {
        history.pushState({ view: target }, '', '#' + target);
    }
}

// Buka Flow Kopi Kenangan dari Portal
function openKopkenFlow() {
    switchView('kopken');
    const savedOutlet = localStorage.getItem("bintang_selected_outlet") || localStorage.getItem("selectedOutlet");
    if (!savedOutlet) {
        setTimeout(() => {
            openWelcomeGateModal(true);
        }, 150);
    }
}

function openTomoroFlow() {
    switchView('tomoro');
    showToast("☕ Tomoro Coffee segera hadir!");
}

function initKopkenParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;
    container.innerHTML = '';
    const icons = ['fa-coffee', 'fa-leaf', 'fa-mug-hot'];
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('i');
        particle.className = `fas ${icons[Math.floor(Math.random() * icons.length)]} particle text-kenangan-primary/20`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${5 + Math.random() * 10}s, ${3 + Math.random() * 5}s`;
        particle.style.fontSize = `${10 + Math.random() * 20}px`;
        particle.style.animationDelay = `-${Math.random() * 10}s`;
        container.appendChild(particle);
    }
}

function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const clean = timeStr.toString().replace('.', ':').trim();
    const parts = clean.split(':');
    if (parts.length < 2) return 0;
    return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
}

function isSignatureOutlet(outlet) {
    if (!outlet) return false;
    const cat = (outlet.category || '').toLowerCase();
    const name = (outlet.name || '').toLowerCase();
    return cat.includes('signature') || /signature|heritage/i.test(name);
}

function isOutletOpenNow(outlet) {
    if (!outlet) return true;
    if (isSignatureOutlet(outlet)) return false;
    const statusLabel = (outlet.status_label || '').toUpperCase();
    const openStatus = (outlet.open_status || '').toUpperCase();
    if (statusLabel === 'CLOSED' || openStatus === 'CLOSED') return false;
    if (!outlet.open_time && !outlet.hours?.open_time) return false;

    const wib = getWIBDate();
    const curMin = wib.getHours() * 60 + wib.getMinutes();
    const openTimeStr = outlet.open_time || outlet.hours?.open_time || "00:01";
    const closeTimeStr = outlet.order_close_time || outlet.real_close_time || outlet.hours?.order_close_time || "23:59";
    const openMin = parseTimeToMinutes(openTimeStr);
    const closeMin = parseTimeToMinutes(closeTimeStr);
    
    if (closeMin < openMin) {
        return curMin >= openMin || curMin < closeMin;
    }
    return curMin >= openMin && curMin < closeMin;
}

function isMallOutlet(outlet) {
    if (!outlet) return false;
    const cat = (outlet.category || '').toLowerCase();
    const name = (outlet.name || '').toLowerCase();
    const pattern = /mall|plaza|tower|city|junction|avenue|walk|central park|grand indonesia|paskal|residence|hospital/i;
    return cat.includes('mall') || pattern.test(name);
}

function showNetflixClosedToast() {
    showToast("<b>Netflix Tutup Sementara</b><br>Slot akun sedang penuh / istirahat ya Kak 🙏");
}

async function loadDataFiles() {
    try {
        const outletRes = await fetch('./outlet.json');
        if (outletRes.ok) allOutlets = await outletRes.json();
    } catch (e) {}

    if (!allOutlets || allOutlets.length === 0) {
        allOutlets = [
            { id: 1, name: "Grand Indonesia", address: "Grand Indonesia Mall Lt. 3, Jakarta Pusat", category: "Mall", is_open: true, open_time: "10:00:00", order_close_time: "21:30:00", real_close_time: "22:00:00" },
            { id: 2, name: "Pondok Indah Mall 2", address: "PIM 2 South Skywalk, Jakarta Selatan", category: "Mall", is_open: true, open_time: "10:00:00", order_close_time: "21:30:00", real_close_time: "22:00:00" },
            { id: 3, name: "23Paskal Bandung", address: "23Paskal Mall Lt. 2, Kota Bandung", category: "Mall", is_open: true, open_time: "10:00:00", order_close_time: "21:30:00", real_close_time: "22:00:00" },
            { id: 4, name: "Margonda Raya Depok", address: "Jl. Margonda Raya No. 120, Beji, Depok", category: "Shop House", is_open: true, open_time: "07:00:00", order_close_time: "22:30:00", real_close_time: "23:00:00" },
            { id: 5, name: "Summarecon Mall Serpong", address: "SMS 1 Ground Floor, Tangerang", category: "Mall", is_open: true, open_time: "10:00:00", order_close_time: "21:30:00", real_close_time: "22:00:00" }
        ];
    }

    const savedOutletRaw = localStorage.getItem("bintang_selected_outlet") || localStorage.getItem("selectedOutlet");
    if (savedOutletRaw) {
        try {
            selectedOutlet = JSON.parse(savedOutletRaw);
        } catch(e) {
            selectedOutlet = allOutlets[0];
        }
    } else {
        selectedOutlet = allOutlets[0];
    }
    
    updateOutletUI();

    let parsedMenu = [];
    try {
        if (supabaseClient) {
            const { data, error } = await supabaseClient
                .from('menus')
                .select('*')
                .eq('is_active', true);

            if (!error && data && data.length > 0) {
                data.forEach(item => {
                    parsedMenu.push({
                        id: item.id,
                        name: item.name,
                        cat: item.category,
                        type: item.type,
                        singlePrice: parseFloat(item.single_price) || 15000,
                        realPrice: parseFloat(item.real_price) || 0,
                        badge: item.badge || '',
                        img: item.img || '',
                        imgs: (item.imgs && Array.isArray(item.imgs) && item.imgs.length > 0) ? item.imgs : null,
                        opts: (item.options && Array.isArray(item.options) && item.options.length > 0) ? item.options : ['Varian Default Paket']
                    });
                });
            }
        }
    } catch (e) {
        console.warn("Gagal memuat menu Supabase:", e);
    }

    if (parsedMenu.length === 0) {
        try {
            const menuRes = await fetch('./menu.json');
            if (menuRes.ok) {
                const menuData = await menuRes.json();
                if (menuData && menuData["Kopi Kenangan"]) {
                    const kk = menuData["Kopi Kenangan"];
                    const catMap = { coffee: 'coffee', nonCoffee: 'noncoffee', oatside: 'frappe', frappe: 'frappe', food: 'bakery', baru: 'new' };

                    if (kk.satuan) {
                        for (const key in kk.satuan) {
                            if (Array.isArray(kk.satuan[key])) {
                                kk.satuan[key].forEach(item => {
                                    parsedMenu.push({
                                        id: item.id || `kk_${Math.random()}`,
                                        name: item.name || item.nama,
                                        singlePrice: parseFloat(item.price) || 15000,
                                        realPrice: parseFloat(item.real_price) || 0,
                                        cat: catMap[key] || 'coffee',
                                        badge: item.badge || (item.isNew ? 'NEW' : ''),
                                        img: item.img || item.image || 'https://placehold.co/400x400/9C532B/FBF5EE?text=Kopi+Kenangan',
                                        type: (key === 'food' || item.isFood) ? 'food' : 'drink'
                                    });
                                });
                            }
                        }
                    }

                    if (kk.bundling && Array.isArray(kk.bundling)) {
                        kk.bundling.forEach(b => {
                            parsedMenu.unshift({
                                id: b.id || `bundle_${Math.random()}`,
                                cat: 'bundling',
                                name: b.name || b.nama,
                                singlePrice: parseFloat(b.price) || 35000,
                                realPrice: parseFloat(b.real_price) || 0,
                                type: 'bundling',
                                badge: b.badge || '🎁 BUNDLE',
                                img: b.img || b.image,
                                imgs: b.imgs || (b.img ? [b.img] : null),
                                opts: b.options || b.opts || ['Varian Default Paket']
                            });
                        });
                    }
                }
            }
        } catch (e) {}
    }

    if (parsedMenu.length > 0) {
        allMenu = parsedMenu;
    }
}

function updateOutletUI() {
    if (!selectedOutlet) return;
    const isSig = isSignatureOutlet(selectedOutlet);
    const isOpen = isOutletOpenNow(selectedOutlet);
    const isMall = isMallOutlet(selectedOutlet);

    const orderIcon = document.getElementById('banner-order-type-icon');
    const orderLabel = document.getElementById('banner-order-type-label');
    const outletStatus = document.getElementById('banner-outlet-status');
    const outletName = document.getElementById('banner-outlet-name');
    const mapsBtn = document.getElementById('banner-outlet-maps-btn');

    if (orderIcon && orderLabel) {
        if (currentOrderType === 'takeaway') {
            orderIcon.className = "fas fa-bag-shopping text-base";
            orderLabel.textContent = "Take Away";
        } else {
            orderIcon.className = "fas fa-mug-hot text-base";
            orderLabel.textContent = "Dine In";
        }
    }

    if (outletStatus) {
        if (isSig) {
            outletStatus.textContent = 'SIGNATURE (TUTUP)';
            outletStatus.className = 'text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase';
        } else {
            outletStatus.textContent = isOpen ? 'BUKA' : '⚠️ JADWAL TUTUP (BISA CEK)';
            outletStatus.className = `text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`;
        }
    }

    if (outletName) {
        outletName.textContent = selectedOutlet.name + (isSig ? ' (Signature)' : (isMall ? ' (Mall)' : ''));
    }

    if (mapsBtn) {
        const queryMaps = encodeURIComponent(`Kopi Kenangan ${selectedOutlet.name}`);
        mapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${queryMaps}`;
    }

    checkOutletClosingSoon();
}

function renderMenu(filterKeyword = '') {
    const container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = '';

    const categories = [
        { id: 'cat-bundling', title: '🎁 Paket Bundling Hemat', filter: 'bundling' },
        { id: 'cat-coffee', title: 'Coffee Series (Kopi)', filter: 'coffee' },
        { id: 'cat-noncoffee', title: 'Non-Coffee Series (Non-Kopi)', filter: 'noncoffee' },
        { id: 'cat-frappe', title: 'Oatside & Frappe Series', filter: 'frappe' },
        { id: 'cat-new', title: 'New Variant (Varian Baru)', filter: 'new' },
        { id: 'cat-bakery', title: 'Signature Bakes, Toast & Food', filter: 'bakery' }
    ];

    const keyword = filterKeyword.toLowerCase().trim();

    categories.forEach(c => {
        const filteredProducts = allMenu.filter(m => {
            const matchesCategory = m.cat === c.filter;
            const matchesKeyword = keyword === '' || (m.name && m.name.toLowerCase().includes(keyword));
            return matchesCategory && matchesKeyword;
        });

        if (filteredProducts.length > 0) {
            const section = document.createElement('div');
            section.id = c.id;
            section.innerHTML = `<h2 class="text-base font-extrabold text-kenangan-dark mb-3 drop-shadow-sm flex items-center gap-2">
                <span class="w-2 h-4 bg-kenangan-primary rounded-full"></span>
                ${c.title}
            </h2>`;
            
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-2 md:grid-cols-4 gap-3';

            filteredProducts.forEach(item => {
                let displayedPrice = '';
                if (item.singlePrice) {
                    displayedPrice = formatRp(item.singlePrice);
                } else if (item.prices) {
                    displayedPrice = `R: ${formatRp(item.prices.R || 0)}`;
                }

                const originalPrice = item.realPrice || (item.singlePrice ? (item.singlePrice * 1.35) : 22000);

                let imageBoxHtml = '';
                if (item.imgs && item.imgs.length > 1) {
                    imageBoxHtml = `
                        <div class="w-full aspect-square p-1.5 mb-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden shadow-inner grid grid-cols-2 gap-1 items-center">
                            <img src="${item.imgs[0]}" alt="${item.name} 1" class="w-full h-full object-contain hover:scale-105 transition" loading="lazy">
                            <img src="${item.imgs[1]}" alt="${item.name} 2" class="w-full h-full object-contain hover:scale-105 transition" loading="lazy">
                        </div>
                    `;
                } else {
                    imageBoxHtml = `
                        <div class="w-full aspect-square flex items-center justify-center p-2 mb-2 bg-white/70 rounded-xl overflow-hidden shadow-inner">
                            <img src="${item.img || (item.imgs && item.imgs[0])}" alt="${item.name}" class="w-full h-full object-contain group-hover:scale-105 transition duration-300" loading="lazy" onerror="this.src='https://placehold.co/400x400/9C532B/FBF5EE?text=Kopi+Kenangan';">
                        </div>
                    `;
                }

                grid.innerHTML += `
                    <div class="glass rounded-2xl p-2.5 flex flex-col justify-between h-full relative overflow-hidden group shadow-sm hover:shadow-md transition">
                        <div class="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg z-10 uppercase">${item.badge || 'PROMO'}</div>
                        ${imageBoxHtml}
                        <div class="flex-grow flex flex-col justify-between">
                            <div>
                                <h3 class="font-extrabold text-kenangan-dark text-xs leading-snug line-clamp-2">${item.name}</h3>
                                <p class="text-[10px] text-gray-400 line-through mt-0.5">${formatRp(originalPrice)}</p>
                            </div>
                            <div class="flex justify-between items-center mt-2 pt-1.5 border-t border-gray-100">
                                <p class="font-black text-kenangan-primary text-xs">${displayedPrice}</p>
                                <button onclick="openModal('${item.id}')" class="w-7 h-7 rounded-xl bg-kenangan-dark text-white flex items-center justify-center shadow-sm hover:bg-kenangan-primary active:scale-90 transition cursor-pointer">
                                    <i class="fas fa-plus text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            section.appendChild(grid);
            container.appendChild(section);
        }
    });

    if (container.innerHTML === '') {
        container.innerHTML = `
            <div class="text-center py-10 px-4 bg-white/60 rounded-3xl border border-white shadow-sm">
                <i class="fas fa-mug-hot text-gray-400 text-3xl mb-2"></i>
                <p class="text-xs text-gray-600 font-bold">Menu "${filterKeyword}" tidak ditemukan di katalog.</p>
                <p class="text-[10px] text-gray-400 mt-1 mb-4">Tapi tenang, kamu tetap bisa memesannya lewat form kustom!</p>
                <button onclick="openCustomRequestModal('${filterKeyword}')" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-kenangan-primary hover:bg-kenangan-hover text-white text-xs font-extrabold shadow-md transition active:scale-95 cursor-pointer">
                    <i class="fas fa-pen text-[10px]"></i> Request Menu "${filterKeyword}" Sekarang
                </button>
            </div>
        `;
    }
}

function searchMenu() {
    const query = document.getElementById('menu-search-input').value;
    renderMenu(query);
}

function scrollToCategory(id, event) {
    if (event) event.preventDefault();
    sfx.playTap();
    const element = document.getElementById(id);
    if (element) {
        const yOffset = -180;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}

// Welcome Gate Modal
function openWelcomeGateModal(forceOpen = true) {
    const modal = document.getElementById('modal-welcome-gate');
    const card = document.getElementById('welcome-gate-card');
    if (!modal || !card) return;

    if (typeof setGateOrderType === 'function') setGateOrderType(currentOrderType);
    if (typeof updateGatePreview === 'function') updateGatePreview();

    modal.classList.remove('hidden', 'opacity-0');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
    card.style.transform = 'scale(1)';
}

function closeWelcomeGateModal() {
    const modal = document.getElementById('modal-welcome-gate');
    const card = document.getElementById('welcome-gate-card');
    if (!modal || !card) return;
    
    modal.classList.add('hidden', 'opacity-0');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
}

function setGateOrderType(type) {
    currentOrderType = type;
    localStorage.setItem("bintang_order_type", type);
    localStorage.setItem("orderType", type);

    const btnTakeaway = document.getElementById('gate-type-takeaway');
    const btnDinein = document.getElementById('gate-type-dinein');

    if (type === 'takeaway') {
        if (btnTakeaway) btnTakeaway.className = "py-2.5 px-3 rounded-2xl border-2 border-kenangan-primary bg-amber-50 text-kenangan-primary font-bold text-xs flex flex-col items-center gap-1 transition shadow-sm cursor-pointer";
        if (btnDinein) btnDinein.className = "py-2.5 px-3 rounded-2xl border-2 border-stone-200 bg-white text-stone-600 font-bold text-xs flex flex-col items-center gap-1 transition cursor-pointer";
    } else {
        if (btnDinein) btnDinein.className = "py-2.5 px-3 rounded-2xl border-2 border-kenangan-primary bg-amber-50 text-kenangan-primary font-bold text-xs flex flex-col items-center gap-1 transition shadow-sm cursor-pointer";
        if (btnTakeaway) btnTakeaway.className = "py-2.5 px-3 rounded-2xl border-2 border-stone-200 bg-white text-stone-600 font-bold text-xs flex flex-col items-center gap-1 transition cursor-pointer";
    }
}

function handleGateOutletSearch() {
    const query = document.getElementById('gate-outlet-search').value.trim().toLowerCase();
    const dropdown = document.getElementById('gate-outlet-dropdown');
    const clearBtn = document.getElementById('gate-clear-search-btn');

    if (!query) {
        if (dropdown) dropdown.classList.add('hidden');
        if (clearBtn) clearBtn.classList.add('hidden');
        return;
    }

    if (clearBtn) clearBtn.classList.remove('hidden');
    const filtered = allOutlets.filter(o => 
        (o.name && o.name.toLowerCase().includes(query)) ||
        (o.address && o.address.toLowerCase().includes(query))
    ).slice(0, 15);

    if (!dropdown) return;
    dropdown.innerHTML = '';
    if (filtered.length === 0) {
        dropdown.innerHTML = '<div class="p-3 text-xs text-gray-400 text-center">Outlet tidak ditemukan</div>';
    } else {
        filtered.forEach(o => {
            const isSig = isSignatureOutlet(o);
            const isOpen = isOutletOpenNow(o);
            const isMall = isMallOutlet(o);

            let statusBadgeHTML = '';
            if (isSig) {
                statusBadgeHTML = `<span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 flex-shrink-0">SIGNATURE (TUTUP)</span>`;
            } else if (isOpen) {
                statusBadgeHTML = `<span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex-shrink-0">BUKA</span>`;
            } else {
                statusBadgeHTML = `<span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex-shrink-0">JADWAL TUTUP</span>`;
            }

            dropdown.innerHTML += `
                <div onclick="selectOutletItem(${o.id})" class="p-3 hover:bg-amber-50/80 cursor-pointer border-b border-gray-100 last:border-none flex items-center justify-between gap-2 transition ${!isOpen ? 'opacity-70 bg-gray-50' : ''}">
                    <div class="min-w-0">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <h5 class="text-xs font-bold text-kenangan-dark truncate">${o.name}</h5>
                            ${isSig ? '<span class="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 rounded">SIGNATURE</span>' : (isMall ? '<span class="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 rounded">MALL</span>' : '')}
                        </div>
                        <p class="text-[10px] text-gray-500 line-clamp-1 mt-0.5">${isSig ? '⚠️ Menu & harga signature berbeda (Promo tidak berlaku)' : (o.address || '-')}</p>
                    </div>
                    ${statusBadgeHTML}
                </div>
            `;
        });
    }
    dropdown.classList.remove('hidden');
}

function clearGateSearch() {
    const input = document.getElementById('gate-outlet-search');
    const dropdown = document.getElementById('gate-outlet-dropdown');
    const clearBtn = document.getElementById('gate-clear-search-btn');
    if (input) input.value = '';
    if (dropdown) dropdown.classList.add('hidden');
    if (clearBtn) clearBtn.classList.add('hidden');
}

function selectOutletItem(outletId) {
    const outlet = allOutlets.find(o => o.id === outletId);
    if (!outlet) return;

    selectedOutlet = outlet;
    localStorage.setItem("bintang_selected_outlet", JSON.stringify(outlet));
    localStorage.setItem("selectedOutlet", JSON.stringify(outlet));

    clearGateSearch();
    updateGatePreview();
    updateOutletUI();
}

function updateGatePreview() {
    if (!selectedOutlet) return;
    const isSig = isSignatureOutlet(selectedOutlet);
    const isOpen = isOutletOpenNow(selectedOutlet);
    const isMall = isMallOutlet(selectedOutlet);

    const nameEl = document.getElementById('gate-preview-name');
    const addrEl = document.getElementById('gate-preview-address');
    const statusBadge = document.getElementById('gate-preview-status');

    if (nameEl) nameEl.textContent = selectedOutlet.name + (isSig ? ' (Signature)' : (isMall ? ' (Mall)' : ''));
    if (addrEl) addrEl.textContent = isSig ? '⚠️ Outlet Signature/Heritage memiliki menu dan harga khusus. Promo reguler tidak berlaku.' : (selectedOutlet.address || 'Alamat outlet');
    
    if (statusBadge) {
        if (isSig) {
            statusBadge.textContent = 'SIGNATURE (TUTUP)';
            statusBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0 bg-purple-100 text-purple-800';
        } else {
            statusBadge.textContent = isOpen ? 'BUKA' : 'JADWAL TUTUP (BISA CEK)';
            statusBadge.className = `text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`;
        }
    }
}

function confirmWelcomeGate() {
    if (!selectedOutlet) {
        showToast("Harap pilih salah satu outlet terlebih dahulu!");
        return;
    }

    sfx.playTap();
    localStorage.setItem("bintang_selected_outlet", JSON.stringify(selectedOutlet));
    localStorage.setItem("selectedOutlet", JSON.stringify(selectedOutlet));

    closeWelcomeGateModal();
    updateOutletUI();
    showToast(`Lokasi: <b>${selectedOutlet.name}</b> (${currentOrderType === 'takeaway' ? 'Take Away' : 'Dine In'})`);
}

function toggleIceOptions() {
    const temp = document.querySelector('input[name="mod-temp"]:checked')?.value;
    const iceContainer = document.getElementById('ice-level-container');
    if (iceContainer) {
        if (temp === 'Hot') {
            iceContainer.classList.add('opacity-30', 'pointer-events-none');
        } else {
            iceContainer.classList.remove('opacity-30', 'pointer-events-none');
        }
    }
}

function updateModalPrice() {
    if (!currentModalItem) return;
    let basePrice = 0;
    const sizePick = document.querySelector('input[name="mod-size-pick"]:checked')?.value || 'Regular';

    if (currentModalItem.prices) {
        const sizeKey = (sizePick === 'Large' || sizePick === 'L') ? 'L' : 'R';
        basePrice = currentModalItem.prices[sizeKey] || currentModalItem.prices.R || currentModalItem.singlePrice || 15000;
    } else {
        const itemBase = currentModalItem.singlePrice || 15000;
        basePrice = (sizePick === 'Large' && currentModalItem.type === 'drink') ? (itemBase + 7500) : itemBase;
    }

    let addOnTotal = 0;
    document.querySelectorAll('.mod-addons-chk:checked').forEach(() => {
        addOnTotal += 7000;
    });

    modalPriceCache = basePrice + addOnTotal;
    const priceEl = document.getElementById('modal-price');
    const btnPriceEl = document.getElementById('modal-btn-price');
    if (priceEl) priceEl.textContent = formatRp(modalPriceCache);
    if (btnPriceEl) btnPriceEl.textContent = formatRp(modalPriceCache);
}

function openModal(itemId, editIndex = null) {
    const item = allMenu.find(m => String(m.id) === String(itemId));
    if (!item) return;

    currentModalItem = item;
    editingCartIndex = editIndex;
    const titleEl = document.getElementById('modal-title');
    const labelEl = document.getElementById('modal-btn-label');
    if (titleEl) titleEl.textContent = item.name;
    if (labelEl) labelEl.textContent = editIndex !== null ? 'Perbarui Pesanan' : 'Simpan ke Keranjang';

    const optionsContainer = document.getElementById('modal-options-container');
    if (!optionsContainer) return;
    optionsContainer.innerHTML = '';

    if (item.type === 'bundling') {
        let html = `<label class="block text-xs font-bold mb-1.5">Pilih Kombinasi Varian <span class="text-red-500">*</span></label>
                    <select id="mod-bundle-sel" class="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:ring-kenangan-primary text-xs outline-none font-medium">`;
        (item.opts || ['Paket Default']).forEach(opt => {
            html += `<option value="${opt}">${opt}</option>`;
        });
        html += `</select>`;
        optionsContainer.innerHTML = html;
    } else if (item.type === 'drink') {
        optionsContainer.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                    <div class="flex items-center gap-1.5">
                        <span class="text-xs">✨</span>
                        <div>
                            <span class="text-xs font-bold text-amber-900 block leading-tight">Racikan Pas (Favorit)</span>
                            <span class="text-[10px] text-amber-700">Ice Normal, Less Sugar 70% (Manis pas)</span>
                        </div>
                    </div>
                    <button type="button" onclick="applyRacikanPas()" class="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] shadow-sm transition active:scale-95">
                        Terapkan
                    </button>
                </div>

                <div>
                    <label class="block text-xs font-bold mb-1.5">Penyajian <span class="text-red-500">*</span></label>
                    <div class="grid grid-cols-2 gap-2">
                        <label class="relative cursor-pointer">
                            <input type="radio" name="mod-temp" id="mod-temp-ice" value="Ice" class="peer sr-only" checked onchange="toggleIceOptions()">
                            <div class="rounded-xl border-2 border-gray-200 bg-white py-2 px-3 text-center transition-all hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 font-bold text-xs">
                                <i class="fas fa-snowflake text-blue-400 mr-1"></i> Iced
                            </div>
                        </label>
                        <label class="relative cursor-pointer">
                            <input type="radio" name="mod-temp" id="mod-temp-hot" value="Hot" class="peer sr-only" onchange="toggleIceOptions()">
                            <div class="rounded-xl border-2 border-gray-200 bg-white py-2 px-3 text-center transition-all hover:bg-orange-50 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700 font-bold text-xs">
                                <i class="fas fa-mug-hot text-orange-400 mr-1"></i> Hot
                            </div>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold mb-1.5">Ukuran Cup <span class="text-red-500">*</span></label>
                    <div class="grid grid-cols-2 gap-2">
                        <label class="relative cursor-pointer">
                            <input type="radio" name="mod-size-pick" id="mod-size-reg" value="Regular" class="peer sr-only" checked onchange="updateModalPrice()">
                            <div class="rounded-xl border-2 border-gray-200 bg-white py-2 px-3 text-center transition-all hover:bg-amber-50 peer-checked:border-kenangan-primary peer-checked:bg-amber-50 peer-checked:text-kenangan-primary font-bold text-xs">
                                Regular
                            </div>
                        </label>
                        <label class="relative cursor-pointer">
                            <input type="radio" name="mod-size-pick" id="mod-size-lrg" value="Large" class="peer sr-only" onchange="updateModalPrice()">
                            <div class="rounded-xl border-2 border-gray-200 bg-white py-2 px-3 text-center transition-all hover:bg-amber-50 peer-checked:border-kenangan-primary peer-checked:bg-amber-50 peer-checked:text-kenangan-primary font-bold text-xs">
                                Large (+Rp 7.500)
                            </div>
                        </label>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div>
                        <label class="block text-[10px] font-bold mb-1 text-gray-500 uppercase">Level Gula</label>
                        <div class="grid grid-cols-3 gap-1.5">
                            <label class="cursor-pointer">
                                <input type="radio" name="mod-sugar" id="mod-sugar-norm" value="Normal Sugar" class="peer sr-only" checked>
                                <div class="rounded-lg border border-gray-200 bg-white py-1 text-center text-[11px] transition-all peer-checked:bg-kenangan-primary peer-checked:text-white font-bold">Normal</div>
                            </label>
                            <label class="cursor-pointer">
                                <input type="radio" name="mod-sugar" id="mod-sugar-less" value="Less Sugar" class="peer sr-only">
                                <div class="rounded-lg border border-gray-200 bg-white py-1 text-center text-[11px] transition-all peer-checked:bg-kenangan-primary peer-checked:text-white font-bold">Less (70%)</div>
                            </label>
                            <label class="cursor-pointer">
                                <input type="radio" name="mod-sugar" id="mod-sugar-zero" value="No Sugar" class="peer sr-only">
                                <div class="rounded-lg border border-gray-200 bg-white py-1 text-center text-[11px] transition-all peer-checked:bg-kenangan-primary peer-checked:text-white font-bold">No Sugar</div>
                            </label>
                        </div>
                    </div>
                    
                    <div id="ice-level-container">
                        <label class="block text-[10px] font-bold mb-1 text-gray-500 uppercase">Level Es</label>
                        <div class="grid grid-cols-3 gap-1.5">
                            <label class="cursor-pointer">
                                <input type="radio" name="mod-ice" id="mod-ice-norm" value="Normal Ice" class="peer sr-only" checked>
                                <div class="rounded-lg border border-gray-200 bg-white py-1 text-center text-[11px] transition-all peer-checked:bg-blue-500 peer-checked:text-white font-bold">Normal</div>
                            </label>
                            <label class="cursor-pointer">
                                <input type="radio" name="mod-ice" id="mod-ice-less" value="Less Ice" class="peer sr-only">
                                <div class="rounded-lg border border-gray-200 bg-white py-1 text-center text-[11px] transition-all peer-checked:bg-blue-500 peer-checked:text-white font-bold">Less</div>
                            </label>
                            <label class="cursor-pointer">
                                <input type="radio" name="mod-ice" id="mod-ice-extra" value="Extra Ice" class="peer sr-only">
                                <div class="rounded-lg border border-gray-200 bg-white py-1 text-center text-[11px] transition-all peer-checked:bg-blue-500 peer-checked:text-white font-bold">Extra</div>
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold mb-1.5">Extra Topping (+Rp 7.000)</label>
                    <div class="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto pr-1">
                        ${addOnToppings.map(t => `
                            <label class="flex items-center gap-2 p-2 border border-gray-100 rounded-xl bg-white shadow-sm cursor-pointer text-xs">
                                <input type="checkbox" value="Topping ${t}" onchange="updateModalPrice()" class="mod-addons-chk accent-kenangan-primary w-4 h-4"> 
                                ${t}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold mb-1.5">Extra Syrup (+Rp 7.000)</label>
                    <div class="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto pr-1">
                        ${addOnSyrups.map(s => `
                            <label class="flex items-center gap-2 p-2 border border-gray-100 rounded-xl bg-white shadow-sm cursor-pointer text-xs">
                                <input type="checkbox" value="Syrup ${s}" onchange="updateModalPrice()" class="mod-addons-chk accent-kenangan-primary w-4 h-4"> 
                                ${s}
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    } else {
        optionsContainer.innerHTML = `
            <div class="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
                <i class="fas fa-bread-slice mr-1 text-kenangan-primary"></i> Varian Makanan & Bakery siap santap.
            </div>
        `;
    }

    optionsContainer.innerHTML += `
        <div class="mt-3">
            <label class="block text-xs font-bold mb-1">Catatan Tambahan (Opsional)</label>
            <input type="text" id="mod-note" placeholder="Misal: ekstra shot / minta dipanaskan" class="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs outline-none focus:ring-2 focus:ring-kenangan-primary transition text-kenangan-dark">
        </div>
    `;

    updateModalPrice();

    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;
    document.body.style.overflow = 'hidden';
    overlay.classList.remove('hidden');
    setTimeout(() => {
        overlay.classList.remove('opacity-0');
        content.classList.remove('translate-y-full');
        content.classList.add('translate-y-0');
    }, 10);
}

function addToCartFromModal() {
    if (!currentModalItem) return;
    const itemName = currentModalItem.name;
    let details = [];
    let chosenPrice = modalPriceCache;

    if (currentModalItem.type === 'bundling') {
        details.push(document.getElementById('mod-bundle-sel').value);
    } else if (currentModalItem.type === 'drink') {
        const temp = document.querySelector('input[name="mod-temp"]:checked')?.value || 'Ice';
        const sizePick = document.querySelector('input[name="mod-size-pick"]:checked')?.value || 'Regular';
        const sugar = document.querySelector('input[name="mod-sugar"]:checked')?.value || 'Normal Sugar';
        
        details.push(temp);
        details.push(sizePick);
        if (sugar !== 'Normal Sugar') details.push(sugar);
        if (temp === 'Ice') {
            const ice = document.querySelector('input[name="mod-ice"]:checked')?.value || 'Normal Ice';
            if (ice !== 'Normal Ice') details.push(ice);
        }
        document.querySelectorAll('.mod-addons-chk:checked').forEach(chk => {
            details.push(chk.value);
        });
    }

    const note = document.getElementById('mod-note')?.value || '';

    if (editingCartIndex !== null) {
        cart[editingCartIndex] = {
            item: currentModalItem,
            name: currentModalItem.name,
            details: details.join(', '),
            note: note,
            price: chosenPrice,
            qty: cart[editingCartIndex].qty || 1
        };
        showToast("Pesanan di keranjang diperbarui!");
    } else {
        cart.push({
            item: currentModalItem,
            name: currentModalItem.name,
            details: details.join(', '),
            note: note,
            price: chosenPrice,
            qty: 1
        });
        playFlyToCartAnimation();
        showToast(`<b>${itemName}</b><br>Berhasil masuk ke keranjang!`);
    }

    // KUNCI PENYIMPANAN KE LOCALSTORAGE
    try {
        localStorage.setItem("bintang_cart", JSON.stringify(cart));
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("bintang_selected_outlet", JSON.stringify(selectedOutlet));
        localStorage.setItem("selectedOutlet", JSON.stringify(selectedOutlet));
        localStorage.setItem("bintang_order_type", currentOrderType);
    } catch(e) {}

    closeModal();
    updateCartUI();
}

function closeModal(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;
    overlay.classList.add('opacity-0');
    content.classList.remove('translate-y-0');
    content.classList.add('translate-y-full');
    document.body.style.overflow = '';
    setTimeout(() => overlay.classList.add('hidden'), 250);
    currentModalItem = null;
    editingCartIndex = null;
}

function playFlyToCartAnimation() {
    sfx.playSuccess();
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const countText = document.getElementById('cart-item-count-text');
    let totalQty = cart.reduce((sum, c) => sum + (c.qty || 1), 0);
    if (countText) countText.textContent = `${totalQty} Item`;
    if (badge) {
        if (totalQty > 0) {
            badge.classList.remove('hidden');
            badge.textContent = totalQty;
        } else {
            badge.classList.add('hidden');
        }
    }
}

function applyRacikanPas() {
    sfx.playTap();
    const iceRadio = document.getElementById('mod-temp-ice');
    const lessSugarRadio = document.getElementById('mod-sugar-less');
    const normIceRadio = document.getElementById('mod-ice-norm');

    if (iceRadio) iceRadio.checked = true;
    if (lessSugarRadio) lessSugarRadio.checked = true;
    if (normIceRadio) normIceRadio.checked = true;

    toggleIceOptions();
    showToast("✨ Racikan Pas diterapkan!");
}

function getDailyWifiPassword() {
    const now = getWIBDate();
    const dayNum = now.getDate();
    return wifiPasswords[dayNum] || "TemanKenangan#01";
}

async function lookupCustomerLoyaltyHistory() {
    sfx.playTap();
    const input = document.getElementById('history-lookup-wa');
    const summaryBox = document.getElementById('loyalty-summary-box');
    const summaryText = document.getElementById('loyalty-summary-text');
    const subText = document.getElementById('loyalty-sub-text');

    if (!input || !input.value.trim()) {
        showToast("Masukkan nomor WhatsApp terlebih dahulu!");
        return;
    }

    let cleanWa = input.value.trim().replace(/[^0-9]/g, '');
    if (cleanWa.startsWith('0')) cleanWa = '62' + cleanWa.slice(1);
    else if (!cleanWa.startsWith('62')) cleanWa = '62' + cleanWa;

    if (summaryBox) summaryBox.classList.remove('hidden');
    if (summaryText) summaryText.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Memeriksa data langganan...';

    try {
        if (!supabaseClient) throw new Error("Database belum terhubung");

        const { data: cust, error } = await supabaseClient
            .from('customers')
            .select('*')
            .eq('phone_number', cleanWa)
            .single();

        if (error || !cust) {
            if (summaryText) summaryText.innerHTML = `👋 Nomor WhatsApp belum tercatat sebagai langganan.`;
            if (subText) subText.textContent = `Yuk selesaikan pesanan pertamamu hari ini!`;
            return;
        }

        const totalOrders = cust.total_orders || 1;
        const totalSpent = cust.total_spent || 0;
        if (summaryText) summaryText.innerHTML = `⭐ <b>Halo Kak ${cust.customer_name || 'Pelanggan'}!</b>`;
        if (subText) subText.innerHTML = `Kamu sudah order <b>${totalOrders} kali</b> dengan total jajan <b>${formatRp(totalSpent)}</b>. 🫶☕`;
    } catch (e) {
        if (summaryText) summaryText.innerHTML = `⚠️ Data belum dapat dimuat.`;
    }
}

function closeCustomRequestModal() {
    const modal = document.getElementById('modal-custom-req');
    const card = document.getElementById('modal-custom-req-card');
    if (!modal || !card) return;
    modal.classList.add('opacity-0');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 250);
}

function validateCustomReqForm() {
    const name = document.getElementById('req-menu-name')?.value.trim() || '';
    const btn = document.getElementById('btn-save-custom-req');
    if (!btn) return;
    btn.disabled = name.length < 2;
}

function addCustomRequestToCart() {
    const name = document.getElementById('req-menu-name')?.value.trim();
    if (!name) return;

    let price = parseFloat(document.getElementById('req-menu-price')?.value) || 18000;
    const note = document.getElementById('req-menu-note')?.value.trim() || '';

    cart.push({
        item: {
            id: 'custom_req_' + Date.now(),
            name: `✍️ [Request] ${name}`,
            isCustom: true
        },
        name: `✍️ [Request] ${name}`,
        details: '[REQUEST KUSTOM]',
        note: note,
        price: price,
        qty: 1
    });

    try {
        localStorage.setItem("bintang_cart", JSON.stringify(cart));
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch(e) {}

    closeCustomRequestModal();
    updateCartUI();
    showToast(`Request <b>${name}</b> berhasil masuk ke keranjang!`);
}

function openCustomRequestModal(keyword = '') {
    const modal = document.getElementById('modal-custom-req');
    const card = document.getElementById('modal-custom-req-card');
    const nameInput = document.getElementById('req-menu-name');
    if (!modal || !card || !nameInput) return;
    nameInput.value = keyword || '';
    document.getElementById('req-menu-price').value = '';
    document.getElementById('req-menu-note').value = '';
    validateCustomReqForm();

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
        nameInput.focus();
    }, 10);
}

// Inisialisasi Aplikasi Utama
document.addEventListener('DOMContentLoaded', async () => {
    initWifiDisplay();
    checkNightHours();
    initSocialProofTicker();
    updateBusyStatusUI();
    setInterval(updateBusyStatusUI, 60000);
    setInterval(checkOutletClosingSoon, 60000);
    initSupabaseRealtimeStatus();
    await fetchStoreAdminStatus();
    await loadDataFiles();
    renderMenu();

    try {
        const savedCart = localStorage.getItem("bintang_cart") || localStorage.getItem("cart");
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    } catch(e) {}

    // ROUTING HASH & PENGECEKAN KEMBALI DARI CHECKOUT
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash === 'kopken') {
        history.replaceState({ view: 'kopken' }, '', '#kopken');
        switchView('kopken', false);

        const hasSavedOutlet = localStorage.getItem("bintang_selected_outlet") || localStorage.getItem("selectedOutlet");
        const hasCartItems = cart && cart.length > 0;

        // Hanya buka popup jika belum pernah pilih cabang dan keranjang kosong
        if (!hasSavedOutlet && !hasCartItems) {
            setTimeout(() => {
                openWelcomeGateModal(true);
            }, 200);
        }
    } else if (currentHash === 'tomoro') {
        history.replaceState({ view: 'tomoro' }, '', '#tomoro');
        switchView('tomoro', false);
    } else {
        history.replaceState({ view: 'portal' }, '', '#portal');
        switchView('portal', false);
    }

    window.addEventListener('popstate', (e) => {
        const targetView = (e.state && e.state.view) ? e.state.view : (window.location.hash.replace('#', '') || 'portal');
        switchView(targetView, false);
    });
});

function initSocialProofTicker() {
    const fakeOrders = [
        { name: "Dimas", menu: "Duo Mantan (2 Cup)", outlet: "Grand Indonesia" },
        { name: "Siti Nur", menu: "Kombo Roti + Mantan", outlet: "PIM 2 South" },
        { name: "Rian F.", menu: "Americano + Bun", outlet: "23Paskal Bandung" },
        { name: "Jessica", menu: "Trio Nongkrong (3 Cup)", outlet: "Margonda Raya Depok" },
        { name: "Bagus", menu: "Party Pack Rame-Rame", outlet: "SMS Serpong" }
    ];

    const spToast = document.getElementById('social-proof-toast');
    const spUser = document.getElementById('sp-user-text');
    const spTime = document.getElementById('sp-time-text');

    if (!spToast || !spUser || !spTime) return;

    setInterval(() => {
        const randomOrder = fakeOrders[Math.floor(Math.random() * fakeOrders.length)];
        const randomMinutes = Math.floor(Math.random() * 8) + 1;

        spUser.textContent = `${randomOrder.name} baru saja order ${randomOrder.menu}`;
        spTime.textContent = `${randomMinutes} menit lalu • ${randomOrder.outlet}`;

        spToast.classList.remove('-translate-x-[120%]');
        spToast.classList.add('translate-x-0');

        setTimeout(() => {
            spToast.classList.remove('translate-x-0');
            spToast.classList.add('-translate-x-[120%]');
        }, 4500);
    }, 24000);
}

// Blokir Inspect
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if (e.key === "F12" || e.keyCode === 123) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) { e.preventDefault(); return false; }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's')) { e.preventDefault(); return false; }
});

// Member Autofill
let memberSearchTimeout = null;
async function onInputMemberCode(val) {
    const query = val.trim().toLowerCase();
    const suggestBox = document.getElementById('memberSuggestBox');
    if (!suggestBox) return;

    if (query.length < 2) {
        suggestBox.style.display = 'none';
        suggestBox.innerHTML = '';
        return;
    }

    clearTimeout(memberSearchTimeout);
    memberSearchTimeout = setTimeout(async () => {
        try {
            if (!supabaseClient) return;
            const { data, error } = await supabaseClient
                .from('members')
                .select('*')
                .ilike('member_code', `${query}%`)
                .limit(4);

            if (!error && data && data.length > 0) {
                suggestBox.innerHTML = data.map(m => `
                    <div onclick="applyMemberProfile('${m.member_code}', '${encodeURIComponent(m.customer_name)}', '${m.customer_phone}', '${m.favorite_outlet_name || ''}')" 
                         style="padding: 10px 12px; cursor: pointer; border-bottom: 1px solid #f1f1f1; display: flex; justify-content: space-between; align-items: center; text-align: left;"
                         onmouseover="this.style.background='#faf5f0'" 
                         onmouseout="this.style.background='white'">
                        <div>
                            <strong style="color: #9C532B; font-size: 13px;">@${m.member_code}</strong>
                            <div style="font-size: 11px; color: #777;">Outlet: ${m.favorite_outlet_name || 'Bebas'}</div>
                        </div>
                        <span style="font-size: 11px; background: #E8D8C8; color: #5c2d16; padding: 2px 8px; border-radius: 12px; font-weight: 600;">Pakai</span>
                    </div>
                `).join('');
                suggestBox.style.display = 'block';
            } else {
                suggestBox.style.display = 'none';
            }
        } catch(e) {
            suggestBox.style.display = 'none';
        }
    }, 250);
}

function applyMemberProfile(code, encodedName, phone, outletName) {
    const name = decodeURIComponent(encodedName);
    localStorage.setItem("bintang_member_session", JSON.stringify({
        code: code,
        name: name,
        phone: phone,
        outlet: outletName
    }));

    const memberInput = document.getElementById('memberCodeInput');
    if (memberInput) memberInput.value = code;

    const suggestBox = document.getElementById('memberSuggestBox');
    if (suggestBox) suggestBox.style.display = 'none';

    if (outletName && Array.isArray(allOutlets)) {
        const found = allOutlets.find(o => o.name.toLowerCase() === outletName.toLowerCase());
        if (found) {
            selectedOutlet = found;
            localStorage.setItem("bintang_selected_outlet", JSON.stringify(found));
            localStorage.setItem("selectedOutlet", JSON.stringify(found));
            updateOutletUI();
            updateGatePreview();
        }
    }
    showToast(`✨ Profil <b>@${code}</b> terpasang!`);
}

function openHistoryModal() {
    renderOrderHistory();
    const modal = document.getElementById('modal-history');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
}

function closeHistoryModal() {
    const modal = document.getElementById('modal-history');
    if (!modal) return;
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 250);
}

function renderOrderHistory() {
    const container = document.getElementById('history-items-list');
    const history = JSON.parse(localStorage.getItem('bintang_order_history') || '[]');
    if (!container) return;

    if (history.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic text-center py-6">Belum ada riwayat pesanan.</p>';
        return;
    }

    container.innerHTML = '';
    history.forEach((h, idx) => {
        container.innerHTML += `
            <div class="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">${h.orderType}</span>
                    <span class="text-[10px] text-gray-400 font-medium">${h.date}</span>
                </div>
                <h4 class="font-extrabold text-xs text-kenangan-dark">${h.outletName}</h4>
                <p class="text-[11px] text-gray-600 line-clamp-2 mt-0.5">${h.itemsSummary}</p>
                <div class="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                    <span class="text-xs font-extrabold text-kenangan-primary">${formatRp(h.grandTotal)}</span>
                    <button onclick="reorderHistoryItem(${idx})" class="px-3 py-1 rounded-xl bg-kenangan-dark hover:bg-kenangan-primary text-white text-[11px] font-bold transition flex items-center gap-1 active:scale-95 cursor-pointer">
                        <i class="fas fa-arrow-rotate-right text-[10px]"></i> Pesan Lagi
                    </button>
                </div>
            </div>
        `;
    });
}

function reorderHistoryItem(index) {
    const history = JSON.parse(localStorage.getItem('bintang_order_history') || '[]');
    const ord = history[index];
    if (!ord) return;

    cart = JSON.parse(JSON.stringify(ord.cartData || []));
    currentOrderType = ord.orderType || 'takeaway';
    if (ord.outletObj) selectedOutlet = ord.outletObj;

    try {
        localStorage.setItem("bintang_cart", JSON.stringify(cart));
        localStorage.setItem("cart", JSON.stringify(cart));
        if (selectedOutlet) {
            localStorage.setItem("bintang_selected_outlet", JSON.stringify(selectedOutlet));
            localStorage.setItem("selectedOutlet", JSON.stringify(selectedOutlet));
        }
    } catch(e) {}

    closeHistoryModal();
    switchView('kopken');
    updateOutletUI();
    updateCartUI();
    showToast("Pesanan dimuat ke keranjang!");
}

function clearOrderHistory() {
    localStorage.removeItem('bintang_order_history');
    renderOrderHistory();
    showToast("Riwayat pesanan dibersihkan");
}

function initWifiDisplay() {
    const pass = getDailyWifiPassword();
    const wifiPassEl = document.getElementById('wifi-pass-text');
    if (wifiPassEl) wifiPassEl.textContent = pass;
}

function toggleWifiModal(show) {
    const modal = document.getElementById('modal-wifi');
    if (!modal) return;
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    } else {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 250);
    }
}

function copyWifiPass() {
    const pass = document.getElementById('wifi-pass-text')?.textContent || '';
    navigator.clipboard.writeText(pass);
    showToast("Password WiFi berhasil disalin!");
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'bg-gray-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transform transition-all duration-300 translate-y-[-20px] opacity-0 border border-white/10 z-[300] text-xs font-semibold';
    toast.innerHTML = `<i class="fas fa-circle-check text-amber-400 text-sm flex-shrink-0"></i> <div>${message}</div>`;
    
    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-[-20px]', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-20px]', 'opacity-0');
        setTimeout(() => toast.remove(), 400);
    }, 3200);
}

function toggleLeaderboardModal(show) {
    const modal = document.getElementById('modal-leaderboard');
    if (!modal) return;
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    } else {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 200);
    }
}
