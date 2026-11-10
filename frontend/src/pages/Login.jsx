import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Logo from '../components/Logo'
import Campo from '../components/Campo'

export default function Login() {
  const { usuario, entrar } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (usuario) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const u = await entrar(login.trim(), senha)
      const destino = location.state?.de || (u.tipo === 'AGENTE' ? '/agente/pedidos' : '/pedidos')
      navigate(destino, { replace: true })
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="entrada">
      <section className="entrada__estrada" aria-hidden="true">
        <Logo variante="claro" tamanho="lg" />
        <p className="entrada__slogan">Peça seu carro, acompanhe a análise e assine o contrato sem sair de casa.</p>
        <div className="faixa" />
      </section>

      <section className="entrada__painel">
        <div className="entrada__form">
          <h1>Entrar</h1>
          <p className="texto-apoio">Use o usuário e a senha do seu cadastro.</p>

          <form onSubmit={handleSubmit} className="formulario">
            {erro && <p className="alerta alerta--erro" role="alert">{erro}</p>}
            <Campo id="login" rotulo="Usuário">
              <input id="login" value={login} onChange={(e) => setLogin(e.target.value)} autoComplete="username" required />
            </Campo>
            <Campo id="senha" rotulo="Senha">
              <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" required />
            </Campo>
            <button className="btn btn--primario" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
          </form>

          <p className="entrada__rodape">
            Ainda não tem cadastro? <Link to="/cadastro">Criar conta de cliente</Link>
          </p>

          <div className="caixa-demo">
            <strong>Usuários de teste</strong>
            <ul>
              <li>Cliente: <code>cliente</code> / <code>123</code></li>
              <li>Agente: <code>agente</code> / <code>123</code></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
