package com.vaptvupt.model;

import com.vaptvupt.exception.RegraNegocioException;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;

/** Pedido de aluguel feito por um cliente. Guarda o ciclo de vida até virar contrato. */
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "automovel_id")
    private Automovel automovel;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;

    @Column(length = 500)
    private String observacao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusPedido status;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm;

    // Análise financeira feita pelo agente
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agente_avaliador_id")
    private Agente agenteAvaliador;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Parecer parecer;

    @Column(name = "comentario_parecer", length = 500)
    private String comentarioParecer;

    @Column(name = "avaliado_em")
    private Instant avaliadoEm;

    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private Contrato contrato;

    protected Pedido() {
    }

    public Pedido(Cliente cliente, Automovel automovel, LocalDate dataInicio, LocalDate dataFim, String observacao) {
        this.cliente = cliente;
        this.automovel = automovel;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.observacao = observacao;
        this.status = StatusPedido.PENDENTE;
        this.criadoEm = Instant.now();
    }

    public boolean pertenceA(Long clienteId) {
        return cliente.getId().equals(clienteId);
    }

    /** Cliente ou agente alteram o pedido enquanto ele ainda não foi analisado. */
    public void alterar(Automovel automovel, LocalDate dataInicio, LocalDate dataFim, String observacao) {
        if (status != StatusPedido.PENDENTE) {
            throw new RegraNegocioException("Só dá para alterar pedidos que ainda não foram analisados.");
        }
        this.automovel = automovel;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.observacao = observacao;
    }

    public void cancelar() {
        if (status != StatusPedido.PENDENTE && status != StatusPedido.APROVADO) {
            throw new RegraNegocioException("Esse pedido não pode mais ser cancelado.");
        }
        this.status = StatusPedido.CANCELADO;
    }

    /** Análise financeira: parecer positivo coloca o pedido à disposição para o contrato. */
    public void avaliar(Agente agente, Parecer parecer, String comentario) {
        if (status != StatusPedido.PENDENTE) {
            throw new RegraNegocioException("Esse pedido já foi avaliado.");
        }
        this.agenteAvaliador = agente;
        this.parecer = parecer;
        this.comentarioParecer = comentario;
        this.avaliadoEm = Instant.now();
        this.status = parecer == Parecer.POSITIVO ? StatusPedido.APROVADO : StatusPedido.REPROVADO;
    }

    public void executarContrato(Agente agente, TipoProprietario proprietario, ContratoCredito credito) {
        if (status != StatusPedido.APROVADO) {
            throw new RegraNegocioException("Só pedidos aprovados podem virar contrato.");
        }
        this.contrato = new Contrato(this, agente, proprietario, credito);
        this.status = StatusPedido.CONTRATADO;
    }

    public Long getId() {
        return id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public Automovel getAutomovel() {
        return automovel;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public String getObservacao() {
        return observacao;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public Agente getAgenteAvaliador() {
        return agenteAvaliador;
    }

    public Parecer getParecer() {
        return parecer;
    }

    public String getComentarioParecer() {
        return comentarioParecer;
    }

    public Instant getAvaliadoEm() {
        return avaliadoEm;
    }

    public Contrato getContrato() {
        return contrato;
    }
}
