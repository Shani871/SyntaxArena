package com.syntaxarena.backend.service;

import com.syntaxarena.backend.model.CodeStoryRequest;
import com.syntaxarena.backend.model.CodeStoryResponse;
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
public class GeminiService {

    @Value("${NVIDIA_API_KEY}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public CodeStoryResponse generateCodeStory(CodeStoryRequest request) {
        String prompt = String.format(
                "Read the following code and explain exactly what it does in the form of a simple story.\n" +
                        "Language: %s\n" +
                        "Target Audience: Beginner Developer\n\n" +
                        "Code:\n%s\n\n" +
                        "Output Format:\n" +
                        "A short narrative story (max 200 words) where the code elements are characters or objects.",
                request.getLanguage(), request.getCode());

        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "nvidia/nemotron-3-nano-30b-a3b");
            payload.put("temperature", 0.8);
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
                return parseResponse(response.body());
            } else {
                System.out.println("NVIDIA API Error: " + response.body());
                return new CodeStoryResponse("Could not generate story. API error.");
            }

        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            return new CodeStoryResponse("Error generating code story.");
        }
    }

    private CodeStoryResponse parseResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            String text = root.path("choices").get(0).path("message").path("content").asText();
            return new CodeStoryResponse(text);
        } catch (Exception e) {
            System.out.println("Parse error: " + e.getMessage());
            return new CodeStoryResponse("Could not parse response.");
        }
    }
}
