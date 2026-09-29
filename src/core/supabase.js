const supabaseClient = window.supabaseClient;

if (!supabaseClient) {
  throw new Error("Supabase client belum tersedia.");
}

export { supabaseClient };
