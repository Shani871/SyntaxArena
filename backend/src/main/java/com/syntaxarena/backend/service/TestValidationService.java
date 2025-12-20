package com.syntaxarena.backend.service;

import com.syntaxarena.backend.model.TestValidationRequest;
import com.syntaxarena.backend.model.TestValidationResponse;
import com.syntaxarena.backend.model.TestValidationResponse.TestResult;
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
public class TestValidationService {

    @Value("${NVIDIA_API_KEY}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Validates a user's solution against the problem description.
     * Uses NVIDIA API to analyze code correctness and generate test cases.
     */
    public TestValidationResponse validateSolution(TestValidationRequest request) {
        String prompt = createValidationPrompt(request);

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "nvidia/nemotron-3-nano-30b-a3b");
            payload.put("temperature", 0.3); // Lower temperature for more deterministic validation
            payload.put("top_p", 0.9);
            payload.put("max_tokens", 4096);
            payload.put("stream", false);

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            payload.put("messages", List.of(message));

            // Enable thinking for better analysis
            Map<String, Object> extra = new HashMap<>();
            extra.put("enable_thinking", true);
            payload.put("chat_template_kwargs", extra);

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
                return parseValidationResponse(response.body());
            } else {
                System.out.println("API Error during validation: " + response.body());
                return getFallbackValidation();
            }

        } catch (Exception e) {
            System.out.println("Exception during validation: " + e.getMessage());
            e.printStackTrace();
            return getFallbackValidation();
        }
    }

    private String createValidationPrompt(TestValidationRequest request) {
        return String.format(
                "You are a code judge. Analyze the following solution and determine if it correctly solves the problem.\n\n"
                        +
                        "PROBLEM DESCRIPTION:\n%s\n\n" +
                        "EXPECTED BEHAVIOR:\n%s\n\n" +
                        "USER'S CODE (%s):\n```\n%s\n```\n\n" +
                        "INSTRUCTIONS:\n" +
                        "1. Generate 5 test cases for this problem (mix of basic, edge cases, and complex cases)\n" +
                        "2. Mentally trace through the user's code for each test case\n" +
                        "3. Determine if each test case would pass or fail\n" +
                        "4. Provide constructive feedback\n\n" +
                        "Return ONLY a valid JSON object (no markdown) with this exact structure:\n" +
                        "{\n" +
                        "  \"allPassed\": boolean,\n" +
                        "  \"passedCount\": number,\n" +
                        "  \"totalCount\": number,\n" +
                        "  \"results\": [\n" +
                        "    {\n" +
                        "      \"testNumber\": number,\n" +
                        "      \"input\": \"string description of input\",\n" +
                        "      \"expected\": \"expected output\",\n" +
                        "      \"actual\": \"what the code would produce\",\n" +
                        "      \"passed\": boolean\n" +
                        "    }\n" +
                        "  ],\n" +
                        "  \"feedback\": \"constructive feedback string\"\n" +
                        "}",
                request.getProblemDescription(),
                request.getExpectedBehavior() != null ? request.getExpectedBehavior()
                        : "Solve the problem as described",
                request.getLanguage(),
                request.getCode());
    }

    private TestValidationResponse parseValidationResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            String text = root.path("choices").get(0).path("message").path("content").asText();

            // Clean markdown formatting if present
            text = cleanJsonResponse(text);

            JsonNode validationNode = objectMapper.readTree(text);

            boolean allPassed = validationNode.path("allPassed").asBoolean(false);
            int passedCount = validationNode.path("passedCount").asInt(0);
            int totalCount = validationNode.path("totalCount").asInt(5);
            String feedback = validationNode.path("feedback").asText("No feedback provided");

            List<TestResult> results = new ArrayList<>();
            JsonNode resultsNode = validationNode.path("results");
            if (resultsNode.isArray()) {
                for (JsonNode node : resultsNode) {
                    TestResult result = new TestResult(
                            node.path("testNumber").asInt(results.size() + 1),
                            node.path("input").asText(""),
                            node.path("expected").asText(""),
                            node.path("actual").asText(""),
                            node.path("passed").asBoolean(false));
                    results.add(result);
                }
            }

            return new TestValidationResponse(allPassed, passedCount, totalCount, results, feedback);

        } catch (Exception e) {
            System.out.println("Error parsing validation response: " + e.getMessage());
            return getFallbackValidation();
        }
    }

    private String cleanJsonResponse(String text) {
        // Remove markdown code blocks
        if (text.startsWith("```json")) {
            text = text.substring(7);
        } else if (text.startsWith("```")) {
            text = text.substring(3);
        }
        if (text.endsWith("```")) {
            text = text.substring(0, text.length() - 3);
        }
        return text.trim();
    }

    private TestValidationResponse getFallbackValidation() {
        // Return a default response when API fails
        List<TestResult> fallbackResults = new ArrayList<>();
        fallbackResults.add(new TestResult(1, "Basic input", "Expected output", "Unable to verify", false));
        fallbackResults.add(new TestResult(2, "Edge case", "Expected output", "Unable to verify", false));
        fallbackResults.add(new TestResult(3, "Large input", "Expected output", "Unable to verify", false));

        return new TestValidationResponse(
                false,
                0,
                3,
                fallbackResults,
                "Unable to validate solution at this time. Please try again.");
    }
}
