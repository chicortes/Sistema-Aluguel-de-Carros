// Campo de formulário com rótulo e mensagem de erro.
export default function Campo({ rotulo, erro, dica, children, id }) {
  return (
    <div className={`campo ${erro ? 'campo--erro' : ''}`}>
      <label htmlFor={id}>{rotulo}</label>
      {children}
      {dica && !erro && <small className="campo__dica">{dica}</small>}
      {erro && <small className="campo__erro">{erro}</small>}
    </div>
  )
}
