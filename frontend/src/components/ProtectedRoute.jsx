import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Bloqueia telas para quem não está logado e separa as áreas de cliente e agente.
export default function ProtectedRoute({ tipo, children }) {
  const { usuario, carregando } = useAuth()
  const location = useLocation()

  if (carregando) return <p className="carregando">Carregando…</p>
  if (!usuario) return <Navigate to="/login" replace state={{ de: location.pathname }} />
  if (tipo && usuario.tipo !== tipo) return <Navigate to="/" replace />
  return children
}
