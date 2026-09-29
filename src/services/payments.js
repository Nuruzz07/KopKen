import { supabaseClient } from "../core/supabase.js";

async function uploadPaymentProof(file, orderId) {
  if (!file) throw new Error("Bukti pembayaran belum dipilih.");
  if (!orderId) throw new Error("Order ID tidak ditemukan.");

  const ext = file.name.split(".").pop().toLowerCase();
  const filePath = `payment-proofs/${orderId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("receipts")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type
    });

  if (uploadError) throw uploadError;

  const { data: publicData } = supabaseClient.storage
    .from("receipts")
    .getPublicUrl(filePath);

  const receiptUrl = publicData.publicUrl;

  const { data, error } = await supabaseClient
    .from("orders")
    .update({
      receipt_image_url: receiptUrl
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

async function markPaymentSubmitted(orderId) {
  const { data, error } = await supabaseClient
    .from("orders")
    .update({
      status: "menunggu_verifikasi"
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export { uploadPaymentProof, markPaymentSubmitted };
