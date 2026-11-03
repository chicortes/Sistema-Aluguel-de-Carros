import logo from '../assets/logo.png'
import logoClaro from '../assets/logo-claro.png'

// Logo do VaptVupt. Use variante="claro" sobre fundos escuros (letras brancas).
export default function Logo({ variante = 'escuro', tamanho = 'md' }) {
  return (
    <img
      src={variante === 'claro' ? logoClaro : logo}
      alt="VaptVupt"
      className={`logo logo--${tamanho}`}
    />
  )
}
