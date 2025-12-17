package com.syntaxarena.backend.controller;

import com.syntaxarena.backend.model.ExecutionRequest;
import com.syntaxarena.backend.model.ExecutionResponse;
import com.syntaxarena.backend.service.ExecutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow requests from frontend
public class ExecutionController {

    @Autowired
    private ExecutionService executionService;

    @PostMapping("/execute")
    public ExecutionResponse execute(@RequestBody ExecutionRequest request) {
        return executionService.executeCode(request);
    }
}
