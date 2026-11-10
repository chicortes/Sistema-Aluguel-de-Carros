package com.vaptvupt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PedidoRequest(
        @NotNull(message = "Escolha um carro.") Long automovelId,
        @NotNull(message = "Informe a data de retirada.") LocalDate dataInicio,
        @NotNull(message = "Informe a data de devolução.") LocalDate dataFim,
        @Size(max = 500, message = "A observação pode ter no máximo 500 caracteres.") String observacao) {
}
