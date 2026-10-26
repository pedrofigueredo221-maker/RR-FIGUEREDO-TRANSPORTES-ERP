export const DEFAULT_APP_CONFIG = {
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  USER_EMAILS: {
    RAFAEL: 'pedrofigueredo221@gmail.com',
    VISITANTES: 'visitante@local.test'
  }
};

export function getAppConfig() {
  return {
    ...DEFAULT_APP_CONFIG,
    ...(window.APP_CONFIG || {})
  };
}
