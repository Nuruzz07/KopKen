const supabaseClient = window.BintangSupabaseClient;

if (!supabaseClient) {
  throw new Error("Supabase client belum tersedia.");
}

export { supabaseClient };
