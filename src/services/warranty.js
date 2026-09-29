import { supabaseClient } from "../core/supabase.js";

async function getWarranty(orderId) {
  if (!orderId) throw new Error("Order ID tidak ditemukan.");

  const { data, error } = await supabaseClient
    .from("digital_subscriptions")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function submitWarrantyClaim({ orderId, issue }) {
  if (!orderId) throw new Error("Order ID tidak ditemukan.");
  if (!issue || issue.trim().length < 5) {
    throw new Error("Keluhan garansi belum diisi.");
  }

  const { data, error } = await supabaseClient
    .from("digital_subscriptions")
    .update({
      warranty_status: "klaim_garansi",
      warranty_notes: issue
    })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export {
  getWarranty,
  submitWarrantyClaim
};
