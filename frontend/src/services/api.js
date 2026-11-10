// Cliente HTTP único da aplicação. Todas as chamadas ao back-end passam por aqui.
// Por padrão o app fala com a API Spring Boot. Com VITE_USE_MOCK=true ele usa dados simulados no navegador.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const BASE_URL = '/api'
const TOKEN_KEY = 'vaptvupt:token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = tokenStorage.get()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(BASE_URL + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    // 401 com token enviado = sessão expirada; sem token (ex.: login errado) mostra a mensagem do servidor.
    if (res.status === 401 && token) {
      tokenStorage.clear()
      throw new Error('Sua sessão expirou. Entre novamente.')
    }
    throw new Error(data.message || `Erro ${res.status} ao falar com o servidor.`)
  }
  return res.status === 204 ? null : res.json()
}

export const http = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
}
