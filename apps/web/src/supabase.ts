import { createClient } from "@supabase/supabase-js";
import {createSupabase} from '../../../packages/core/src/supbase.ts'
export const supabase = createSupabase(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)