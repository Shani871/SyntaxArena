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
        String testHarness = request.getTestHarness();

        try {
            if ("python".equalsIgnoreCase(language)) {
                return executePython(code, testHarness);
            } else if ("javascript".equalsIgnoreCase(language) || "node".equalsIgnoreCase(language)) {
                return executeNode(code, testHarness);
            } else if ("java".equalsIgnoreCase(language)) {
                return executeJava(code, testHarness);
            } else {
                return new ExecutionResponse("", "Unsupported language: " + language);
            }
        } catch (IOException | InterruptedException e) {
            return new ExecutionResponse("", "Execution failed: " + e.getMessage());
        }
    }

    private ExecutionResponse executePython(String code, String testHarness) throws IOException, InterruptedException {
        // If testHarness is present, append it to the code
        String finalCode = code;
        if (testHarness != null && !testHarness.isEmpty()) {
            finalCode = code + "\n\n" + testHarness;
        }

        File tempFile = File.createTempFile("script", ".py");
        try (FileWriter writer = new FileWriter(tempFile)) {
            writer.write(finalCode);
        }

        return runProcess("python3", tempFile.getAbsolutePath());
    }

    private ExecutionResponse executeNode(String code, String testHarness) throws IOException, InterruptedException {
        // If testHarness is present, append it to the code
        String finalCode = code;
        if (testHarness != null && !testHarness.isEmpty()) {
            finalCode = code + "\n\n" + testHarness;
        }

        File tempFile = File.createTempFile("script", ".js");
        try (FileWriter writer = new FileWriter(tempFile)) {
            writer.write(finalCode);
        }

        return runProcess("node", tempFile.getAbsolutePath());
    }

    private ExecutionResponse executeJava(String code, String testHarness) throws IOException, InterruptedException {
        Path tempDir = Files.createTempDirectory("java_exec");

        // If test harness is present, user code goes into Solution.java, harness goes
        // into Main.java
        // Otherwise, fallback to single file execution (Main.java)

        if (testHarness != null && !testHarness.isEmpty()) {
            // Write User Code -> Solution.java
            File solutionFile = new File(tempDir.toFile(), "Solution.java");
            try (FileWriter writer = new FileWriter(solutionFile)) {
                writer.write(code);
            }

            // Write Harness -> Main.java
            File mainFile = new File(tempDir.toFile(), "Main.java");
            try (FileWriter writer = new FileWriter(mainFile)) {
                writer.write(testHarness);
            }

            // Compile ALL java files in dir
            ProcessBuilder compilePb = new ProcessBuilder("javac", solutionFile.getAbsolutePath(),
                    mainFile.getAbsolutePath());
            Process compileProcess = compilePb.start();
            // ... capture error ...
            String compileError = new BufferedReader(new InputStreamReader(compileProcess.getErrorStream()))
                    .lines().collect(Collectors.joining("\n"));
            compileProcess.waitFor(10, TimeUnit.SECONDS);

            if (compileProcess.exitValue() != 0) {
                return new ExecutionResponse("", "Compilation Error:\n" + compileError);
            }

            // Run Main
            ProcessBuilder runPb = new ProcessBuilder("java", "-cp", tempDir.toAbsolutePath().toString(), "Main");
            Process runProcess = runPb.start();
            return handleProcessOutput(runProcess);

        } else {
            // Old Logic for single file
            // Extract class name to match filename
            String className = "Main";
            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("public\\s+class\\s+(\\w+)");
            java.util.regex.Matcher matcher = pattern.matcher(code);
            if (matcher.find()) {
                className = matcher.group(1);
            }

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
            return handleProcessOutput(runProcess);
        }
    }

    private ExecutionResponse handleProcessOutput(Process process) throws IOException, InterruptedException {
        String output;
        String error;
        try (BufferedReader outputReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
            output = outputReader.lines().collect(Collectors.joining("\n"));
            error = errorReader.lines().collect(Collectors.joining("\n"));
        }

        boolean finished = process.waitFor(5, TimeUnit.SECONDS);
        if (!finished) {
            process.destroy();
            return new ExecutionResponse(output, error + "\nTimeout");
        }

        return new ExecutionResponse(output, error);
    }

    private ExecutionResponse runProcess(String... command) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(command);
        Process process = pb.start();

        String output;
        String error;
        try (BufferedReader outputReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
            output = outputReader.lines().collect(Collectors.joining("\n"));
            error = errorReader.lines().collect(Collectors.joining("\n"));
        }

        boolean finished = process.waitFor(5, TimeUnit.SECONDS);
        if (!finished) {
            process.destroy();
            return new ExecutionResponse(output, error + "\nTimeout");
        }

        return new ExecutionResponse(output, error);
    }
}
