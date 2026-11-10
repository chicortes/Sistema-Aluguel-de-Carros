package com.vaptvupt.config;

import org.springframework.security.oauth2.jwt.Jwt;

import com.vaptvupt.model.TipoUsuario;

public record UsuarioAutenticado(Long id, TipoUsuario tipo) {

    public static UsuarioAutenticado de(Jwt jwt) {
        return new UsuarioAutenticado(Long.valueOf(jwt.getSubject()),
                TipoUsuario.valueOf(jwt.getClaimAsString("scope")));
    }

    public boolean ehAgente() {
        return tipo == TipoUsuario.AGENTE;
    }
}
