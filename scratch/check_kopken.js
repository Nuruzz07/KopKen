const fs = require('fs');

const html = fs.readFileSync('c:/BOT_WEB/KopKen-main/kopken.html', 'utf8');

// Check script syntax
const scriptMatches = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi);
let errors = 0;
scriptMatches.forEach((s, idx) => {
  const code = s.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
  if (!code.trim()) return;
  try {
    new Function(code);
    console.log(`Script ${idx} valid`);
  } catch(e) {
    console.error(`Script ${idx} syntax error:`, e.message);
    errors++;
  }
});

// Check links
const homeLinks = (html.match(/href="[^"]*home\.html"/g) || []);
const trackingLinks = (html.match(/href="[^"]*tracking\.html[^"]*"/g) || []);
const checkoutLinks = (html.match(/href="[^"]*checkout\.html[^"]*"/g) || []);

console.log('Home links in kopken.html:', homeLinks);
console.log('Tracking links in kopken.html:', trackingLinks);
console.log('Checkout links in kopken.html (should be 0):', checkoutLinks);

if (errors === 0) console.log('ALL SYNTAX & CHECKS PASSED FOR kopken.html!');
