package com.syntaxarena.backend.service;

import com.syntaxarena.backend.model.AptitudeRequest;
import com.syntaxarena.backend.model.AptitudeResponse;
import com.syntaxarena.backend.model.AptitudeQuestion;
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
public class AptitudeService {

    @Value("${NVIDIA_API_KEY}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AptitudeResponse generateQuestions(AptitudeRequest request) {
        String prompt = createPrompt(request);

        try {
            // NVIDIA API endpoint (OpenAI-compatible)
            String url = "https://integrate.api.nvidia.com/v1/chat/completions";

            Map<String, Object> payload = new HashMap<>();
            payload.put("model", "nvidia/nemotron-3-nano-30b-a3b");
            payload.put("temperature", 0.9);
            payload.put("top_p", 1);
            payload.put("max_tokens", 4096);
            payload.put("stream", false);

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            payload.put("messages", List.of(message));

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
                System.out.println("NVIDIA API Error: " + response.body() + ". Utilizing fallback.");
                return getFallbackQuestions(request.getTopic(), request.getDifficulty());
            }

        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage() + ". Utilizing fallback.");
            return getFallbackQuestions(request.getTopic(), request.getDifficulty());
        }
    }

    private String createPrompt(AptitudeRequest request) {
        String uniqueId = java.util.UUID.randomUUID().toString();
        long timestamp = System.currentTimeMillis();

        return String.format(
                "You are an AI aptitude question generator for a logic-first assessment platform.\n\n" +
                        "Your task:\n" +
                        "Generate UNIQUE aptitude questions every time.\n" +
                        "Do NOT repeat previously common or standard questions.\n" +
                        "Focus on reasoning, logic, and thinking process rather than memorized formulas.\n\n" +
                        "Rules:\n" +
                        "1. Each question must be freshly generated with different numbers, scenarios, or logic paths.\n"
                        +
                        "2. Avoid textbook or frequently repeated aptitude questions.\n" +
                        "3. Questions must require reasoning, not direct formula recall.\n" +
                        "4. Provide ONE correct answer.\n" +
                        "5. Provide 3 plausible distractor options.\n" +
                        "6. Include a short explanation for the correct answer.\n" +
                        "7. Avoid revealing patterns that allow easy guessing.\n" +
                        "8. Do NOT reuse structures from earlier questions.\n\n" +
                        "Question Types (rotate randomly):\n" +
                        "- Logical reasoning\n" +
                        "- Analytical reasoning\n" +
                        "- Pattern recognition\n" +
                        "- Scenario-based problem solving\n" +
                        "- Numerical reasoning with logic\n" +
                        "- Real-world aptitude situations\n\n" +
                        "Generate %d aptitude questions.\n\n" +
                        "Difficulty Level: %s\n" +
                        "Category: %s\n" +
                        "Request ID: %s\n" +
                        "Timestamp: %d\n\n" +
                        "Return output strictly as a JSON array with this structure (NO markdown, raw JSON only):\n" +
                        "[\n" +
                        "  {\n" +
                        "    \"text\": \"question text here\",\n" +
                        "    \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n" +
                        "    \"correctAnswer\": 0,\n" +
                        "    \"explanation\": \"short logical explanation\",\n" +
                        "    \"difficulty\": \"%s\",\n" +
                        "    \"skillTested\": \"skill name\"\n" +
                        "  }\n" +
                        "]\n" +
                        "correctAnswer is 0-indexed (0=first option, 1=second, etc.)",
                request.getNumberOfQuestions(),
                request.getDifficulty(),
                request.getTopic(),
                uniqueId,
                timestamp,
                request.getDifficulty());
    }

    private AptitudeResponse parseResponse(String jsonResponse) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);

            // OpenAI-compatible response structure: choices[0].message.content
            String text = root.path("choices").get(0)
                    .path("message").path("content").asText();

            // Clean markdown if present
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

            text = text.trim();

            JsonNode questionsArray = objectMapper.readTree(text);
            List<AptitudeQuestion> questions = new ArrayList<>();

            int id = 1;
            for (JsonNode qNode : questionsArray) {
                String questionText = qNode.path("text").asText();
                int correctAnswer = qNode.path("correctAnswer").asInt();
                String explanation = qNode.path("explanation").asText("");
                String difficulty = qNode.path("difficulty").asText("medium");
                String skillTested = qNode.path("skillTested").asText("");

                List<String> options = new ArrayList<>();
                JsonNode optionsNode = qNode.path("options");
                if (optionsNode.isArray()) {
                    for (JsonNode opt : optionsNode) {
                        options.add(opt.asText());
                    }
                }

                questions.add(new AptitudeQuestion(id++, questionText, options, correctAnswer,
                        explanation, difficulty, skillTested));
            }

            return new AptitudeResponse(questions);

        } catch (Exception e) {
            System.out.println("Parse error: " + e.getMessage());
            e.printStackTrace();
            return new AptitudeResponse(new ArrayList<>());
        }
    }

    private AptitudeResponse getFallbackQuestions(String category, String difficulty) {
        List<AptitudeQuestion> fallbackQuestions = new ArrayList<>();

        // Logic-focused fallback questions
        fallbackQuestions.add(new AptitudeQuestion(1,
                "If 5 machines can produce 5 widgets in 5 minutes, how long would it take 100 machines to produce 100 widgets?",
                List.of("5 minutes", "100 minutes", "20 minutes", "1 minute"),
                0,
                "Each machine produces 1 widget in 5 minutes. So 100 machines would produce 100 widgets in 5 minutes (not faster, since each still takes 5 min per widget).",
                difficulty,
                "Logical reasoning with rate problems"));

        fallbackQuestions.add(new AptitudeQuestion(2,
                "A bat and a ball together cost $1.10. The bat costs $1.00 more than the ball. How much does the ball cost?",
                List.of("$0.10", "$0.05", "$0.15", "$0.01"),
                1,
                "If ball = x, then bat = x + 1.00. So x + (x + 1.00) = 1.10, meaning 2x = 0.10, so x = $0.05.",
                difficulty,
                "Algebraic reasoning"));

        fallbackQuestions.add(new AptitudeQuestion(3,
                "In a race, you overtake the person in 2nd place. What position are you in now?",
                List.of("1st place", "2nd place", "3rd place", "It depends"),
                1,
                "If you overtake the 2nd place person, you take their position, which is 2nd place (not 1st).",
                difficulty,
                "Logical reasoning with misdirection"));

        return new AptitudeResponse(fallbackQuestions);
    }
}
