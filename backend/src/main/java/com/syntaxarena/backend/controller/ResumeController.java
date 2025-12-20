package com.syntaxarena.backend.controller;

import com.syntaxarena.backend.service.ResumeParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private ResumeParserService resumeParserService;

    @PostMapping("/parse")
    public ResponseEntity<Map<String, Object>> parseResume(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate file
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("error", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            // Check file type
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
                response.put("success", false);
                response.put("error", "Only image files (PNG, JPG) and PDF are supported");
                return ResponseEntity.badRequest().body(response);
            }

            // Parse resume
            String extractedData = resumeParserService.parseResumeFromImage(file);

            response.put("success", true);
            response.put("data", extractedData);
            response.put("message", "Resume parsed successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to parse resume: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/enhance")
    public ResponseEntity<Map<String, Object>> enhanceResume(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String resumeData = request.get("resumeData");

            if (resumeData == null || resumeData.trim().isEmpty()) {
                response.put("success", false);
                response.put("error", "Resume data is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Enhance resume content
            String enhancedData = resumeParserService.enhanceResumeContent(resumeData);

            response.put("success", true);
            response.put("data", enhancedData);
            response.put("message", "Resume enhanced successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Failed to enhance resume: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
