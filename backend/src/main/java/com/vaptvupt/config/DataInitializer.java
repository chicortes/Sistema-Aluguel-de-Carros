package com.vaptvupt.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.vaptvupt.model.Agente;
import com.vaptvupt.model.Automovel;
import com.vaptvupt.model.Cliente;
import com.vaptvupt.model.Rendimento;
import com.vaptvupt.model.TipoAgente;
import com.vaptvupt.repository.AutomovelRepository;
import com.vaptvupt.repository.UsuarioRepository;

/**
 * Cliente: cliente / 123. Agente: agente / 123.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarios;
    private final AutomovelRepository automoveis;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarios, AutomovelRepository automoveis, PasswordEncoder passwordEncoder) {
        this.usuarios = usuarios;
        this.automoveis = automoveis;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!usuarios.existsByLogin("agente")) {
            usuarios.save(new Agente("Agente", "agente", passwordEncoder.encode("123"), TipoAgente.BANCO));
        }
        if (!usuarios.existsByLogin("cliente")) {
            Cliente cliente = new Cliente("Cliente", "cliente", passwordEncoder.encode("123"),
                    "MG-12.345.678", "123.456.789-00", "Rua da Bahia, 1000 - Belo Horizonte", "Engenheiro");
            cliente.setRendimentos(List.of(new Rendimento("Construtora Minas", new BigDecimal("8500.00"))));
            usuarios.save(cliente);
        }
        if (automoveis.count() == 0) {
            automoveis.saveAll(List.of(
                    new Automovel("MAT-0001", 2023, "Fiat", "Argo", "RTA1B23"),
                    new Automovel("MAT-0002", 2022, "Volkswagen", "T-Cross", "QPX4C56"),
                    new Automovel("MAT-0003", 2024, "Chevrolet", "Onix", "SBH7D89"),
                    new Automovel("MAT-0004", 2024, "Toyota", "Corolla Cross", "PUC2E10")));
        }
    }
}
