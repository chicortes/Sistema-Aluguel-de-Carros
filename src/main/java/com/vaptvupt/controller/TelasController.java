package com.vaptvupt.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TelasController {

    @GetMapping({"/{caminho:[^\\.]*}", "/pedidos/**", "/agente/**"})
    public String telas() {
        return "forward:/index.html";
    }
}
