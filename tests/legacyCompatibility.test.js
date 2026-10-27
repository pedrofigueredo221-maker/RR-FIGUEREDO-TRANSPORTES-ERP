import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAppState, accountPaymentTotals, expensePaymentTotals } from '../src/domain/legacyCompatibility.js';
import { freightCommission, freightProfit } from '../src/domain/finance.js';

test('normalização mantém dados e coleções desconhecidas sem mutar origem', () => {
  const source = { freights:[{id:'f1',value:1000,discount:100,toll:50,commission:10,deductToll:true,legacyExtra:'preservar'}], expenses:[], receivables:[], customCollection:[{x:1}] };
  const result = normalizeAppState(source);
  assert.equal(result.freights[0].legacyExtra,'preservar');
  assert.deepEqual(result.customCollection,source.customCollection);
  assert.equal(source.freights[0].receipts,undefined);
});
test('comissão respeita desconto geral e pedágio opcional', () => {
  const freight={value:1000,discount:100,toll:50,commission:10,deductToll:true};
  assert.equal(freightCommission(freight),85);
  assert.equal(freightProfit(freight),765);
});
test('não descarta pagamento legado sem histórico detalhado', () => {
  const result=accountPaymentTotals({value:1000,received:400,receipts:[]});
  assert.equal(result.paid,400);
  assert.equal(result.balance,600);
  assert.equal(result.status,'Parcial');
});
test('despesa parcelada preserva saldo correto', () => {
  const result=expensePaymentTotals({value:500,installments:[{value:250,paid:100},{value:250,paid:250}]});
  assert.deepEqual(result,{total:500,paid:350,balance:150,status:'Parcial'});
});
