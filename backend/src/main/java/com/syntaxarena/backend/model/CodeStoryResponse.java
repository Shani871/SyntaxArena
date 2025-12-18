package com.syntaxarena.backend.model;

public class CodeStoryResponse {
    private String story;

    public CodeStoryResponse() {
    }

    public CodeStoryResponse(String story) {
        this.story = story;
    }

    public String getStory() {
        return story;
    }

    public void setStory(String story) {
        this.story = story;
    }
}
