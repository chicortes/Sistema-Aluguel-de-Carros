import { http, USE_MOCK } from './api'
import * as mock from './mockApi'

export const automovelService = {
  listar: () => (USE_MOCK ? mock.listarAutomoveis() : http.get('/automoveis')),
}
