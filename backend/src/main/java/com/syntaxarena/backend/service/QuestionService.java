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

@Service
public class QuestionService {

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    
    private final ObjectMapper objectMapper = new ObjectMapper();

    public QuestionResponse generateQuestion(QuestionRequest request) {
        String prompt = createPrompt(request);
        
        // Simple JSON payload structure for Gemini API
        // { "contents": [{ "parts": [{ "text": "..." }] }] }
        String requestBody = String.format(
            "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}",
            escapeJson(prompt)
        );

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        try {
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                return parseResponse(response.body());
            } else {
                return new QuestionResponse("Error", "Failed to generate question: " + response.body(), List.of(), "");
            }

        } catch (Exception e) {
            return new QuestionResponse("Error", "Exception: " + e.getMessage(), List.of(), "");
        }
    }

    private String createPrompt(QuestionRequest request) {
        return String.format(
            "Generate a coding interview question. " +
            "Topic: %s. " +
            "Difficulty: %s. " +
            "Language: %s. " +
            "Return ONLY a JSON object with fields: title, description, examples (array of strings), starterCode. " +
            "Do not use markdown formatting in the response.",
            request.getTopic(), request.getDifficulty(), request.getLanguage()
        );
    }
    
    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\"", "\\\"").replace("\n", " ");
    }

    private QuestionResponse parseResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            // Navigate to valid text response: candidates[0].content.parts[0].text
            String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
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
