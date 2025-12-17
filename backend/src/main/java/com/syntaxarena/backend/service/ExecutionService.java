package com.syntaxarena.backend.service;

import com.syntaxarena.backend.model.ExecutionRequest;
import com.syntaxarena.backend.model.ExecutionResponse;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class ExecutionService {

    public ExecutionResponse executeCode(ExecutionRequest request) {
        String language = request.getLanguage();
        String code = request.getCode();

        try {
            if ("python".equalsIgnoreCase(language)) {
                return executePython(code);
            } else if ("javascript".equalsIgnoreCase(language) || "node".equalsIgnoreCase(language)) {
                return executeNode(code);
            } else if ("java".equalsIgnoreCase(language)) {
                return executeJava(code);
            } else {
                return new ExecutionResponse("", "Unsupported language: " + language);
            }
        } catch (IOException | InterruptedException e) {
            return new ExecutionResponse("", "Execution failed: " + e.getMessage());
        }
    }

    private ExecutionResponse executePython(String code) throws IOException, InterruptedException {
        File tempFile = File.createTempFile("script", ".py");
        try (FileWriter writer = new FileWriter(tempFile)) {
            writer.write(code);
        }

        return runProcess("python3", tempFile.getAbsolutePath());
    }

    private ExecutionResponse executeNode(String code) throws IOException, InterruptedException {
        File tempFile = File.createTempFile("script", ".js");
        try (FileWriter writer = new FileWriter(tempFile)) {
            writer.write(code);
        }

        return runProcess("node", tempFile.getAbsolutePath());
    }

    private ExecutionResponse executeJava(String code) throws IOException, InterruptedException {
        // Extract class name to match filename
        String className = "Main";
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("public\\s+class\\s+(\\w+)");
        java.util.regex.Matcher matcher = pattern.matcher(code);
        if (matcher.find()) {
            className = matcher.group(1);
        }

        Path tempDir = Files.createTempDirectory("java_exec");
        File sourceFile = new File(tempDir.toFile(), className + ".java");
        try (FileWriter writer = new FileWriter(sourceFile)) {
            writer.write(code);
        }

        // Compile
        ProcessBuilder compilePb = new ProcessBuilder("javac", sourceFile.getAbsolutePath());
        Process compileProcess = compilePb.start();
        String compileError = new BufferedReader(new InputStreamReader(compileProcess.getErrorStream()))
                .lines().collect(Collectors.joining("\n"));
        compileProcess.waitFor(10, TimeUnit.SECONDS);

        if (compileProcess.exitValue() != 0) {
            return new ExecutionResponse("", "Compilation Error:\n" + compileError);
        }

        // Run
        ProcessBuilder runPb = new ProcessBuilder("java", "-cp", tempDir.toAbsolutePath().toString(), className);
        Process runProcess = runPb.start();

        String output = new BufferedReader(new InputStreamReader(runProcess.getInputStream()))
                .lines().collect(Collectors.joining("\n"));
        String error = new BufferedReader(new InputStreamReader(runProcess.getErrorStream()))
                .lines().collect(Collectors.joining("\n"));

        boolean finished = runProcess.waitFor(5, TimeUnit.SECONDS);
        if (!finished) {
            runProcess.destroy();
            return new ExecutionResponse(output, error + "\nTimeout");
        }

        return new ExecutionResponse(output, error);
    }

    private ExecutionResponse runProcess(String... command) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(command);
        Process process = pb.start();

        String output = new BufferedReader(new InputStreamReader(process.getInputStream()))
                .lines().collect(Collectors.joining("\n"));
        String error = new BufferedReader(new InputStreamReader(process.getErrorStream()))
                .lines().collect(Collectors.joining("\n"));

        boolean finished = process.waitFor(5, TimeUnit.SECONDS);
        if (!finished) {
            process.destroy();
            return new ExecutionResponse(output, error + "\nTimeout");
        }

        return new ExecutionResponse(output, error);
    }
}
