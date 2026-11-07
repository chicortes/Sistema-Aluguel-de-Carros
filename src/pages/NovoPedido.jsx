import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Campo from '../components/Campo'
import Placa from '../components/Placa'
import { automovelService } from '../services/automovelService'
import { pedidoService } from '../services/pedidoService'
import { diasEntre } from '../utils/formatos'

const hoje = () => new Date().toISOString().slice(0, 10)

// Serve para criar e para alterar um pedido
export default function NovoPedido() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()
  const [automoveis, setAutomoveis] = useState([])
  const [form, setForm] = useState({ automovelId: '', dataInicio: '', dataFim: '', observacao: '' })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    automovelService.listar().then(setAutomoveis).catch((e) => setErro(e.message))
    if (editando) {
      pedidoService.listarMeus().then((lista) => {
        const p = lista.find((x) => x.id === Number(id))
        if (p) setForm({ automovelId: p.automovelId, dataInicio: p.dataInicio, dataFim: p.dataFim, observacao: p.observacao || '' })
      })
    }
  }, [id, editando])

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))
  const dias = form.dataInicio && form.dataFim ? diasEntre(form.dataInicio, form.dataFim) : 0

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (!form.automovelId) return setErro('Escolha um carro.')
    if (!form.dataInicio || !form.dataFim) return setErro('Informe as datas de retirada e devolução.')
    if (dias < 1) return setErro('A devolução precisa ser pelo menos um dia depois da retirada.')

    setEnviando(true)
    try {
      if (editando) await pedidoService.atualizar(Number(id), form)
      else await pedidoService.criar(form)
      navigate('/pedidos')
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="secao-estreita">
      <h1>{editando ? 'Alterar pedido' : 'Novo pedido de aluguel'}</h1>
      <p className="texto-apoio">Depois de enviado, o pedido passa por uma análise financeira feita por um agente.</p>

      <form className="formulario" onSubmit={handleSubmit}>
        {erro && <p className="alerta alerta--erro" role="alert">{erro}</p>}

        <fieldset>
          <legend>Carro</legend>
          <div className="carros" role="radiogroup" aria-label="Escolha o carro">
            {automoveis.map((a) => (
              <label key={a.id} className={`carro ${Number(form.automovelId) === a.id ? 'carro--escolhido' : ''}`}>
                <input type="radio" name="automovel" value={a.id} checked={Number(form.automovelId) === a.id} onChange={set('automovelId')} />
                <span className="carro__nome">{a.marca} {a.modelo}</span>
                <span className="carro__ano">{a.ano}</span>
                <Placa texto={a.placa} tamanho="xs" />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Período</legend>
          <div className="grade-2">
            <Campo id="inicio" rotulo="Retirada">
              <input id="inicio" type="date" min={hoje()} value={form.dataInicio} onChange={set('dataInicio')} />
            </Campo>
            <Campo id="fim" rotulo="Devolução">
              <input id="fim" type="date" min={form.dataInicio || hoje()} value={form.dataFim} onChange={set('dataFim')} />
            </Campo>
          </div>
          {dias > 0 && <p className="texto-apoio">{dias} {dias === 1 ? 'dia' : 'dias'} de aluguel.</p>}
        </fieldset>

        <Campo id="obs" rotulo="Observações (opcional)">
          <textarea id="obs" rows="3" value={form.observacao} onChange={set('observacao')} />
        </Campo>

        <div className="formulario__acoes">
          <button className="btn btn--primario" disabled={enviando}>
            {enviando ? 'Enviando…' : editando ? 'Salvar alterações' : 'Enviar pedido'}
          </button>
          <button type="button" className="btn btn--fantasma" onClick={() => navigate('/pedidos')}>Voltar</button>
        </div>
      </form>
    </section>
  )
}
