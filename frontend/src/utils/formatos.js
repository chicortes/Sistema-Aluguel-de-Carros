export const moeda = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const data = (iso) => (iso ? new Date(iso + (iso.length === 10 ? 'T00:00' : '')).toLocaleDateString('pt-BR') : '')

export function mascaraCpf(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export const cpfValido = (cpf) => cpf.replace(/\D/g, '').length === 11

export const diasEntre = (inicio, fim) =>
  Math.round((new Date(fim) - new Date(inicio)) / 86_400_000)
