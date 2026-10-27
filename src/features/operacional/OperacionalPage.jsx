import { money } from '../../domain/validators.js';

export default function OperacionalPage({ data }) {
  const freights = data?.freights || [];
  const expenses = data?.expenses || [];

  const faturamento = freights.reduce((sum, freight) => sum + Number(freight.value || 0), 0);
  const despesaTotal = expenses.reduce((sum, expense) => sum + Number(expense.value || 0), 0);
  const saldo = faturamento - despesaTotal;
  const pendente = freights.reduce((sum, freight) => sum + Math.max(0, Number(freight.value || 0) - Number(freight.received || 0)), 0);

  const recentes = [...freights]
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
    .slice(0, 5);

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Fretes</div>
          <div className="value">{freights.length}</div>
          <div className="hint">Total cadastrados</div>
        </div>

        <div className="stat-card">
          <div className="label">Faturamento</div>
          <div className="value">{money(faturamento)}</div>
          <div className="hint">Operação em andamento</div>
        </div>

        <div className="stat-card">
          <div className="label">Gastos</div>
          <div className="value">{money(despesaTotal)}</div>
          <div className="hint">Despesas do período</div>
        </div>

        <div className="stat-card">
          <div className="label">Saldo</div>
          <div className="value">{money(saldo)}</div>
          <div className="hint">Resultado bruto</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        <section className="panel">
          <div className="panel-header">
            <h3>Últimas operações</h3>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Origem</th>
                  <th>Destino</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {recentes.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">Nenhuma operação encontrada.</div>
                    </td>
                  </tr>
                ) : (
                  recentes.map((freight) => (
                    <tr key={freight.id}>
                      <td>{freight.date}</td>
                      <td>{freight.customer}</td>
                      <td>{freight.origin}</td>
                      <td>{freight.destination}</td>
                      <td>{money(freight.value)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Resumo financeiro</h3>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Faturamento</td>
                  <td>{money(faturamento)}</td>
                </tr>
                <tr>
                  <td>Gastos</td>
                  <td>{money(despesaTotal)}</td>
                </tr>
                <tr>
                  <td>Saldo</td>
                  <td>{money(saldo)}</td>
                </tr>
                <tr>
                  <td>A receber</td>
                  <td>{money(pendente)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
