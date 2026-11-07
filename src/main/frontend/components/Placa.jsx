// Placa Mercosul do carro (usada na escolha do automóvel).
export default function Placa({ texto, tamanho = 'xs' }) {
  return (
    <span className={`placa placa--${tamanho}`} aria-label={`Placa ${texto}`}>
      <span className="placa__faixa">
        <span>BRASIL</span>
      </span>
      <span className="placa__texto">{texto}</span>
    </span>
  )
}
