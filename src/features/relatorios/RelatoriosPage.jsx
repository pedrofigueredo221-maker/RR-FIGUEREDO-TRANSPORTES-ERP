import { money } from '../../domain/validators.js';
import { freightCommission, freightProfit } from '../../domain/finance.js';

export default function RelatoriosPage({ data }) {
  const freights = data.freights || [];
  const expenses = data.expenses || [];

  const totalRevenue = freights.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const totalCost = freights.reduce((sum, item) => sum + freightCommission(item) + Number(item.toll || 0) + Number(item.fuelActual || 0) + Number(item.otherCosts || 0), 0);
  const totalProfit = freights.reduce((sum, item) => sum + freightProfit(item), 0) - expenses.reduce((sum, expense) => sum + Number(expense.value || 0), 0);

  const byDriver = Object.entries(
    freights.reduce((acc, item) => {
      acc[item.driver || 'Não informado'] = (acc[item.driver || 'Não informado'] || 0) + Number(item.value || 0);
      return acc;
    }, {})
  );

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card"><div className="label">Faturamento</div><div className="value">{money(totalRevenue)}</div><div className="hint">Fretes cadastrados</div></div>
        <div className="stat-card"><div className="label">Custo operacional</div><div className="value">{money(totalCost)}</div><div className="hint">Comissão e despesas operacionais</div></div>
        <div className="stat-card"><div className="label">Lucro estimado</div><div className="value">{money(totalProfit)}</div><div className="hint">Resultado líquido</div></div>
      </div>

      <section className="panel">
        <div className="panel-header"><h3>Por motorista</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Motorista</th><th>Faturamento</th></tr></thead>
            <tbody>
              {byDriver.map(([driver, value]) => (
                <tr key={driver}><td>{driver}</td><td>{money(value)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
