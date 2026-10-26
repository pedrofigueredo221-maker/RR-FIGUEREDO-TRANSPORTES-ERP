# R&R Figueredo Transportes ERP

Este repositório foi criado para preservar a funcionalidade atual do sistema e melhorar a qualidade da estrutura, do código e da evolução do projeto sem mexer no repositório original.

## Objetivo da refatoração

- manter a lógica e o comportamento atual
- organizar melhor a aplicação
- reduzir arquivos e duplicações
- melhorar a qualidade do código em React
- manter o visual corporativo e a paleta de cores do sistema
- facilitar manutenção e crescimento futuro

## Estrutura principal

- `src/app` — aplicação e shell principal
- `src/components` — componentes reutilizáveis
- `src/features` — telas por domínio de negócio
- `src/domain` — regras financeiras e validações
- `src/services` — autenticação e persistência
- `src/data` — dados demo
- `src/styles.css` — design system e layout corporativo

## Como rodar

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Importante

A implementação foi organizada para preservar o comportamento funcional do ERP atual, reforçando arquitetura, clareza e escalabilidade sem perder o visual e as regras do negócio.
