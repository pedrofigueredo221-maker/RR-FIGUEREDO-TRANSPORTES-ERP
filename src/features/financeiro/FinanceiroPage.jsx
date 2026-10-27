const money = (value) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
}).format(Number(value || 0));

export default function FinanceiroPage({ data }) {
  const freights = data?.freights || [];
  const expenses = data?.expenses || [];

  const faturamento = freights.reduce((sum, freight) => sum + Number(freight.value || 0), 0);
  const recibos = freights.reduce((sum, freight) => sum + Number(freight.received || 0), 0);
  const despesaTotal = expenses.reduce((sum, expense) => sum + Number(expense.value || 0), 0);
  const saldo = faturamento - despesaTotal;
  const pendente = Math.max(0, faturamento - recibos);

  const ultimasDespesas = [...expenses]
    .sort((a, b) => String(b.created || '').localeCompare(String(a.created || '')))
    .slice(0, 5);

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Faturamento</div>
          <div className="value">{money(faturamento)}</div>
          <div className="hint">Total de fretes lançados</div>
        </div>

        <div className="stat-card">
          <div className="label">Despesas</div>
          <div className="value">{money(despesaTotal)}</div>
          <div className="hint">Custo operacional do período</div>
        </div>

        <div className="stat-card">
          <div className="label">Saldo</div>
          <div className="value">{money(saldo)}</div>
          <div className="hint">Resultado bruto do período</div>
        </div>

        <div className="stat-card">
          <div className="label">A receber</div>
          <div className="value">{money(pendente)}</div>
          <div className="hint">Valores ainda não recebidos</div>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>Resumo financeiro</h3>
          <button type="button" className="primary-button">Exportar</button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Veículo</th>
                <th>Fornecedor</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {ultimasDespesas.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">Nenhuma despesa lançada.</div>
                  </td>
                </tr>
              ) : (
                ultimasDespesas.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.created}</td>
                    <td>{expense.description}</td>
                    <td>{expense.category}</td>
                    <td>{expense.truck || '-'}</td>
                    <td>{expense.supplier || '-'}</td>
                    <td>{money(expense.value)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
