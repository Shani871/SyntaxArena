package com.syntaxarena.backend.model;

public class ArenaPlayer {
    private String playerId;
    private String username;
    private int rating;
    private int progress; // 0-100
    private int testsPassed;
    private int totalTests;
    private boolean submitted;
    private long submitTime;
    private boolean isReady;

    public ArenaPlayer() {
        this.progress = 0;
        this.testsPassed = 0;
        this.totalTests = 0;
        this.submitted = false;
        this.isReady = false;
    }

    public ArenaPlayer(String playerId, String username, int rating) {
        this();
        this.playerId = playerId;
        this.username = username;
        this.rating = rating;
    }

    // Getters and Setters
    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public int getTestsPassed() {
        return testsPassed;
    }

    public void setTestsPassed(int testsPassed) {
        this.testsPassed = testsPassed;
    }

    public int getTotalTests() {
        return totalTests;
    }

    public void setTotalTests(int totalTests) {
        this.totalTests = totalTests;
    }

    public boolean isSubmitted() {
        return submitted;
    }

    public void setSubmitted(boolean submitted) {
        this.submitted = submitted;
    }

    public long getSubmitTime() {
        return submitTime;
    }

    public void setSubmitTime(long submitTime) {
        this.submitTime = submitTime;
    }

    public boolean isReady() {
        return isReady;
    }

    public void setReady(boolean ready) {
        isReady = ready;
    }
}
