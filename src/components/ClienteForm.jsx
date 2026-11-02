import { useState } from 'react'
import Campo from './Campo'
import { cpfValido, mascaraCpf } from '../utils/formatos'

const MAX_EMPREGADORES = 3

const VAZIO = {
  nome: '', rg: '', cpf: '', endereco: '', profissao: '',
  login: '', senha: '', empregadores: [],
}

// Formulário compartilhado entre o cadastro e a edição dos dados do cliente.
export default function ClienteForm({ inicial, modo = 'cadastro', onSubmit, textoBotao }) {
  const [form, setForm] = useState({ ...VAZIO, ...inicial, senha: '' })
  const [erros, setErros] = useState({})
  const [enviando, setEnviando] = useState(false)
  const [erroGeral, setErroGeral] = useState('')

  const set = (campo) => (e) => {
    const valor = campo === 'cpf' ? mascaraCpf(e.target.value) : e.target.value
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  const setEmpregador = (i, campo) => (e) =>
    setForm((f) => ({
      ...f,
      empregadores: f.empregadores.map((emp, j) => (j === i ? { ...emp, [campo]: e.target.value } : emp)),
    }))

  const addEmpregador = () =>
    setForm((f) => ({ ...f, empregadores: [...f.empregadores, { nome: '', rendimento: '' }] }))

  const removerEmpregador = (i) =>
    setForm((f) => ({ ...f, empregadores: f.empregadores.filter((_, j) => j !== i) }))

  function validar() {
    const e = {}
    if (!form.nome.trim()) e.nome = 'Informe o nome completo.'
    if (!form.rg.trim()) e.rg = 'Informe o RG.'
    if (!cpfValido(form.cpf)) e.cpf = 'O CPF precisa ter 11 dígitos.'
    if (!form.endereco.trim()) e.endereco = 'Informe o endereço.'
    if (!form.profissao.trim()) e.profissao = 'Informe a profissão.'
    if (!form.login.trim()) e.login = 'Escolha um nome de usuário.'
    if (modo === 'cadastro' && form.senha.length < 3) e.senha = 'A senha precisa de pelo menos 3 caracteres.'
    form.empregadores.forEach((emp, i) => {
      if (!emp.nome.trim()) e[`emp${i}nome`] = 'Informe a empresa.'
      if (!(Number(emp.rendimento) > 0)) e[`emp${i}rend`] = 'Informe um valor maior que zero.'
    })
    setErros(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErroGeral('')
    if (!validar()) return
    setEnviando(true)
    try {
      await onSubmit({
        ...form,
        empregadores: form.empregadores.map((emp) => ({ ...emp, rendimento: Number(emp.rendimento) })),
      })
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario" onSubmit={handleSubmit} noValidate>
      {erroGeral && <p className="alerta alerta--erro" role="alert">{erroGeral}</p>}

      <fieldset>
        <legend>Identificação</legend>
        <Campo id="nome" rotulo="Nome completo" erro={erros.nome}>
          <input id="nome" value={form.nome} onChange={set('nome')} autoComplete="name" />
        </Campo>
        <div className="grade-2">
          <Campo id="rg" rotulo="RG" erro={erros.rg}>
            <input id="rg" value={form.rg} onChange={set('rg')} />
          </Campo>
          <Campo id="cpf" rotulo="CPF" erro={erros.cpf}>
            <input id="cpf" value={form.cpf} onChange={set('cpf')} inputMode="numeric" placeholder="000.000.000-00" />
          </Campo>
        </div>
        <Campo id="endereco" rotulo="Endereço" erro={erros.endereco}>
          <input id="endereco" value={form.endereco} onChange={set('endereco')} autoComplete="street-address" />
        </Campo>
        <Campo id="profissao" rotulo="Profissão" erro={erros.profissao}>
          <input id="profissao" value={form.profissao} onChange={set('profissao')} />
        </Campo>
      </fieldset>

      <fieldset>
        <legend>Renda</legend>
        <p className="texto-apoio">
          Os agentes usam essas informações na análise financeira. Você pode informar até {MAX_EMPREGADORES} empregadores.
        </p>
        {form.empregadores.map((emp, i) => (
          <div className="empregador" key={i}>
            <Campo id={`emp${i}`} rotulo={`Empregador ${i + 1}`} erro={erros[`emp${i}nome`]}>
              <input id={`emp${i}`} value={emp.nome} onChange={setEmpregador(i, 'nome')} />
            </Campo>
            <Campo id={`rend${i}`} rotulo="Rendimento mensal (R$)" erro={erros[`emp${i}rend`]}>
              <input id={`rend${i}`} type="number" min="0" step="0.01" value={emp.rendimento} onChange={setEmpregador(i, 'rendimento')} />
            </Campo>
            <button type="button" className="btn btn--link" onClick={() => removerEmpregador(i)}>Remover</button>
          </div>
        ))}
        {form.empregadores.length < MAX_EMPREGADORES && (
          <button type="button" className="btn btn--secundario" onClick={addEmpregador}>Adicionar empregador</button>
        )}
      </fieldset>

      <fieldset>
        <legend>Acesso</legend>
        <div className="grade-2">
          <Campo id="login" rotulo="Usuário" erro={erros.login}>
            <input id="login" value={form.login} onChange={set('login')} autoComplete="username" />
          </Campo>
          <Campo
            id="senha"
            rotulo={modo === 'cadastro' ? 'Senha' : 'Nova senha'}
            erro={erros.senha}
            dica={modo === 'edicao' ? 'Deixe em branco para manter a atual.' : undefined}
          >
            <input id="senha" type="password" value={form.senha} onChange={set('senha')} autoComplete="new-password" />
          </Campo>
        </div>
      </fieldset>

      <button className="btn btn--primario" disabled={enviando}>
        {enviando ? 'Salvando…' : textoBotao}
      </button>
    </form>
  )
}
