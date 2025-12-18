package com.syntaxarena.backend.model;

import java.util.List;

public class BlackholeRequest {
    private String message;
    private List<ChatHistoryItem> history;

    public BlackholeRequest() {
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
