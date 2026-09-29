const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const server = http.createServer(async (req, res) => {
  if (req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ ok: true, service: "bintang-store" }));
  }

  if (req.url === "/api/notifications/telegram" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const data = JSON.parse(body);

        if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
          throw new Error("Telegram backend belum dikonfigurasi.");
        }

        const response = await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: data.message || "",
              parse_mode: "HTML",
              disable_web_page_preview: true,
              reply_markup: data.reply_markup
            })
          }
        );

        const result = await response.json();

        res.writeHead(response.ok ? 200 : 500, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          ok: false,
          error: error.message
        }));
      }
    });

    return;
  }

  if (req.url === "/api/notifications/telegram/photo" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const data = JSON.parse(body);

        if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
          throw new Error("Telegram backend belum dikonfigurasi.");
        }

        const response = await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              photo: data.photo,
              caption: data.caption || "",
              parse_mode: "HTML",
              reply_markup: data.reply_markup
            })
          }
        );

        const result = await response.json();

        res.writeHead(response.ok ? 200 : 500, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
          ok: false,
          error: error.message
        }));
      }
    });

    return;
  }

  let filePath = decodeURIComponent(req.url.split("?")[0]);

  if (filePath === "/") filePath = "/index.html";

  const fullPath = path.join(process.cwd(), filePath);

  if (!fullPath.startsWith(process.cwd())) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not Found");
    }

    const ext = path.extname(fullPath).toLowerCase();

    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream"
    });

    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Bintang Store backend berjalan di http://localhost:${PORT}`);
});
