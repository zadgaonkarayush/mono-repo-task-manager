import { SupabaseClient } from '@supabase/supabase-js';

export const fetchTasks = async (supabase: SupabaseClient) => {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) throw error;
  return data;
};

export const addTask = async (
  supabase: SupabaseClient,
  title: string
) => {
  const { error } = await supabase.from('tasks').insert({ title });
  if (error) throw error;
};
