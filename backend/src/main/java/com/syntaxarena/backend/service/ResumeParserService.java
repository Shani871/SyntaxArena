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

    @Value("${NVIDIA_RESUME_PARSER_KEY}")
    private String nvidiaApiKey;

    private static final String NVIDIA_OCR_ENDPOINT = "https://ai.api.nvidia.com/v1/vlm/microsoft/phi-3-vision-128k-instruct";

    public String parseResumeFromImage(MultipartFile file) throws IOException, InterruptedException {
        // Convert file to base64
        byte[] fileBytes = file.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(fileBytes);
        String imageDataUrl = "data:" + file.getContentType() + ";base64," + base64Image;

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
                "Extract all visible information. If a field is not present, use null. Return ONLY valid JSON, no additional text.";

        // Build request body
        String requestBody = String.format(
                "{\"messages\":[{\"role\":\"user\",\"content\":\"%s <img src=\\\"%s\\\" />\"}],\"max_tokens\":2048,\"temperature\":0.2,\"top_p\":0.7,\"stream\":false}",
                prompt.replace("\"", "\\\"").replace("\n", "\\n"),
                imageDataUrl);

        // Make API call
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(NVIDIA_OCR_ENDPOINT))
                .header("Authorization", "Bearer " + nvidiaApiKey)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            // Extract content from response
            String responseBody = response.body();
            // Parse the response to get the actual content
            // The response format is:
            // {"id":"...","choices":[{"message":{"content":"..."}}]}
            int contentStart = responseBody.indexOf("\"content\":\"") + 11;
            int contentEnd = responseBody.indexOf("\"", contentStart);

            if (contentStart > 10 && contentEnd > contentStart) {
                String content = responseBody.substring(contentStart, contentEnd);
                // Unescape JSON
                content = content.replace("\\n", "\n").replace("\\\"", "\"").replace("\\\\", "\\");
                return content;
            }

            return responseBody; // Return full response if parsing fails
        } else {
            throw new RuntimeException("NVIDIA API error: " + response.statusCode() + " - " + response.body());
        }
    }

    public String enhanceResumeContent(String resumeData) throws IOException, InterruptedException {
        String prompt = "You are a professional resume writer. Given this resume data in JSON format, enhance it by:\n"
                +
                "1. Improving the professional summary to be more impactful\n" +
                "2. Rewriting experience bullet points to be more achievement-focused with metrics\n" +
                "3. Ensuring ATS-friendly keywords are included\n" +
                "4. Maintaining the same JSON structure\n\n" +
                "Resume data:\n" + resumeData + "\n\n" +
                "Return the enhanced resume in the same JSON format.";

        String requestBody = String.format(
                "{\"messages\":[{\"role\":\"user\",\"content\":\"%s\"}],\"max_tokens\":2048,\"temperature\":0.7,\"top_p\":0.9,\"stream\":false}",
                prompt.replace("\"", "\\\"").replace("\n", "\\n"));

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(NVIDIA_OCR_ENDPOINT))
                .header("Authorization", "Bearer " + nvidiaApiKey)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            String responseBody = response.body();
            int contentStart = responseBody.indexOf("\"content\":\"") + 11;
            int contentEnd = responseBody.lastIndexOf("\"");

            if (contentStart > 10 && contentEnd > contentStart) {
                String content = responseBody.substring(contentStart, contentEnd);
                content = content.replace("\\n", "\n").replace("\\\"", "\"").replace("\\\\", "\\");
                return content;
            }

            return responseBody;
        } else {
            throw new RuntimeException("NVIDIA API error: " + response.statusCode() + " - " + response.body());
        }
    }
}
