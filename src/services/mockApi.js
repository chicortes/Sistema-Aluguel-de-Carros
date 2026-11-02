// Back-end simulado no navegador (localStorage). Ativado com VITE_USE_MOCK=true.
// Segue o mesmo contrato da API REST, então trocar para o Spring Boot não muda as telas.
const DB_KEY = 'vaptvupt:mockdb'
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))

const seed = () => ({
  usuarios: [
    { id: 1, tipo: 'AGENTE', tipoAgente: 'BANCO', nome: 'Banco Horizonte', login: 'banco', senha: '123' },
    { id: 2, tipo: 'AGENTE', tipoAgente: 'EMPRESA', nome: 'Locadora Serra Azul', login: 'empresa', senha: '123' },
    {
      id: 3, tipo: 'CLIENTE', nome: 'Ana Souza', login: 'ana', senha: '123',
      rg: 'MG-12.345.678', cpf: '123.456.789-00', endereco: 'Rua da Bahia, 1000 - Belo Horizonte',
      profissao: 'Engenheira',
      empregadores: [{ nome: 'Construtora Minas', rendimento: 8500 }],
    },
  ],
  automoveis: [
    { id: 1, matricula: 'MAT-0001', placa: 'RTA1B23', marca: 'Fiat', modelo: 'Argo', ano: 2023 },
    { id: 2, matricula: 'MAT-0002', placa: 'QPX4C56', marca: 'Volkswagen', modelo: 'T-Cross', ano: 2022 },
    { id: 3, matricula: 'MAT-0003', placa: 'SBH7D89', marca: 'Chevrolet', modelo: 'Onix', ano: 2024 },
    { id: 4, matricula: 'MAT-0004', placa: 'PUC2E10', marca: 'Toyota', modelo: 'Corolla Cross', ano: 2024 },
  ],
  pedidos: [],
  nextId: 100,
})

const load = () => JSON.parse(localStorage.getItem(DB_KEY)) || seed()
const save = (db) => localStorage.setItem(DB_KEY, JSON.stringify(db))
const semSenha = ({ senha, ...u }) => u
const sessaoAtual = (db) => {
  const id = Number(localStorage.getItem('vaptvupt:token')?.replace('mock-', ''))
  const u = db.usuarios.find((x) => x.id === id)
  if (!u) throw new Error('Sua sessão expirou. Entre novamente.')
  return u
}
const comAutomovel = (db, p) => ({ ...p, automovel: db.automoveis.find((a) => a.id === p.automovelId) })

// ---------- Auth ----------
export async function login({ login, senha }) {
  await delay()
  const db = load()
  const u = db.usuarios.find((x) => x.login === login && x.senha === senha)
  if (!u) throw new Error('Usuário ou senha incorretos.')
  return { token: `mock-${u.id}`, usuario: semSenha(u) }
}

export async function me() {
  await delay(100)
  return semSenha(sessaoAtual(load()))
}

// ---------- Clientes (CRUD) ----------
export async function cadastrarCliente(dados) {
  await delay()
  const db = load()
  if (db.usuarios.some((u) => u.login === dados.login)) throw new Error('Esse usuário já existe. Escolha outro.')
  if (db.usuarios.some((u) => u.cpf && u.cpf === dados.cpf)) throw new Error('Já existe um cadastro com esse CPF.')
  const novo = { ...dados, id: db.nextId++, tipo: 'CLIENTE' }
  db.usuarios.push(novo)
  save(db)
  return semSenha(novo)
}

export async function buscarCliente(id) {
  await delay(100)
  const u = load().usuarios.find((x) => x.id === id && x.tipo === 'CLIENTE')
  if (!u) throw new Error('Cliente não encontrado.')
  return semSenha(u)
}

export async function atualizarCliente(id, dados) {
  await delay()
  const db = load()
  const i = db.usuarios.findIndex((x) => x.id === id)
  if (i < 0) throw new Error('Cliente não encontrado.')
  const { senha, ...resto } = dados
  db.usuarios[i] = { ...db.usuarios[i], ...resto, ...(senha ? { senha } : {}) }
  save(db)
  return semSenha(db.usuarios[i])
}

export async function excluirCliente(id) {
  await delay()
  const db = load()
  db.usuarios = db.usuarios.filter((x) => x.id !== id)
  db.pedidos = db.pedidos.filter((p) => p.clienteId !== id)
  save(db)
  return null
}

// ---------- Automóveis ----------
export async function listarAutomoveis() {
  await delay(100)
  return load().automoveis
}

// ---------- Pedidos ----------
export async function listarMeusPedidos() {
  await delay()
  const db = load()
  const u = sessaoAtual(db)
  return db.pedidos.filter((p) => p.clienteId === u.id).map((p) => comAutomovel(db, p)).reverse()
}

export async function listarTodosPedidos() {
  await delay()
  const db = load()
  return db.pedidos
    .map((p) => ({ ...comAutomovel(db, p), clienteNome: db.usuarios.find((u) => u.id === p.clienteId)?.nome }))
    .reverse()
}

export async function criarPedido(dados) {
  await delay()
  const db = load()
  const u = sessaoAtual(db)
  const pedido = {
    id: db.nextId++,
    clienteId: u.id,
    ...dados,
    automovelId: Number(dados.automovelId),
    status: 'PENDENTE',
    criadoEm: new Date().toISOString(),
  }
  db.pedidos.push(pedido)
  save(db)
  return comAutomovel(db, pedido)
}

function alterarPedido(id, fn) {
  const db = load()
  const p = db.pedidos.find((x) => x.id === id)
  if (!p) throw new Error('Pedido não encontrado.')
  fn(p, db)
  save(db)
  return comAutomovel(db, p)
}

export async function atualizarPedido(id, dados) {
  await delay()
  return alterarPedido(id, (p) => {
    if (p.status !== 'PENDENTE') throw new Error('Só dá para alterar pedidos que ainda não foram analisados.')
    Object.assign(p, dados, { automovelId: Number(dados.automovelId) })
  })
}

export async function cancelarPedido(id) {
  await delay()
  return alterarPedido(id, (p) => {
    if (!['PENDENTE', 'APROVADO'].includes(p.status)) throw new Error('Esse pedido não pode mais ser cancelado.')
    p.status = 'CANCELADO'
  })
}

export async function avaliarPedido(id, { parecer, comentario }) {
  await delay()
  return alterarPedido(id, (p, db) => {
    if (p.status !== 'PENDENTE') throw new Error('Esse pedido já foi avaliado.')
    p.status = parecer === 'POSITIVO' ? 'APROVADO' : 'REPROVADO'
    p.parecer = { comentario, agente: sessaoAtual(db).nome, em: new Date().toISOString() }
  })
}

export async function executarContrato(id, { proprietario, comCredito }) {
  await delay()
  return alterarPedido(id, (p, db) => {
    if (p.status !== 'APROVADO') throw new Error('Só pedidos aprovados podem virar contrato.')
    const agente = sessaoAtual(db)
    p.status = 'CONTRATADO'
    p.contrato = {
      proprietario,
      bancoCredito: comCredito ? agente.nome : null,
      em: new Date().toISOString(),
    }
  })
}

export function resetarMock() {
  localStorage.removeItem(DB_KEY)
}
