import { createClient as createServerClient } from "@supabase/supabase-js";

export const createAdminClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase URL or Service Role Key in environment variables");
  }

  return createServerClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
};

export const debugSupabase = () => ({
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_SERVICE_ROLE_KEY
    ? process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 6) + "...(hidden)"
    : "MISSING",
});
