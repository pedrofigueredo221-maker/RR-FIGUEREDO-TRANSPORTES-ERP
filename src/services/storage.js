const STORAGE_KEY = 'rr_figueredo_demo_state';

export function readDemoState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeDemoState(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadSharedState(supabase, session) {
  if (!supabase || !session) return null;

  return supabase
    .from('app_state')
    .select('data, version')
    .eq('id', 1)
    .maybeSingle();
}

export function saveSharedState(supabase, nextData, version) {
  if (!supabase) return Promise.reject(new Error('Supabase não configurado.'));

  return supabase
    .from('app_state')
    .update({ data: nextData, version: Number(version) + 1 })
    .eq('id', 1)
    .eq('version', version)
    .select('version');
}
