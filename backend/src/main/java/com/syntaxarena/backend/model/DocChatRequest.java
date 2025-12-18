package com.syntaxarena.backend.model;

import java.util.List;

public class DocChatRequest {
    private String documentContent;
    private String message;
    private List<ChatHistoryItem> history;

    public DocChatRequest() {
    }

    public DocChatRequest(String documentContent, String message, List<ChatHistoryItem> history) {
        this.documentContent = documentContent;
        this.message = message;
        this.history = history;
    }

    public String getDocumentContent() {
        return documentContent;
    }

    public void setDocumentContent(String documentContent) {
        this.documentContent = documentContent;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ChatHistoryItem> getHistory() {
        return history;
    }

    public void setHistory(List<ChatHistoryItem> history) {
        this.history = history;
    }

    public static class ChatHistoryItem {
        private String role;
        private String text;

        public ChatHistoryItem() {
        }

        public ChatHistoryItem(String role, String text) {
            this.role = role;
            this.text = text;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }
}
