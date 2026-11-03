# VaptVupt

Sistema de aluguel de carros VaptVupt (LAB02 — DIAW, PUC Minas), feito com React + Vite.
## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

Por padrão o app roda em **modo demonstração**: os dados ficam no `localStorage` do navegador e não é preciso ter o back-end rodando. Usuários de teste:

| Perfil  | Usuário   | Senha |
|---------|-----------|-------|
| Cliente | `cliente` | `123` |
| Agente  | `agente`  | `123` |

## Estrutura

```
src/
├── components/     peças reutilizáveis (Logo, Placa, ClienteForm, StatusPedido, rotas protegidas…)
├── contexts/       AuthContext: login, logout e sessão
├── pages/          telas (Login, Cadastro, MeusPedidos, NovoPedido, Perfil)
│   └── agente/     PainelAgente (avaliar pedidos e assinar contrato)
├── services/       chamadas à API (uma por entidade) + mockApi.js
├── styles/         global.css
└── utils/          formatação (moeda, data, CPF)
```