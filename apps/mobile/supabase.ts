import Constants from "expo-constants";
import { createSupabase } from "@repo/core";

const extra = Constants.expoConfig?.extra as { SUPABASE_URL: string; SUPABASE_ANON_KEY: string };

export const supabase = createSupabase(extra.SUPABASE_URL, extra.SUPABASE_ANON_KEY);
