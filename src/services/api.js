export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

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

  if (res.status === 401) {
    tokenStorage.clear()
    throw new Error('Sua sessão expirou. Entre novamente.')
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
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
