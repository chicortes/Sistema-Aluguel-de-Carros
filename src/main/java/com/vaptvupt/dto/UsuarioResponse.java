package com.vaptvupt.dto;

import com.vaptvupt.model.Agente;
import com.vaptvupt.model.Cliente;
import com.vaptvupt.model.TipoAgente;
import com.vaptvupt.model.TipoUsuario;
import com.vaptvupt.model.Usuario;

import java.util.List;

/** Dados do usuário devolvidos ao front-end (nunca inclui a senha). */
public record UsuarioResponse(
        Long id,
        TipoUsuario tipo,
        TipoAgente tipoAgente,
        String nome,
        String login,
        String rg,
        String cpf,
        String endereco,
        String profissao,
        List<EmpregadorDTO> empregadores) {

    public static UsuarioResponse de(Usuario usuario) {
        if (usuario instanceof Cliente c) {
            return new UsuarioResponse(c.getId(), c.getTipo(), null, c.getNome(), c.getLogin(),
                    c.getRg(), c.getCpf(), c.getEndereco(), c.getProfissao(),
                    c.getRendimentos().stream().map(EmpregadorDTO::de).toList());
        }
        TipoAgente tipoAgente = usuario instanceof Agente a ? a.getTipoAgente() : null;
        return new UsuarioResponse(usuario.getId(), usuario.getTipo(), tipoAgente, usuario.getNome(), usuario.getLogin(),
                null, null, null, null, List.of());
    }
}
