import { money } from '../../lib/formatters.js';
import { freightDriverPayment, freightProfit, freightCompanyCosts } from '../../domain/finance.js';

export default function RelatoriosPage({ data }) {
  const freights = data.freights || [];
  const expenses = data.expenses || [];

  const totalRevenue = freights.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const totalPayments = freights.reduce((sum, item) => sum + freightDriverPayment(item), 0);
  const totalCompanyCosts = freights.reduce((sum, item) => sum + freightCompanyCosts(item), 0);
  const totalProfit = freights.reduce((sum, item) => sum + freightProfit(item), 0) - expenses.reduce((sum, expense) => sum + Number(expense.value || 0), 0);

  const byDriver = Object.entries(
    freights.reduce((acc, item) => {
      const driver = item.driver || 'Não informado';
      if (!acc[driver]) acc[driver] = { revenue: 0, payment: 0, companyCosts: 0, profit: 0 };

      acc[driver].revenue += Number(item.value || 0);
      acc[driver].payment += freightDriverPayment(item);
      acc[driver].companyCosts += freightCompanyCosts(item);
      acc[driver].profit += freightProfit(item);

      return acc;
    }, {})
  );

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card"><div className="label">Faturamento</div><div className="value">{money(totalRevenue)}</div><div className="hint">Receita bruta dos fretes</div></div>
        <div className="stat-card"><div className="label">Pagamento ao motorista</div><div className="value">{money(totalPayments)}</div><div className="hint">Comissão + bônus</div></div>
        <div className="stat-card"><div className="label">Custos da empresa</div><div className="value">{money(totalCompanyCosts)}</div><div className="hint">Pedágio, combustível e outros custos</div></div>
        <div className="stat-card"><div className="label">Lucro estimado</div><div className="value">{money(totalProfit)}</div><div className="hint">Resultado líquido do período</div></div>
      </div>

      <section className="panel">
        <div className="panel-header"><h3>Resultado por motorista</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Motorista</th><th>Faturamento</th><th>Pagamento</th><th>Custos empresa</th><th>Lucro</th></tr></thead>
            <tbody>
              {byDriver.map(([driver, dataRow]) => (
                <tr key={driver}>
                  <td>{driver}</td>
                  <td>{money(dataRow.revenue)}</td>
                  <td>{money(dataRow.payment)}</td>
                  <td>{money(dataRow.companyCosts)}</td>
                  <td>{money(dataRow.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
