package com.vaptvupt.service;

import com.vaptvupt.dto.AutomovelResponse;
import com.vaptvupt.repository.AutomovelRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AutomovelService {

    private final AutomovelRepository automoveis;

    public AutomovelService(AutomovelRepository automoveis) {
        this.automoveis = automoveis;
    }

    @Transactional(readOnly = true)
    public List<AutomovelResponse> listar() {
        return automoveis.findAll(Sort.by("marca", "modelo")).stream().map(AutomovelResponse::de).toList();
    }
}
