const fs = require('fs');

const kopkenHtml = fs.readFileSync('c:/BOT_WEB/KopKen-main/kopken.html', 'utf8');
const homeHtml = fs.readFileSync('c:/BOT_WEB/KopKen-main/home.html', 'utf8');
const trackingHtml = fs.readFileSync('c:/BOT_WEB/KopKen-main/tracking.html', 'utf8');
const appJs = fs.readFileSync('c:/BOT_WEB/KopKen-main/app.js', 'utf8');

console.log('--- CHECK 1: ROUTING & FILE RENAMING ---');
console.log('home.html has ./kopken.html:', (homeHtml.match(/href="\.\/kopken\.html"/g) || []).length === 5);
console.log('home.html has NO ./kopken/:', !homeHtml.includes('href="./kopken/"'));
console.log('kopken.html has back button to home.html:', kopkenHtml.includes('href="./home.html"'));

console.log('--- CHECK 2: CHECKOUT BOTTOM SHEET MODAL ---');
console.log('kopken.html has NO redirect to checkout.html:', !kopkenHtml.includes('checkout.html'));
console.log('kopken.html CTA button has Lanjut ke Pembayaran QRIS:', kopkenHtml.includes('Lanjut ke Pembayaran QRIS'));
console.log('kopken.html redirects to tracking.html on order:', kopkenHtml.includes('tracking.html?order_id='));

console.log('--- CHECK 3: TRACKING.HTML CLEANUP ---');
console.log('tracking.html has NO review-card:', !trackingHtml.includes('id="review-card"'));
console.log('tracking.html has NO review-form:', !trackingHtml.includes('id="review-form"'));
console.log('tracking.html has NO review-comment:', !trackingHtml.includes('id="review-comment"'));
console.log('tracking.html has qris-payment-card:', trackingHtml.includes('id="qris-payment-card"'));
console.log('tracking.html has queue-box:', trackingHtml.includes('id="queue-box"'));
console.log('tracking.html has confirmation timer:', trackingHtml.includes('id="confirmation-timer-card"'));

console.log('--- CHECK 4: DRINK CUSTOMIZATION MODAL (app.js) ---');
console.log('app.js has Racikan Pas #FFFDF8:', appJs.includes('#FFFDF8'));
console.log('app.js has subtle amber border #FDE68A:', appJs.includes('#FDE68A'));
console.log('app.js has apply button bg-[#9C4221]:', appJs.includes('bg-[#9C4221]'));
console.log('app.js has Iced peer-checked:bg-stone-900:', appJs.includes('peer-checked:bg-stone-900'));
console.log('app.js has note input border-[#E7E5E4]:', appJs.includes('border-[#E7E5E4]'));

console.log('=== ALL CHECKS FINISHED ===');
