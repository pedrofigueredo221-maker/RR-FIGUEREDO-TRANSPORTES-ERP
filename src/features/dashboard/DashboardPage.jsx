import { money } from '../../lib/formatters.js';
import { freightDriverPayment, freightCompanyCosts, freightProfit } from '../../domain/finance.js';
import MetricCard from '../../components/MetricCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';

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
        <MetricCard label="Faturamento" value={money(revenue)} hint={`${freights.length} fretes no período`} />
        <MetricCard label="Pagamento ao motorista" value={money(driverPayments)} hint="Comissões e bônus" />
        <MetricCard label="Custos da empresa" value={money(companyCosts)} hint="Pedágio, combustível e outros custos" />
        <MetricCard label="Lucro estimado" value={money(profit)} hint="Faturamento menos custos e pagamento ao motorista" />
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>Últimas viagens</h3>
        </div>

        {recent.length === 0 ? (
          <EmptyState message="Nenhum frete encontrado." />
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

      <section className="panel" style={{ marginTop: '1rem' }}>
        <div className="panel-header">
          <h3>Resumo financeiro</h3>
        </div>

        <div className="stats-grid compact">
          <MetricCard label="A receber" value={money(receivable)} hint="Valores pendentes" />
          <MetricCard label="A pagar" value={money(payable)} hint="Despesas em aberto" />
        </div>
      </section>
    </>
  );
}
