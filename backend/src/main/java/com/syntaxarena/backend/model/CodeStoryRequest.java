package com.syntaxarena.backend.model;

public class CodeStoryRequest {
    private String code;
    private String language;

    public CodeStoryRequest() {
    }

    public CodeStoryRequest(String code, String language) {
        this.code = code;
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
