package com.vaptvupt.exception;

/** Violação de uma regra do negócio (responde 400). */
public class RegraNegocioException extends RuntimeException {

    public RegraNegocioException(String mensagem) {
        super(mensagem);
    }
}
