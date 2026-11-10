import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ClienteForm from '../components/ClienteForm'
import { clienteService } from '../services/clienteService'
import { useAuth } from '../contexts/AuthContext'

export default function Perfil() {
  const { usuario, setUsuario, sair } = useAuth()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    clienteService.buscar(usuario.id).then(setCliente).catch((e) => setErro(e.message))
  }, [usuario.id])

  async function salvar(dados) {
    const atualizado = await clienteService.atualizar(usuario.id, dados)
    setCliente(atualizado)
    setUsuario(atualizado)
    setMensagem('Dados salvos.')
  }

  async function excluir() {
    const ok = window.confirm('Excluir sua conta apaga também todos os seus pedidos. Continuar?')
    if (!ok) return
    try {
      await clienteService.excluir(usuario.id)
      sair()
      navigate('/login', { replace: true })
    } catch (e) {
      setErro(e.message)
    }
  }

  if (erro) return <p className="alerta alerta--erro">{erro}</p>
  if (!cliente) return <p className="carregando">Carregando seus dados…</p>

  return (
    <section className="secao-estreita">
      <h1>Meus dados</h1>
      {mensagem && <p className="alerta alerta--ok" role="status">{mensagem}</p>}
      <ClienteForm inicial={cliente} modo="edicao" onSubmit={salvar} textoBotao="Salvar alterações" />

      <div className="zona-perigo">
        <h2>Excluir conta</h2>
        <p className="texto-apoio">Seu cadastro e todos os pedidos serão apagados. Não dá para desfazer.</p>
        <button className="btn btn--perigo" onClick={excluir}>Excluir minha conta</button>
      </div>
    </section>
  )
}
