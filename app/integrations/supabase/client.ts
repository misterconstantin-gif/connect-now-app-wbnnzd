import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://ncqvacfadxypykekvdsm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jcXZhY2ZhZHh5cHlrZWt2ZHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzY5MjYsImV4cCI6MjA3NDQ1MjkyNn0.Aa5iB9fqY_oCjIlV7dUH1mxrvn6wzcKgfa1gQ_mkfR8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
