import { http, USE_MOCK } from './api'
import * as mock from './mockApi'

export const authService = {
  login: (credenciais) => (USE_MOCK ? mock.login(credenciais) : http.post('/auth/login', credenciais)),
  me: () => (USE_MOCK ? mock.me() : http.get('/auth/me')),
}
