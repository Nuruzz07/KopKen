import { createOrder } from "../../services/orders.js";
import { saveMember } from "../../services/members.js";
import { buildOrderData } from "./order-builder.js";
import { validateCheckout } from "./validation.js";

async function processCheckout(data) {
  const validation = validateCheckout(data);

  if (!validation.valid) {
    throw new Error(validation.message);
  }

  if (
    data.registerMember &&
    data.memberCode &&
    data.memberCode.length >= 2
  ) {
    try {
      await saveMember({
        memberCode: data.memberCode,
        customerName: data.name,
        customerPhone: data.cleanWa,
        outletName: data.outlet?.name || ""
      });
    } catch (error) {
      console.warn("Gagal simpan member baru:", error);
    }
  }

  const orderData = buildOrderData(data);
  const order = await createOrder(orderData);

  return order;
}

export {
  processCheckout
};
