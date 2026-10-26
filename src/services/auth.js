import { createClient } from '@supabase/supabase-js';
import { DEFAULT_APP_CONFIG } from '../app/config.js';

export function getAppConfig() {
  return {
    ...DEFAULT_APP_CONFIG,
    ...(window.APP_CONFIG || {})
  };
}

export function createSupabaseClient() {
  const config = getAppConfig();

  if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    return null;
  }

  return createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
}

export function isDemoMode() {
  return new URLSearchParams(window.location.search).get('demo') === '1';
}

export async function loginWithSupabase(username, password) {
  const supabase = createSupabaseClient();
  if (!supabase) throw new Error('Supabase não configurado.');

  const config = getAppConfig();
  const email = config.USER_EMAILS?.[String(username || '').trim().toUpperCase()];

  if (!email) {
    throw new Error('Usuário não configurado.');
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function resetPasswordRequest(username) {
  const supabase = createSupabaseClient();
  if (!supabase) throw new Error('Supabase não configurado.');

  const config = getAppConfig();
  const email = config.USER_EMAILS?.[String(username || '').trim().toUpperCase()];

  if (!email) {
    throw new Error('Digite um usuário válido antes de solicitar a recuperação.');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://pedrofigueredo221-maker.github.io/RR-FIGUEREDO-TRANSPORTES/redefinir-senha.html'
  });

  if (error) throw error;
}
