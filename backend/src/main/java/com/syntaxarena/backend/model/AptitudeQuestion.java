package com.syntaxarena.backend.model;

import java.util.List;

public class AptitudeQuestion {
    private int id;
    private String text;
    private List<String> options;
    private int correctAnswer;
    private String explanation;
    private String difficulty;
    private String skillTested;

    public AptitudeQuestion() {
    }

    public AptitudeQuestion(int id, String text, List<String> options, int correctAnswer) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    public AptitudeQuestion(int id, String text, List<String> options, int correctAnswer,
            String explanation, String difficulty, String skillTested) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
        this.difficulty = difficulty;
        this.skillTested = skillTested;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public int getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(int correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getSkillTested() {
        return skillTested;
    }

    public void setSkillTested(String skillTested) {
        this.skillTested = skillTested;
    }
}
