package com.vaptvupt.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

/** Contratante do aluguel. */
@Entity
@Table(name = "clientes")
public class Cliente extends Usuario {

    public static final int MAX_RENDIMENTOS = 3;

    @Column(nullable = false, length = 20)
    private String rg;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false, length = 80)
    private String profissao;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "cliente_rendimentos", joinColumns = @JoinColumn(name = "cliente_id"))
    @OrderColumn(name = "posicao")
    private List<Rendimento> rendimentos = new ArrayList<>();

    protected Cliente() {
    }

    public Cliente(String nome, String login, String senha, String rg, String cpf, String endereco, String profissao) {
        super(nome, login, senha);
        this.rg = rg;
        this.cpf = cpf;
        this.endereco = endereco;
        this.profissao = profissao;
    }

    @Override
    public TipoUsuario getTipo() {
        return TipoUsuario.CLIENTE;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getProfissao() {
        return profissao;
    }

    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }

    public List<Rendimento> getRendimentos() {
        return rendimentos;
    }

    public void setRendimentos(List<Rendimento> novos) {
        rendimentos.clear();
        rendimentos.addAll(novos);
    }
}
