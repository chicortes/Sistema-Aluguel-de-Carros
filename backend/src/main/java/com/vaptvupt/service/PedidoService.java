package com.vaptvupt.service;

import com.vaptvupt.config.UsuarioAutenticado;
import com.vaptvupt.dto.AvaliacaoRequest;
import com.vaptvupt.dto.ContratoRequest;
import com.vaptvupt.dto.PedidoRequest;
import com.vaptvupt.dto.PedidoResponse;
import com.vaptvupt.exception.AcessoNegadoException;
import com.vaptvupt.exception.NaoEncontradoException;
import com.vaptvupt.exception.RegraNegocioException;
import com.vaptvupt.model.Agente;
import com.vaptvupt.model.Automovel;
import com.vaptvupt.model.Cliente;
import com.vaptvupt.model.ContratoCredito;
import com.vaptvupt.model.Pedido;
import com.vaptvupt.repository.AgenteRepository;
import com.vaptvupt.repository.AutomovelRepository;
import com.vaptvupt.repository.ClienteRepository;
import com.vaptvupt.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/** Gestão de pedidos e contratos: o fluxo PENDENTE → APROVADO → CONTRATADO. */
@Service
public class PedidoService {

    private final PedidoRepository pedidos;
    private final ClienteRepository clientes;
    private final AgenteRepository agentes;
    private final AutomovelRepository automoveis;

    public PedidoService(PedidoRepository pedidos, ClienteRepository clientes, AgenteRepository agentes,
                         AutomovelRepository automoveis) {
        this.pedidos = pedidos;
        this.clientes = clientes;
        this.agentes = agentes;
        this.automoveis = automoveis;
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarDoCliente(Long clienteId) {
        return pedidos.findByClienteIdOrderByCriadoEmDesc(clienteId).stream().map(PedidoResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponse> listarTodos() {
        return pedidos.findAllByOrderByCriadoEmDesc().stream().map(PedidoResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponse buscar(Long id, UsuarioAutenticado quem) {
        Pedido pedido = encontrar(id);
        garantirAcesso(pedido, quem);
        return PedidoResponse.de(pedido);
    }

    @Transactional
    public PedidoResponse criar(PedidoRequest req, Long clienteId) {
        Cliente cliente = clientes.findById(clienteId)
                .orElseThrow(() -> new NaoEncontradoException("Cliente não encontrado."));
        validarDatas(req);
        Pedido pedido = new Pedido(cliente, encontrarAutomovel(req.automovelId()),
                req.dataInicio(), req.dataFim(), limpar(req.observacao()));
        return PedidoResponse.de(pedidos.save(pedido));
    }

    /** O cliente altera o próprio pedido; agentes podem alterar qualquer pedido ainda não analisado. */
    @Transactional
    public PedidoResponse atualizar(Long id, PedidoRequest req, UsuarioAutenticado quem) {
        Pedido pedido = encontrar(id);
        garantirAcesso(pedido, quem);
        validarDatas(req);
        pedido.alterar(encontrarAutomovel(req.automovelId()), req.dataInicio(), req.dataFim(), limpar(req.observacao()));
        return PedidoResponse.de(pedido);
    }

    @Transactional
    public PedidoResponse cancelar(Long id, UsuarioAutenticado quem) {
        Pedido pedido = encontrar(id);
        garantirAcesso(pedido, quem);
        pedido.cancelar();
        return PedidoResponse.de(pedido);
    }

    @Transactional
    public PedidoResponse avaliar(Long id, AvaliacaoRequest req, Long agenteId) {
        Pedido pedido = encontrar(id);
        pedido.avaliar(encontrarAgente(agenteId), req.parecer(), limpar(req.comentario()));
        return PedidoResponse.de(pedido);
    }

    @Transactional
    public PedidoResponse executarContrato(Long id, ContratoRequest req, Long agenteId) {
        Pedido pedido = encontrar(id);
        Agente agente = encontrarAgente(agenteId);
        if (req.comCredito() && !agente.isBanco()) {
            throw new RegraNegocioException("Só bancos agentes podem conceder contrato de crédito.");
        }
        ContratoCredito credito = req.comCredito() ? new ContratoCredito(agente) : null;
        pedido.executarContrato(agente, req.proprietario(), credito);
        return PedidoResponse.de(pedido);
    }

    private Pedido encontrar(Long id) {
        return pedidos.findById(id).orElseThrow(() -> new NaoEncontradoException("Pedido não encontrado."));
    }

    private Automovel encontrarAutomovel(Long id) {
        return automoveis.findById(id).orElseThrow(() -> new NaoEncontradoException("Carro não encontrado."));
    }

    private Agente encontrarAgente(Long id) {
        return agentes.findById(id).orElseThrow(() -> new NaoEncontradoException("Agente não encontrado."));
    }

    private void garantirAcesso(Pedido pedido, UsuarioAutenticado quem) {
        if (!quem.ehAgente() && !pedido.pertenceA(quem.id())) {
            throw new AcessoNegadoException("Esse pedido não é seu.");
        }
    }

    private void validarDatas(PedidoRequest req) {
        if (req.dataInicio().isBefore(LocalDate.now())) {
            throw new RegraNegocioException("A retirada não pode ser em uma data que já passou.");
        }
        if (!req.dataFim().isAfter(req.dataInicio())) {
            throw new RegraNegocioException("A devolução precisa ser pelo menos um dia depois da retirada.");
        }
    }

    private static String limpar(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }
}
