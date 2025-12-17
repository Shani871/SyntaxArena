package com.syntaxarena.backend.model;

public class QuestionRequest {
    private String topic;
    private String difficulty; // e.g., "easy", "medium", "hard"
    private String language; // e.g., "java", "python"

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
