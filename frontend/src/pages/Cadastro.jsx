import { Link, useNavigate } from 'react-router-dom'
import ClienteForm from '../components/ClienteForm'
import Logo from '../components/Logo'
import { clienteService } from '../services/clienteService'
import { useAuth } from '../contexts/AuthContext'

export default function Cadastro() {
  const navigate = useNavigate()
  const { entrar } = useAuth()

  async function cadastrar(dados) {
    await clienteService.cadastrar(dados)
    await entrar(dados.login, dados.senha)
    navigate('/pedidos', { replace: true })
  }

  return (
    <div className="pagina-solta">
      <header className="pagina-solta__topo">
        <Link to="/login"><Logo variante="claro" tamanho="sm" /></Link>
        <Link to="/login" className="btn btn--fantasma">Já tenho conta</Link>
      </header>
      <main className="pagina-solta__corpo">
        <h1>Criar conta de cliente</h1>
        <p className="texto-apoio">Com a conta criada você já pode fazer seu primeiro pedido de aluguel.</p>
        <ClienteForm onSubmit={cadastrar} textoBotao="Criar conta" />
      </main>
    </div>
  )
}
