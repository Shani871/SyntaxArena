package com.syntaxarena.backend.controller;

import com.syntaxarena.backend.model.CodeStoryRequest;
import com.syntaxarena.backend.model.CodeStoryResponse;
import com.syntaxarena.backend.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CodeStoryController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/generate-code-story")
    public CodeStoryResponse generateCodeStory(@RequestBody CodeStoryRequest request) {
        return geminiService.generateCodeStory(request);
    }
}
