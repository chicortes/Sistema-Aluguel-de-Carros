package com.vaptvupt.service;

import com.vaptvupt.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/** Gera o token JWT entregue no login. */
@Service
public class TokenService {

    private final JwtEncoder encoder;
    private final long validadeHoras;

    public TokenService(JwtEncoder encoder, @Value("${vaptvupt.jwt.validade-horas}") long validadeHoras) {
        this.encoder = encoder;
        this.validadeHoras = validadeHoras;
    }

    public String gerar(Usuario usuario) {
        Instant agora = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("vaptvupt")
                .issuedAt(agora)
                .expiresAt(agora.plus(validadeHoras, ChronoUnit.HOURS))
                .subject(String.valueOf(usuario.getId()))
                .claim("scope", usuario.getTipo().name())
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
