package com.syntaxarena.backend.service;

import com.syntaxarena.backend.model.ExecutionFlowRequest;
import com.syntaxarena.backend.model.ExecutionFlowResponse;
import com.syntaxarena.backend.model.ExecutionFlowResponse.VisualizerStep;
import com.syntaxarena.backend.model.ConceptRequest;
import com.syntaxarena.backend.model.ConceptResponse;
import com.fasterxml.jackson.core.type.TypeReference;
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
public class NvidiaVisualizerService {

    @Value("${NVIDIA_API_KEY}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ExecutionFlowResponse visualizeExecution(ExecutionFlowRequest request) {
        String prompt = String.format(
                "You are a code execution visualizer. Analyze this %s code step by step.\n\n" +
                        "Code:\n```\n%s\n```\n\n" +
                        "Instructions:\n" +
                        "1. Return ONLY a valid JSON array of objects.\n" +
                        "2. Each object must obey this schema: { \"step\": number, \"line\": number, \"description\": string, \"variables\": { \"varName\": \"value\" } }\n"
                        +
                        "3. 'line' is the 1-based line number being executed.\n" +
                        "4. 'variables' should show valid variable state at that step.\n" +
                        "5. Do NOT include any text outside the JSON block.\n",
                request.getLanguage(), request.getCode());

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "nvidia/nemotron-3-nano-30b-a3b");
            payload.put("temperature", 0.2); // Low temperature for deterministic JSON
            payload.put("top_p", 1);
            payload.put("max_tokens", 2048);
            payload.put("stream", false);

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            payload.put("messages", List.of(message));

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
                return new ExecutionFlowResponse(
                        "Error: Could not visualize execution. Status: " + response.statusCode());
            }

        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            return new ExecutionFlowResponse("Error visualizing code execution: " + e.getMessage());
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
            payload.put("model", "nvidia/nemotron-3-nano-30b-a3b"); // Or another suitable model
            payload.put("temperature", 0.7);
            payload.put("max_tokens", 1024);

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            payload.put("messages", List.of(message));

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
                return new ConceptResponse("Error: Could not simplify concept.");
            }

        } catch (Exception e) {
            return new ConceptResponse("Error simplifying concept.");
        }
    }

    private ExecutionFlowResponse parseExecutionResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            String content = root.path("choices").get(0).path("message").path("content").asText();

            // Clean up content to find JSON array
            int startIndex = content.indexOf("[");
            int endIndex = content.lastIndexOf("]");
            if (startIndex == -1 || endIndex == -1) {
                return new ExecutionFlowResponse("Error: AI did not return valid JSON steps.");
            }
            String jsonArray = content.substring(startIndex, endIndex + 1);

            List<VisualizerStep> steps = objectMapper.readValue(jsonArray, new TypeReference<List<VisualizerStep>>() {
            });
            return new ExecutionFlowResponse(steps);
        } catch (Exception e) {
            System.out.println("Parse error: " + e.getMessage());
            return new ExecutionFlowResponse("Could not parse AI response into steps.");
        }
    }

    private ConceptResponse parseConceptResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            String text = root.path("choices").get(0).path("message").path("content").asText();
            return new ConceptResponse(text);
        } catch (Exception e) {
            return new ConceptResponse("Could not parse response.");
        }
    }
}
