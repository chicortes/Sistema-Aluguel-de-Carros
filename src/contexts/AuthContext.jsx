import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import { tokenStorage } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!tokenStorage.get()) {
      setCarregando(false)
      return
    }
    authService
      .me()
      .then(setUsuario)
      .catch(() => tokenStorage.clear())
      .finally(() => setCarregando(false))
  }, [])

  async function entrar(login, senha) {
    const { token, usuario } = await authService.login({ login, senha })
    tokenStorage.set(token)
    setUsuario(usuario)
    return usuario
  }

  function sair() {
    tokenStorage.clear()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
