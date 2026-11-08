package com.vaptvupt.exception;

/** Usuário ou senha incorretos no login (responde 401). */
public class CredenciaisInvalidasException extends RuntimeException {

    public CredenciaisInvalidasException() {
        super("Usuário ou senha incorretos.");
    }
}
