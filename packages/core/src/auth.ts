import { SupabaseClient } from '@supabase/supabase-js';

export const signIn = (
  supabase: SupabaseClient,
  email: string,
  password: string
) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signUp = (
  supabase: SupabaseClient,
  email: string,
  password: string
) => {
  return supabase.auth.signUp({ email, password });
};

export const signOut = (supabase: SupabaseClient) => {
  return supabase.auth.signOut();
};
