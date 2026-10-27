import { money } from '../../domain/validators.js';
import { freightCommission, freightProfit, freightOperatingCosts } from '../../domain/finance.js';

export default function DashboardPage({ data }) {
  const freights = data.freights || [];
  const expenses = data.expenses || [];

  const revenue = freights.reduce((sum, freight) => sum + Number(freight.value || 0), 0);
  const profit = freights.reduce((sum, freight) => sum + freightProfit(freight), 0) - expenses.reduce((sum, expense) => sum + Number(expense.value || 0), 0);
  const receivable = freights.reduce((sum, freight) => sum + Math.max(0, Number(freight.value || 0) - Number(freight.received || 0)), 0);
  const payable = expenses.reduce((sum, expense) => sum + Math.max(0, Number(expense.value || 0) - (Array.isArray(expense.installments) ? expense.installments.reduce((t, s) => t + Number(s.paid || 0), 0) : 0)), 0);

  const recent = [...freights].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 6);

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Faturamento</div>
          <div className="value">{money(revenue)}</div>
          <div className="hint">{freights.length} fretes no período</div>
        </div>
        <div className="stat-card">
          <div className="label">Lucro estimado</div>
          <div className="value">{money(profit)}</div>
          <div className="hint">Considerando comissão e custos</div>
        </div>
        <div className="stat-card">
          <div className="label">A receber</div>
          <div className="value">{money(receivable)}</div>
          <div className="hint">Valores pendentes de recebimento</div>
        </div>
        <div className="stat-card">
          <div className="label">A pagar</div>
          <div className="value">{money(payable)}</div>
          <div className="hint">Contas e despesas em aberto</div>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>Últimas viagens</h3>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">Nenhum frete encontrado.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Motorista</th>
                  <th>Origem</th>
                  <th>Destino</th>
                  <th>Faturamento</th>
                  <th>Lucro</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((freight) => (
                  <tr key={freight.id}>
                    <td>{freight.date}</td>
                    <td>{freight.customer}</td>
                    <td>{freight.driver}</td>
                    <td>{freight.origin}</td>
                    <td>{freight.destination}</td>
                    <td>{money(freight.value)}</td>
                    <td>{money(freightProfit(freight))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
