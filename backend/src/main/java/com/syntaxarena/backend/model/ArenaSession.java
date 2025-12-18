package com.syntaxarena.backend.model;

import java.util.ArrayList;
import java.util.List;

public class ArenaSession {
    private String sessionId;
    private String problemId;
    private String problemDescription;
    private String problemTitle;
    private String difficulty;
    private List<ArenaPlayer> players;
    private long startTime;
    private int durationSeconds;
    private String winnerId;
    private SessionStatus status;

    public enum SessionStatus {
        WAITING, // Waiting for second player
        ACTIVE, // Battle in progress
        COMPLETED // Battle finished
    }

    public ArenaSession() {
        this.players = new ArrayList<>();
        this.status = SessionStatus.WAITING;
        this.durationSeconds = 900; // 15 minutes default
    }

    public ArenaSession(String sessionId, String problemId, String problemTitle, String problemDescription,
            String difficulty) {
        this();
        this.sessionId = sessionId;
        this.problemId = problemId;
        this.problemTitle = problemTitle;
        this.problemDescription = problemDescription;
        this.difficulty = difficulty;
    }

    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getProblemId() {
        return problemId;
    }

    public void setProblemId(String problemId) {
        this.problemId = problemId;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription;
    }

    public String getProblemTitle() {
        return problemTitle;
    }

    public void setProblemTitle(String problemTitle) {
        this.problemTitle = problemTitle;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public List<ArenaPlayer> getPlayers() {
        return players;
    }

    public void setPlayers(List<ArenaPlayer> players) {
        this.players = players;
    }

    public void addPlayer(ArenaPlayer player) {
        this.players.add(player);
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    public int getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(int durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    public String getWinnerId() {
        return winnerId;
    }

    public void setWinnerId(String winnerId) {
        this.winnerId = winnerId;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public boolean isFull() {
        return players.size() >= 2;
    }

    public ArenaPlayer getOpponent(String playerId) {
        return players.stream()
                .filter(p -> !p.getPlayerId().equals(playerId))
                .findFirst()
                .orElse(null);
    }
}
