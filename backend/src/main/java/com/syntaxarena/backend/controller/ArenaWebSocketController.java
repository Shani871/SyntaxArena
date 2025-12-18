package com.syntaxarena.backend.controller;

import com.syntaxarena.backend.model.ArenaMessage;
import com.syntaxarena.backend.model.ArenaMessage.MessageType;
import com.syntaxarena.backend.model.ArenaPlayer;
import com.syntaxarena.backend.model.ArenaSession;
import com.syntaxarena.backend.service.ArenaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class ArenaWebSocketController {

    @Autowired
    private ArenaService arenaService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Handle player joining the matchmaking queue
     */
    @MessageMapping("/arena/join")
    public void joinQueue(@Payload ArenaPlayer player) {
        System.out.println("Player joining queue: " + player.getUsername());

        arenaService.joinQueue(player);

        // Attempt to find a match
        ArenaSession session = arenaService.attemptMatch();

        if (session != null) {
            // Match found! Notify both players
            ArenaMessage matchMessage = new ArenaMessage(
                    MessageType.MATCH_FOUND,
                    session.getSessionId(),
                    null,
                    session);

            // Broadcast to the session topic
            messagingTemplate.convertAndSend(
                    "/topic/arena/" + session.getSessionId(),
                    matchMessage);

            // Also send directly to each player
            for (ArenaPlayer p : session.getPlayers()) {
                messagingTemplate.convertAndSend(
                        "/topic/player/" + p.getPlayerId(),
                        matchMessage);
            }

            System.out.println("Match notification sent for session: " + session.getSessionId());
        } else {
            // No match yet, notify player they're in queue
            ArenaMessage queueMessage = new ArenaMessage(
                    MessageType.JOIN_QUEUE,
                    null,
                    player.getPlayerId(),
                    Map.of("queuePosition", arenaService.getQueueSize(), "status", "SEARCHING"));

            messagingTemplate.convertAndSend(
                    "/topic/player/" + player.getPlayerId(),
                    queueMessage);
        }
    }

    /**
     * Handle player leaving the queue
     */
    @MessageMapping("/arena/leave")
    public void leaveQueue(@Payload Map<String, String> payload) {
        String playerId = payload.get("playerId");
        System.out.println("Player leaving queue: " + playerId);

        arenaService.leaveQueue(playerId);

        ArenaMessage leaveMessage = new ArenaMessage(
                MessageType.LEAVE_QUEUE,
                null,
                playerId,
                Map.of("status", "LEFT_QUEUE"));

        messagingTemplate.convertAndSend(
                "/topic/player/" + playerId,
                leaveMessage);
    }

    /**
     * Handle progress updates during battle
     */
    @MessageMapping("/arena/progress")
    public void updateProgress(@Payload Map<String, Object> payload) {
        String sessionId = (String) payload.get("sessionId");
        String playerId = (String) payload.get("playerId");
        int progress = (int) payload.get("progress");
        int testsPassed = payload.containsKey("testsPassed") ? (int) payload.get("testsPassed") : 0;
        int totalTests = payload.containsKey("totalTests") ? (int) payload.get("totalTests") : 0;

        // Update in service
        arenaService.updateProgress(sessionId, playerId, progress, testsPassed, totalTests);

        // Get session and notify opponent
        ArenaSession session = arenaService.getSession(sessionId);
        if (session != null) {
            ArenaPlayer opponent = session.getOpponent(playerId);
            if (opponent != null) {
                Map<String, Object> progressData = new HashMap<>();
                progressData.put("opponentProgress", progress);
                progressData.put("opponentTestsPassed", testsPassed);
                progressData.put("opponentTotalTests", totalTests);

                ArenaMessage progressMessage = new ArenaMessage(
                        MessageType.OPPONENT_PROGRESS,
                        sessionId,
                        playerId,
                        progressData);

                // Send to opponent
                messagingTemplate.convertAndSend(
                        "/topic/player/" + opponent.getPlayerId(),
                        progressMessage);
            }
        }
    }

    /**
     * Handle solution submission
     */
    @MessageMapping("/arena/submit")
    public void submitSolution(@Payload Map<String, Object> payload) {
        String sessionId = (String) payload.get("sessionId");
        String playerId = (String) payload.get("playerId");
        boolean allPassed = (boolean) payload.get("allPassed");
        int testsPassed = (int) payload.get("testsPassed");
        int totalTests = (int) payload.get("totalTests");

        boolean isWinner = arenaService.submitSolution(sessionId, playerId, allPassed, testsPassed, totalTests);

        ArenaSession session = arenaService.getSession(sessionId);
        if (session == null)
            return;

        if (isWinner) {
            // Game over - this player wins!
            Map<String, Object> endData = new HashMap<>();
            endData.put("winnerId", playerId);
            endData.put("reason", "SOLVED");

            ArenaMessage endMessage = new ArenaMessage(
                    MessageType.GAME_END,
                    sessionId,
                    playerId,
                    endData);

            // Notify all players in session
            messagingTemplate.convertAndSend(
                    "/topic/arena/" + sessionId,
                    endMessage);

            System.out.println("Game ended! Winner: " + playerId);
        } else {
            // Notify opponent of submission attempt
            ArenaPlayer opponent = session.getOpponent(playerId);
            if (opponent != null) {
                Map<String, Object> submitData = new HashMap<>();
                submitData.put("opponentSubmitted", true);
                submitData.put("opponentTestsPassed", testsPassed);
                submitData.put("opponentTotalTests", totalTests);

                ArenaMessage submitMessage = new ArenaMessage(
                        MessageType.OPPONENT_PROGRESS,
                        sessionId,
                        playerId,
                        submitData);

                messagingTemplate.convertAndSend(
                        "/topic/player/" + opponent.getPlayerId(),
                        submitMessage);
            }
        }
    }

    /**
     * Handle timeout
     */
    @MessageMapping("/arena/timeout")
    public void handleTimeout(@Payload Map<String, String> payload) {
        String sessionId = payload.get("sessionId");

        ArenaSession session = arenaService.getSession(sessionId);
        if (session == null)
            return;

        // Determine winner based on progress
        ArenaPlayer winner = null;
        int maxProgress = -1;

        for (ArenaPlayer player : session.getPlayers()) {
            if (player.getProgress() > maxProgress) {
                maxProgress = player.getProgress();
                winner = player;
            }
        }

        String winnerId = winner != null ? winner.getPlayerId() : null;
        arenaService.endSession(sessionId, winnerId);

        Map<String, Object> endData = new HashMap<>();
        endData.put("winnerId", winnerId);
        endData.put("reason", "TIMEOUT");

        ArenaMessage endMessage = new ArenaMessage(
                MessageType.GAME_END,
                sessionId,
                null,
                endData);

        messagingTemplate.convertAndSend(
                "/topic/arena/" + sessionId,
                endMessage);

        System.out.println("Game ended due to timeout! Winner: " + winnerId);
    }
}
