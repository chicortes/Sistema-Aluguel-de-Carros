import { useEffect, useState } from 'react'
import { pedidoService } from '../../services/pedidoService'
import { useAuth } from '../../contexts/AuthContext'
import { StatusBadge } from '../../components/StatusPedido'
import { data, diasEntre } from '../../utils/formatos'

const FILTROS = [
  { valor: 'PENDENTE', rotulo: 'Para analisar' },
  { valor: 'APROVADO', rotulo: 'Aguardando contrato' },
  { valor: 'TODOS', rotulo: 'Todos' },
]

export default function PainelAgente() {
  const { usuario } = useAuth()
  const [pedidos, setPedidos] = useState(null)
  const [filtro, setFiltro] = useState('PENDENTE')
  const [erro, setErro] = useState('')

  const carregar = () => pedidoService.listarTodos().then(setPedidos).catch((e) => setErro(e.message))
  useEffect(() => { carregar() }, [])

  async function acao(fn) {
    setErro('')
    try {
      await fn()
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  const avaliar = (p, parecer) => {
    const comentario = window.prompt(parecer === 'POSITIVO' ? 'Comentário do parecer (opcional):' : 'Motivo da reprovação:') ?? null
    if (comentario === null) return
    acao(() => pedidoService.avaliar(p.id, { parecer, comentario }))
  }

  const contratar = (p, proprietario) =>
    acao(() => pedidoService.executarContrato(p.id, { proprietario, comCredito: usuario.tipoAgente === 'BANCO' }))

  const visiveis = pedidos?.filter((p) => filtro === 'TODOS' || p.status === filtro) ?? []

  return (
    <section>
      <div className="cabecalho-secao">
        <h1>Pedidos de aluguel</h1>
        <div className="filtros" role="tablist">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              role="tab"
              aria-selected={filtro === f.valor}
              className={`filtro ${filtro === f.valor ? 'filtro--ativo' : ''}`}
              onClick={() => setFiltro(f.valor)}
            >
              {f.rotulo}
            </button>
          ))}
        </div>
      </div>

      {erro && <p className="alerta alerta--erro" role="alert">{erro}</p>}
      {!pedidos && <p className="carregando">Carregando pedidos…</p>}
      {pedidos && visiveis.length === 0 && (
        <div className="vazio">
          <h2>Nada por aqui</h2>
          <p>Quando um cliente enviar um pedido, ele aparece em “Para analisar”.</p>
        </div>
      )}

      {visiveis.length > 0 && (
        <div className="tabela-rolagem">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nº</th>
                <th>Cliente</th>
                <th>Carro</th>
                <th>Período</th>
                <th>Situação</th>
                <th><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.clienteNome}</td>
                  <td>{p.automovel?.marca} {p.automovel?.modelo}</td>
                  <td>{data(p.dataInicio)} a {data(p.dataFim)} <small>({diasEntre(p.dataInicio, p.dataFim)} d)</small></td>
                  <td><StatusBadge status={p.status} /></td>
                  <td className="tabela__acoes">
                    {p.status === 'PENDENTE' && (
                      <>
                        <button className="btn btn--primario btn--pequeno" onClick={() => avaliar(p, 'POSITIVO')}>Aprovar</button>
                        <button className="btn btn--fantasma btn--pequeno" onClick={() => avaliar(p, 'NEGATIVO')}>Reprovar</button>
                      </>
                    )}
                    {p.status === 'APROVADO' && (
                      <select
                        className="btn btn--secundario btn--pequeno"
                        defaultValue=""
                        onChange={(e) => e.target.value && contratar(p, e.target.value)}
                        aria-label="Assinar contrato registrando o carro em nome de"
                      >
                        <option value="" disabled>Assinar contrato…</option>
                        <option value="CLIENTE">Carro em nome do cliente</option>
                        <option value="EMPRESA">Carro em nome da empresa</option>
                        <option value="BANCO">Carro em nome do banco</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
