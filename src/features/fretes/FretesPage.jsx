import { money } from '../../lib/formatters.js';
import MetricCard from '../../components/MetricCard.jsx';
import EmptyState from '../../components/EmptyState.jsx';

const initialForm = {
  date: '',
  customer: '',
  driver: '',
  truck: '',
  origin: '',
  destination: '',
  value: '',
  discount: '',
  received: '',
  notes: ''
};

export default function FretesPage({ data, onSave, readOnly }) {
  const [form, setForm] = useState(initialForm);
  const rows = data.freights || [];

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (readOnly) return;

    const next = {
      ...form,
      id: crypto.randomUUID(),
      value: Number(form.value || 0),
      discount: Number(form.discount || 0),
      received: Number(form.received || 0)
    };

    onSave({
      ...data,
      freights: [next, ...rows]
    });

    setForm(initialForm);
  };

  const totalRevenue = rows.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const totalReceived = rows.reduce((sum, item) => sum + Number(item.received || 0), 0);

  return (
    <>
      <div className="stats-grid">
        <MetricCard label="Faturamento" value={money(totalRevenue)} hint={`${rows.length} fretes cadastrados`} />
        <MetricCard label="Recebido" value={money(totalReceived)} hint="Total já recebido" />
      </div>

      {!readOnly && (
        <section className="panel" style={{ marginBottom: '1rem' }}>
          <div className="panel-header">
            <h3>Novo frete</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field"><label>Data</label><input className="input" type="date" value={form.date} onChange={(event) => handleChange('date', event.target.value)} /></div>
              <div className="form-field"><label>Cliente</label><input className="input" value={form.customer} onChange={(event) => handleChange('customer', event.target.value)} /></div>
              <div className="form-field"><label>Motorista</label><input className="input" value={form.driver} onChange={(event) => handleChange('driver', event.target.value)} /></div>
              <div className="form-field"><label>Caminhão</label><input className="input" value={form.truck} onChange={(event) => handleChange('truck', event.target.value)} /></div>
              <div className="form-field"><label>Origem</label><input className="input" value={form.origin} onChange={(event) => handleChange('origin', event.target.value)} /></div>
              <div className="form-field"><label>Destino</label><input className="input" value={form.destination} onChange={(event) => handleChange('destination', event.target.value)} /></div>
              <div className="form-field"><label>Valor</label><input className="input" type="number" value={form.value} onChange={(event) => handleChange('value', event.target.value)} /></div>
              <div className="form-field"><label>Desconto</label><input className="input" type="number" value={form.discount} onChange={(event) => handleChange('discount', event.target.value)} /></div>
              <div className="form-field"><label>Recebido</label><input className="input" type="number" value={form.received} onChange={(event) => handleChange('received', event.target.value)} /></div>
              <div className="form-field" style={{ gridColumn: '1 / -1' }}><label>Observações</label><textarea className="textarea" value={form.notes} onChange={(event) => handleChange('notes', event.target.value)} /></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="primary-button">Salvar frete</button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <h3>Lista de fretes</h3>
        </div>

        {rows.length === 0 ? (
          <EmptyState message="Nenhum frete cadastrado." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Cliente</th>
                  <th>Motorista</th>
                  <th>Veículo</th>
                  <th>Rota</th>
                  <th>Valor</th>
                  <th>Recebido</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((freight) => (
                  <tr key={freight.id}>
                    <td>{freight.date}</td>
                    <td>{freight.customer}</td>
                    <td>{freight.driver}</td>
                    <td>{freight.truck}</td>
                    <td>{freight.origin} → {freight.destination}</td>
                    <td>{money(freight.value)}</td>
                    <td>{money(freight.received)}</td>
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

const { useState } = require('react');
