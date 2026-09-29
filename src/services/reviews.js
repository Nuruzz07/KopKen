import { supabaseClient } from "../core/supabase.js";

async function submitReview({
  orderId,
  rating,
  comment,
  photoUrl = null
}) {
  if (!orderId) throw new Error("Order ID tidak ditemukan.");

  const score = Number(rating);

  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new Error("Rating harus antara 1 sampai 5.");
  }

  const { data, error } = await supabaseClient
    .from("reviews")
    .insert({
      order_id: orderId,
      rating: score,
      review: comment || null,
      photo_url: photoUrl
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export { submitReview };
