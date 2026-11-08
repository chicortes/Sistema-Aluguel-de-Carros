package com.vaptvupt.exception;

/** O usuário está logado, mas não pode mexer nesse recurso (responde 403). */
public class AcessoNegadoException extends RuntimeException {

    public AcessoNegadoException(String mensagem) {
        super(mensagem);
    }
}
