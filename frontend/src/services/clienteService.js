import { http, USE_MOCK } from './api'
import * as mock from './mockApi'

export const clienteService = {
  cadastrar: (dados) => (USE_MOCK ? mock.cadastrarCliente(dados) : http.post('/clientes', dados)),
  buscar: (id) => (USE_MOCK ? mock.buscarCliente(id) : http.get(`/clientes/${id}`)),
  atualizar: (id, dados) => (USE_MOCK ? mock.atualizarCliente(id, dados) : http.put(`/clientes/${id}`, dados)),
  excluir: (id) => (USE_MOCK ? mock.excluirCliente(id) : http.delete(`/clientes/${id}`)),
}
