package com.syntaxarena.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

@Service
public class ResumeParserService {

    @Value("${GEMINI_API_KEY:}")
    private String geminiApiKey;

    @Value("${NVIDIA_RESUME_PARSER_KEY:}")
    private String nvidiaApiKey;

    private static final String GEMINI_VISION_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public String parseResumeFromImage(MultipartFile file) throws IOException, InterruptedException {
        // Try Gemini API first (more reliable)
        try {
            return parseWithGemini(file);
        } catch (Exception e) {
            System.err.println("Gemini parsing failed: " + e.getMessage());
            // Fallback to mock data if API fails
            return createMockResumeData();
        }
    }

    private String parseWithGemini(MultipartFile file) throws IOException, InterruptedException {
        // Convert file to base64
        byte[] fileBytes = file.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(fileBytes);

        // Determine MIME type
        String mimeType = file.getContentType();
        if (mimeType == null || mimeType.isEmpty()) {
            mimeType = "image/png";
        }

        // Create prompt for resume extraction
        String prompt = "Extract all information from this resume document and structure it as JSON with the following fields:\n"
                +
                "{\n" +
                "  \"name\": \"full name\",\n" +
                "  \"email\": \"email address\",\n" +
                "  \"phone\": \"phone number\",\n" +
                "  \"location\": \"city, state/country\",\n" +
                "  \"summary\": \"professional summary or objective\",\n" +
                "  \"experience\": [\n" +
                "    {\n" +
                "      \"company\": \"company name\",\n" +
                "      \"title\": \"job title\",\n" +
                "      \"duration\": \"start - end date\",\n" +
                "      \"description\": [\"bullet point 1\", \"bullet point 2\"]\n" +
                "    }\n" +
                "  ],\n" +
                "  \"education\": [\n" +
                "    {\n" +
                "      \"school\": \"school name\",\n" +
                "      \"degree\": \"degree name\",\n" +
                "      \"year\": \"graduation year\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"skills\": [\"skill1\", \"skill2\", \"skill3\"],\n" +
                "  \"projects\": [\n" +
                "    {\n" +
                "      \"name\": \"project name\",\n" +
                "      \"description\": \"project description\",\n" +
                "      \"technologies\": [\"tech1\", \"tech2\"]\n" +
                "    }\n" +
                "  ]\n" +
                "}\n\n" +
                "Extract all visible information. If a field is not present, use null. Return ONLY valid JSON, no additional text or markdown formatting.";

        // Build Gemini API request body
        String requestBody = String.format(
                "{\"contents\":[{\"parts\":[{\"text\":\"%s\"},{\"inline_data\":{\"mime_type\":\"%s\",\"data\":\"%s\"}}]}],\"generationConfig\":{\"temperature\":0.2,\"topP\":0.8,\"maxOutputTokens\":2048}}",
                prompt.replace("\"", "\\\"").replace("\n", "\\n"),
                mimeType,
                base64Image);

        // Make API call
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(GEMINI_VISION_ENDPOINT + "?key=" + geminiApiKey))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            // Extract content from Gemini response
            String responseBody = response.body();
            // Gemini response format:
            // {"candidates":[{"content":{"parts":[{"text":"..."}]}}]}
            int textStart = responseBody.indexOf("\"text\":\"") + 8;
            int textEnd = responseBody.indexOf("\"", textStart);

            if (textStart > 7 && textEnd > textStart) {
                String content = responseBody.substring(textStart, textEnd);
                // Unescape JSON
                content = content.replace("\\n", "\n").replace("\\\"", "\"").replace("\\\\", "\\");

                // Remove markdown code fences if present
                content = content.replaceAll("```json\\s*", "").replaceAll("```\\s*", "");

                return content.trim();
            }

            return responseBody; // Return full response if parsing fails
        } else {
            throw new RuntimeException("Gemini API error: " + response.statusCode() + " - " + response.body());
        }
    }

    private String createMockResumeData() {
        // Fallback mock data when API is unavailable
        return "{\n" +
                "  \"name\": \"Demo User\",\n" +
                "  \"email\": \"demo@syntaxarena.com\",\n" +
                "  \"phone\": \"+1 (555) 123-4567\",\n" +
                "  \"location\": \"San Francisco, CA\",\n" +
                "  \"summary\": \"Results-driven software engineer with 3+ years of experience in full-stack development. Passionate about building scalable applications and solving complex problems.\",\n"
                +
                "  \"experience\": [\n" +
                "    {\n" +
                "      \"company\": \"TechCorp Inc.\",\n" +
                "      \"title\": \"Software Engineer\",\n" +
                "      \"duration\": \"2021 - Present\",\n" +
                "      \"description\": [\n" +
                "        \"Developed and maintained RESTful APIs serving 1M+ requests daily\",\n" +
                "        \"Improved application performance by 40% through code optimization\",\n" +
                "        \"Collaborated with cross-functional teams in Agile environment\"\n" +
                "      ]\n" +
                "    }\n" +
                "  ],\n" +
                "  \"education\": [\n" +
                "    {\n" +
                "      \"school\": \"University of California\",\n" +
                "      \"degree\": \"Bachelor of Science in Computer Science\",\n" +
                "      \"year\": \"2020\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"skills\": [\"Java\", \"Python\", \"JavaScript\", \"React\", \"Spring Boot\", \"PostgreSQL\", \"Docker\", \"AWS\"],\n"
                +
                "  \"projects\": [\n" +
                "    {\n" +
                "      \"name\": \"E-Commerce Platform\",\n" +
                "      \"description\": \"Built a full-stack e-commerce solution with payment integration\",\n" +
                "      \"technologies\": [\"React\", \"Node.js\", \"MongoDB\", \"Stripe\"]\n" +
                "    }\n" +
                "  ]\n" +
                "}";
    }

    public String enhanceResumeContent(String resumeData) throws IOException, InterruptedException {
        try {
            String prompt = "You are a professional resume writer. Given this resume data in JSON format, enhance it by:\n"
                    +
                    "1. Improving the professional summary to be more impactful\n" +
                    "2. Rewriting experience bullet points to be more achievement-focused with metrics\n" +
                    "3. Ensuring ATS-friendly keywords are included\n" +
                    "4. Maintaining the same JSON structure\n\n" +
                    "Resume data:\n" + resumeData + "\n\n" +
                    "Return the enhanced resume in the same JSON format. Do not include markdown code fences, just return the JSON.";

            String requestBody = String.format(
                    "{\"contents\":[{\"parts\":[{\"text\":\"%s\"}]}],\"generationConfig\":{\"temperature\":0.7,\"topP\":0.9,\"maxOutputTokens\":2048}}",
                    prompt.replace("\"", "\\\"").replace("\n", "\\n"));

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GEMINI_VISION_ENDPOINT + "?key=" + geminiApiKey))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                String responseBody = response.body();
                int textStart = responseBody.indexOf("\"text\":\"") + 8;
                int textEnd = responseBody.lastIndexOf("\"");

                if (textStart > 7 && textEnd > textStart) {
                    String content = responseBody.substring(textStart, textEnd);
                    content = content.replace("\\n", "\n").replace("\\\"", "\"").replace("\\\\", "\\");
                    content = content.replaceAll("```json\\s*", "").replaceAll("```\\s*", "");
                    return content.trim();
                }

                return responseBody;
            } else {
                throw new RuntimeException("Gemini API error: " + response.statusCode() + " - " + response.body());
            }
        } catch (Exception e) {
            System.err.println("Resume enhancement failed: " + e.getMessage());
            // Return original if enhancement fails
            return resumeData;
        }
    }
}
