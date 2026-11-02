// Mostra em que ponto da estrada o pedido está: enviado → análise → aprovado → contrato.
const ETAPAS = [
  { chave: 'ENVIADO', rotulo: 'Enviado' },
  { chave: 'PENDENTE', rotulo: 'Análise financeira' },
  { chave: 'APROVADO', rotulo: 'Aprovado' },
  { chave: 'CONTRATADO', rotulo: 'Contrato assinado' },
]

const ORDEM = { PENDENTE: 1, APROVADO: 2, CONTRATADO: 3 }

export const STATUS_LABEL = {
  PENDENTE: 'Aguardando análise',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  CANCELADO: 'Cancelado',
  CONTRATADO: 'Contrato assinado',
}

export function StatusBadge({ status }) {
  return <span className={`badge badge--${status.toLowerCase()}`}>{STATUS_LABEL[status] ?? status}</span>
}

export function TrilhaStatus({ status }) {
  if (status === 'CANCELADO' || status === 'REPROVADO') {
    return (
      <p className={`trilha-fim trilha-fim--${status.toLowerCase()}`}>
        {status === 'CANCELADO' ? 'Você cancelou este pedido.' : 'O agente deu parecer negativo para este pedido.'}
      </p>
    )
  }

  const atual = ORDEM[status] ?? 0
  return (
    <ol className="trilha" aria-label={`Situação: ${STATUS_LABEL[status]}`}>
      {ETAPAS.map((etapa, i) => {
        const estado = i < atual ? 'feito' : i === atual ? (status === 'CONTRATADO' ? 'feito' : 'atual') : 'proximo'
        return (
          <li key={etapa.chave} className={`trilha__etapa trilha__etapa--${estado}`}>
            <span className="trilha__marco" />
            <span className="trilha__rotulo">{etapa.rotulo}</span>
          </li>
        )
      })}
    </ol>
  )
}
