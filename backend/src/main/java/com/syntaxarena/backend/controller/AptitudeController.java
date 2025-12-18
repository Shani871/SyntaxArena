package com.syntaxarena.backend.controller;

import com.syntaxarena.backend.model.AptitudeRequest;
import com.syntaxarena.backend.model.AptitudeResponse;
import com.syntaxarena.backend.service.AptitudeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AptitudeController {

    @Autowired
    private AptitudeService aptitudeService;

    @PostMapping("/generate-aptitude")
    public AptitudeResponse generateAptitude(@RequestBody AptitudeRequest request) {
        return aptitudeService.generateQuestions(request);
    }
}
