package com.vaptvupt.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vaptvupt.model.Rendimento;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@JsonIgnoreProperties(ignoreUnknown = true)
public record EmpregadorDTO(
        @NotBlank(message = "Informe o nome do empregador.") String nome,
        @NotNull(message = "Informe o rendimento.") @Positive(message = "O rendimento precisa ser maior que zero.") BigDecimal rendimento) {

    public static EmpregadorDTO de(Rendimento r) {
        return new EmpregadorDTO(r.getEntidadeEmpregadora(), r.getValor());
    }

    public Rendimento paraRendimento() {
        return new Rendimento(nome.trim(), rendimento);
    }
}
