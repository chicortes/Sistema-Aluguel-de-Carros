package com.vaptvupt.dto;

import com.vaptvupt.model.Pedido;
import com.vaptvupt.model.StatusPedido;

/** Datas vão como texto ISO (ex.: "2026-11-10"), o formato que o front-end espera. */
public record PedidoResponse(
        Long id,
        Long clienteId,
        String clienteNome,
        Long automovelId,
        AutomovelResponse automovel,
        String dataInicio,
        String dataFim,
        String observacao,
        StatusPedido status,
        String criadoEm,
        ParecerResponse parecer,
        ContratoResponse contrato) {

    public static PedidoResponse de(Pedido p) {
        return new PedidoResponse(
                p.getId(),
                p.getCliente().getId(),
                p.getCliente().getNome(),
                p.getAutomovel().getId(),
                AutomovelResponse.de(p.getAutomovel()),
                p.getDataInicio().toString(),
                p.getDataFim().toString(),
                p.getObservacao(),
                p.getStatus(),
                p.getCriadoEm().toString(),
                ParecerResponse.de(p),
                ContratoResponse.de(p.getContrato()));
    }
}
