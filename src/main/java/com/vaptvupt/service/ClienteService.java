package com.vaptvupt.service;

import com.vaptvupt.config.UsuarioAutenticado;
import com.vaptvupt.dto.ClienteRequest;
import com.vaptvupt.dto.EmpregadorDTO;
import com.vaptvupt.dto.UsuarioResponse;
import com.vaptvupt.exception.AcessoNegadoException;
import com.vaptvupt.exception.NaoEncontradoException;
import com.vaptvupt.exception.RegraNegocioException;
import com.vaptvupt.model.Cliente;
import com.vaptvupt.repository.ClienteRepository;
import com.vaptvupt.repository.PedidoRepository;
import com.vaptvupt.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** CRUD de cliente com as regras de cadastro (usuário e CPF únicos, até 3 rendimentos). */
@Service
public class ClienteService {

    private final ClienteRepository clientes;
    private final UsuarioRepository usuarios;
    private final PedidoRepository pedidos;
    private final PasswordEncoder passwordEncoder;

    public ClienteService(ClienteRepository clientes, UsuarioRepository usuarios, PedidoRepository pedidos,
                          PasswordEncoder passwordEncoder) {
        this.clientes = clientes;
        this.usuarios = usuarios;
        this.pedidos = pedidos;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UsuarioResponse cadastrar(ClienteRequest req) {
        validarCpf(req.cpf());
        if (req.senha() == null || req.senha().length() < 3) {
            throw new RegraNegocioException("A senha precisa de pelo menos 3 caracteres.");
        }
        if (usuarios.existsByLogin(req.login().trim())) {
            throw new RegraNegocioException("Esse usuário já existe. Escolha outro.");
        }
        if (clientes.existsByCpf(req.cpf())) {
            throw new RegraNegocioException("Já existe um cadastro com esse CPF.");
        }
        Cliente cliente = new Cliente(req.nome().trim(), req.login().trim(), passwordEncoder.encode(req.senha()),
                req.rg().trim(), req.cpf(), req.endereco().trim(), req.profissao().trim());
        cliente.setRendimentos(req.empregadoresOuVazio().stream().map(EmpregadorDTO::paraRendimento).toList());
        return UsuarioResponse.de(clientes.save(cliente));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscar(Long id, UsuarioAutenticado quem) {
        // O próprio cliente vê seus dados; agentes também podem consultar para a análise financeira.
        if (!quem.ehAgente()) {
            garantirQueEhOProprio(id, quem);
        }
        return UsuarioResponse.de(encontrar(id));
    }

    @Transactional
    public UsuarioResponse atualizar(Long id, ClienteRequest req, UsuarioAutenticado quem) {
        garantirQueEhOProprio(id, quem);
        validarCpf(req.cpf());
        Cliente cliente = encontrar(id);
        if (usuarios.existsByLoginAndIdNot(req.login().trim(), id)) {
            throw new RegraNegocioException("Esse usuário já existe. Escolha outro.");
        }
        if (clientes.existsByCpfAndIdNot(req.cpf(), id)) {
            throw new RegraNegocioException("Já existe um cadastro com esse CPF.");
        }
        cliente.setNome(req.nome().trim());
        cliente.setRg(req.rg().trim());
        cliente.setCpf(req.cpf());
        cliente.setEndereco(req.endereco().trim());
        cliente.setProfissao(req.profissao().trim());
        cliente.setLogin(req.login().trim());
        if (req.senha() != null && !req.senha().isBlank()) {
            if (req.senha().length() < 3) {
                throw new RegraNegocioException("A senha precisa de pelo menos 3 caracteres.");
            }
            cliente.setSenha(passwordEncoder.encode(req.senha()));
        }
        cliente.setRendimentos(req.empregadoresOuVazio().stream().map(EmpregadorDTO::paraRendimento).toList());
        return UsuarioResponse.de(cliente);
    }

    @Transactional
    public void excluir(Long id, UsuarioAutenticado quem) {
        garantirQueEhOProprio(id, quem);
        Cliente cliente = encontrar(id);
        pedidos.deleteByClienteId(id);
        clientes.delete(cliente);
    }

    private Cliente encontrar(Long id) {
        return clientes.findById(id).orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado."));
    }

    private void garantirQueEhOProprio(Long id, UsuarioAutenticado quem) {
        if (!id.equals(quem.id())) {
            throw new AcessoNegadoException("Você só pode mexer no seu próprio cadastro.");
        }
    }

    private void validarCpf(String cpf) {
        if (cpf == null || cpf.replaceAll("\\D", "").length() != 11) {
            throw new RegraNegocioException("O CPF precisa ter 11 dígitos.");
        }
    }
}
