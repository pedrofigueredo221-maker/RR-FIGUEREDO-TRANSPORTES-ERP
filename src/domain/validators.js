export const money = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(value || 0));

export function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function normalizeFreight(input = {}) {
  return {
    id: input.id || crypto.randomUUID(),
    date: input.date || new Date().toISOString().slice(0, 10),
    customer: input.customer || '',
    driver: input.driver || '',
    truck: input.truck || '',
    origin: input.origin || '',
    destination: input.destination || '',
    value: Number(input.value || 0),
    discount: Number(input.discount || 0),
    toll: Number(input.toll || 0),
    fuelActual: Number(input.fuelActual || 0),
    otherCosts: Number(input.otherCosts || 0),
    commissionType: input.commissionType || 'percent',
    commission: Number(input.commission || 0),
    bonus: Number(input.bonus || 0),
    received: Number(input.received || 0),
    notes: input.notes || ''
  };
}

export function normalizeExpense(input = {}) {
  return {
    id: input.id || crypto.randomUUID(),
    created: input.created || new Date().toISOString().slice(0, 10),
    description: input.description || '',
    category: input.category || 'Despesas gerais',
    truck: input.truck || '',
    supplier: input.supplier || '',
    value: Number(input.value || 0),
    installments: Array.isArray(input.installments) ? input.installments : [],
    notes: input.notes || ''
  };
}

export function prepareDataShape(data = {}) {
  return {
    freights: safeArray(data.freights),
    expenses: safeArray(data.expenses),
    receivables: safeArray(data.receivables),
    payables: safeArray(data.payables),
    employees: safeArray(data.employees),
    trucks: safeArray(data.trucks),
    categories: safeArray(data.categories)
  };
}
