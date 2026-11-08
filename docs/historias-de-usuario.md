# Histórias de Usuário — VaptVupt

Cada história indica o caso de uso relacionado no [Diagrama de Casos de Uso](diagramas/casos-de-uso.png).

## Cliente

### US01 — Cadastrar-se (UC02)
**Como** pessoa interessada em alugar um carro, **quero** criar minha conta no sistema **para** poder fazer pedidos de aluguel.

Critérios de aceitação:
- O cadastro pede RG, CPF, nome, endereço, profissão, usuário e senha.
- Posso informar de nenhum até 3 empregadores, cada um com o rendimento mensal.
- O sistema não aceita um usuário ou CPF que já esteja cadastrado.
- Depois de criar a conta, já entro no sistema logado.

### US02 — Fazer login (UC01)
**Como** cliente ou agente cadastrado, **quero** entrar com usuário e senha **para** acessar as funções do meu perfil.

Critérios de aceitação:
- Sem login, nenhuma tela além de login e cadastro fica acessível.
- Usuário ou senha errados mostram uma mensagem clara.
- O cliente cai em "Meus pedidos"; o agente cai no painel de pedidos.

### US03 — Manter meus dados (UC03)
**Como** cliente, **quero** consultar, alterar e excluir meus dados cadastrais **para** mantê-los corretos ou encerrar minha conta.

Critérios de aceitação:
- Consigo alterar qualquer dado, inclusive empregadores e rendimentos (máximo 3).
- Se deixar a nova senha em branco, a senha atual é mantida.
- Excluir a conta pede confirmação e apaga também meus pedidos.
- Um cliente não consegue ver nem alterar os dados de outro cliente.

### US04 — Introduzir pedido de aluguel (UC04)
**Como** cliente, **quero** escolher um carro e as datas de retirada e devolução **para** pedir o aluguel pela internet.

Critérios de aceitação:
- Vejo os carros disponíveis com marca, modelo, ano e placa.
- A retirada não pode ser em data passada e a devolução precisa ser depois da retirada.
- O pedido é criado com o status "Aguardando análise".

### US05 — Consultar pedidos e status (UC05)
**Como** cliente, **quero** ver meus pedidos e em que etapa cada um está **para** acompanhar o andamento do aluguel.

Critérios de aceitação:
- Cada pedido mostra carro, período e status (aguardando análise, aprovado, reprovado, cancelado ou contrato assinado).
- O parecer do agente e os dados do contrato aparecem quando existirem.

### US06 — Modificar pedido (UC06)
**Como** cliente, **quero** alterar o carro, as datas ou a observação de um pedido **para** corrigir o que pedi antes da análise.

Critérios de aceitação:
- Só pedidos que ainda aguardam análise podem ser alterados.
- Um cliente só altera os próprios pedidos.

### US07 — Cancelar pedido (UC07)
**Como** cliente, **quero** cancelar um pedido **para** desistir do aluguel.

Critérios de aceitação:
- Posso cancelar pedidos aguardando análise ou aprovados (antes do contrato).
- O cancelamento pede confirmação.

## Agente (empresa ou banco)

### US08 — Avaliar pedido (UC08)
**Como** agente, **quero** analisar financeiramente os pedidos enviados **para** dar um parecer positivo ou negativo.

Critérios de aceitação:
- Vejo todos os pedidos, com filtro dos que aguardam análise.
- O parecer positivo deixa o pedido "Aprovado"; o negativo, "Reprovado".
- Posso registrar um comentário, que o cliente vê junto do pedido.

### US09 — Modificar pedido (UC06)
**Como** agente, **quero** alterar um pedido ainda não analisado **para** ajustá-lo antes de dar o parecer.

Critérios de aceitação:
- Só pedidos aguardando análise podem ser alterados.
- O cliente vê as alterações no seu pedido.

### US10 — Executar contrato (UC09)
**Como** agente, **quero** executar o contrato de um pedido aprovado **para** concluir o aluguel.

Critérios de aceitação:
- Só pedidos aprovados podem virar contrato.
- Escolho em nome de quem o carro fica registrado: cliente, empresa ou banco.
- O pedido passa para "Contrato assinado".

### US11 — Conceder contrato de crédito (UC10)
**Como** banco agente, **quero** associar um contrato de crédito ao aluguel **para** financiar o cliente.

Critérios de aceitação:
- Só agentes do tipo banco concedem crédito.
- O cliente vê no pedido qual banco concedeu o crédito.
