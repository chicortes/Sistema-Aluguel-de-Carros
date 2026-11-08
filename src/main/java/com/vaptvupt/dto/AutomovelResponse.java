package com.vaptvupt.dto;

import com.vaptvupt.model.Automovel;

public record AutomovelResponse(Long id, String matricula, String placa, String marca, String modelo, int ano) {

    public static AutomovelResponse de(Automovel a) {
        return new AutomovelResponse(a.getId(), a.getMatricula(), a.getPlaca(), a.getMarca(), a.getModelo(), a.getAno());
    }
}
