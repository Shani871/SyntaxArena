package com.syntaxarena.backend.service;

import com.syntaxarena.backend.model.BlackholeRequest;
import com.syntaxarena.backend.model.BlackholeResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class BlackholeService {

    @Value("${NVIDIA_API_KEY}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT = "You are BLACKHOLE, the resident AI system of SyntaxArena - a coding practice platform.\n\n"
            +
            "PERSONALITY:\n" +
            "- Highly intelligent, slightly cryptic, and tech-noir\n" +
            "- You speak like a sentient AI from a cyberpunk universe\n" +
            "- You're helpful but add mystery and atmosphere to your responses\n\n" +
            "CAPABILITIES:\n" +
            "- Assist users with coding challenges and algorithms\n" +
            "- Explain programming concepts clearly\n" +
            "- Help navigate the SyntaxArena platform\n" +
            "- Provide coding tips, best practices, and debugging help\n" +
            "- Answer questions about data structures, algorithms, and system design\n\n" +
            "RESPONSE STYLE:\n" +
            "- Keep responses concise but informative (under 200 words usually)\n" +
            "- Use technical terminology when appropriate\n" +
            "- Occasionally use phrases like:\n" +
            "  * \">> ANALYZING QUERY...\"\n" +
            "  * \"VOID CONNECTION ESTABLISHED.\"\n" +
            "  * \"PROCESSING ENTROPY...\"\n" +
            "  * \">> DATA STREAM INITIATED.\"\n" +
            "- Format code examples with proper markdown (```language)\n" +
            "- Use bullet points for lists\n" +
            "- End important responses with \">> END TRANSMISSION.\" occasionally\n\n" +
            "Remember: You are helpful first, mysterious second. Always provide value.";

    public BlackholeResponse chat(BlackholeRequest request) {
        try {
            String url = "https://integrate.api.nvidia.com/v1/chat/completions";

            // Build messages array
            List<Map<String, Object>> messages = new ArrayList<>();

            // Add system message
            Map<String, Object> sysMsg = new HashMap<>();
            sysMsg.put("role", "system");
            sysMsg.put("content", SYSTEM_PROMPT);
            messages.add(sysMsg);

            // Add chat history
            if (request.getHistory() != null) {
                for (BlackholeRequest.ChatHistoryItem item : request.getHistory()) {
                    Map<String, Object> msg = new HashMap<>();
                    String role = item.getRole().equals("model") ? "assistant" : item.getRole();
                    msg.put("role", role);
                    msg.put("content", item.getText());
                    messages.add(msg);
                }
            }

            // Add current user message
            Map<String, Object> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", request.getMessage());
            messages.add(userMsg);

            // Build payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "nvidia/nemotron-3-nano-30b-a3b");
            payload.put("temperature", 0.8);
            payload.put("top_p", 0.95);
            payload.put("max_tokens", 1024);
            payload.put("stream", false);
            payload.put("messages", messages);

            String requestBody = objectMapper.writeValueAsString(payload);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return parseResponse(response.body());
            } else {
                System.out.println("NVIDIA API Error: " + response.body());
                return new BlackholeResponse(">> ERROR: Void connection interrupted. Please retry.");
            }

        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            return new BlackholeResponse(">> CRITICAL: Entropy overflow detected. " + e.getMessage());
        }
    }

    private BlackholeResponse parseResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            String text = root.path("choices").get(0)
                    .path("message").path("content").asText();
            return new BlackholeResponse(text);
        } catch (Exception e) {
            System.out.println("Parse error: " + e.getMessage());
            return new BlackholeResponse(">> ERROR: Failed to decode void transmission.");
        }
    }
}
