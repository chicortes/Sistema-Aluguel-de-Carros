package com.vaptvupt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vaptvupt.model.TipoProprietario;
import jakarta.validation.constraints.NotNull;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ContratoRequest(
        @NotNull(message = "Informe em nome de quem o carro será registrado.") TipoProprietario proprietario,
        boolean comCredito) {
}
