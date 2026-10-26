import { money } from '../../domain/validators.js';

export default function CadastrosPage({ data, readOnly }) {
  const employees = data.employees || [];
  const trucks = data.trucks || [];

  return (
    <>
      <div className="toolbar">
        <div className="page-badge">Cadastros</div>
        {!readOnly && <button type="button" className="secondary-button">Adicionar cadastro</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        <section className="panel">
          <div className="panel-header"><h3>Funcionários</h3></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nome</th><th>Cargo</th><th>Ativo</th></tr></thead>
              <tbody>
                {employees.map((item) => (
                  <tr key={item.id}><td>{item.name}</td><td>{item.role}</td><td><span className={`badge ${item.active ? 'success' : 'warning'}`}>{item.active ? 'Ativo' : 'Inativo'}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header"><h3>Caminhões</h3></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Veículo</th><th>Placa</th><th>Status</th></tr></thead>
              <tbody>
                {trucks.map((item) => (
                  <tr key={item.id}><td>{item.name}</td><td>{item.plate}</td><td><span className={`badge ${item.active ? 'success' : 'warning'}`}>{item.active ? 'Operando' : 'Inativo'}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
