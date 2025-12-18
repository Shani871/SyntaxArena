package com.syntaxarena.backend.model;

public class ArenaMessage {
    private MessageType type;
    private String sessionId;
    private String playerId;
    private Object payload;

    public enum MessageType {
        JOIN_QUEUE, // Player wants to join matchmaking queue
        LEAVE_QUEUE, // Player leaves queue
        MATCH_FOUND, // Server notifies both players of match
        BATTLE_START, // Battle begins
        PROGRESS_UPDATE, // Player progress update
        OPPONENT_PROGRESS, // Opponent's progress (sent to player)
        SUBMIT_SOLUTION, // Player submits solution
        GAME_END, // Game ended (win/lose/timeout)
        ERROR // Error message
    }

    public ArenaMessage() {
    }

    public ArenaMessage(MessageType type, Object payload) {
        this.type = type;
        this.payload = payload;
    }

    public ArenaMessage(MessageType type, String sessionId, String playerId, Object payload) {
        this.type = type;
        this.sessionId = sessionId;
        this.playerId = playerId;
        this.payload = payload;
    }

    // Getters and Setters
    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
}
