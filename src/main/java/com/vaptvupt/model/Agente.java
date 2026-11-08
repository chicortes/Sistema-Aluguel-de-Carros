package com.vaptvupt.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

/** Empresa ou banco que modifica, avalia pedidos e executa contratos. */
@Entity
@Table(name = "agentes")
public class Agente extends Usuario {

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_agente", nullable = false, length = 20)
    private TipoAgente tipoAgente;

    protected Agente() {
    }

    public Agente(String nome, String login, String senha, TipoAgente tipoAgente) {
        super(nome, login, senha);
        this.tipoAgente = tipoAgente;
    }

    @Override
    public TipoUsuario getTipo() {
        return TipoUsuario.AGENTE;
    }

    public TipoAgente getTipoAgente() {
        return tipoAgente;
    }

    public boolean isBanco() {
        return tipoAgente == TipoAgente.BANCO;
    }
}
