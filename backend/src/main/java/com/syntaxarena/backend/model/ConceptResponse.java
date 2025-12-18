package com.syntaxarena.backend.model;

public class ConceptResponse {
    private String explanation;

    public ConceptResponse() {
    }

    public ConceptResponse(String explanation) {
        this.explanation = explanation;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
