// Logotipo no formato de placa Mercosul.
export default function Placa({ texto = 'VAPTVUPT', tamanho = 'md' }) {
  return (
    <span className={`placa placa--${tamanho}`} aria-label="VaptVupt">
      <span className="placa__faixa">
        <span>BRASIL</span>
      </span>
      <span className="placa__texto">{texto}</span>
    </span>
  )
}
