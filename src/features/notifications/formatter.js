function formatOrderNotification({
  orderId,
  customerName,
  customerWa,
  outletName,
  orderType,
  deliveryFee = 0,
  deliveryAddress,
  deliveryMaps,
  cart = [],
  grandTotal,
  trackingUrl
}) {
  const items = cart.map((item, index) => {
    const name = item.name || item.item?.name || "Menu";
    const qty = Number(item.qty) || 1;
    const price = (Number(item.price) || 0) * qty;

    const details =
      item.details ||
      item.note ||
      (item.options && typeof item.options === "object"
        ? Object.entries(item.options)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : "");

    return [
      `<b>${index + 1}. ${qty}x ${name}</b> — Rp ${price.toLocaleString("id-ID")}`,
      details ? `   └ <i>${details}</i>` : ""
    ].filter(Boolean).join("\n");
  }).join("\n\n");

  const delivery = orderType === "delivery"
    ? [
        "DELIVERY",
        `Ongkir: Rp ${Number(deliveryFee).toLocaleString("id-ID")}`,
        `Alamat: ${deliveryAddress || "-"}`,
        deliveryMaps ? `Maps: ${deliveryMaps}` : ""
      ].filter(Boolean).join("\n")
    : String(orderType || "TAKEAWAY").toUpperCase();

  return [
    "<b>BINTANG STORE</b>",
    "━━━━━━━━━━━━━━━━",
    "<b>PESANAN BARU</b>",
    "",
    `<b>ID:</b> ${orderId}`,
    `<b>Nama:</b> ${customerName}`,
    `<b>WhatsApp:</b> ${customerWa}`,
    "",
    `<b>OUTLET</b>`,
    outletName || "Kopi Kenangan",
    "",
    "<b>PESANAN</b>",
    items || "-",
    "",
    "<b>PENGIRIMAN</b>",
    delivery,
    "",
    "<b>TOTAL</b>",
    `Rp ${Number(grandTotal || 0).toLocaleString("id-ID")}`,
    "",
    `<b>Tracking:</b> ${trackingUrl || "-"}`,
    "",
    "<b>Status:</b> Menunggu pembayaran",
    "━━━━━━━━━━━━━━━━"
  ].join("\n");
}

export { formatOrderNotification };
