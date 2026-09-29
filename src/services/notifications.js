async function sendTelegramNotification(message, options = {}) {
  const response = await fetch("/api/notifications/telegram", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      ...options
    })
  });

  if (!response.ok) {
    throw new Error("Gagal mengirim notifikasi Telegram.");
  }

  return response.json();
}

async function sendWhatsAppNotification(message, options = {}) {
  const response = await fetch("/api/notifications/whatsapp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      ...options
    })
  });

  if (!response.ok) {
    throw new Error("Gagal mengirim notifikasi WhatsApp.");
  }

  return response.json();
}

export {
  sendTelegramNotification,
  sendWhatsAppNotification
};
