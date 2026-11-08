package com.vaptvupt.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.vaptvupt.config.UsuarioAutenticado;
import com.vaptvupt.dto.AvaliacaoRequest;
import com.vaptvupt.dto.ContratoRequest;
import com.vaptvupt.dto.PedidoRequest;
import com.vaptvupt.dto.PedidoResponse;
import com.vaptvupt.service.PedidoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // ----- Cliente -----

    @GetMapping("/meus")
    public List<PedidoResponse> meus(@AuthenticationPrincipal Jwt jwt) {
        return pedidoService.listarDoCliente(UsuarioAutenticado.de(jwt).id());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponse criar(@Valid @RequestBody PedidoRequest req, @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.criar(req, UsuarioAutenticado.de(jwt).id());
    }

    @PatchMapping("/{id}/cancelar")
    public PedidoResponse cancelar(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.cancelar(id, UsuarioAutenticado.de(jwt));
    }

    // ----- Cliente ou agente -----

    @GetMapping("/{id}")
    public PedidoResponse buscar(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.buscar(id, UsuarioAutenticado.de(jwt));
    }

    @PutMapping("/{id}")
    public PedidoResponse atualizar(@PathVariable Long id, @Valid @RequestBody PedidoRequest req,
                                    @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.atualizar(id, req, UsuarioAutenticado.de(jwt));
    }

    // ----- Agente -----

    @GetMapping
    public List<PedidoResponse> todos() {
        return pedidoService.listarTodos();
    }

    @PatchMapping("/{id}/avaliar")
    public PedidoResponse avaliar(@PathVariable Long id, @Valid @RequestBody AvaliacaoRequest req,
                                    @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.avaliar(id, req, UsuarioAutenticado.de(jwt).id());
    }

    @PostMapping("/{id}/contrato")
    public PedidoResponse executarContrato(@PathVariable Long id, @Valid @RequestBody ContratoRequest req,
                                    @AuthenticationPrincipal Jwt jwt) {
        return pedidoService.executarContrato(id, req, UsuarioAutenticado.de(jwt).id());
    }
}
