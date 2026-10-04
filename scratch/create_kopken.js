const fs = require('fs');

let c = fs.readFileSync('c:/BOT_WEB/KopKen-main/kopken/index.html', 'utf8');
c = c.split('href="../home.html"').join('href="./home.html"');
c = c.split('href="../tracking.html"').join('href="./tracking.html"');
c = c.split('`../tracking.html?order_id=').join('`./tracking.html?order_id=');
c = c.split('`../tracking.html`').join('`./tracking.html`');

fs.writeFileSync('c:/BOT_WEB/KopKen-main/kopken.html', c, 'utf8');
console.log('SUCCESS: kopken.html written, bytes:', fs.statSync('c:/BOT_WEB/KopKen-main/kopken.html').size);
