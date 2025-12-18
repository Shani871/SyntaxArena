package com.syntaxarena.backend.controller;

import com.syntaxarena.backend.model.TestValidationRequest;
import com.syntaxarena.backend.model.TestValidationResponse;
import com.syntaxarena.backend.service.TestValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BattleController {

    @Autowired
    private TestValidationService testValidationService;

    /**
     * Validates a user's solution against the problem.
     * Returns test results with pass/fail status for each test case.
     */
    @PostMapping("/validate-solution")
    public TestValidationResponse validateSolution(@RequestBody TestValidationRequest request) {
        return testValidationService.validateSolution(request);
    }
}
