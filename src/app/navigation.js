export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Balanço Geral', symbol: '▣' },
  { id: 'freights', label: 'Fretes', symbol: '🚚' },
  { id: 'expenses', label: 'Despesas', symbol: '🧾' },
  { id: 'accounts', label: 'Contas', symbol: '💳' },
  { id: 'cadastros', label: 'Cadastros', symbol: '👥' },
  { id: 'reports', label: 'Relatórios', symbol: '📊' }
];

export function getPageMeta(activePage, visitorMode) {
  const selected = NAV_ITEMS.find((item) => item.id === activePage) || NAV_ITEMS[0];

  return {
    title: selected.label,
    mode: visitorMode ? 'visitor' : 'operational',
    label: visitorMode ? 'Modo visitante' : 'Operacional'
  };
}
