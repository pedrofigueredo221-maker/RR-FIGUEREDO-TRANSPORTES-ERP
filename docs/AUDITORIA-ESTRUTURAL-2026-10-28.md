# Auditoria estrutural e plano de reescrita integral — 28/10/2026

## Escopo e fonte da verdade
- **Código a reestruturar:** `RR-PROJETO-NOVO` (branch `main`, somente leitura na auditoria).
- **Referência funcional:** `RR-PROJETO-ANTIGO` (branch `main`).
- **Regra principal:** nenhum campo, fluxo, cálculo, integração, permissão ou histórico pode desaparecer.
- **Governança:** nenhuma alteração direta em `main`; branch e PR detalhada; merge somente após aprovação.
- **Proteções:** Login e Menu Lateral congelados. A autorização para refatoração geral **não** substitui a confirmação explícita para alterar essas telas; pedir antes de tocar nos seus componentes, estilos ou dependências que mudem seu comportamento.

## Inventário objetivo
| Item | Antigo | Novo |
| --- | ---: | ---: |
| Arquivos versionados na main | 84 | 31 |
| Tamanho total de blobs | 570095 bytes | 64403 bytes |
| Arquivos identificados de testes | 4 | 1 |
| Workflows | 3 | 1 |

### Concentração de responsabilidade no legado
- `src/styles/screens.css`: 20.884 bytes; `src/styles.css`: 16.776 bytes; `src/styles/balanco-geral.css`: 12.659 bytes. Alto risco de cascata e sobreposição de seletores.
- `src/EditablePage.jsx`: 15.784 bytes; `src/App.jsx`: 15.577 bytes; `src/screens/ContasAReceber.jsx`: 15.184 bytes. Candidatos a decomposição por responsabilidade, não a cópia literal.
- `src/screens/Despesas.jsx`: 11.660 bytes; `src/screens/Cadastros.jsx`: 10.751 bytes; formulários de fretes distribuídos em vários arquivos.
- A extensão dos arquivos é um **indicador de revisão**, não prova isolada de má qualidade.

## Achados confirmados no projeto novo
1. **Fretes incompletos:** `src/features/fretes/FretesPage.jsx` usa formulário simplificado, sem edição completa, histórico de recebimentos, custos e regras visíveis do legado. Não deve substituir a tela funcional sem testes de equivalência.
2. **Contas incompletas:** `src/features/contas/ContasPage.jsx` lista `receivables` e `payables`, sem cadastro/edição/baixas integrados. A fonte antiga de contas a pagar inclui parcelas em `expenses`; falta adaptador funcional para evitar omissão ou dupla contagem.
3. **Autenticação não configurada:** `src/app/config.js` e `index.html` apresentam `SUPABASE_URL` e `SUPABASE_ANON_KEY` vazios. `src/app/App.jsx` acessa `supabase.auth` no login sem checar `supabase` nulo. Erro de execução reproduzível por inspeção: `Cannot read properties of null (reading 'auth')`. Configurar conexão sem expor segredos e sem alterar a tela congelada sem autorização.
4. **Persistência concorrente:** `src/app/App.jsx` faz leitura/escrita diretamente e `src/services/storage.js` também possui funções de persistência. Consolidar numa única interface de repositório, mantendo controle de versão otimista e erros.
5. **Demo/produção:** `DEFAULT_DATA` é inicializado no estado antes da leitura remota. Nunca permitir que dados de demonstração sejam gravados na produção, inclusive quando a consulta inicial falhar.
6. **Cálculos:** `src/domain/finance.js` contém operações de frete e contas. Formalizar unidades monetárias em centavos e comparar resultados com os testes do antigo; revisar semântica de `freightNet` antes de qualquer mudança.
7. **Compatibilidade:** `src/domain/legacyCompatibility.js` preserva campos desconhecidos, mas a normalização deve ser apenas de leitura até que seja validada em registros históricos reais anonimizados.
8. **CSS:** `src/styles.css` contém regras globais de login, menu e páginas. `src/styles/legacy-internal-layout.css` já isola estilos sob `.main`. Separar tokens e estilos por componente sem alterar Login/Menu congelados.
9. **Testes insuficientes:** novo tem apenas `tests/legacyCompatibility.test.js`, sem evidência de cobertura completa de formulários, permissões, sincronização, fluxo de pagamentos, builds e UI.
10. **Permissões:** `visitorMode` depende de email na UI. Verificar políticas RLS e autorização no backend antes de aceitar segurança como equivalente.
11. **Recuperação de senha:** `src/services/auth.js` ainda usa URL do repositório original como redirecionamento. Ajustar somente após autorização de alterações que impactem autenticação e com testes de ambiente.
12. **Workflow:** `.github/workflows/deploy-pages.yml` publica o build, mas não substitui testes de domínio, lint, segurança e bloqueio de regressões.

## Arquitetura alvo
```
src/
  app/             composição, roteamento e provedores
  domain/          regras puras: fretes, comissão, despesas, contas, parcelas
  features/
    fretes/        componentes, formulários, hooks, seletores e testes
    despesas/      ...
    contas/        contas a pagar e a receber com histórico
    cadastros/     ...
    dashboard/     ...
    relatorios/    ...
  components/      modal, tabela, campo, filtros e botões reutilizáveis
  services/        autenticação, Supabase, repositórios, cache e erros
  styles/          tokens, componentes e estilos escopados
tests/             testes de contrato, regressão e integração
```

## Contratos de compatibilidade obrigatórios
- Mesmo esquema Supabase `public.app_state`, `id=1`, `version`, dados reais e IDs preservados; sem migração destrutiva.
- Fretes: descontos gerais, pedágio opcional na base de comissão, comissão fixa/percentual, bônus, custos, combustível real/estimado, adiantamento, saldo, situação e recebíveis vinculados.
- Despesas: categorias, caminhão, vencimentos, parcelas, pagamentos parciais, histórico e exclusão protegida.
- Contas a receber/pagar: criação manual, derivação de frete/despesa, múltiplas baixas, meios de pagamento, valores em centavos, situação automática, bloqueio de conta fechada, histórico legado.
- Cadastros: funcionários, caminhões, vínculo motorista/caminhão, inativos e edição.
- Dashboard/relatórios: mesmas métricas, filtros por período, motorista e caminhão, sem dupla contagem.
- Visitante: somente leitura **também no Supabase RLS**.
- Telas congeladas: Login e Menu Lateral permanecem intocadas até aprovação explícita.

## Execução segura (PRs por módulo)
0. **Auditoria**: inventário, riscos, contratos e matriz de equivalência (esta PR, documentação somente).
1. **Base de testes**: executar testes existentes, criar fixtures anonimizadas e snapshots de cálculos e fluxos.
2. **Domínio**: separar regras puras de frete, pagamentos, parcelas e saldos; preservar resultados.
3. **Persistência**: unificar acesso a Supabase, validação de versão, erros e isolamento de demo.
4. **Componentes internos**: modal, tabelas, formulários e filtros com CSS escopado.
5. **Fretes**: reescrita completa com os campos e cálculos originais, em uma PR própria.
6. **Despesas e Contas**: unificar histórico, parcelas, baixas e vínculos sem perdas.
7. **Cadastros, Balanço e Relatórios**: refatorar interfaces e consultas preservando resultados.
8. **Protegidas**: Login e Menu Lateral somente após autorização explícita e revisão específica.
9. **Validação final**: testes automatizados, build, navegador, responsividade, RLS, reconciliação de dados e checklist funcional comparado com o antigo.

## Critérios de aprovação
- Cada PR identifica exatamente quais comportamentos foram preservados, seus testes, riscos e limitações.
- Zero mudanças diretas na main; zero merges automáticos.
- Nenhum resultado é declarado concluído sem build/teste funcional correspondente.
- Nenhuma alteração na produção ou nas telas congeladas sem autorização.
- Sem apagar código ou arquivos funcionais até o substituto estar comprovadamente equivalente.
