package com.vaptvupt.dto;

import com.vaptvupt.model.Pedido;

public record ParecerResponse(String parecer, String comentario, String agente, String em) {

    public static ParecerResponse de(Pedido p) {
        if (p.getParecer() == null) {
            return null;
        }
        return new ParecerResponse(p.getParecer().name(), p.getComentarioParecer(),
                p.getAgenteAvaliador().getNome(), p.getAvaliadoEm().toString());
    }
}
