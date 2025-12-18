package com.syntaxarena.backend.service;

import com.syntaxarena.backend.model.QuestionRequest;
import com.syntaxarena.backend.model.QuestionResponse;
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
public class QuestionService {

    @Value("${NVIDIA_API_KEY}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public QuestionResponse generateQuestion(QuestionRequest request) {
        String prompt = createPrompt(request);

        // NVIDIA (OpenAI-compatible) payload
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "nvidia/nemotron-3-nano-30b-a3b");
            payload.put("temperature", 1);
            payload.put("top_p", 1);
            payload.put("max_tokens", 8192); // Reduced from 16k to be safe, or stick to 4k
            payload.put("stream", false);

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            payload.put("messages", List.of(message));

            // Extra body for reasoning if needed, though we just want the output
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
                return parseResponse(response.body());
            } else {
                System.out.println("API Error: " + response.body() + ". Utilizing fallback.");
                return getFallbackQuestion(request.getDifficulty());
            }

        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage() + ". Utilizing fallback.");
            return getFallbackQuestion(request.getDifficulty());
        }
    }

    private QuestionResponse getFallbackQuestion(String difficulty) {
        if (difficulty == null)
            difficulty = "Medium";
        switch (difficulty.toLowerCase()) {
            case "easy":
                return new QuestionResponse(
                        "Two Sum",
                        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                        List.of("Input: nums = [2,7,11,15], target = 9 -> Output: [0,1]",
                                "Input: nums = [3,2,4], target = 6 -> Output: [1,2]"),
                        "public class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        return new int[]{};\n    }\n}");
            case "hard":
                return new QuestionResponse(
                        "Trapping Rain Water",
                        "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
                        List.of("Input: height = [0,1,0,2,1,0,1,3,2,1,2,1] -> Output: 6",
                                "Input: height = [4,2,0,3,2,5] -> Output: 9"),
                        "public class Solution {\n    public int trap(int[] height) {\n        // Write your code here\n        return 0;\n    }\n}");
            case "medium":
            default:
                return new QuestionResponse(
                        "Longest Substring Without Repeating Characters",
                        "Given a string s, find the length of the longest substring without repeating characters.",
                        List.of("Input: s = \"abcabcbb\" -> Output: 3", "Input: s = \"bbbbb\" -> Output: 1"),
                        "public class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your code here\n        return 0;\n    }\n}");
        }
    }

    private String createPrompt(QuestionRequest request) {
        String uniqueId = java.util.UUID.randomUUID().toString();
        return String.format(
                "Generate a UNIQUE, CREATIVE, and NEW coding interview question. Do not repeat common examples. " +
                        "Topic: %s. " +
                        "Difficulty: %s. " +
                        "Language: %s. " +
                        "Request ID: %s (Ensure this request produces a different result than previous ones). " +
                        "Return ONLY a JSON object with fields: title, description, examples (array of strings), starterCode. "
                        +
                        "Do not use markdown formatting in the response.",
                request.getTopic(), request.getDifficulty(), request.getLanguage(), uniqueId);
    }

    private QuestionResponse parseResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            // OpenAI format: choices[0].message.content
            String text = root.path("choices").get(0).path("message").path("content").asText();

            // The text should be the JSON object we asked for
            // Clean potentially markdown blocks like ```json
            if (text.startsWith("```json")) {
                text = text.substring(7);
                if (text.endsWith("```")) {
                    text = text.substring(0, text.length() - 3);
                }
            } else if (text.startsWith("```")) {
                text = text.substring(3);
                if (text.endsWith("```")) {
                    text = text.substring(0, text.length() - 3);
                }
            }

            JsonNode questionNode = objectMapper.readTree(text);

            String title = questionNode.path("title").asText("Untitled");
            String description = questionNode.path("description").asText("No description");
            String starterCode = questionNode.path("starterCode").asText("");

            List<String> examples = new ArrayList<>();
            JsonNode examplesNode = questionNode.path("examples");
            if (examplesNode.isArray()) {
                for (JsonNode node : examplesNode) {
                    examples.add(node.asText());
                }
            }

            return new QuestionResponse(title, description, examples, starterCode);

        } catch (Exception e) {
            return new QuestionResponse("Error Parsing", "Raw response: " + jsonResponse, List.of(), "");
        }
    }
}
