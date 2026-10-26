export const DEMO_DATA = {
  freights: [
    {
      id: 'f-1001',
      date: '2026-10-01',
      customer: 'Transportes Delta',
      driver: 'Rafael',
      truck: 'TRK-01',
      origin: 'São Paulo',
      destination: 'Campinas',
      value: 4200,
      discount: 150,
      toll: 180,
      fuelActual: 420,
      otherCosts: 150,
      commissionType: 'percent',
      commission: 12,
      bonus: 150,
      received: 3200,
      notes: 'Carga fechada com despacho normal'
    },
    {
      id: 'f-1002',
      date: '2026-10-05',
      customer: 'Logística Norte',
      driver: 'Carlos',
      truck: 'TRK-02',
      origin: 'Belo Horizonte',
      destination: 'Uberlândia',
      value: 5100,
      discount: 200,
      toll: 210,
      fuelActual: 510,
      otherCosts: 180,
      commissionType: 'percent',
      commission: 10,
      bonus: 120,
      received: 4800,
      notes: 'Entrega com combustível elevado'
    }
  ],
  expenses: [
    {
      id: 'e-1001',
      created: '2026-10-03',
      description: 'Manutenção preventiva',
      category: 'Manutenção',
      truck: 'TRK-01',
      supplier: 'Oficina Central',
      value: 1800,
      installments: [{ due: '2026-10-10', value: 1800, paid: 1800, payments: [] }],
      notes: 'Troca de peças'
    },
    {
      id: 'e-1002',
      created: '2026-10-09',
      description: 'Combustível',
      category: 'Combustível',
      truck: 'TRK-02',
      supplier: 'Posto Vale',
      value: 950,
      installments: [{ due: '2026-10-12', value: 950, paid: 0, payments: [] }],
      notes: 'Abastecimento do veículo'
    }
  ],
  receivables: [
    { id: 'r-1', customer: 'Transportes Delta', amount: 1000, due: '2026-10-15', status: 'Aberta' },
    { id: 'r-2', customer: 'Logística Norte', amount: 300, due: '2026-10-18', status: 'Aberta' }
  ],
  payables: [
    { id: 'p-1', supplier: 'Oficina Central', amount: 1200, due: '2026-10-20', status: 'Aberta' },
    { id: 'p-2', supplier: 'Posto Vale', amount: 550, due: '2026-10-23', status: 'Aberta' }
  ],
  employees: [
    { id: 'emp-1', name: 'Rafael', role: 'Motorista', commissionType: 'percent', commission: 12, active: true },
    { id: 'emp-2', name: 'Carlos', role: 'Motorista', commissionType: 'percent', commission: 10, active: true }
  ],
  trucks: [
    { id: 'truck-1', name: 'TRK-01', plate: 'ABC-1234', active: true },
    { id: 'truck-2', name: 'TRK-02', plate: 'XYZ-9876', active: true }
  ],
  categories: ['Combustível', 'Manutenção', 'Pedágio', 'Pneus', 'Documentação', 'Mecânico']
};
