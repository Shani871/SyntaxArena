package com.syntaxarena.backend.model;

import java.util.List;

public class TestValidationResponse {
    private boolean allPassed;
    private int passedCount;
    private int totalCount;
    private List<TestResult> results;
    private String feedback;

    public TestValidationResponse() {
    }

    public TestValidationResponse(boolean allPassed, int passedCount, int totalCount, List<TestResult> results,
            String feedback) {
        this.allPassed = allPassed;
        this.passedCount = passedCount;
        this.totalCount = totalCount;
        this.results = results;
        this.feedback = feedback;
    }

    public boolean isAllPassed() {
        return allPassed;
    }

    public void setAllPassed(boolean allPassed) {
        this.allPassed = allPassed;
    }

    public int getPassedCount() {
        return passedCount;
    }

    public void setPassedCount(int passedCount) {
        this.passedCount = passedCount;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public List<TestResult> getResults() {
        return results;
    }

    public void setResults(List<TestResult> results) {
        this.results = results;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public static class TestResult {
        private int testNumber;
        private String input;
        private String expected;
        private String actual;
        private boolean passed;

        public TestResult() {
        }

        public TestResult(int testNumber, String input, String expected, String actual, boolean passed) {
            this.testNumber = testNumber;
            this.input = input;
            this.expected = expected;
            this.actual = actual;
            this.passed = passed;
        }

        public int getTestNumber() {
            return testNumber;
        }

        public void setTestNumber(int testNumber) {
            this.testNumber = testNumber;
        }

        public String getInput() {
            return input;
        }

        public void setInput(String input) {
            this.input = input;
        }

        public String getExpected() {
            return expected;
        }

        public void setExpected(String expected) {
            this.expected = expected;
        }

        public String getActual() {
            return actual;
        }

        public void setActual(String actual) {
            this.actual = actual;
        }

        public boolean isPassed() {
            return passed;
        }

        public void setPassed(boolean passed) {
            this.passed = passed;
        }
    }
}
