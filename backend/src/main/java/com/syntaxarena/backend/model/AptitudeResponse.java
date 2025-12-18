package com.syntaxarena.backend.model;

import java.util.List;

public class AptitudeResponse {
    private List<AptitudeQuestion> questions;

    public AptitudeResponse() {
    }

    public AptitudeResponse(List<AptitudeQuestion> questions) {
        this.questions = questions;
    }

    public List<AptitudeQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<AptitudeQuestion> questions) {
        this.questions = questions;
    }
}
