const SUPABASE_URL = "";
const SUPABASE_KEY = "";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

export { supabaseClient };
