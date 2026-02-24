import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://hjsmwcppwrtmudgsibed.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqc213Y3Bwd3J0bXVkZ3NpYmVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MDc4MTQsImV4cCI6MjA4NzQ4MzgxNH0.8RbiV6C9XUo9odlkl_cqXanAd7KZZDQpjNg0C8q-tb4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});