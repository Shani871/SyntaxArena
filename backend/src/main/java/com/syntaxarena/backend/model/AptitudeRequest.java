package com.syntaxarena.backend.model;

public class AptitudeRequest {
    private String topic;
    private int numberOfQuestions = 3;
    private String difficulty = "medium"; // easy, medium, hard
    private String category = "mixed"; // logic, numerical, analytical, mixed

    public AptitudeRequest() {
    }

    public AptitudeRequest(String topic, int numberOfQuestions) {
        this.topic = topic;
        this.numberOfQuestions = numberOfQuestions;
    }

    public AptitudeRequest(String topic, int numberOfQuestions, String difficulty, String category) {
        this.topic = topic;
        this.numberOfQuestions = numberOfQuestions;
        this.difficulty = difficulty;
        this.category = category;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public int getNumberOfQuestions() {
        return numberOfQuestions;
    }

    public void setNumberOfQuestions(int numberOfQuestions) {
        this.numberOfQuestions = numberOfQuestions;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
