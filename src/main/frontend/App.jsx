import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import MeusPedidos from './pages/MeusPedidos'
import NovoPedido from './pages/NovoPedido'
import Perfil from './pages/Perfil'
import PainelAgente from './pages/agente/PainelAgente'
import NaoEncontrado from './pages/NaoEncontrado'

function Inicio() {
  const { usuario } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  return <Navigate to={usuario.tipo === 'AGENTE' ? '/agente/pedidos' : '/pedidos'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<ProtectedRoute tipo="CLIENTE"><AppLayout /></ProtectedRoute>}>
        <Route path="/pedidos" element={<MeusPedidos />} />
        <Route path="/pedidos/novo" element={<NovoPedido />} />
        <Route path="/pedidos/:id/editar" element={<NovoPedido />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route element={<ProtectedRoute tipo="AGENTE"><AppLayout /></ProtectedRoute>}>
        <Route path="/agente/pedidos" element={<PainelAgente />} />
        <Route path="/agente/pedidos/:id/editar" element={<NovoPedido />} />
      </Route>

      <Route path="*" element={<NaoEncontrado />} />
    </Routes>
  )
}
