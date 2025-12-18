package com.syntaxarena.backend.controller;

import com.syntaxarena.backend.model.BlackholeRequest;
import com.syntaxarena.backend.model.BlackholeResponse;
import com.syntaxarena.backend.service.BlackholeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BlackholeController {

    @Autowired
    private BlackholeService blackholeService;

    @PostMapping("/blackhole")
    public BlackholeResponse chat(@RequestBody BlackholeRequest request) {
        return blackholeService.chat(request);
    }
}
