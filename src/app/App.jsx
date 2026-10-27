import { useMemo, useState, useEffect } from 'react';
import { createSupabaseClient, isDemoMode, getAppConfig } from '../services/auth.js';
import { readDemoState, writeDemoState } from '../services/storage.js';
import { DEFAULT_DATA } from '../data/demoData.js';
import LoginScreen from '../components/LoginScreen.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import DashboardPage from '../features/dashboard/DashboardPage.jsx';
import FinanceiroPage from '../features/financeiro/FinanceiroPage.jsx';
import FretesPage from '../features/fretes/FretesPage.jsx';
import DespesasPage from '../features/despesas/DespesasPage.jsx';
import ContasPage from '../features/contas/ContasPage.jsx';
import CadastrosPage from '../features/cadastros/CadastrosPage.jsx';
import RelatoriosPage from '../features/relatorios/RelatoriosPage.jsx';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Balanço Geral', symbol: '▣' },
  { id: 'financeiro', label: 'Financeiro', symbol: '💰' },
  { id: 'freights', label: 'Fretes', symbol: '🚚' },
  { id: 'expenses', label: 'Despesas', symbol: '🧾' },
  { id: 'accounts', label: 'Contas', symbol: '💳' },
  { id: 'cadastros', label: 'Cadastros', symbol: '👥' },
  { id: 'reports', label: 'Relatórios', symbol: '📊' }
];

const screenMap = {
  dashboard: DashboardPage,
  financeiro: FinanceiroPage,
  freights: FretesPage,
  expenses: DespesasPage,
  accounts: ContasPage,
  cadastros: CadastrosPage,
  reports: RelatoriosPage
};

export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [busy, setBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [data, setData] = useState(DEFAULT_DATA);
  const [version, setVersion] = useState(0);

  const demoMode = isDemoMode();
  const supabase = useMemo(() => createSupabaseClient(), []);

  useEffect(() => {
    if (demoMode) {
      const raw = readDemoState();
      setData(raw || DEFAULT_DATA);
      setSession({ user: { email: 'demo@local.test' } });
      setAuthReady(true);
      return undefined;
    }

    if (!supabase) {
      setAuthReady(true);
      return undefined;
    }

    let active = true;

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession);
        setAuthReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: result }) => {
      if (!active) return;
      setSession(result?.session || null);
      setAuthReady(true);
    });

    return () => {
      active = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, [demoMode, supabase]);

  useEffect(() => {
    if (!session) return;

    if (demoMode) {
      const raw = readDemoState();
      setData(raw || DEFAULT_DATA);
      setVersion(0);
      return;
    }

    if (!supabase) return;

    supabase
      .from('app_state')
      .select('data, version')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (error) {
          setAuthError(error.message);
          return;
        }

        if (row?.data) {
          setData(row.data);
          setVersion(Number(row.version) || 0);
        }
      });
  }, [session, demoMode, supabase]);

  const handleLogin = async (username, password) => {
    setBusy(true);
    setAuthError('');

    try {
      if (demoMode) {
        setSession({ user: { email: 'demo@local.test' } });
        setAuthReady(true);
        return;
      }

      const config = getAppConfig();
      const email = config.USER_EMAILS?.[String(username || '').trim().toUpperCase()];

      if (!email) {
        throw new Error('Usuário não configurado.');
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      setAuthError(error.message || 'Não foi possível entrar.');
    } finally {
      setBusy(false);
    }
  };

  const handleSave = (nextData) => {
    if (demoMode) {
      writeDemoState(nextData);
      setData(nextData);
      return;
    }

    if (!supabase) return;

    supabase
      .from('app_state')
      .update({ data: nextData, version: version + 1 })
      .eq('id', 1)
      .eq('version', version)
      .select('version')
      .then(({ data: updated, error }) => {
        if (error) {
          setAuthError(error.message || 'Não foi possível salvar.');
          return;
        }

        if (updated && updated.length > 0) {
          setData(nextData);
          setVersion(Number(updated[0].version) || version + 1);
        }
      });
  };

  if (!authReady) {
    return <div className="login-shell"><div className="login-box">Carregando...</div></div>;
  }

  if (!session) {
    return <LoginScreen onLogin={handleLogin} error={authError} busy={busy} />;
  }

  const PageComponent = screenMap[activePage] || DashboardPage;
  const visitorMode = String((window.APP_CONFIG || {}).USER_EMAILS?.VISITANTES || '').toLowerCase() === String(session?.user?.email || '').toLowerCase();

  return (
    <div className="app-shell">
      <Sidebar navItems={NAV_ITEMS} activeItem={activePage} onSelect={setActivePage} userEmail={session?.user?.email} />

      <main className="main">
        <div className="topbar">
          <h1>{NAV_ITEMS.find((item) => item.id === activePage)?.label || 'Painel'}</h1>
          <div className="page-badge">{visitorMode ? 'modo visitante' : 'operacional'}</div>
        </div>

        <PageComponent data={data} onSave={handleSave} readOnly={visitorMode} />
      </main>
    </div>
  );
}
