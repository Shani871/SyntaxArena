package com.syntaxarena.backend.controller;

import com.syntaxarena.backend.model.ExecutionFlowRequest;
import com.syntaxarena.backend.model.ExecutionFlowResponse;
import com.syntaxarena.backend.model.ConceptRequest;
import com.syntaxarena.backend.model.ConceptResponse;
import com.syntaxarena.backend.service.NvidiaVisualizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class VisualizerController {

    @Autowired
    private NvidiaVisualizerService nvidiaVisualizerService;

    @PostMapping("/visualize-execution")
    public ExecutionFlowResponse visualizeExecution(@RequestBody ExecutionFlowRequest request) {
        return nvidiaVisualizerService.visualizeExecution(request);
    }

    @PostMapping("/simplify-concept")
    public ConceptResponse simplifyConcept(@RequestBody ConceptRequest request) {
        return nvidiaVisualizerService.simplifyConcept(request);
    }
}
