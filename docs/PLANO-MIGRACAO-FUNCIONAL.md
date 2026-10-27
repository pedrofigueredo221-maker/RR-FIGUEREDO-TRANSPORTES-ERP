# Plano de migração funcional — R&R

## Princípio
O repositório ANTIGO é a especificação comportamental. O repositório NOVO é a base arquitetural. Não copiar componentes grandes e acoplados; extrair regras puras, criar componentes pequenos e testar a equivalência antes de substituir telas.

## Proteções
- Nunca escrever na main ou fazer merge sem aprovação.
- Login e Menu Lateral congelados; qualquer alteração direta ou indireta requer autorização explícita.
- Não modificar dados reais do Supabase durante a migração; usar cópias anonimizadas em testes.
- Não usar dados de demonstração para sobrescrever dados reais.
- Preservar campos legados desconhecidos, histórico de baixas, valores e IDs.
- Visitantes devem ser somente leitura na UI **e** nas políticas RLS.

## Ordem de migração
1. Domínio: fórmulas de fretes, comissões, despesas, recebíveis, pagamentos, centavos, datas e validações.
2. Compatibilidade: normalizar dados históricos em memória sem migração destrutiva.
3. Componentes: formulários e tabelas compartilhados, modais, filtros e histórico.
4. Fretes: reproduzir todos os campos, edição, comissões e cálculos do antigo.
5. Contas a pagar e a receber: mesma tela para criar/editar/baixar cada conta, múltiplas baixas, métodos PIX/Dinheiro/Crédito/Débito/TED/Boleto, histórico, saldo e bloqueio de conta fechada.
6. Despesas e manutenção: parcelas, vínculos e categorias.
7. Cadastros e relatórios: motoristas, caminhões, permissões, filtros e exportações.
8. Dashboard: indicadores reconciliados com fretes, contas e despesas, sem dupla contagem.

## Critérios de aceite
- Testes automatizados de todas as regras financeiras e casos de legado.
- Comparação de resultados em amostra de dados com o sistema antigo.
- Build de produção e testes de navegação, formulário, responsividade e segurança.
- Nenhuma regressão nas telas congeladas.
- PR com descrição de arquivos, riscos, evidências, limitações e autorização antes do merge.

## Estado da primeira etapa
Incluída camada de compatibilidade `src/domain/legacyCompatibility.js` e testes iniciais. Isso **não** conclui a migração funcional; nenhuma tela foi substituída nesta etapa.
