package com.syntaxarena.backend.service;

import com.syntaxarena.backend.model.DocChatRequest;
import com.syntaxarena.backend.model.DocChatResponse;
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
import java.util.regex.Pattern;

@Service
public class DocChatService {

    @Value("${NVIDIA_API_KEY}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_2)
            .connectTimeout(Duration.ofSeconds(30))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Patterns to detect document creation intent
    private static final Pattern CREATE_DOC_PATTERN = Pattern.compile(
            "(?i)(create|make|generate|write|build|draft)\\s+(a\\s+)?(new\\s+)?(document|doc|documentation|guide|tutorial|article)\\s+(about|on|for|regarding)?",
            Pattern.CASE_INSENSITIVE);

    public DocChatResponse chat(DocChatRequest request) {
        // Check if this is a document creation request
        boolean isCreateDocRequest = CREATE_DOC_PATTERN.matcher(request.getMessage()).find();

        try {
            String url = "https://integrate.api.nvidia.com/v1/chat/completions";

            String systemMessage;
            if (isCreateDocRequest) {
                systemMessage = buildDocCreationPrompt(request.getMessage());
            } else {
                systemMessage = buildQAPrompt(request.getDocumentContent());
            }

            // Build messages array
            List<Map<String, Object>> messages = new ArrayList<>();

            // Add system message
            Map<String, Object> sysMsg = new HashMap<>();
            sysMsg.put("role", "system");
            sysMsg.put("content", systemMessage);
            messages.add(sysMsg);

            // Add chat history (only for Q&A, not for creation)
            if (!isCreateDocRequest && request.getHistory() != null) {
                for (DocChatRequest.ChatHistoryItem item : request.getHistory()) {
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
            payload.put("temperature", isCreateDocRequest ? 0.8 : 0.7);
            payload.put("top_p", 1);
            payload.put("max_tokens", isCreateDocRequest ? 4096 : 2048);
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
                return parseResponse(response.body(), isCreateDocRequest);
            } else {
                System.out.println("NVIDIA API Error: " + response.body());
                return new DocChatResponse("Error communicating with the assistant. Please try again.");
            }

        } catch (Exception e) {
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            return new DocChatResponse("Error: " + e.getMessage());
        }
    }

    private String buildDocCreationPrompt(String userRequest) {
        return "You are an expert technical documentation writer.\n\n" +
                "TASK: Create a comprehensive, well-structured technical document based on the user's request.\n\n" +
                "CRITICAL: You MUST return a valid JSON object with this EXACT structure:\n" +
                "{\n" +
                "  \"title\": \"Short descriptive title (2-5 words)\",\n" +
                "  \"category\": \"One of: Getting Started, Core Concepts, Advanced Topics, Reference, Tutorials\",\n" +
                "  \"content\": \"Full document content with proper formatting\"\n" +
                "}\n\n" +
                "DOCUMENT STRUCTURE REQUIREMENTS:\n" +
                "The content field MUST include these sections (use \\n for newlines):\n\n" +
                "1. OVERVIEW - Brief introduction explaining what this topic is (2-3 sentences)\n\n" +
                "2. KEY CONCEPTS - List 3-5 main concepts with bullet points:\n" +
                "   - Concept 1: Brief explanation\n" +
                "   - Concept 2: Brief explanation\n\n" +
                "3. HOW IT WORKS - Step-by-step explanation or workflow\n\n" +
                "4. EXAMPLE - A practical code example or use case\n\n" +
                "5. BEST PRACTICES - 3-5 tips or recommendations\n\n" +
                "6. SUMMARY - 1-2 sentence conclusion\n\n" +
                "FORMATTING RULES:\n" +
                "- Use ## for section headers\n" +
                "- Use - for bullet points\n" +
                "- Use ``` for code blocks\n" +
                "- Use **bold** for important terms\n" +
                "- Each section should be separated by a blank line (\\n\\n)\n\n" +
                "EXAMPLE OUTPUT FORMAT:\n" +
                "{\n" +
                "  \"title\": \"REST API Basics\",\n" +
                "  \"category\": \"Core Concepts\",\n" +
                "  \"content\": \"## Overview\\n\\nREST APIs are... description here.\\n\\n## Key Concepts\\n\\n- **Endpoints**: URL paths...\\n- **Methods**: GET, POST...\\n\\n## How It Works\\n\\n1. Client sends request...\\n2. Server processes...\\n\\n## Example\\n\\n```javascript\\nfetch('/api/users')...\\n```\\n\\n## Best Practices\\n\\n- Use proper status codes\\n- Version your APIs\\n\\n## Summary\\n\\nREST APIs provide...\"\n"
                +
                "}\n\n" +
                "IMPORTANT: Return ONLY the JSON object. No markdown code blocks around it. No explanations before or after.";
    }

    private String buildQAPrompt(String documentContent) {
        return String.format(
                "You are an intelligent documentation assistant.\n" +
                        "Your goal is to answer questions based strictly on the provided DOCUMENT_CONTEXT.\n\n" +
                        "DOCUMENT_CONTEXT:\n\"\"\"\n%s\n\"\"\"\n\n" +
                        "RULES:\n" +
                        "1. Answer users' questions using the context above.\n" +
                        "2. If the answer is not in the context, say \"I cannot find that information in the current document.\"\n"
                        +
                        "3. Be concise and helpful.\n" +
                        "4. Format responses clearly with bullet points when appropriate.",
                documentContent != null ? documentContent : "");
    }

    private DocChatResponse parseResponse(String jsonResponse, boolean isCreateDocRequest) {
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            String text = root.path("choices").get(0)
                    .path("message").path("content").asText();

            if (isCreateDocRequest) {
                // Try to parse as JSON for document creation
                return parseDocCreationResponse(text);
            } else {
                return new DocChatResponse(text);
            }
        } catch (Exception e) {
            System.out.println("Parse error: " + e.getMessage());
            return new DocChatResponse("Could not parse response.");
        }
    }

    private DocChatResponse parseDocCreationResponse(String text) {
        try {
            // Clean markdown if present
            String cleanedText = text.trim();
            if (cleanedText.startsWith("```json")) {
                cleanedText = cleanedText.substring(7);
            } else if (cleanedText.startsWith("```")) {
                cleanedText = cleanedText.substring(3);
            }
            if (cleanedText.endsWith("```")) {
                cleanedText = cleanedText.substring(0, cleanedText.length() - 3);
            }
            cleanedText = cleanedText.trim();

            JsonNode docNode = objectMapper.readTree(cleanedText);

            String title = docNode.path("title").asText("Untitled Document");
            String category = docNode.path("category").asText("Uncategorized");
            String content = docNode.path("content").asText("");

            // Return with CREATE_DOC action
            return new DocChatResponse(
                    "Document \"" + title + "\" created successfully!",
                    "CREATE_DOC",
                    title,
                    category,
                    content);
        } catch (Exception e) {
            System.out.println("Doc creation parse error: " + e.getMessage());
            // Fallback: return the text as a regular response
            return new DocChatResponse(
                    "I generated the content but couldn't format it properly. Here's what I created:\n\n" + text);
        }
    }
}
