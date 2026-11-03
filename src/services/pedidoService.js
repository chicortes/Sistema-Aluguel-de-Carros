import { http, USE_MOCK } from './api'
import * as mock from './mockApi'

export const pedidoService = {
  // Cliente
  listarMeus: () => (USE_MOCK ? mock.listarMeusPedidos() : http.get('/pedidos/meus')),
  criar: (dados) => (USE_MOCK ? mock.criarPedido(dados) : http.post('/pedidos', dados)),
  atualizar: (id, dados) => (USE_MOCK ? mock.atualizarPedido(id, dados) : http.put(`/pedidos/${id}`, dados)),
  cancelar: (id) => (USE_MOCK ? mock.cancelarPedido(id) : http.patch(`/pedidos/${id}/cancelar`)),

  // Agente
  listarTodos: () => (USE_MOCK ? mock.listarTodosPedidos() : http.get('/pedidos')),
  avaliar: (id, avaliacao) => (USE_MOCK ? mock.avaliarPedido(id, avaliacao) : http.patch(`/pedidos/${id}/avaliar`, avaliacao)),
  executarContrato: (id, dados) =>
    USE_MOCK ? mock.executarContrato(id, dados) : http.post(`/pedidos/${id}/contrato`, dados),
}
