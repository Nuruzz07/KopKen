const SUPABASE_URL = "https://axaoagzveujcgoxybdmp.supabase.co";
const SUPABASE_KEY = "sb_publishable_GQ19XRT7yWIBido0iXJvCQ_ybZ_I7ju";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

export { supabaseClient };
