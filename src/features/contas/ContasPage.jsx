import { money } from '../../domain/validators.js';

export default function ContasPage({ data }) {
  const receivables = data.receivables || [];
  const payables = data.payables || [];

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Contas a receber</div>
          <div className="value">{money(receivables.reduce((sum, item) => sum + Number(item.amount || 0), 0))}</div>
          <div className="hint">{receivables.length} registros</div>
        </div>
        <div className="stat-card">
          <div className="label">Contas a pagar</div>
          <div className="value">{money(payables.reduce((sum, item) => sum + Number(item.amount || 0), 0))}</div>
          <div className="hint">{payables.length} registros</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        <section className="panel">
          <div className="panel-header"><h3>Recebimentos</h3></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Cliente</th><th>Valor</th><th>Vencimento</th></tr></thead>
              <tbody>
                {receivables.map((item) => (
                  <tr key={item.id}><td>{item.customer}</td><td>{money(item.amount)}</td><td>{item.due}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header"><h3>Pagamentos</h3></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Fornecedor</th><th>Valor</th><th>Vencimento</th></tr></thead>
              <tbody>
                {payables.map((item) => (
                  <tr key={item.id}><td>{item.supplier}</td><td>{money(item.amount)}</td><td>{item.due}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
