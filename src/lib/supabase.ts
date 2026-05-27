import { createClient } from '@supabase/supabase-js';

// Validate that the env var is a real URL, not the placeholder string from .env.local.
// All Supabase calls in the app are wrapped in try/catch, so a placeholder client is safe.
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseUrl = rawUrl.startsWith('https://') ? rawUrl : 'https://placeholder.supabase.co';
// Accepts both new sb_publishable_ format and legacy eyJ JWT format
const supabaseAnonKey = rawKey.length > 20 ? rawKey : 'placeholder-anon-key-00000000000000000000';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
