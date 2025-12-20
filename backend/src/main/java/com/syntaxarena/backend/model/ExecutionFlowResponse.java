package com.syntaxarena.backend.model;

import java.util.List;
import java.util.Map;

public class ExecutionFlowResponse {
    private List<VisualizerStep> steps;
    private String error;

    public ExecutionFlowResponse() {
    }

    public ExecutionFlowResponse(List<VisualizerStep> steps) {
        this.steps = steps;
    }

    public ExecutionFlowResponse(String error) {
        this.error = error;
    }

    public List<VisualizerStep> getSteps() {
        return steps;
    }

    public void setSteps(List<VisualizerStep> steps) {
        this.steps = steps;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public static class VisualizerStep {
        private int step;
        private int line;
        private String description;
        private Map<String, String> variables;

        public VisualizerStep() {
        }

        public VisualizerStep(int step, int line, String description, Map<String, String> variables) {
            this.step = step;
            this.line = line;
            this.description = description;
            this.variables = variables;
        }

        public int getStep() {
            return step;
        }

        public void setStep(int step) {
            this.step = step;
        }

        public int getLine() {
            return line;
        }

        public void setLine(int line) {
            this.line = line;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Map<String, String> getVariables() {
            return variables;
        }

        public void setVariables(Map<String, String> variables) {
            this.variables = variables;
        }
    }
}
