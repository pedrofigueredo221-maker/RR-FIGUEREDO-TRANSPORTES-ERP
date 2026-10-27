/**
 * Adaptadores puros entre os dados históricos do ERP e a arquitetura por features.
 * Não alteram o objeto recebido nem removem campos desconhecidos.
 */
const numeric = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const round = value => Math.round((numeric(value) + Number.EPSILON) * 100) / 100;

export function normalizeFreight(record = {}) {
  return {
    ...record,
    value: numeric(record.value),
    discount: numeric(record.discount),
    toll: numeric(record.toll),
    fuelActual: numeric(record.fuelActual),
    otherCosts: numeric(record.otherCosts),
    commission: numeric(record.commission),
    bonus: numeric(record.bonus),
    received: numeric(record.received),
    receipts: Array.isArray(record.receipts) ? record.receipts : [],
    commissionType: record.commissionType === 'fixed' ? 'fixed' : 'percent'
  };
}

export function normalizeExpense(record = {}) {
  const installments = Array.isArray(record.installments) ? record.installments : [];
  return {
    ...record,
    value: numeric(record.value),
    installments: installments.map(item => ({
      ...item,
      value: numeric(item.value),
      paid: numeric(item.paid),
      payments: Array.isArray(item.payments) ? item.payments : []
    }))
  };
}

export function normalizeManualAccount(record = {}, kind = 'receivables') {
  const amount = numeric(record.value ?? record.amount);
  const key = kind === 'payables' ? 'payments' : 'receipts';
  const paidKey = kind === 'payables' ? 'paid' : 'received';
  return {
    ...record,
    value: amount,
    amount,
    [paidKey]: numeric(record[paidKey]),
    [key]: Array.isArray(record[key]) ? record[key] : []
  };
}

/**
 * Adaptar é diferente de migrar: mantém todas as coleções e campos
 * para permitir rollback e auditoria, inclusive dados legados.
 */
export function normalizeAppState(data = {}) {
  return {
    ...data,
    freights: (data.freights || []).map(normalizeFreight),
    expenses: (data.expenses || []).map(normalizeExpense),
    receivables: (data.receivables || []).map(item => normalizeManualAccount(item, 'receivables')),
    payables: (data.payables || []).map(item => normalizeManualAccount(item, 'payables')),
    employees: Array.isArray(data.employees) ? data.employees : [],
    trucks: Array.isArray(data.trucks) ? data.trucks : [],
    categories: Array.isArray(data.categories) ? data.categories : []
  };
}

export function expensePaymentTotals(expense = {}) {
  const installments = Array.isArray(expense.installments) ? expense.installments : [];
  const total = numeric(expense.value);
  const paid = round(installments.reduce((sum, item) => sum + numeric(item.paid), 0));
  const balance = Math.max(0, round(total - paid));
  return { total, paid, balance, status: balance === 0 && total > 0 ? 'Paga' : paid > 0 ? 'Parcial' : 'Pendente' };
}

export function accountPaymentTotals(account = {}, kind = 'receivables') {
  const total = numeric(account.value ?? account.amount);
  const entries = kind === 'payables' ? account.payments : account.receipts;
  const history = Array.isArray(entries) ? entries : [];
  const recorded = numeric(account[kind === 'payables' ? 'paid' : 'received']);
  const historyPaid = round(history.reduce((sum, item) => sum + numeric(item.amount), 0));
  // Campos agregados históricos podem não possuir extrato; não os zere.
  const paid = Math.max(recorded, historyPaid);
  const balance = Math.max(0, round(total - paid));
  return { total, paid, balance, status: balance === 0 && total > 0 ? 'Paga' : paid > 0 ? 'Parcial' : 'Pendente' };
}
