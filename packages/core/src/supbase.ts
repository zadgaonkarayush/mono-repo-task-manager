import { createClient } from '@supabase/supabase-js';

export const createSupabase = (url: string, anonKey: string) =>
  createClient(url, anonKey);
