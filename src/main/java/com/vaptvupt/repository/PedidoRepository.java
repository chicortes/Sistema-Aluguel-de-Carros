package com.vaptvupt.repository;

import com.vaptvupt.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByClienteIdOrderByCriadoEmDesc(Long clienteId);

    List<Pedido> findAllByOrderByCriadoEmDesc();

    void deleteByClienteId(Long clienteId);
}
