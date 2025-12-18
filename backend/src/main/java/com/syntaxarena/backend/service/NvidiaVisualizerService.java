package com.syntaxarena.backend.service;

import com.syntaxarena.backend.model.ExecutionFlowRequest;
import com.syntaxarena.backend.model.ExecutionFlowResponse;
import com.syntaxarena.backend.model.ConceptRequest;
import com.syntaxarena.backend.model.ConceptResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class NvidiaVisualizerService {

    @Value("${NVIDIA_API_KEY}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ExecutionFlowResponse visualizeExecution(ExecutionFlowRequest request) {
        String prompt = String.format(
                "Analyze this %s code step by step.\n\n" +
                        "Code:\n```\n%s\n```\n\n" +
                        "Instructions:\n" +
                        "1. Show exactly what happens at EACH line of code\n" +
                        "2. Format as numbered steps: Step 1, Step 2, etc.\n" +
                        "3. For each step show: Line, Action, Variable values\n" +
                        "4. Keep each step SHORT (1-2 sentences max)\n" +
                        "5. Use simple language, no complex tables\n\n" +
                        "Example format:\n" +
                        "Step 1: Function factorial(3) is called with n=3\n" +
                        "Step 2: Check if n===0 (false), so continue\n" +
                        "Step 3: Return 3 * factorial(2)...",
                request.getLanguage(), request.getCode());

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "nvidia/nemotron-3-nano-30b-a3b");
            payload.put("temperature", 0.5);
            payload.put("top_p", 1);
            payload.put("max_tokens", 2048);
            payload.put("stream", false);

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            payload.put("messages", List.of(message));

            // Removed thinking mode for cleaner output

            String requestBody = objectMapper.writeValueAsString(payload);
            String url = "https://integrate.api.nvidia.com/v1/chat/completions";

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return parseExecutionResponse(response.body());
            } else {
                System.out.println("API Error: " + response.body());
                return new ExecutionFlowResponse("Error: Could not visualize execution.");
            }

        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            return new ExecutionFlowResponse("Error visualizing code execution.");
        }
    }

    public ConceptResponse simplifyConcept(ConceptRequest request) {
        String prompt = String.format(
                "Explain the concept \"%s\" simply for a %s level student.\n\n" +
                        "Instructions:\n" +
                        "1. Use %s language\n" +
                        "2. Start with a simple analogy (like cooking or driving)\n" +
                        "3. Keep it under 100 words\n" +
                        "4. Be clear and direct\n" +
                        "5. No complex jargon",
                request.getConcept(), request.getLevel(), request.getLanguage());

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "nvidia/nemotron-3-nano-30b-a3b");
            payload.put("temperature", 0.7);
            payload.put("top_p", 1);
            payload.put("max_tokens", 1024);
            payload.put("stream", false);

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            payload.put("messages", List.of(message));

            // Removed thinking mode for cleaner output

            String requestBody = objectMapper.writeValueAsString(payload);
            String url = "https://integrate.api.nvidia.com/v1/chat/completions";

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                return parseConceptResponse(response.body());
            } else {
                System.out.println("API Error: " + response.body());
                return new ConceptResponse("Error: Could not simplify concept.");
            }

        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            return new ConceptResponse("Error simplifying concept.");
        }
    }

    private ExecutionFlowResponse parseExecutionResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            String text = root.path("choices").get(0).path("message").path("content").asText();
            return new ExecutionFlowResponse(text);
        } catch (Exception e) {
            System.out.println("Parse error: " + e.getMessage());
            return new ExecutionFlowResponse("Could not parse response.");
        }
    }

    private ConceptResponse parseConceptResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            String text = root.path("choices").get(0).path("message").path("content").asText();
            return new ConceptResponse(text);
        } catch (Exception e) {
            System.out.println("Parse error: " + e.getMessage());
            return new ConceptResponse("Could not parse response.");
        }
    }
}
