import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase Lib: Initializing", { hasUrl: !!supabaseUrl, hasKey: !!supabaseAnonKey });

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Key missing in .env");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
