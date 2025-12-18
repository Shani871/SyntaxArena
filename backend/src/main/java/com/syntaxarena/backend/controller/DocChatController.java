package com.syntaxarena.backend.controller;

import com.syntaxarena.backend.model.DocChatRequest;
import com.syntaxarena.backend.model.DocChatResponse;
import com.syntaxarena.backend.service.DocChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DocChatController {

    @Autowired
    private DocChatService docChatService;

    @PostMapping("/doc-chat")
    public DocChatResponse chat(@RequestBody DocChatRequest request) {
        return docChatService.chat(request);
    }
}
