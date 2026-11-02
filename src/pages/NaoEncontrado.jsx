import { Link } from 'react-router-dom'

export default function NaoEncontrado() {
  return (
    <div className="pagina-solta pagina-solta--centro">
      <h1>Essa rua não existe</h1>
      <p className="texto-apoio">O endereço que você abriu não leva a nenhuma página.</p>
      <Link to="/" className="btn btn--primario">Voltar ao início</Link>
    </div>
  )
}
