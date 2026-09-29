import { supabaseClient } from "../core/supabase.js";

async function submitRefund({
  orderId,
  bank,
  accountNumber,
  accountHolder
}) {
  if (!orderId) throw new Error("Order ID tidak ditemukan.");
  if (!bank || !accountNumber || !accountHolder) {
    throw new Error("Data refund belum lengkap.");
  }

  const refundNote =
    `Pengajuan Refund: ${bank} - ${accountNumber} a/n ${accountHolder}`;

  const { data, error } = await supabaseClient
    .from("orders")
    .update({
      status: "dibatalkan_pelanggan",
      review: refundNote
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export { submitRefund };
