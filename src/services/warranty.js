import { supabaseClient } from "../core/supabase.js";

async function getWarranty(orderId) {
  if (!orderId) throw new Error("Order ID tidak ditemukan.");

  const { data, error } = await supabaseClient
    .from("digital_subscriptions")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

async function submitWarrantyClaim({
  orderId,
  issue
}) {
  if (!orderId) throw new Error("Order ID tidak ditemukan.");
  if (!issue || issue.trim().length < 3) {
    throw new Error("Keluhan garansi belum diisi.");
  }

  const { data, error } = await supabaseClient
    .from("digital_subscriptions")
    .update({
      status: "claim"
    })
    .eq("order_id", orderId)
    .select()
    .single();

  if (error) throw error;

  return {
    subscription: data,
    issue
  };
}

export {
  getWarranty,
  submitWarrantyClaim
};
