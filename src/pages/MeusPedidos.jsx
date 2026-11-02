import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { pedidoService } from '../services/pedidoService'
import { StatusBadge, TrilhaStatus } from '../components/StatusPedido'
import { data, diasEntre } from '../utils/formatos'

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState(null)
  const [erro, setErro] = useState('')

  const carregar = () => pedidoService.listarMeus().then(setPedidos).catch((e) => setErro(e.message))
  useEffect(() => { carregar() }, [])

  async function cancelar(id) {
    if (!window.confirm('Cancelar este pedido?')) return
    try {
      await pedidoService.cancelar(id)
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  if (!pedidos && !erro) return <p className="carregando">Carregando pedidos…</p>

  return (
    <section>
      <div className="cabecalho-secao">
        <h1>Meus pedidos</h1>
        <Link to="/pedidos/novo" className="btn btn--primario">Fazer novo pedido</Link>
      </div>

      {erro && <p className="alerta alerta--erro" role="alert">{erro}</p>}

      {pedidos?.length === 0 && (
        <div className="vazio">
          <h2>Nenhum pedido ainda</h2>
          <p>Escolha um carro e as datas. Um agente analisa o pedido e você acompanha tudo por aqui.</p>
          <Link to="/pedidos/novo" className="btn btn--primario">Fazer meu primeiro pedido</Link>
        </div>
      )}

      <ul className="lista-pedidos">
        {pedidos?.map((p) => (
          <li key={p.id} className="pedido">
            <div className="pedido__cabeca">
              <div>
                <h2 className="pedido__carro">{p.automovel?.marca} {p.automovel?.modelo}</h2>
                <p className="pedido__meta">
                  Pedido nº {p.id}, de {data(p.dataInicio)} a {data(p.dataFim)} ({diasEntre(p.dataInicio, p.dataFim)} dias)
                </p>
              </div>
              <StatusBadge status={p.status} />
            </div>

            <TrilhaStatus status={p.status} />

            {p.parecer?.comentario && (
              <p className="pedido__parecer"><strong>{p.parecer.agente}:</strong> {p.parecer.comentario}</p>
            )}
            {p.contrato && (
              <p className="pedido__parecer">
                Carro registrado em nome {p.contrato.proprietario === 'CLIENTE' ? 'do cliente' : p.contrato.proprietario === 'BANCO' ? 'do banco' : 'da empresa'}
                {p.contrato.bancoCredito && `, com contrato de crédito do ${p.contrato.bancoCredito}`}.
              </p>
            )}

            {['PENDENTE', 'APROVADO'].includes(p.status) && (
              <div className="pedido__acoes">
                {p.status === 'PENDENTE' && <Link to={`/pedidos/${p.id}/editar`} className="btn btn--secundario">Alterar</Link>}
                <button className="btn btn--link btn--link-perigo" onClick={() => cancelar(p.id)}>Cancelar pedido</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
