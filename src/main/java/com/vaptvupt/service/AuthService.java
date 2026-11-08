package com.vaptvupt.service;

import com.vaptvupt.dto.LoginRequest;
import com.vaptvupt.dto.LoginResponse;
import com.vaptvupt.dto.UsuarioResponse;
import com.vaptvupt.exception.CredenciaisInvalidasException;
import com.vaptvupt.exception.NaoEncontradoException;
import com.vaptvupt.model.Usuario;
import com.vaptvupt.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarios;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public AuthService(UsuarioRepository usuarios, PasswordEncoder passwordEncoder, TokenService tokenService) {
        this.usuarios = usuarios;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    @Transactional(readOnly = true)
    public LoginResponse entrar(LoginRequest req) {
        Usuario usuario = usuarios.findByLogin(req.login().trim())
                .filter(u -> passwordEncoder.matches(req.senha(), u.getSenha()))
                .orElseThrow(CredenciaisInvalidasException::new);
        return new LoginResponse(tokenService.gerar(usuario), UsuarioResponse.de(usuario));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse usuarioAtual(Long id) {
        return usuarios.findById(id)
                .map(UsuarioResponse::de)
                .orElseThrow(() -> new NaoEncontradoException("Usuário não encontrado."));
    }
}
