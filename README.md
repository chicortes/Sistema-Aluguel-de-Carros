# VaptVupt · Front-end

Front-end do sistema de aluguel de carros VaptVupt (LAB02 — DIAW, PUC Minas), feito com React + Vite.

> Este arquivo é provisório. Na entrega, use o template de README do professor:
> https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/blob/main/TEMPLATES/template_README.md

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:5173.

Por padrão o app roda em **modo demonstração**: os dados ficam no `localStorage` do navegador e não é preciso ter o back-end rodando. Usuários de teste:

| Perfil  | Usuário   | Senha |
|---------|-----------|-------|
| Cliente | `ana`     | `123` |
| Banco   | `banco`   | `123` |
| Empresa | `empresa` | `123` |

Para ligar no back-end Spring Boot (porta 8080), crie um `.env` a partir do `.env.example` com `VITE_USE_MOCK=false`. O Vite repassa tudo que começa com `/api` para `http://localhost:8080`.

## Estrutura

```
src/
├── components/     peças reutilizáveis (Placa, ClienteForm, StatusPedido, rotas protegidas…)
├── contexts/       AuthContext: login, logout e sessão
├── pages/          telas (Login, Cadastro, MeusPedidos, NovoPedido, Perfil)
│   └── agente/     PainelAgente (avaliar pedidos e assinar contrato)
├── services/       chamadas à API (uma por entidade) + mockApi.js
├── styles/         global.css
└── utils/          formatação (moeda, data, CPF)
```

No MVC do projeto, o React é a **View**. As telas nunca chamam `fetch` direto: passam pelos `services/`, que espelham os controllers do Spring Boot.

## Contrato da API esperado do back-end

| Método | Rota                          | Quem    | Uso |
|--------|-------------------------------|---------|-----|
| POST   | `/api/auth/login`             | todos   | `{login, senha}` → `{token, usuario}` |
| GET    | `/api/auth/me`                | logado  | usuário da sessão |
| POST   | `/api/clientes`               | público | cadastro de cliente |
| GET    | `/api/clientes/{id}`          | cliente | consultar dados |
| PUT    | `/api/clientes/{id}`          | cliente | alterar dados |
| DELETE | `/api/clientes/{id}`          | cliente | excluir conta |
| GET    | `/api/automoveis`             | logado  | listar carros |
| GET    | `/api/pedidos/meus`           | cliente | pedidos do cliente logado |
| POST   | `/api/pedidos`                | cliente | `{automovelId, dataInicio, dataFim, observacao}` |
| PUT    | `/api/pedidos/{id}`           | cliente | alterar pedido pendente |
| PATCH  | `/api/pedidos/{id}/cancelar`  | cliente | cancelar |
| GET    | `/api/pedidos`                | agente  | todos os pedidos |
| PATCH  | `/api/pedidos/{id}/avaliar`   | agente  | `{parecer: POSITIVO|NEGATIVO, comentario}` |
| POST   | `/api/pedidos/{id}/contrato`  | agente  | `{proprietario: CLIENTE|EMPRESA|BANCO, comCredito}` |

O token vai no cabeçalho `Authorization: Bearer <token>`. Erros devem voltar como `{ "message": "..." }`.

**Status do pedido:** `PENDENTE` → `APROVADO` → `CONTRATADO`, ou `REPROVADO` / `CANCELADO`.
