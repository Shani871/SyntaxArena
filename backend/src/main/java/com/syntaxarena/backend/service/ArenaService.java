package com.syntaxarena.backend.service;

import com.syntaxarena.backend.model.ArenaPlayer;
import com.syntaxarena.backend.model.ArenaSession;
import com.syntaxarena.backend.model.ArenaSession.SessionStatus;
import com.syntaxarena.backend.model.QuestionRequest;
import com.syntaxarena.backend.model.QuestionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

@Service
public class ArenaService {

    // Queue of players waiting for a match
    private final ConcurrentLinkedQueue<ArenaPlayer> matchmakingQueue = new ConcurrentLinkedQueue<>();

    // Active sessions by sessionId
    private final ConcurrentHashMap<String, ArenaSession> activeSessions = new ConcurrentHashMap<>();

    // Player to session mapping
    private final ConcurrentHashMap<String, String> playerSessionMap = new ConcurrentHashMap<>();

    @Autowired
    private QuestionService questionService;

    /**
     * Add a player to the matchmaking queue
     */
    public void joinQueue(ArenaPlayer player) {
        // Remove if already in queue
        matchmakingQueue.removeIf(p -> p.getPlayerId().equals(player.getPlayerId()));
        matchmakingQueue.add(player);
        System.out.println("Player " + player.getUsername() + " joined queue. Queue size: " + matchmakingQueue.size());
    }

    /**
     * Remove a player from the matchmaking queue
     */
    public void leaveQueue(String playerId) {
        matchmakingQueue.removeIf(p -> p.getPlayerId().equals(playerId));
        System.out.println("Player " + playerId + " left queue. Queue size: " + matchmakingQueue.size());
    }

    /**
     * Attempt to match two players from the queue
     * Returns a new ArenaSession if match found, null otherwise
     */
    public ArenaSession attemptMatch() {
        if (matchmakingQueue.size() < 2) {
            return null;
        }

        // Simple FIFO matching - take first two players
        ArenaPlayer player1 = matchmakingQueue.poll();
        ArenaPlayer player2 = matchmakingQueue.poll();

        if (player1 == null || player2 == null) {
            // Put back if we couldn't get both
            if (player1 != null)
                matchmakingQueue.add(player1);
            if (player2 != null)
                matchmakingQueue.add(player2);
            return null;
        }

        // Generate a problem for this session
        QuestionRequest questionRequest = new QuestionRequest();
        questionRequest.setTopic("Arrays");
        questionRequest.setDifficulty("Medium");
        questionRequest.setLanguage("java");
        QuestionResponse problem = questionService.generateQuestion(questionRequest); // Create session
        String sessionId = UUID.randomUUID().toString();
        ArenaSession session = new ArenaSession(
                sessionId,
                "gen_" + System.currentTimeMillis(),
                problem.getTitle(),
                problem.getDescription(),
                "Medium");

        session.addPlayer(player1);
        session.addPlayer(player2);
        session.setStatus(SessionStatus.ACTIVE);
        session.setStartTime(System.currentTimeMillis());

        // Store session
        activeSessions.put(sessionId, session);
        playerSessionMap.put(player1.getPlayerId(), sessionId);
        playerSessionMap.put(player2.getPlayerId(), sessionId);

        System.out.println("Match found! Session: " + sessionId + " Players: " +
                player1.getUsername() + " vs " + player2.getUsername());

        return session;
    }

    /**
     * Get session by ID
     */
    public ArenaSession getSession(String sessionId) {
        return activeSessions.get(sessionId);
    }

    /**
     * Get session by player ID
     */
    public ArenaSession getSessionByPlayer(String playerId) {
        String sessionId = playerSessionMap.get(playerId);
        return sessionId != null ? activeSessions.get(sessionId) : null;
    }

    /**
     * Update player progress in a session
     */
    public void updateProgress(String sessionId, String playerId, int progress, int testsPassed, int totalTests) {
        ArenaSession session = activeSessions.get(sessionId);
        if (session == null)
            return;

        for (ArenaPlayer player : session.getPlayers()) {
            if (player.getPlayerId().equals(playerId)) {
                player.setProgress(progress);
                player.setTestsPassed(testsPassed);
                player.setTotalTests(totalTests);
                break;
            }
        }
    }

    /**
     * Handle solution submission
     * Returns true if the player won (all tests passed)
     */
    public boolean submitSolution(String sessionId, String playerId, boolean allPassed, int testsPassed,
            int totalTests) {
        ArenaSession session = activeSessions.get(sessionId);
        if (session == null || session.getStatus() != SessionStatus.ACTIVE) {
            return false;
        }

        for (ArenaPlayer player : session.getPlayers()) {
            if (player.getPlayerId().equals(playerId)) {
                player.setSubmitted(true);
                player.setSubmitTime(System.currentTimeMillis());
                player.setTestsPassed(testsPassed);
                player.setTotalTests(totalTests);
                player.setProgress(allPassed ? 100 : (testsPassed * 100 / Math.max(totalTests, 1)));

                if (allPassed) {
                    // This player wins!
                    session.setWinnerId(playerId);
                    session.setStatus(SessionStatus.COMPLETED);
                    return true;
                }
                break;
            }
        }

        return false;
    }

    /**
     * End a session (due to timeout or other reasons)
     */
    public void endSession(String sessionId, String winnerId) {
        ArenaSession session = activeSessions.get(sessionId);
        if (session == null)
            return;

        session.setStatus(SessionStatus.COMPLETED);
        session.setWinnerId(winnerId);
    }

    /**
     * Clean up session resources
     */
    public void cleanupSession(String sessionId) {
        ArenaSession session = activeSessions.remove(sessionId);
        if (session != null) {
            for (ArenaPlayer player : session.getPlayers()) {
                playerSessionMap.remove(player.getPlayerId());
            }
        }
    }

    /**
     * Get queue size
     */
    public int getQueueSize() {
        return matchmakingQueue.size();
    }

    /**
     * Check if player is in queue
     */
    public boolean isInQueue(String playerId) {
        return matchmakingQueue.stream().anyMatch(p -> p.getPlayerId().equals(playerId));
    }
}
