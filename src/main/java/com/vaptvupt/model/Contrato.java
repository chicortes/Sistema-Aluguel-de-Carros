package com.vaptvupt.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.time.Instant;

/** Contrato de aluguel executado a partir de um pedido aprovado. */
@Entity
@Table(name = "contratos")
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "pedido_id", unique = true)
    private Pedido pedido;

    @ManyToOne(optional = false)
    @JoinColumn(name = "agente_id")
    private Agente agente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoProprietario proprietario;

    @Column(name = "assinado_em", nullable = false)
    private Instant assinadoEm;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "contrato_credito_id")
    private ContratoCredito contratoCredito;

    protected Contrato() {
    }

    public Contrato(Pedido pedido, Agente agente, TipoProprietario proprietario, ContratoCredito contratoCredito) {
        this.pedido = pedido;
        this.agente = agente;
        this.proprietario = proprietario;
        this.contratoCredito = contratoCredito;
        this.assinadoEm = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public Agente getAgente() {
        return agente;
    }

    public TipoProprietario getProprietario() {
        return proprietario;
    }

    public Instant getAssinadoEm() {
        return assinadoEm;
    }

    public ContratoCredito getContratoCredito() {
        return contratoCredito;
    }
}
