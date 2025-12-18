package com.syntaxarena.backend.model;

public class ExecutionFlowResponse {
    private String visualization;

    public ExecutionFlowResponse() {
    }

    public ExecutionFlowResponse(String visualization) {
        this.visualization = visualization;
    }

    public String getVisualization() {
        return visualization;
    }

    public void setVisualization(String visualization) {
        this.visualization = visualization;
    }
}
