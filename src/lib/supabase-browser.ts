import { createBrowserClient } from '@supabase/ssr';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseUrl = rawUrl.startsWith('https://') ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey.length > 20 ? rawKey : 'placeholder-anon-key-00000000000000000000';

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
