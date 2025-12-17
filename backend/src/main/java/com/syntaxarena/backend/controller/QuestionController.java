package com.syntaxarena.backend.controller;

import com.syntaxarena.backend.model.QuestionRequest;
import com.syntaxarena.backend.model.QuestionResponse;
import com.syntaxarena.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping("/generate-question")
    public QuestionResponse generateQuestion(@RequestBody QuestionRequest request) {
        return questionService.generateQuestion(request);
    }
}
