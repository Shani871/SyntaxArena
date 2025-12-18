package com.syntaxarena.backend.model;

public class ConceptRequest {
    private String concept;
    private String language;
    private String level; // Beginner, Intermediate, Advanced

    public ConceptRequest() {
    }

    public ConceptRequest(String concept, String language, String level) {
        this.concept = concept;
        this.language = language;
        this.level = level;
    }

    public String getConcept() {
        return concept;
    }

    public void setConcept(String concept) {
        this.concept = concept;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
