import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from './Logo'

export default function AppLayout() {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()
  const ehAgente = usuario.tipo === 'AGENTE'

  function handleSair() {
    sair()
    navigate('/login')
  }

  return (
    <div className="app">
      <header className="topo">
        <div className="topo__conteudo">
          <NavLink to="/" className="topo__marca">
            <Logo variante="claro" tamanho="sm" />
          </NavLink>

          <nav className="topo__nav">
            {ehAgente ? (
              <NavLink to="/agente/pedidos">Pedidos para avaliar</NavLink>
            ) : (
              <>
                <NavLink to="/pedidos" end>Meus pedidos</NavLink>
                <NavLink to="/pedidos/novo">Novo pedido</NavLink>
                <NavLink to="/perfil">Meus dados</NavLink>
              </>
            )}
          </nav>

          <div className="topo__usuario">
            <span>{usuario.nome}</span>
            <button className="btn btn--fantasma" onClick={handleSair}>Sair</button>
          </div>
        </div>
      </header>

      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}
