package com.vaptvupt.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vaptvupt.model.Parecer;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@JsonIgnoreProperties(ignoreUnknown = true)
public record AvaliacaoRequest(
        @NotNull(message = "Informe o parecer.") Parecer parecer,
        @Size(max = 500, message = "O comentário pode ter no máximo 500 caracteres.") String comentario) {
}
