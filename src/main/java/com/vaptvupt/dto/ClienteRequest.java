package com.vaptvupt.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ClienteRequest(
        @NotBlank(message = "Informe o nome completo.") @Size(max = 120) String nome,
        @NotBlank(message = "Informe o RG.") @Size(max = 20) String rg,
        @NotBlank(message = "Informe o CPF.") String cpf,
        @NotBlank(message = "Informe o endereço.") @Size(max = 255) String endereco,
        @NotBlank(message = "Informe a profissão.") @Size(max = 80) String profissao,
        @NotBlank(message = "Escolha um nome de usuário.") @Size(max = 60) String login,
        String senha,
        @Size(max = 3, message = "Informe no máximo 3 empregadores.") List<@Valid EmpregadorDTO> empregadores) {

    public List<EmpregadorDTO> empregadoresOuVazio() {
        return empregadores == null ? List.of() : empregadores;
    }
}
