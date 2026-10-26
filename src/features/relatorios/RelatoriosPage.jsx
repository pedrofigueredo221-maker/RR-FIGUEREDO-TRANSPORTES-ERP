import { money } from '../../domain/validators.js';
import { freightDriverPayment, freightCompanyCosts, freightProfit } from '../../domain/finance.js';

export default function DashboardPage({ data }) {
  const freights = data.freights || [];
  const expenses = data.expenses || [];

  const revenue = freights.reduce((sum, freight) => sum + Number(freight.value || 0), 0);
  const driverPayments = freights.reduce((sum, freight) => sum + freightDriverPayment(freight), 0);
  const companyCosts = freights.reduce((sum, freight) => sum + freightCompanyCosts(freight), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.value || 0), 0);
  const profit = freights.reduce((sum, freight) => sum + freightProfit(freight), 0) - totalExpenses;
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
          <div className="label">Pagamento ao motorista</div>
          <div className="value">{money(driverPayments)}</div>
          <div className="hint">Comissões e bônus</div>
        </div>
        <div className="stat-card">
          <div className="label">Custos da empresa</div>
          <div className="value">{money(companyCosts)}</div>
          <div className="hint">Pedágio, combustível e outros custos</div>
        </div>
        <div className="stat-card">
          <div className="label">Lucro estimado</div>
          <div className="value">{money(profit)}</div>
          <div className="hint">Faturamento menos custos e pagamento do motorista</div>
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
                  <th>Pagamento</th>
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
                    <td>{money(freightDriverPayment(freight))}</td>
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
