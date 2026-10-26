export function Sidebar({ navItems, activeItem, onSelect, userEmail }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">R&amp;R</div>
        <div>
          <div className="brand-title">Transportes</div>
        </div>
      </div>

      <div className="nav-label">Menu principal</div>
      <nav className="nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-button ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <span>{item.label}</span>
            <span>{item.symbol}</span>
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(148,163,184,0.2)' }}>
        <div className="brand-title" style={{ marginBottom: '0.5rem' }}>Usuário</div>
        <div style={{ color: 'var(--muted)', fontSize: '0.85rem', wordBreak: 'break-word' }}>{userEmail || 'demo@local.test'}</div>
      </div>
    </aside>
  );
}
