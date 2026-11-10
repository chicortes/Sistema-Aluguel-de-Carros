package com.vaptvupt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;

@JsonIgnoreProperties(ignoreUnknown = true)
public record LoginRequest(
        @NotBlank(message = "Informe o usuário.") String login,
        @NotBlank(message = "Informe a senha.") String senha) {
}
