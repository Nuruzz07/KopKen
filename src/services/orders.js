import { supabaseClient } from "../core/supabase.js";

async function createOrder(orderData) {
  const { data, error } = await supabaseClient
    .from("orders")
    .upsert([orderData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function getOrder(orderId) {
  const { data, error } = await supabaseClient
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) throw error;
  return data;
}

async function updateOrder(orderId, updates) {
  const { data, error } = await supabaseClient
    .from("orders")
    .update(updates)
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export {
  createOrder,
  getOrder,
  updateOrder
};
