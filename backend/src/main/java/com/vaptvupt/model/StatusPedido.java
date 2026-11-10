package com.vaptvupt.model;

public enum StatusPedido {
    /** Enviado pelo cliente, aguardando a análise financeira. */
    PENDENTE,
    /** Parecer positivo do agente; aguardando a execução do contrato. */
    APROVADO,
    /** Parecer negativo do agente. */
    REPROVADO,
    /** Cancelado pelo cliente. */
    CANCELADO,
    /** Contrato executado. */
    CONTRATADO
}
