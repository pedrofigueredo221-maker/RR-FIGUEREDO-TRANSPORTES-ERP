import { safeNumber } from './formatters.js';
import { freightDriverPayment, freightCompanyCosts, freightProfit } from '../domain/finance.js';

export function buildFinancialSummary(data = {}) {
  const freights = Array.isArray(data.freights) ? data.freights : [];
  const expenses = Array.isArray(data.expenses) ? data.expenses : [];

  const revenue = freights.reduce((sum, freight) => sum + safeNumber(freight.value), 0);
  const driverPayment = freights.reduce((sum, freight) => sum + freightDriverPayment(freight), 0);
  const companyCosts = freights.reduce((sum, freight) => sum + freightCompanyCosts(freight), 0);
  const totalExpenseValue = expenses.reduce((sum, expense) => sum + safeNumber(expense.value), 0);
  const profit = freights.reduce((sum, freight) => sum + freightProfit(freight), 0) - totalExpenseValue;

  return {
    revenue,
    driverPayment,
    companyCosts,
    totalExpenseValue,
    profit,
    receivable: freights.reduce((sum, freight) => sum + Math.max(0, safeNumber(freight.value) - safeNumber(freight.received)), 0),
    payable: expenses.reduce((sum, expense) => sum + Math.max(0, safeNumber(expense.value) - (Array.isArray(expense.installments) ? expense.installments.reduce((t, s) => t + safeNumber(s.paid), 0) : 0)), 0),
    totalFreights: freights.length
  };
}
