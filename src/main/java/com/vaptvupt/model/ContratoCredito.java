package com.vaptvupt.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;

/** Crédito concedido por um banco agente para o aluguel. */
@Entity
@Table(name = "contratos_credito")
public class ContratoCredito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "banco_id")
    private Agente banco;

    @Column(name = "concedido_em", nullable = false)
    private Instant concedidoEm;

    protected ContratoCredito() {
    }

    public ContratoCredito(Agente banco) {
        this.banco = banco;
        this.concedidoEm = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public Agente getBanco() {
        return banco;
    }

    public Instant getConcedidoEm() {
        return concedidoEm;
    }
}
