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

// Supabase Endpoint
const SUPABASE_TOMORO_URL = "https://xckpxsrkpqktmdiulhsy.supabase.co";
const SUPABASE_TOMORO_KEY = "sb_publishable_bbqKvEd6ew_vM9wBpoIHZw_hANNhLNF";

// Admin Secret Settings
const ADMIN_PIN_CODE = "310107";
let currentAdminStoreStatus = "online";
let secretLogoTapCount = 0;
let secretLogoTapTimer = null;

// Konfigurasi Jam Agenda Terjadwal
// 0: Minggu, 1: Senin, 2: Selasa, 3: Rabu, 4: Kamis, 5: Jumat, 6: Sabtu
const SCHEDULE_BUSY = [
  // SELASA (2)
  { day: 2, start: "07:00", end: "08:40" },
  { day: 2, start: "14:20", end: "16:00" },
  // KAMIS (4)
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

async function sendSingleTelegramMsg(msgHtml) {
    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: msgHtml,
                parse_mode: 'HTML'
            })
        });
        return resp.ok;
    } catch (err) {
        console.error("Gagal kirim pesan telegram", err);
        return false;
    }
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

const tomoroMenuDatabase = [
    { id: 'tm_c1', name: 'Spanish Aren Latte', category: 'Classic Coffee', price: 20000, realPrice: 32000, badge: '🔥 BEST', img: 'https://img.cimagroup.my.id/tomoro-spanish-aren-latte-1784206477919.webp' },
    { id: 'tm_c2', name: 'Manuka Oat Latte', category: 'Classic Coffee', price: 22000, realPrice: 34000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-manuka-oat-latte-1784206955327.webp' },
    { id: 'tm_c6', name: 'Coconut Aren Latte', category: 'Classic Coffee', price: 20000, realPrice: 30000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-coconut-aren-latte-1784206496113.webp' },
    { id: 'tm_c7', name: 'Caramel Macchiato', category: 'Classic Coffee', price: 20000, realPrice: 32000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-caramel-macchiato-1784206391083.webp' },
    { id: 'tm_c8', name: 'Cheese Cloud Chocolate', category: 'Classic Coffee', price: 21000, realPrice: 32000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-cheese-cloud-chocolate-1784205905057.webp' },
    { id: 'tm_c9', name: 'Sea Salt Cloud Caramel Macchiato', category: 'Classic Coffee', price: 22000, realPrice: 34000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-sea-salt-cloud-caramel-macchiato-1784205854612.webp' },
    { id: 'tm_c10', name: 'Caramel Cheese Latte', category: 'Classic Coffee', price: 21000, realPrice: 32000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-caramel-cheese-latte-1784206443651.webp' },
    { id: 'tm_c11', name: 'Cheese Cloud Latte', category: 'Classic Coffee', price: 21000, realPrice: 32000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-cheese-cloud-latte-1784206354009.webp' },
    { id: 'tm_c12', name: 'Caffe Americano', category: 'Classic Coffee', price: 15000, realPrice: 20000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-caffe-americano-1784205916193.webp' },
    { id: 'tm_c13', name: 'Kopi Susu Aren', category: 'Classic Coffee', price: 17000, realPrice: 24000, badge: '🔥 BEST', img: 'https://img.cimagroup.my.id/tomoro-kopi-susu-aren-1784205971117.webp' },
    { id: 'tm_c14', name: 'TOMORO Coconut Latte', category: 'Classic Coffee', price: 20000, realPrice: 30000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-tomoro-coconut-latte-1784206633800.webp' },
    { id: 'tm_c15', name: 'Caffe Latte', category: 'Classic Coffee', price: 18000, realPrice: 26000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-caffe-latte-1784205946441.webp' },
    { id: 'tm_c16', name: 'Cappuccino', category: 'Classic Coffee', price: 18000, realPrice: 26000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-cappuccino-1784206159848.webp' },
    { id: 'tm_c17', name: 'Spanish Latte', category: 'Classic Coffee', price: 19000, realPrice: 28000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-spanish-latte-1784206468364.webp' },
    { id: 'tm_c18', name: 'Caffe Mocha', category: 'Classic Coffee', price: 20000, realPrice: 28000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-caffe-mocha-1784205985921.webp' },
    { id: 'tm_c19', name: 'Sea Salt Cloud Chocolate', category: 'Classic Coffee', price: 21000, realPrice: 32000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-sea-salt-cloud-chocolate-1784206747477.webp' },
    { id: 'tm_c20', name: 'Sea Salt Cloud Matcha Latte', category: 'Classic Coffee', price: 22000, realPrice: 34000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-sea-salt-cloud-matcha-latte-1784205828616.webp' },
    { id: 'tm_c21', name: 'TOMORO Aren Latte', category: 'Classic Coffee', price: 18000, realPrice: 26000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-tomoro-aren-latte-1784205841380.webp' },
    { id: 'tm_fr1', name: 'Peach Americano', category: 'Fruity Series', price: 18000, realPrice: 25000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-peach-americano-1784206558221.webp' },
    { id: 'tm_fr2', name: 'Peach Coconut Frappe', category: 'Fruity Series', price: 21000, realPrice: 30000, badge: '', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCo4iqcCjVnKKGlihxw4V4LhYjDpNI9iiV0QG7zx96Lg&s=10' },
    { id: 'tm_fr3', name: 'Peach Jasmine Tea', category: 'Fruity Series', price: 16000, realPrice: 22000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-peach-jasmine-tea-1784206571953.webp' },
    { id: 'tm_ap1', name: 'Grapefruit Americano', category: 'Americano Party Series', price: 18000, realPrice: 25000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-grapefruit-americano-1784206918080.webp' },
    { id: 'tm_ap2', name: 'Lemonade Americano', category: 'Americano Party Series', price: 18000, realPrice: 25000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-lemonade-americano-1784206858343.webp' },
    { id: 'tm_ap3', name: 'Jasmine Americano', category: 'Americano Party Series', price: 18000, realPrice: 25000, badge: '', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgbqPIlQTVVBjPgMrIrGRPC61LwL0lmRvBIc5l6aJaLyOyjVVxGXA4aVE&s=10' },
    { id: 'tm_fp1', name: 'Caffe Mocha Frappe', category: 'Frappe', price: 22000, realPrice: 32000, badge: '', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYG2-owZu3RShejVqVbrlgE2XJw6qse0278WS7UaK0hmO5sGJnxFCo1e97&s=10' },
    { id: 'tm_fp2', name: 'Aren Latte Frappe', category: 'Frappe', price: 21000, realPrice: 30000, badge: '', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmFA0Eg0Zrv1M9AlEtZdNpdasMHN1QONAucTC5Mm6avcPLkVz1Fix1WWue&s=10' },
    { id: 'tm_fp3', name: 'Oat Aren Frappe', category: 'Frappe', price: 23000, realPrice: 34000, badge: '', img: 'https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/f301b1ee-ecff-476a-a0b9-ae7793071e46_Gg4SDAoDCPQDEgMI9AMYAShV.jpeg?w=250' },
    { id: 'tm_fp4', name: 'Coconut Aren Frappe', category: 'Frappe', price: 22000, realPrice: 32000, badge: '', img: 'https://i0.wp.com/i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/aea7c1cb-6d8e-4084-abf6-697b5f958fe6_Gg4SDAoDCPQDEgMI9AMYAShV.jpeg' },
    { id: 'tm_fp5', name: 'Matcha Frappe', category: 'Frappe', price: 22000, realPrice: 32000, badge: '', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToZrYIBc6ITj-YQ7T3TO9MkJ130VWE7BsWbhp1veq3UfFAS0tQBUZx4Nw5&s=10' },
    { id: 'tm_fp6', name: 'Coffee Frappe', category: 'Frappe', price: 21000, realPrice: 30000, badge: '', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxaWu6-5iz1g6ChF9R0o52sTQRAQEgqhYnDobqfoYkeA&s=10' },
    { id: 'tm_fp7', name: 'Chocolate Frappe', category: 'Frappe', price: 21000, realPrice: 30000, badge: '', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRYS73RxkOJunfg01mgaSVDJD1flUqP9dNDM5b-sCy-xx9mEb2pyRAv-k&s=10' },
    { id: 'tm_ps1', name: 'Pistachio Latte', category: 'Pistachio Series', price: 23000, realPrice: 34000, badge: '✨ NEW', img: 'https://img.cimagroup.my.id/tomoro-pistachio-matcha-latte-1784205817997.webp' },
    { id: 'tm_ps2', name: 'Pistachio Chocolate', category: 'Pistachio Series', price: 24000, realPrice: 35000, badge: '✨ NEW', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7g8MzcX_0KJIfacaKIylGEk47gPEfqNH_tPWQoumWNBgUypmkVwBB6dtw&s=10' },
    { id: 'tm_ps3', name: 'Pistachio Matcha Latte', category: 'Pistachio Series', price: 24000, realPrice: 35000, badge: '✨ NEW', img: 'https://img.cimagroup.my.id/tomoro-pistachio-matcha-latte-1784205817997.webp' },
    { id: 'tm_nc1', name: 'Pink Pop Lemonade', category: 'Non Coffee', price: 16000, realPrice: 22000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-pink-pop-lemonade-1784206894500.webp' },
    { id: 'tm_nc2', name: 'Pink Pop Lemon Tea', category: 'Non Coffee', price: 16000, realPrice: 22000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-pink-pop-lemon-tea-1784206905841.webp' },
    { id: 'tm_nc3', name: 'Chocolate', category: 'Non Coffee', price: 18000, realPrice: 25000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-chocolate-1784206769565.webp' },
    { id: 'tm_nc8', name: 'TOMORO Oat Latte', category: 'Non Coffee', price: 21000, realPrice: 30000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-tomoro-oat-latte-1784205867826.webp' },
    { id: 'tm_nc9', name: 'Breve Latte', category: 'Non Coffee', price: 20000, realPrice: 28000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-breve-latte-1784205927541.webp' },
    { id: 'tm_nc16', name: 'Choco Oat Latte', category: 'Non Coffee', price: 21000, realPrice: 30000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-choco-oat-latte-1784206785487.webp' },
    { id: 'tm_nc18', name: 'Hojicha Oat Latte', category: 'Non Coffee', price: 21000, realPrice: 30000, badge: '', img: 'https://img.cimagroup.my.id/tomoro-hojicha-oat-latte-1784206818915.webp' }
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
let checkoutCustomerName = "Pelanggan";
let checkoutGrandTotal = 0;
let checkoutCustomerWa = "";
let pendingCheckoutMethod = null;
let isMidnightForced = false;
let tomoroDebounceTimer = null;
let selectedOrderType = 'now';

function setOrderTimeType(type) {
  selectedOrderType = type;
  const btnNow = document.getElementById('btn-order-now');
  const btnSchedule = document.getElementById('btn-order-schedule');
  const picker = document.getElementById('schedule-picker');

  if (!btnNow || !btnSchedule || !picker) return;

  if (type === 'schedule') {
    btnSchedule.className = "py-2 px-3 text-xs font-semibold rounded-xl border border-amber-600 bg-amber-50 text-amber-900 transition-all flex items-center justify-center gap-1.5 shadow-sm";
    btnNow.className = "py-2 px-3 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50 text-stone-600 transition-all flex items-center justify-center gap-1.5";
    picker.classList.remove('hidden');
  } else {
    btnNow.className = "py-2 px-3 text-xs font-semibold rounded-xl border border-amber-600 bg-amber-50 text-amber-900 transition-all flex items-center justify-center gap-1.5 shadow-sm";
    btnSchedule.className = "py-2 px-3 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50 text-stone-600 transition-all flex items-center justify-center gap-1.5";
    picker.classList.add('hidden');
  }
}

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
    const syncText = document.getElementById('admin-sync-indicator');
    if (syncText) syncText.textContent = "⏳ Menyimpan status ke database cloud...";

    try {
        const endpoint = `${SUPABASE_TOMORO_URL}/rest/v1/store_settings?key=eq.admin_status`;
        const res = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_TOMORO_KEY,
                'Authorization': `Bearer ${SUPABASE_TOMORO_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({ value: newStatus })
        });

        if (!res.ok) throw new Error("Gagal update Supabase");

        currentAdminStoreStatus = newStatus;
        applyAdminStatusToUI(newStatus);
        refreshAdminControlUI();
        if (syncText) syncText.textContent = "✅ Status berhasil diperbarui di cloud!";
        showToast(`Status toko diubah ke: <b>${newStatus.toUpperCase()}</b>`);
    } catch (err) {
        currentAdminStoreStatus = newStatus;
        applyAdminStatusToUI(newStatus);
        refreshAdminControlUI();
        if (syncText) syncText.textContent = "⚠️ Tersimpan lokal";
        showToast(`Status tersimpan lokal: <b>${newStatus.toUpperCase()}</b>`);
    }
}

async function fetchStoreAdminStatus() {
    try {
        const endpoint = `${SUPABASE_TOMORO_URL}/rest/v1/store_settings?key=eq.admin_status&select=*`;
        const res = await fetch(endpoint, {
            headers: {
                'apikey': SUPABASE_TOMORO_KEY,
                'Authorization': `Bearer ${SUPABASE_TOMORO_KEY}`
            }
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data && data.length > 0) {
            currentAdminStoreStatus = data[0].value || 'online';
            applyAdminStatusToUI(currentAdminStoreStatus);
        }
    } catch (e) {
        applyAdminStatusToUI('online');
    }
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
    const glow = document.getElementById('main-glow');

    if (target === 'portal') {
        body.style.backgroundColor = '#0F172A';
        glow.style.background = 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 40%)';
        document.getElementById('particle-container').innerHTML = '';
    } else if (target === 'kopken') {
        body.style.backgroundColor = '#F9F1E7';
        glow.style.background = 'radial-gradient(circle at 50% 50%, rgba(232, 163, 89, 0.15) 0%, rgba(249, 241, 231, 0) 50%), radial-gradient(circle at 80% 20%, rgba(160, 92, 58, 0.1) 0%, rgba(249, 241, 231, 0) 40%)';
        initKopkenParticles();
    } else if (target === 'tomoro') {
        body.style.backgroundColor = '#FFF7ED';
        glow.style.background = 'radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.15) 0%, rgba(255, 247, 237, 0) 50%), radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.1) 0%, rgba(255, 247, 237, 0) 40%)';
        document.getElementById('particle-container').innerHTML = '';
    }

    if (pushToHistory) {
        history.pushState({ view: target }, '', '#' + target);
    }
}

function openKopkenFlow() {
    switchView('kopken');
    openWelcomeGateModal(false);
}

function openTomoroFlow() {
    switchView('tomoro');
    renderTomoroMenu('all');
    showToast("☕ Selamat datang di Showcase Menu Tomoro Coffee!");
}

function initKopkenParticles() {
    const container = document.getElementById('particle-container');
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

function renderTomoroMenu(category = 'all') {
    const container = document.getElementById('tomoro-menu-grid');
    if (!container) return;
    container.innerHTML = '';

    const list = category === 'all' 
        ? tomoroMenuDatabase 
        : tomoroMenuDatabase.filter(m => m.category === category);

    list.forEach(item => {
        container.innerHTML += `
            <div class="glass rounded-2xl p-2.5 flex flex-col justify-between h-full relative overflow-hidden group shadow-sm hover:shadow-md transition bg-white/80">
                <div class="absolute top-0 right-0 bg-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg z-10 uppercase">${item.badge || 'PROMO'}</div>
                
                <div class="w-full aspect-square flex items-center justify-center p-2 mb-2 bg-orange-50/60 rounded-xl overflow-hidden shadow-inner">
                    <img src="${item.img}" alt="${item.name}" class="w-full h-full object-contain group-hover:scale-105 transition duration-300" loading="lazy" onerror="this.src='https://placehold.co/400x400/EA580C/FFFFFF?text=Tomoro+Coffee';">
                </div>

                <div class="flex-grow flex flex-col justify-between">
                    <div>
                        <span class="text-[9px] font-bold text-orange-700 uppercase tracking-wider block">${item.category}</span>
                        <h3 class="font-extrabold text-slate-900 text-xs leading-snug line-clamp-2">${item.name}</h3>
                        <p class="text-[10px] text-gray-400 line-through mt-0.5">${formatRp(item.realPrice)}</p>
                    </div>
                    <div class="flex justify-between items-center mt-2 pt-1.5 border-t border-gray-100">
                        <p class="font-black text-orange-600 text-xs">${formatRp(item.price)}</p>
                        <button onclick="handleTomoroItemClick('${item.name.replace(/'/g, "\\'")}')" class="px-2 py-1 rounded-lg bg-orange-100 text-orange-800 hover:bg-orange-500 hover:text-white text-[10px] font-extrabold transition cursor-pointer">
                            Segera
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function filterTomoroCategory(cat, btn) {
    sfx.playTap();
    document.querySelectorAll('.tomoro-cat-btn').forEach(b => {
        b.className = "tomoro-cat-btn px-3.5 py-1.5 rounded-full bg-white/90 text-slate-700 text-xs font-bold shadow-sm transition";
    });
    btn.className = "tomoro-cat-btn px-3.5 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold shadow-sm transition";
    renderTomoroMenu(cat);
}

function handleTomoroItemClick(name) {
    sfx.playTap();
    showToast(`☕ <b>${name}</b><br>Kupon diskon Tomoro sedang disiapkan, segera rilis ya Kak! ✨`);
}

function handleTomoroOutletSearch() {
    clearTimeout(tomoroDebounceTimer);
    const query = document.getElementById('tomoro-outlet-search-input').value.trim();
    const dropdown = document.getElementById('tomoro-outlet-dropdown');

    if (!query) {
        dropdown.classList.add('hidden');
        return;
    }

    dropdown.classList.remove('hidden');
    dropdown.innerHTML = '<div class="p-3 text-xs text-gray-500 text-center"><i class="fas fa-spinner fa-spin mr-1"></i> Mencari outlet Tomoro...</div>';

    tomoroDebounceTimer = setTimeout(async () => {
        try {
            const endpoint = `${SUPABASE_TOMORO_URL}/rest/v1/tomoro_outlets?select=*&or=(nama.ilike.*${encodeURIComponent(query)}*,area.ilike.*${encodeURIComponent(query)}*,alamat.ilike.*${encodeURIComponent(query)}*)&limit=15`;
            const res = await fetch(endpoint, {
                headers: {
                    'apikey': SUPABASE_TOMORO_KEY,
                    'Authorization': `Bearer ${SUPABASE_TOMORO_KEY}`
                }
            });
            if (!res.ok) throw new Error();
            const data = await res.json();

            if (!data || data.length === 0) {
                dropdown.innerHTML = '<div class="p-3 text-xs text-gray-400 text-center">Outlet Tomoro tidak ditemukan</div>';
                return;
            }

            dropdown.innerHTML = '';
            data.forEach(o => {
                const name = o.nama || 'Tomoro Coffee';
                const area = o.area ? ` (${o.area})` : '';
                const addr = o.alamat || '-';
                const isOpen = o.status ? (o.status.toLowerCase() === 'buka') : true;

                dropdown.innerHTML += `
                    <div onclick="selectTomoroOutlet('${name}${area}', '${addr}', ${isOpen})" class="p-3 hover:bg-orange-50/80 cursor-pointer border-b border-gray-100 last:border-none flex items-center justify-between gap-2 transition">
                        <div class="min-w-0">
                            <h5 class="text-xs font-bold text-slate-900 truncate">${name}${area}</h5>
                            <p class="text-[10px] text-gray-500 line-clamp-1 mt-0.5">${addr}</p>
                        </div>
                        <span class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}">
                            ${isOpen ? 'BUKA' : 'TUTUP'}
                        </span>
                    </div>
                `;
            });
        } catch(e) {
            dropdown.innerHTML = '<div class="p-3 text-xs text-red-500 text-center">Gagal memuat outlet Tomoro</div>';
        }
    }, 350);
}

function selectTomoroOutlet(name, address, isOpen) {
    sfx.playTap();
    document.getElementById('tomoro-selected-name').textContent = name;
    const statusEl = document.getElementById('tomoro-selected-status');
    statusEl.textContent = isOpen ? 'BUKA' : 'TUTUP';
    statusEl.className = `text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`;
    document.getElementById('tomoro-outlet-dropdown').classList.add('hidden');
    showToast(`Cabang Tomoro dipilih: <b>${name}</b>`);
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
    selectedOutlet = allOutlets[0];
    updateOutletUI();

    const defaultBundlings = [
        {
            id: 'b_combo_single_toast',
            cat: 'bundling',
            name: 'Combo Single Ngopi & Toast',
            singlePrice: 32000,
            realPrice: 44000,
            badge: '🍞 COMBO KENYANG',
            type: 'bundling',
            img: 'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/sandwich-chicken-tartar-1784204052680.webp',
            imgs: [
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/kopi-kenangan-mantan-1784203103920.webp',
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/sandwich-chicken-tartar-1784204052680.webp'
            ],
            opts: [
                '1 Mantan Reguler (Ice) + 1 Toast Adam Ayam',
                '1 Mantan Reguler (Ice) + 1 Toast Wahyu Sapi',
                '1 Mantan Reguler (Ice) + 1 Toast Bambang Choco Cheese',
                '1 Americano (Hot/Ice) + 1 Toast Adam Ayam'
            ]
        },
        {
            id: 'b_kencan_berdua',
            cat: 'bundling',
            name: 'Paket Kencan Berdua (2 Cup Large)',
            singlePrice: 44000,
            realPrice: 60000,
            badge: '🔥 BEST 50K',
            type: 'bundling',
            img: 'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/kopi-kenangan-mantan-1784203103920.webp',
            imgs: [
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/kopi-kenangan-mantan-1784203103920.webp',
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/og-thai-tea-1784203762918.webp'
            ],
            opts: [
                '2 Mantan Large (Ice)',
                '1 Mantan Large + 1 Thai Tea Large (Ice)',
                '1 Mantan Large + 1 Dutch Choco Large (Ice)',
                '2 Thai Tea Large (Ice)'
            ]
        },
        {
            id: 'b_duo_mantan_toast',
            cat: 'bundling',
            name: 'Duo Mantan Reguler + Toast Kenyang',
            singlePrice: 44000,
            realPrice: 60000,
            badge: '🥪 NGOPI + KENYANG',
            type: 'bundling',
            img: 'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/sandwich-smoked-beef-cheese-1784204059423.webp',
            imgs: [
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/kopi-kenangan-mantan-1784203103920.webp',
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/sandwich-smoked-beef-cheese-1784204059423.webp'
            ],
            opts: [
                '2 Mantan Reguler (Ice) + 1 Toast Adam Ayam',
                '2 Mantan Reguler (Ice) + 1 Toast Wahyu Sapi',
                '2 Mantan Reguler (Ice) + 1 Sandwich Smoked Beef',
                '2 Mantan Reguler (Ice) + 1 Toast Bambang Choco Cheese'
            ]
        },
        {
            id: 'b_nongkrong_bertiga',
            cat: 'bundling',
            name: 'Paket Nongkrong Bertiga (3 Cup Reguler)',
            singlePrice: 42000,
            realPrice: 57000,
            badge: '⚡ HEMAT BERTIGA',
            type: 'bundling',
            img: 'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/kopi-kenangan-mantan-1784203103920.webp',
            imgs: [
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/kopi-kenangan-mantan-1784203103920.webp',
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/og-thai-tea-1784203762918.webp',
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/dutch-chocolate-1786006597203.webp'
            ],
            opts: [
                '3 Mantan Reguler (Ice)',
                '2 Mantan + 1 Thai Tea Reguler (Ice)',
                '1 Mantan + 1 Spanish Latte + 1 Thai Tea (Ice)',
                '1 Mantan + 1 Americano + 1 Dutch Choco (Ice)'
            ]
        },
        {
            id: 'b_mabar_sultan',
            cat: 'bundling',
            name: 'Paket Mabar Sultan (3 Cup + 1 Roti/Pastry)',
            singlePrice: 55000,
            realPrice: 70000,
            badge: '👑 SUPER COMBO 70K',
            type: 'bundling',
            img: 'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/roti-coklat-klasik-1784203834325.webp',
            imgs: [
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/kopi-kenangan-mantan-1784203103920.webp',
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/og-thai-tea-1784203762918.webp',
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/dutch-chocolate-1786006597203.webp',
                'https://axaoagzveujcgoxybdmp.supabase.co/storage/v1/object/public/menu-kopken/roti-coklat-klasik-1784203834325.webp'
            ],
            opts: [
                '3 Mantan (Ice) + 1 Roti Coklat Klasik',
                '2 Mantan + 1 Thai Tea (Ice) + 1 Roti Coklat Klasik',
                '2 Mantan + 1 Thai Tea (Ice) + 1 Salt Bread Original',
                '1 Mantan + 1 Thai Tea + 1 Dutch Choco (Ice) + 1 Toast Bambang'
            ]
        }
    ];

    try {
        const menuRes = await fetch('./menu.json');
        if (menuRes.ok) {
            const menuData = await menuRes.json();
            const parsedMenu = [...defaultBundlings];

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
            } else if (Array.isArray(menuData)) {
                menuData.forEach(item => parsedMenu.push(item));
            }

            if (parsedMenu.length > 0) allMenu = parsedMenu;
        }
    } catch (e) {
        allMenu = defaultBundlings;
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
            const bagWrap = document.getElementById('plastic-bag-wrapper');
            if (bagWrap) bagWrap.classList.remove('hidden');
        } else {
            orderIcon.className = "fas fa-mug-hot text-base";
            orderLabel.textContent = "Dine In";
            const bagWrap = document.getElementById('plastic-bag-wrapper');
            if (bagWrap) bagWrap.classList.add('hidden');
            const bagChk = document.getElementById('bag-checkbox');
            if (bagChk) bagChk.checked = false;
        }
    }

    if (outletStatus) {
        if (isSig) {
            outletStatus.textContent = 'SIGNATURE (TUTUP)';
            outletStatus.className = 'text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase';
        } else {
            outletStatus.textContent = isOpen ? 'BUKA' : 'TUTUP';
            outletStatus.className = `text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`;
        }
    }

    if (outletName) {
        outletName.textContent = selectedOutlet.name + (isSig ? ' (Signature)' : (isMall ? ' (Mall)' : ''));
    }

    if (mapsBtn) {
        const queryMaps = encodeURIComponent(`Kopi Kenangan ${selectedOutlet.name}`);
        mapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${queryMaps}`;
    }

    validateKopkenForm();
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
                    if (item.imgs.length === 2) {
                        imageBoxHtml = `
                            <div class="w-full aspect-square p-1.5 mb-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden shadow-inner grid grid-cols-2 gap-1 items-center">
                                <img src="${item.imgs[0]}" alt="${item.name} 1" class="w-full h-full object-contain hover:scale-105 transition" loading="lazy">
                                <img src="${item.imgs[1]}" alt="${item.name} 2" class="w-full h-full object-contain hover:scale-105 transition" loading="lazy">
                            </div>
                        `;
                    } else if (item.imgs.length === 3) {
                        imageBoxHtml = `
                            <div class="w-full aspect-square p-1.5 mb-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden shadow-inner grid grid-cols-2 grid-rows-2 gap-1 items-center">
                                <div class="col-span-2 flex justify-center h-full"><img src="${item.imgs[0]}" alt="${item.name} 1" class="h-full object-contain" loading="lazy"></div>
                                <div class="flex justify-center h-full"><img src="${item.imgs[1]}" alt="${item.name} 2" class="h-full object-contain" loading="lazy"></div>
                                <div class="flex justify-center h-full"><img src="${item.imgs[2]}" alt="${item.name} 3" class="h-full object-contain" loading="lazy"></div>
                            </div>
                        `;
                    } else {
                        imageBoxHtml = `
                            <div class="w-full aspect-square p-1.5 mb-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden shadow-inner grid grid-cols-2 grid-rows-2 gap-1 items-center">
                                <img src="${item.imgs[0]}" alt="${item.name} 1" class="w-full h-full object-contain" loading="lazy">
                                <img src="${item.imgs[1]}" alt="${item.name} 2" class="w-full h-full object-contain" loading="lazy">
                                <img src="${item.imgs[2]}" alt="${item.name} 3" class="w-full h-full object-contain" loading="lazy">
                                <img src="${item.imgs[3]}" alt="${item.name} 4" class="w-full h-full object-contain" loading="lazy">
                            </div>
                        `;
                    }
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

function scrollToCart() {
    document.getElementById('checkout-section').scrollIntoView({ behavior: 'smooth' });
}

function openWelcomeGateModal(forceOpen = true) {
    const modal = document.getElementById('modal-welcome-gate');
    const card = document.getElementById('welcome-gate-card');
    setGateOrderType(currentOrderType);
    updateGatePreview();

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }, 10);
}

function closeWelcomeGateModal() {
    const modal = document.getElementById('modal-welcome-gate');
    const card = document.getElementById('welcome-gate-card');
    modal.classList.add('opacity-0');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 250);
}

function setGateOrderType(type) {
    currentOrderType = type;
    const btnTakeaway = document.getElementById('gate-type-takeaway');
    const btnDinein = document.getElementById('gate-type-dinein');

    if (type === 'takeaway') {
        btnTakeaway.className = "py-2.5 px-3 rounded-2xl border-2 border-kenangan-primary bg-amber-50 text-kenangan-primary font-bold text-xs flex flex-col items-center gap-1 transition shadow-sm cursor-pointer";
        btnDinein.className = "py-2.5 px-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-600 font-bold text-xs flex flex-col items-center gap-1 transition cursor-pointer";
    } else {
        btnDinein.className = "py-2.5 px-3 rounded-2xl border-2 border-kenangan-primary bg-amber-50 text-kenangan-primary font-bold text-xs flex flex-col items-center gap-1 transition shadow-sm cursor-pointer";
        btnTakeaway.className = "py-2.5 px-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-600 font-bold text-xs flex flex-col items-center gap-1 transition cursor-pointer";
    }
}

function handleGateOutletSearch() {
    const query = document.getElementById('gate-outlet-search').value.trim().toLowerCase();
    const dropdown = document.getElementById('gate-outlet-dropdown');
    const clearBtn = document.getElementById('gate-clear-search-btn');

    if (!query) {
        dropdown.classList.add('hidden');
        clearBtn.classList.add('hidden');
        return;
    }

    clearBtn.classList.remove('hidden');
    const filtered = allOutlets.filter(o => 
        (o.name && o.name.toLowerCase().includes(query)) ||
        (o.address && o.address.toLowerCase().includes(query))
    ).slice(0, 15);

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
                statusBadgeHTML = `<span class="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-800 flex-shrink-0">TUTUP</span>`;
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
    document.getElementById('gate-outlet-search').value = '';
    document.getElementById('gate-outlet-dropdown').classList.add('hidden');
    document.getElementById('gate-clear-search-btn').classList.add('hidden');
}

function selectOutletItem(outletId) {
    const outlet = allOutlets.find(o => o.id === outletId);
    if (!outlet) return;

    const isSig = isSignatureOutlet(outlet);
    const isOpen = isOutletOpenNow(outlet);

    if (isSig) {
        showToast(`<b>Outlet Signature/Heritage</b><br>Cabang ini memiliki menu & harga khusus, promo reguler tidak berlaku.`);
    } else if (!isOpen) {
        showToast(`<b>Outlet ${outlet.name} sedang TUTUP.</b><br>Pesanan hanya bisa diproses saat jam operasional.`);
    }

    selectedOutlet = outlet;
    clearGateSearch();
    updateGatePreview();
    validateKopkenForm();
}

function updateGatePreview() {
    if (!selectedOutlet) return;
    const isSig = isSignatureOutlet(selectedOutlet);
    const isOpen = isOutletOpenNow(selectedOutlet);
    const isMall = isMallOutlet(selectedOutlet);

    document.getElementById('gate-preview-name').textContent = selectedOutlet.name + (isSig ? ' (Signature)' : (isMall ? ' (Mall)' : ''));
    document.getElementById('gate-preview-address').textContent = isSig ? '⚠️ Outlet Signature/Heritage memiliki menu dan harga khusus. Promo reguler tidak berlaku.' : (selectedOutlet.address || 'Alamat outlet');
    
    const statusBadge = document.getElementById('gate-preview-status');
    if (isSig) {
        statusBadge.textContent = 'SIGNATURE (TUTUP)';
        statusBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0 bg-purple-100 text-purple-800';
    } else {
        statusBadge.textContent = isOpen ? 'BUKA' : 'TUTUP';
        statusBadge.className = `text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex-shrink-0 ${isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`;
    }
}

function confirmWelcomeGate() {
    if (!selectedOutlet) {
        showToast("Harap pilih salah satu outlet terlebih dahulu!");
        return;
    }

    const isSig = isSignatureOutlet(selectedOutlet);
    if (isSig) {
        showToast("<b>Outlet Signature</b><br>Outlet ini memiliki menu khusus dan promo reguler tidak berlaku.");
    }

    sfx.playTap();
    closeWelcomeGateModal();
    updateOutletUI();
    validateKopkenForm();
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
    document.getElementById('modal-price').textContent = formatRp(modalPriceCache);
    document.getElementById('modal-btn-price').textContent = formatRp(modalPriceCache);
}

function openModal(itemId, editIndex = null) {
    const item = allMenu.find(m => String(m.id) === String(itemId));
    if (!item) return;

    currentModalItem = item;
    editingCartIndex = editIndex;
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-btn-label').textContent = editIndex !== null ? 'Perbarui Pesanan' : 'Simpan ke Keranjang';

    const optionsContainer = document.getElementById('modal-options-container');
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
        const temp = document.querySelector('input[name="mod-temp"]:checked').value;
        const sizePick = document.querySelector('input[name="mod-size-pick"]:checked')?.value || 'Regular';
        const sugar = document.querySelector('input[name="mod-sugar"]:checked').value;
        
        details.push(temp);
        details.push(sizePick);
        if(sugar !== 'Normal Sugar') details.push(sugar);
        if (temp === 'Ice') {
            const ice = document.querySelector('input[name="mod-ice"]:checked').value;
            if(ice !== 'Normal Ice') details.push(ice);
        }
        document.querySelectorAll('.mod-addons-chk:checked').forEach(chk => {
            details.push(chk.value);
        });
    }

    const note = document.getElementById('mod-note').value;

    if (editingCartIndex !== null) {
        cart[editingCartIndex] = {
            item: currentModalItem,
            details: details.join(', '),
            note: note,
            price: chosenPrice,
            qty: cart[editingCartIndex].qty || 1
        };
        showToast("Pesanan di keranjang diperbarui!");
    } else {
        cart.push({
            item: currentModalItem,
            details: details.join(', '),
            note: note,
            price: chosenPrice,
            qty: 1
        });
        playFlyToCartAnimation();
        showToast(`<b>${itemName}</b><br>Berhasil masuk ke keranjang!`);
    }

    closeModal();
    updateCartUI();
    validateKopkenForm();
}

function closeModal(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
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
    const cartBtn = document.getElementById('cart-icon-btn');
    const cartIcon = document.getElementById('cart-icon');
    const badge = document.getElementById('cart-badge');
    const rect = cartBtn.getBoundingClientRect();

    const flyer = document.createElement('div');
    flyer.innerHTML = '<i class="fas fa-coffee text-white text-base"></i>';
    flyer.className = 'fixed z-[250] flex items-center justify-center w-10 h-10 bg-kenangan-primary rounded-full shadow-lg';
    flyer.style.left = '50%';
    flyer.style.top = '70%';
    flyer.style.transform = 'translate(-50%, -50%) scale(0)';
    flyer.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    document.body.appendChild(flyer);

    flyer.getBoundingClientRect();
    flyer.style.transform = 'translate(-50%, -50%) scale(1)';

    setTimeout(() => {
        flyer.style.left = `${rect.left + rect.width / 2}px`;
        flyer.style.top = `${rect.top + rect.height / 2}px`;
        flyer.style.transform = 'translate(-50%, -50%) scale(0.2)';
        flyer.style.opacity = '0';
    }, 300);

    setTimeout(() => {
        flyer.remove();
        cartIcon.classList.add('scale-125', 'text-kenangan-primary');
        badge.classList.add('scale-125');
        setTimeout(() => {
            cartIcon.classList.remove('scale-125', 'text-kenangan-primary');
            badge.classList.remove('scale-125');
        }, 200);
    }, 800);
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');
    const countText = document.getElementById('cart-item-count-text');

    let totalQty = cart.reduce((sum, c) => sum + (c.qty || 1), 0);
    countText.textContent = `${totalQty} Item`;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic text-center py-4">Keranjang masih kosong.</p>';
        badge.classList.add('hidden');
    } else {
        badge.classList.remove('hidden');
        badge.textContent = totalQty;
        container.innerHTML = '';
        
        cart.forEach((c, idx) => {
            container.innerHTML += `
                <div class="flex justify-between items-start bg-white/70 p-3 rounded-2xl border border-white">
                    <div class="flex-grow pr-2">
                        <h4 class="font-bold text-xs text-kenangan-dark">${c.item.name}</h4>
                        ${c.details ? `<p class="text-[10px] text-gray-600 mt-0.5"><i class="fas fa-sliders-h mr-1"></i>${c.details}</p>` : ''}
                        ${c.note ? `<p class="text-[10px] text-gray-500 italic mt-0.5">Catatan: "${c.note}"</p>` : ''}
                        <p class="text-xs font-bold text-kenangan-primary mt-1">${formatRp(c.price * (c.qty || 1))}</p>
                    </div>
                    <div class="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <button onclick="openModal('${c.item.id}', ${idx})" class="text-[10px] font-bold text-gray-400 hover:text-kenangan-primary cursor-pointer">
                            <i class="fas fa-pencil mr-0.5"></i> Edit
                        </button>
                        <button onclick="removeFromCart(${idx})" class="text-red-400 hover:text-red-600 text-xs p-1 cursor-pointer">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    validateKopkenForm();
    showToast("Item dihapus dari keranjang");
}

function handleBagCheckboxChange() {
    validateKopkenForm();
}

function setPickupMode(mode) {
    pickupMode = mode;
    const btnNow = document.getElementById('btn-pickup-now');
    const btnSched = document.getElementById('btn-pickup-sched');
    const pickerBox = document.getElementById('schedule-picker-box');

    if (mode === 'now') {
        btnNow.className = "py-2 px-3 rounded-xl border-2 border-kenangan-primary bg-amber-50 text-kenangan-primary font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer";
        btnSched.className = "py-2 px-3 rounded-xl border-2 border-gray-200 bg-white text-gray-600 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer";
        pickerBox.classList.add('hidden');
    } else {
        btnSched.className = "py-2 px-3 rounded-xl border-2 border-kenangan-primary bg-amber-50 text-kenangan-primary font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer";
        btnNow.className = "py-2 px-3 rounded-xl border-2 border-gray-200 bg-white text-gray-600 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer";
        pickerBox.classList.remove('hidden');
    }
}

function initScheduleDropdown() {
    const select = document.getElementById('pickup-time-select');
    if (!select) return;
    select.innerHTML = '';
    const now = getWIBDate();
    let curMin = now.getHours() * 60 + now.getMinutes();
    let startMin = Math.ceil(curMin / 15) * 15 + 15;

    for (let m = startMin; m <= 23 * 60 + 45; m += 15) {
        const hStr = String(Math.floor(m / 60)).padStart(2, '0');
        const mStr = String(m % 60).padStart(2, '0');
        select.innerHTML += `<option value="${hStr}.${mStr}">Pukul ${hStr}.${mStr}</option>`;
    }
}

function validateKopkenForm() {
    const name = document.getElementById('cust-name').value.trim();
    const wa = document.getElementById('cust-wa').value.trim();
    const btnTele = document.getElementById('btn-submit-tele-kopken');
    const btnWa = document.getElementById('btn-submit-wa-kopken');
    const closedWarning = document.getElementById('outlet-closed-warning-box');

    let subtotal = cart.reduce((sum, c) => sum + (c.price * (c.qty || 1)), 0);
    document.getElementById('summary-subtotal').textContent = formatRp(subtotal);

    let totalEstimatedReal = 0;
    cart.forEach(c => {
        const qty = c.qty || 1;
        const rPrice = c.item.realPrice || (c.price * 1.35);
        totalEstimatedReal += (rPrice * qty);
    });
    const savingsTotal = Math.max(0, Math.round(totalEstimatedReal - subtotal));
    const savingsBadge = document.getElementById('savings-badge-box');
    const savingsText = document.getElementById('savings-total-text');
    if (savingsBadge && savingsText) {
        if (savingsTotal > 0 && cart.length > 0) {
            savingsBadge.classList.remove('hidden');
            savingsText.textContent = formatRp(savingsTotal);
        } else {
            savingsBadge.classList.add('hidden');
        }
    }

    const promoTrackerText = document.getElementById('promo-tracker-text');
    const promoTrackerBadge = document.getElementById('promo-tracker-badge');
    const promoProgressBar = document.getElementById('promo-progress-bar');
    const promoUpsellWrap = document.getElementById('promo-upsell-wrapper');
    const freeBonusCard = document.getElementById('free-bonus-card');
    const freePromoDiscountRow = document.getElementById('free-promo-discount-row');

    const targetAmount = 70000;
    const progressPct = Math.min(100, Math.round((subtotal / targetAmount) * 100));
    if (promoProgressBar) promoProgressBar.style.width = progressPct + '%';

    if (subtotal >= targetAmount) {
        if (promoTrackerText) promoTrackerText.innerHTML = '🎉 <b>PROMO TERCAPAI!</b> Kamu berhak dapat <b>1x FREE Roti Coklat Klasik</b>';
        if (promoTrackerBadge) {
            promoTrackerBadge.textContent = 'UNLOCKED ✅';
            promoTrackerBadge.className = 'text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase shadow-xs';
        }
        if (promoUpsellWrap) promoUpsellWrap.classList.add('hidden');
        if (freeBonusCard) freeBonusCard.classList.remove('hidden');
        if (freePromoDiscountRow) freePromoDiscountRow.classList.remove('hidden');
    } else {
        const diff = targetAmount - subtotal;
        if (promoTrackerText) promoTrackerText.textContent = subtotal > 0 ? `Tambah ${formatRp(diff)} lagi untuk dapat GRATIS 1x Roti Coklat Klasik! 🍞` : 'Belanja min. Rp 70.000 dapat Gratis Roti Coklat Klasik!';
        if (promoTrackerBadge) {
            promoTrackerBadge.textContent = 'PROMO';
            promoTrackerBadge.className = 'text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-white uppercase shadow-xs';
        }
        if (promoUpsellWrap) promoUpsellWrap.classList.remove('hidden');
        if (freeBonusCard) freeBonusCard.classList.add('hidden');
        if (freePromoDiscountRow) freePromoDiscountRow.classList.add('hidden');
    }

    const isMall = isMallOutlet(selectedOutlet);
    const surcharge = (isMall && cart.length > 0) ? 3000 : 0;
    const surchargeRow = document.getElementById('mall-surcharge-row');
    if (surcharge > 0) surchargeRow.classList.remove('hidden');
    else surchargeRow.classList.add('hidden');

    const isBagChecked = document.getElementById('bag-checkbox').checked && currentOrderType === 'takeaway';
    const bagFee = (isBagChecked && cart.length > 0) ? 1000 : 0;
    const bagRow = document.getElementById('bag-fee-row');
    if (bagFee > 0) bagRow.classList.remove('hidden');
    else bagRow.classList.add('hidden');

    const total = subtotal + surcharge + bagFee;
    document.getElementById('summary-total').textContent = formatRp(total);

    const isOpenNow = isOutletOpenNow(selectedOutlet);
    const isSig = isSignatureOutlet(selectedOutlet);
    const isOutletValid = isOpenNow && !isSig;

    if (!isOutletValid) {
        if (closedWarning) closedWarning.classList.remove('hidden');
    } else {
        if (closedWarning) closedWarning.classList.add('hidden');
    }

    const hasBaseInfo = cart.length > 0 && name.length >= 2 && selectedOutlet && isOutletValid;
    const hasWaNumber = wa.length >= 9;

    if (hasBaseInfo) {
        btnWa.disabled = false;
        btnWa.className = "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition duration-200 flex justify-center items-center gap-2 active:scale-98 text-xs cursor-pointer";
    } else {
        btnWa.disabled = true;
        btnWa.className = "w-full bg-gray-400 text-white font-extrabold py-3.5 rounded-2xl transition duration-200 flex justify-center items-center gap-2 cursor-not-allowed text-xs";
    }

    if (hasBaseInfo && hasWaNumber) {
        btnTele.disabled = false;
        btnTele.className = "w-full bg-kenangan-dark hover:bg-kenangan-hover text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition duration-200 flex justify-center items-center gap-2 active:scale-98 text-xs cursor-pointer";
    } else if (hasBaseInfo && !hasWaNumber) {
        btnTele.disabled = false;
        btnTele.className = "w-full bg-amber-800 hover:bg-amber-900 text-amber-200 font-extrabold py-3.5 rounded-2xl shadow transition duration-200 flex justify-center items-center gap-2 text-xs cursor-pointer";
    } else {
        btnTele.disabled = true;
        btnTele.className = "w-full bg-gray-400 text-white font-extrabold py-3.5 rounded-2xl transition duration-200 flex justify-center items-center gap-2 cursor-not-allowed text-xs";
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
    showToast("✨ Racikan Pas (Ice Normal + Less Sugar 70%) diterapkan!");
}

function addUpsellRoti() {
    sfx.playSuccess();
    cart.push({
        item: {
            id: 'upsell_roti_' + Date.now(),
            name: 'Roti Coklat Klasik',
            type: 'food'
        },
        details: 'Siap Santap',
        note: 'Menu Tambahan Pengejar Promo',
        price: 10000,
        qty: 1
    });
    updateCartUI();
    validateKopkenForm();
    playFlyToCartAnimation();
    showToast("🍞 1x Roti Coklat Klasik berhasil ditambahkan!");
}

function handleKopkenCheckoutInitiation(method) {
    const name = document.getElementById('cust-name').value.trim();
    const custWaInput = document.getElementById('cust-wa').value.trim();

    if (cart.length === 0) {
        showToast("Keranjang masih kosong, pilih menu dulu ya!");
        return;
    }

    if (!isOutletOpenNow(selectedOutlet) || isSignatureOutlet(selectedOutlet)) {
        showToast("⚠️ <b>Outlet Sedang Tutup</b><br>Pemesanan hanya dapat dilakukan saat jam operasional outlet ya Kak!");
        return;
    }

    if (!name || name.length < 2) {
        showToast("Mohon isi Nama Pemesan terlebih dahulu!");
        document.getElementById('cust-name').focus();
        return;
    }

    if (method === 'telegram' && (!custWaInput || custWaInput.length < 9)) {
        showToast("⚠️ <b>Wajib Isi Nomor WhatsApp</b><br>Isi nomor WhatsApp Anda agar admin bisa kirim konfirmasi & struk pesanan!");
        const waInput = document.getElementById('cust-wa');
        waInput.focus();
        waInput.classList.add('ring-2', 'ring-amber-500');
        setTimeout(() => waInput.classList.remove('ring-2', 'ring-amber-500'), 3000);
        return;
    }

    if (isMidnightHour() && !isMidnightForced) {
        pendingCheckoutMethod = method;
        openMidnightModal(name);
        return;
    }

    submitOrderKopken(method);
}

function openMidnightModal(customerName) {
    sfx.playTap();
    const modal = document.getElementById('modal-midnight-confirm');
    const card = document.getElementById('modal-midnight-card');
    const askBtn = document.getElementById('midnight-wa-ask-btn');

    const askText = encodeURIComponent(`Halo Min, masih melek nggak? Mau order Kopi Kenangan di Bintang Store nih atas nama ${customerName || 'Saya'} ☕`);
    askBtn.href = `https://wa.me/${waNumber}?text=${askText}`;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
    }, 10);
}

function closeMidnightModal() {
    const modal = document.getElementById('modal-midnight-confirm');
    const card = document.getElementById('modal-midnight-card');
    modal.classList.add('opacity-0');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 250);
    pendingCheckoutMethod = null;
}

function confirmMidnightOrder() {
    sfx.playTap();
    isMidnightForced = true;
    closeMidnightModal();
    if (pendingCheckoutMethod) {
        submitOrderKopken(pendingCheckoutMethod);
    }
}

function getDailyWifiPassword() {
    const now = getWIBDate();
    const dayNum = now.getDate();
    return wifiPasswords[dayNum] || "TemanKenangan#01";
}

async function submitOrderKopken(method) {
    const name = document.getElementById('cust-name').value.trim();
    const custWaInput = document.getElementById('cust-wa').value.trim();
    const notes = document.getElementById('cust-notes').value.trim();
    const isBagChecked = document.getElementById('bag-checkbox').checked && currentOrderType === 'takeaway';
    
    let timeSched = '';
    if (typeof selectedOrderType !== 'undefined' && selectedOrderType === 'schedule') {
        const dayVal = document.getElementById('schedule-day')?.value || 'Hari Ini';
        const timeVal = document.getElementById('schedule-time')?.value || '12:00 WIB';
        timeSched = `📅 TERJADWAL [${dayVal.toUpperCase()}, ${timeVal}]`;
    } else if (pickupMode === 'sched') {
        const timeVal = document.getElementById('pickup-time-select')?.value || 'Nanti';
        const zoneVal = document.getElementById('pickup-timezone')?.value || 'WIB';
        timeSched = `🕒 HARI INI (Pukul ${timeVal} ${zoneVal})`;
    } else if (isMidnightHour()) {
        timeSched = '🌙 Jam Malam (Antrean Pagi 06:00 WIB)';
    } else {
        timeSched = '⚡ Segera (5-15 Menit)';
    }

    sfx.playSuccess();
    checkoutCustomerName = name || "Pelanggan";
    checkoutCustomerWa = custWaInput || "";

    let itemsText = '';
    let subtotal = 0;
    let totalAppOriginalPrice = 0;

    cart.forEach((c, i) => {
        const qty = c.qty || 1;
        const itemTotal = c.price * qty;
        subtotal += itemTotal;

        const unitOriginalPrice = c.item.realPrice || getOfficialOriginalPrice(c.item.name, c.price);
        totalAppOriginalPrice += (unitOriginalPrice * qty);

        itemsText += `${i+1}. ${qty}x ${c.item.name}\n`;
        if(c.details) itemsText += `   [Racikan: ${c.details}]\n`;
        if(c.note) itemsText += `   (Catatan: "${c.note}")\n`;
        itemsText += `   Subtotal: ${formatRp(itemTotal)}\n`;
    });

    const hasFreePromo = subtotal >= 70000;
    if (hasFreePromo) {
        itemsText += `🎁 *[BONUS PROMO]*: 1x Roti Coklat Klasik (GRATIS/FREE - Rp 0)\n`;
        totalAppOriginalPrice += 9000;
    }

    const isMall = isMallOutlet(selectedOutlet);
    const surcharge = isMall ? 3000 : 0;
    const bagFee = isBagChecked ? 1000 : 0;
    const grandTotal = subtotal + surcharge + bagFee;
    checkoutGrandTotal = grandTotal;

    let voucherRecommendationText = '';
    let voucherIcon = '🏷️';
    if (totalAppOriginalPrice >= 70000) {
        voucherIcon = '🔥';
        voucherRecommendationText = `<b>👉 PAKE VOUCHER MIN. 70K</b> (Total asli ${formatRp(totalAppOriginalPrice)} memenuhi syarat kupon 70k. Cuan maksimal!)`;
    } else if (totalAppOriginalPrice >= 50000) {
        voucherIcon = '⚡';
        voucherRecommendationText = `<b>👉 PAKE VOUCHER MIN. 50K</b> (Total asli ${formatRp(totalAppOriginalPrice)} memenuhi syarat kupon 50k)`;
    } else {
        voucherIcon = '💡';
        voucherRecommendationText = `<b>👉 PAKE VOUCHER TANPA MIN. BELANJA</b> (Total asli ${formatRp(totalAppOriginalPrice)}. Pakai kupon diskon persen/flat)`;
    }

    saveOrderToHistory({
        id: 'ord_' + Date.now(),
        date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        outletName: selectedOutlet.name,
        orderType: currentOrderType,
        itemsSummary: cart.map(c => `${c.item.name} (${c.qty || 1}x)`).join(', ') + (hasFreePromo ? ' + FREE Roti Coklat' : ''),
        cartData: JSON.parse(JSON.stringify(cart)),
        outletObj: { ...selectedOutlet },
        grandTotal: grandTotal
    });

    const orderTypeText = currentOrderType === 'takeaway' ? 'Take Away (Bungkus)' : 'Dine In (Minum Ditempat)';
    let cleanWaNumber = custWaInput ? custWaInput.replace(/[^0-9]/g, '') : '';
    if (cleanWaNumber.startsWith('0')) cleanWaNumber = '62' + cleanWaNumber.slice(1);
    else if (!cleanWaNumber.startsWith('62') && cleanWaNumber.length > 0) cleanWaNumber = '62' + cleanWaNumber;

    const waDirectLink = cleanWaNumber ? `https://wa.me/${cleanWaNumber}` : '-';

    const autoSched = checkAdminSchedule();
    let adminStatusHeader = '';

    if (autoSched.isBusy) {
        adminStatusHeader = `⏳ <b>[ADMIN SEDANG AGENDA LUAR - PROSES MULAI ${autoSched.availableAt} WIB]</b>\n`;
    } else if (currentAdminStoreStatus === 'busy' || localStorage.getItem('adminManualBusy') === 'true') {
        adminStatusHeader = '🟡 <b>[STATUS TOKO: ADMIN SEDANG SIBUK / SLOW RESPONSE (15-30 MNT)]</b>\n';
    }

    const telegramSummaryBubble = `── .✦ <b>ORDER KOPI KENANGAN BARU</b> ✦.──
${adminStatusHeader}${isMidnightHour() ? '🌙 <b>[PERINGATAN: ORDER JAM MALAM / ANTREAN PAGI]</b>\n' : ''}
👤 <b>Nama Pemesan :</b> ${name}
📱 <b>No. WhatsApp :</b> ${custWaInput || 'Via WhatsApp Chat'}
🔗 <b>Chat Customer :</b> <a href="${waDirectLink}">${waDirectLink}</a>
🛵 <b>Tipe Pesanan :</b> ${orderTypeText}
📍 <b>Outlet :</b> ${selectedOutlet.name}
🏢 <b>Alamat :</b> ${selectedOutlet.address || '-'}
⏰ <b>Waktu Ambil :</b> ${timeSched}
📝 <b>Catatan :</b> "${notes || '-'}"
--------------------------------------------------
📋 <b>Detail Item :</b>
${itemsText}--------------------------------------------------
${hasFreePromo ? '🎁 <b>Bonus Promo:</b> 1x Roti Coklat Klasik (FREE)\n' : ''}Biaya Outlet (Mall) : ${formatRp(surcharge)}
${isBagChecked ? 'Kantong Belanja : Rp 1.000\n' : ''}💰 <b>TOTAL TAGIHAN CUSTOMER : ${formatRp(grandTotal)}</b>
🏷️ <b>Total Nilai Asli Aplikasi : ${formatRp(totalAppOriginalPrice)}</b>

${voucherIcon} <b>REKOMENDASI VOUCHER KASIR:</b>
${voucherRecommendationText}

📌 <b>Status : [MENUNGGU PEMBAYARAN QRIS]</b>`;

    const draftChat1 = `<code>Halo Kak ${name}! 🫶✨
Terima kasih sudah order Kopi Kenangan di Bintang Store!

📋 Rincian Pesanan:
${itemsText}📍 Outlet: ${selectedOutlet.name}
${hasFreePromo ? '🎁 Bonus Promo: 1x Roti Coklat Klasik (FREE)\n' : ''}💰 Total Tagihan Pas: ${formatRp(grandTotal)}

Silakan scan / transfer via QRIS kami ya Kak. Setelah berhasil, kirim bukti transfer ke sini agar langsung kami proseskan ke kasir! Ditunggu ya Kak! 🫰💖</code>`;

    const draftChatAutoProses = `<code>Terima kasih banyak Kak ${name}! Pembayaran sebesar ${formatRp(grandTotal)} sudah kami terima ☕✨

Pesananmu sedang langsung kami proseskan ke kasir outlet ${selectedOutlet.name} yaa! Mohon ditunggu sebentar ya Kak 🫶</code>`;

    const waRawMessage = `── .✦ *ORDER KOPI KENANGAN BARU* ✦.──
${autoSched.isBusy ? `⏳ *[ADMIN AGENDA LUAR - PROSES MULAI ${autoSched.availableAt} WIB]*\n` : (currentAdminStoreStatus === 'busy' ? '🟡 *[STATUS: ADMIN SEDANG SIBUK (15-30 MNT)]*\n' : '')}${isMidnightHour() ? '🌙 *[ORDER JAM MALAM / ANTREAN PAGI]*\n' : ''}
👤 *Nama Pemesan :* ${name}
📱 *No. WhatsApp :* ${custWaInput || '-'}
🛵 *Tipe Pesanan :* ${orderTypeText}
📍 *Outlet Pengambilan :* ${selectedOutlet.name}
🏢 *Alamat Outlet :* ${selectedOutlet.address || '-'}
⏰ *Waktu Ambil :* ${timeSched}
📝 *Catatan Tambahan :* "${notes || '-'}"
--------------------------------------------------
📋 *Detail Item:*
${itemsText}--------------------------------------------------
${hasFreePromo ? '🎁 *Bonus Promo:* 1x Roti Coklat Klasik (FREE)\n' : ''}Biaya Outlet (Mall) : ${formatRp(surcharge)}
${isBagChecked ? 'Kantong Belanja : Rp 1.000\n' : ''}💰 *Total Tagihan Final : ${formatRp(grandTotal)}*
🏷️ *Nilai Asli Aplikasi : ${formatRp(totalAppOriginalPrice)}*
📌 *Status : [MENUNGGU PEMBAYARAN QRIS]*`;

    if (method === 'telegram') {
        const btn = document.getElementById('btn-submit-tele-kopken');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin text-sm"></i> Memproses...';
        btn.disabled = true;

        const ok1 = await sendSingleTelegramMsg(telegramSummaryBubble);
        await delay(400);
        const ok2 = await sendSingleTelegramMsg(draftChat1);
        await delay(400);
        const ok3 = await sendSingleTelegramMsg(`👇 <b>[TEMPLATE BALASAN JIKA CUSTOMER SUDAH TRANSFER]</b>\n(Cukup tap teks di bawah untuk salin otomatis):\n\n${draftChatAutoProses}`);

        if (ok1 || ok2 || ok3) {
            showFullscreenLoader('kopken', false, '');
            cart = [];
            updateCartUI();
            document.getElementById('cust-name').value = '';
            document.getElementById('cust-wa').value = '';
            document.getElementById('cust-notes').value = '';
            isMidnightForced = false;
        } else {
            showToast("Gagal kirim ke bot, silakan gunakan opsi WA.");
        }

        btn.innerHTML = '<i class="fas fa-bolt text-sm"></i> Pesan Otomatis (Proses Cepat via Bot)';
        validateKopkenForm();
    } else if (method === 'whatsapp') {
        sendSingleTelegramMsg(telegramSummaryBubble);
        await delay(300);
        sendSingleTelegramMsg(`👇 <b>[TEMPLATE BALASAN JIKA SUDAH TRANSFER]</b>:\n\n${draftChatAutoProses}`);

        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waRawMessage)}`;
        showFullscreenLoader('kopken', true, waUrl);
        isMidnightForced = false;
    }
}

async function notifyAdminPaymentDone() {
    sfx.playSuccess();
    const btn = document.getElementById('btn-confirm-notify-admin');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin text-xs"></i> Mengirim Notifikasi...';
    btn.disabled = true;

    let cleanWa = checkoutCustomerWa ? checkoutCustomerWa.replace(/[^0-9]/g, '') : '';
    if (cleanWa.startsWith('0')) cleanWa = '62' + cleanWa.slice(1);
    else if (!cleanWa.startsWith('62') && cleanWa.length > 0) cleanWa = '62' + cleanWa;
    const waLink = cleanWa ? `https://wa.me/${cleanWa}` : '-';

    const dailyWifi = getDailyWifiPassword();

    const draftProsesWifi = `Terima kasih banyak Kak ${checkoutCustomerName}! Pembayaran sebesar ${formatRp(checkoutGrandTotal)} sudah kami terima ☕✨

Orderan sedang kami proseskan ke kasir yaa!

📶 INFO WIFI OUTLET HARI INI:
• SSID : Teman Kenangan
• User : kopikenangan
• Pass : ${dailyWifi}

Mohon ditunggu sebentar ya Kak! 🫶`;

    const draftSelesai = `Pesanan Kak ${checkoutCustomerName} sudah selesai diproses ke kasir ya! ✨

📌 Cara Pengambilan:
Cukup sebutkan nama "${checkoutCustomerName}" ke barista di outlet.

Selamat menikmati dan terima kasih sudah jajan di Bintang Store! Ditunggu orderan berikutnya ya Kak! 🫰☕`;

    const notifyBubble1 = `🔔 <b>KONFIRMASI: CUSTOMER SUDAH TRANSFER!</b> 🔔
--------------------------------------------------
👤 <b>Nama :</b> ${checkoutCustomerName}
📱 <b>No. WhatsApp :</b> ${checkoutCustomerWa || '-'}
🔗 <b>Hubungi Customer :</b> <a href="${waLink}">${waLink}</a>
💰 <b>Total Tagihan :</b> ${formatRp(checkoutGrandTotal)}
--------------------------------------------------
Customer telah menekan tombol <b>SUDAH TRANSFER</b>.
Balon di bawah ini bisa langsung disalin / diteruskan ke customer! ⚡`;

    const ok1 = await sendSingleTelegramMsg(notifyBubble1);
    await delay(400);
    const ok2 = await sendSingleTelegramMsg(draftProsesWifi);
    await delay(400);
    const ok3 = await sendSingleTelegramMsg(draftSelesai);

    if (ok1 || ok2 || ok3) {
        btn.className = "w-full bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5";
        btn.innerHTML = '<i class="fas fa-check-double text-xs"></i> Notifikasi Terkirim ke Admin!';
        showToast(`<b>Pembayaran Dikonfirmasi!</b><br>Admin sedang mengecek mutasi dan akan menghubungi WhatsApp kamu jika pesanan sudah diproses 🫶`);
    } else {
        showToast("Koneksi gagal, silakan konfirmasi lewat tombol WhatsApp di atas.");
        btn.innerHTML = '<i class="fas fa-circle-check text-emerald-400 text-sm"></i> ✅ Sudah Transfer (Beri Tahu Admin)';
        btn.disabled = false;
    }
}

function saveOrderToHistory(orderObj) {
    let history = JSON.parse(localStorage.getItem('bintang_order_history') || '[]');
    history.unshift(orderObj);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('bintang_order_history', JSON.stringify(history));
}

function openHistoryModal() {
    renderOrderHistory();
    const modal = document.getElementById('modal-history');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
}

function closeHistoryModal() {
    const modal = document.getElementById('modal-history');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 250);
}

function renderOrderHistory() {
    const container = document.getElementById('history-items-list');
    const history = JSON.parse(localStorage.getItem('bintang_order_history') || '[]');

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

    closeHistoryModal();
    switchView('kopken');
    updateOutletUI();
    updateCartUI();
    validateKopkenForm();
    scrollToCart();
    showToast("Pesanan sebelumnya berhasil dimuat ke keranjang!");
}

function clearOrderHistory() {
    localStorage.removeItem('bintang_order_history');
    renderOrderHistory();
    showToast("Riwayat pesanan berhasil dibersihkan");
}

function initWifiDisplay() {
    const pass = getDailyWifiPassword();
    const wifiPassEl = document.getElementById('wifi-pass-text');
    if (wifiPassEl) wifiPassEl.textContent = pass;
}

function toggleWifiModal(show) {
    const modal = document.getElementById('modal-wifi');
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    } else {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 250);
    }
}

function copyWifiPass() {
    const pass = document.getElementById('wifi-pass-text').textContent;
    navigator.clipboard.writeText(pass);
    showToast("Password WiFi berhasil disalin!");
}

function showToast(message) {
    const container = document.getElementById('toast-container');
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

function showFullscreenLoader(type, isWaRedirect, waUrl) {
    const screen = document.getElementById('thankyou-screen');
    const content = document.getElementById('thankyou-content');
    const quoteEl = document.getElementById('thankyou-quote');
    const titleEl = document.getElementById('thankyou-title');
    const iconWrap = document.getElementById('thankyou-icon-wrapper');

    if (type === 'kopken') {
        iconWrap.innerHTML = '<i class="fas fa-coffee text-4xl text-amber-400 animate-bounce"></i>';
        titleEl.textContent = "Pesanan Dirangkai!";
        quoteEl.innerHTML = "Beli kopi buat begadang, terima kasih sudah memesan! Pesananmu segera diproses sayang! ☕ 🫶";
    }

    screen.classList.remove('hidden');
    setTimeout(() => screen.classList.remove('opacity-0'), 10);
    setTimeout(() => {
        content.classList.remove('scale-75', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 100);

    setTimeout(() => {
        if (isWaRedirect) {
            window.open(waUrl, '_blank');
        } else {
            showPaymentPopup();
        }

        setTimeout(() => {
            screen.classList.add('opacity-0');
            content.classList.remove('scale-100', 'opacity-100');
            content.classList.add('scale-75', 'opacity-0');
            setTimeout(() => screen.classList.add('hidden'), 400);
        }, 800);
    }, 5000);
}

function showPaymentPopup() {
    const popupTotal = document.getElementById('popup-total-tagihan');
    if (popupTotal) popupTotal.textContent = formatRp(checkoutGrandTotal);

    const message = `Halo Admin, saya sudah transfer pesanan via QRIS atas nama *${checkoutCustomerName}* dengan total tagihan pas *${formatRp(checkoutGrandTotal)}*.\n\nBerikut bukti transfer saya, tolong segera diproses ya Kak! 🫶✨`;
    const encoded = encodeURIComponent(message);
    const waLink = document.getElementById('payment-wa-link');
    if (waLink) waLink.href = `https://wa.me/${waNumber}?text=${encoded}`;

    const popup = document.getElementById('payment-popup');
    const popupContent = document.getElementById('payment-popup-content');
    popup.classList.remove('hidden');
    setTimeout(() => {
        popup.classList.remove('opacity-0');
        popupContent.classList.remove('scale-95');
        popupContent.classList.add('scale-100');
    }, 10);
}

function copyPopupNominal() {
    if (!checkoutGrandTotal) return;
    const textToCopy = checkoutGrandTotal.toString();
    const tempInput = document.createElement('textarea');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Nominal <b>${formatRp(checkoutGrandTotal)}</b> berhasil disalin!`);
}

function closePaymentPopup() {
    sfx.playTap();
    const popup = document.getElementById('payment-popup');
    const popupContent = document.getElementById('payment-popup-content');
    popup.classList.add('opacity-0');
    popupContent.classList.remove('scale-100');
    popupContent.classList.add('scale-95');
    setTimeout(() => popup.classList.add('hidden'), 250);
}

function closeCustomRequestModal() {
    const modal = document.getElementById('modal-custom-req');
    const card = document.getElementById('modal-custom-req-card');
    modal.classList.add('opacity-0');
    card.classList.remove('scale-100');
    card.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 250);
}

let reqCurrentItemType = 'drink';

function setReqItemType(type) {
    reqCurrentItemType = type;
    const btnDrink = document.getElementById('btn-req-type-drink');
    const btnFood = document.getElementById('btn-req-type-food');
    const drinkOptionsBox = document.getElementById('req-drink-options-box');

    if (type === 'drink') {
        btnDrink.className = "py-2 px-3 rounded-xl border-2 border-kenangan-primary bg-amber-50 text-kenangan-primary font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer";
        btnFood.className = "py-2 px-3 rounded-xl border-2 border-gray-200 bg-white text-gray-600 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer";
        drinkOptionsBox.classList.remove('hidden');
    } else {
        btnFood.className = "py-2 px-3 rounded-xl border-2 border-kenangan-primary bg-amber-50 text-kenangan-primary font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer";
        btnDrink.className = "py-2 px-3 rounded-xl border-2 border-gray-200 bg-white text-gray-600 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer";
        drinkOptionsBox.classList.add('hidden');
    }
}

function toggleReqIce() {
    const temp = document.querySelector('input[name="req-temp"]:checked')?.value;
    const iceWrapper = document.getElementById('req-ice-wrapper');
    if (iceWrapper) {
        if (temp === 'Hot') iceWrapper.classList.add('opacity-40', 'pointer-events-none');
        else iceWrapper.classList.remove('opacity-40', 'pointer-events-none');
    }
}

function validateCustomReqForm() {
    const name = document.getElementById('req-menu-name').value.trim();
    const btn = document.getElementById('btn-save-custom-req');
    if (name.length >= 2) {
        btn.disabled = false;
        btn.className = "w-full bg-kenangan-dark hover:bg-kenangan-hover text-white font-extrabold py-3.5 rounded-2xl shadow-md transition duration-200 flex justify-center items-center gap-2 text-xs active:scale-98 cursor-pointer";
    } else {
        btn.disabled = true;
        btn.className = "w-full bg-gray-300 text-gray-500 font-extrabold py-3.5 rounded-2xl transition duration-200 flex justify-center items-center gap-2 cursor-not-allowed text-xs";
    }
}

function addCustomRequestToCart() {
    const name = document.getElementById('req-menu-name').value.trim();
    if (!name) return;

    let price = parseFloat(document.getElementById('req-menu-price').value) || 15000;
    const note = document.getElementById('req-menu-note').value.trim();
    let details = ['[REQUEST KUSTOM]'];

    if (reqCurrentItemType === 'drink') {
        const temp = document.querySelector('input[name="req-temp"]:checked')?.value || 'Ice';
        const size = document.querySelector('input[name="req-size"]:checked')?.value || 'Regular';
        const sugar = document.getElementById('req-sugar').value;
        const ice = document.getElementById('req-ice').value;

        details.push(temp);
        details.push(size);
        if (sugar !== 'Normal Sugar') details.push(sugar);
        if (temp === 'Ice' && ice !== 'Normal Ice') details.push(ice);
    } else {
        details.push('Roti/Makanan');
    }

    cart.push({
        item: {
            id: 'custom_req_' + Date.now(),
            name: `✍️ [Request] ${name}`,
            isCustom: true
        },
        details: details.join(', '),
        note: note,
        price: price,
        qty: 1
    });

    closeCustomRequestModal();
    updateCartUI();
    validateKopkenForm();
    playFlyToCartAnimation();
    showToast(`Request <b>${name}</b> berhasil dimasukkan ke keranjang!`);
}

function openCustomRequestModal(keyword = '') {
    const modal = document.getElementById('modal-custom-req');
    const card = document.getElementById('modal-custom-req-card');
    const nameInput = document.getElementById('req-menu-name');
    nameInput.value = keyword || '';
    document.getElementById('req-menu-price').value = '';
    document.getElementById('req-menu-note').value = '';
    setReqItemType('drink');
    validateCustomReqForm();

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
        nameInput.focus();
    }, 10);
}

// Inisialisasi Aplikasi Saat Load
document.addEventListener('DOMContentLoaded', async () => {
    initWifiDisplay();
    initScheduleDropdown();
    checkNightHours();
    initSocialProofTicker();
    updateBusyStatusUI();
    setInterval(updateBusyStatusUI, 60000);
    await fetchStoreAdminStatus();
    await loadDataFiles();
    renderMenu();

    const initialHash = window.location.hash.replace('#', '') || 'portal';
    if (['portal', 'kopken', 'tomoro'].includes(initialHash)) {
        history.replaceState({ view: initialHash }, '', '#' + initialHash);
        switchView(initialHash, false);
    } else {
        history.replaceState({ view: 'portal' }, '', '#portal');
        switchView('portal', false);
    }

    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.view) {
            switchView(e.state.view, false);
        } else {
            switchView('portal', false);
        }
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

// Blokir Klik Kanan, Inspect & Drag
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

document.addEventListener('keydown', function (e) {
    if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return false;
    }
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        return false;
    }
    if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        return false;
    }
});

document.addEventListener('dragstart', function (e) {
    if (e.target.tagName.toLowerCase() === 'img') {
        e.preventDefault();
    }
});

// Cosmic Burst Animation
document.body.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, input, select, a, .cursor-pointer')) return;
    createCosmicBurst(e.clientX, e.clientY);
});

function createCosmicBurst(x, y) {
    const colors = ['#E8A359', '#38BDF8', '#A05C3A', '#ffffff', '#EA580C'];
    for(let i=0; i<8; i++) {
        const particle = document.createElement('i');
        const isStar = Math.random() > 0.4;
        particle.className = `fas ${isStar ? 'fa-star' : 'fa-circle'} fixed pointer-events-none z-[300] text-xs`;
        particle.style.color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 4;
        const tx = Math.cos(angle) * velocity * 12;
        const ty = Math.sin(angle) * velocity * 12;
        
        document.body.appendChild(particle);
        
        if(particle.animate) {
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 500 + Math.random() * 300,
                easing: 'cubic-bezier(0.1, 0.8, 0.25, 1)'
            }).onfinish = () => particle.remove();
        } else {
            setTimeout(() => particle.remove(), 800);
        }
    }
}
