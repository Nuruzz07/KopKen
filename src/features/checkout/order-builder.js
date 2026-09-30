function normalizeWhatsApp(phone) {
  let clean = String(phone || "").replace(/[^0-9]/g, "");

  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  } else if (clean && !clean.startsWith("62")) {
    clean = "62" + clean;
  }

  return clean;
}

function generateOrderId(name) {
  const rawClean =
    String(name || "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase() || "order";

  return `${rawClean}-${Date.now().toString().slice(-4)}`;
}

function buildOrderData({
  orderId,
  orderId,
  name,
  phone,
  outlet,
  orderType,
  deliveryFee,
  deliveryAddress,
  deliveryMaps,
  cart,
  grandTotal
}) {
  const cleanWa = normalizeWhatsApp(phone);
  const finalOrderId = orderId || generateOrderId(name);

  return {
    id: finalOrderId,
    customer_name: name,
    customer_wa: cleanWa,
    outlet_name: outlet?.name || "Kopi Kenangan",
    order_type: orderType,
    delivery_fee: orderType === "delivery" ? deliveryFee : 0,
    delivery_address:
      orderType === "delivery" ? deliveryAddress : null,
    delivery_maps_url:
      orderType === "delivery" && deliveryMaps
        ? deliveryMaps
        : null,
    order_items: cart,
    total_price: grandTotal,
    estimated_profit: Math.round(grandTotal * 0.35),
    status: "menunggu_pembayaran"
  };
}

export {
  normalizeWhatsApp,
  generateOrderId,
  buildOrderData
};


