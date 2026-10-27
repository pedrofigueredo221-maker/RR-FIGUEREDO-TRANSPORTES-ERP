import { money } from '../../lib/formatters.js';
import MetricCard from '../../components/MetricCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function ContasPage({ data }) {
  const receivables = data.receivables || [];
  const payables = data.payables || [];

  const receivableTotal = receivables.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const payableTotal = payables.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <>
      <div className="stats-grid">
        <MetricCard label="Contas a receber" value={money(receivableTotal)} hint={`${receivables.length} registros`} />
        <MetricCard label="Contas a pagar" value={money(payableTotal)} hint={`${payables.length} registros`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        <section className="panel">
          <div className="panel-header"><h3>Recebimentos</h3></div>

          {receivables.length === 0 ? (
            <EmptyState message="Nenhuma conta a receber." />
          ) : (
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
          )}
        </section>

        <section className="panel">
          <div className="panel-header"><h3>Pagamentos</h3></div>

          {payables.length === 0 ? (
            <EmptyState message="Nenhuma conta a pagar." />
          ) : (
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
          )}
        </section>
      </div>
    </>
  );
}
