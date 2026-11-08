package com.vaptvupt.dto;

import com.vaptvupt.model.Contrato;

public record ContratoResponse(String proprietario, String bancoCredito, String em) {

    public static ContratoResponse de(Contrato c) {
        if (c == null) {
            return null;
        }
        String banco = c.getContratoCredito() == null ? null : c.getContratoCredito().getBanco().getNome();
        return new ContratoResponse(c.getProprietario().name(), banco, c.getAssinadoEm().toString());
    }
}
