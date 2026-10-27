import { money } from '../../lib/formatters.js';
import MetricCard from '../../components/MetricCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function DespesasPage({ data, onSave, readOnly }) {
  const rows = data.expenses || [];

  const handleCreate = () => {
    if (readOnly) return;

    const draft = {
      id: crypto.randomUUID(),
      created: new Date().toISOString().slice(0, 10),
      description: 'Nova despesa',
      category: 'Despesas gerais',
      truck: '',
      supplier: '',
      value: 0,
      installments: []
    };

    onSave({ ...data, expenses: [draft, ...rows] });
  };

  const totalExpenses = rows.reduce((sum, expense) => sum + Number(expense.value || 0), 0);

  return (
    <>
      <div className="stats-grid">
        <MetricCard label="Total despesas" value={money(totalExpenses)} hint={`${rows.length} registros cadastrados`} />
      </div>

      <div className="toolbar">
        <div className="page-badge">Despesas</div>
        {!readOnly && <button type="button" className="primary-button" onClick={handleCreate}>Nova despesa</button>}
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>Controle financeiro</h3>
        </div>

        {rows.length === 0 ? (
          <EmptyState message="Nenhuma despesa cadastrada." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Fornecedor</th>
                  <th>Veículo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.created}</td>
                    <td>{expense.description}</td>
                    <td>{expense.category}</td>
                    <td>{expense.supplier}</td>
                    <td>{expense.truck}</td>
                    <td>{money(expense.value)}</td>
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
