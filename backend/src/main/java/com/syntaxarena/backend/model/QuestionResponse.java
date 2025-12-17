package com.syntaxarena.backend.model;

import java.util.List;

public class QuestionResponse {
    private String title;
    private String description;
    private List<String> examples;
    private String starterCode;

    public QuestionResponse(String title, String description, List<String> examples, String starterCode) {
        this.title = title;
        this.description = description;
        this.examples = examples;
        this.starterCode = starterCode;
    }

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getExamples() { return examples; }
    public void setExamples(List<String> examples) { this.examples = examples; }

    public String getStarterCode() { return starterCode; }
    public void setStarterCode(String starterCode) { this.starterCode = starterCode; }
}
