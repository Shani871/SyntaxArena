package com.syntaxarena.backend.model;

public class DocChatResponse {
    private String response;
    private String action; // null for normal chat, "CREATE_DOC" for document creation
    private String title; // Document title (only for CREATE_DOC)
    private String category; // Document category (only for CREATE_DOC)
    private String content; // Document content (only for CREATE_DOC)

    public DocChatResponse() {
    }

    public DocChatResponse(String response) {
        this.response = response;
    }

    public DocChatResponse(String response, String action, String title, String category, String content) {
        this.response = response;
        this.action = action;
        this.title = title;
        this.category = category;
        this.content = content;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
