---
description: How to implement the Battle feature with test validation
---

# Battle Feature Implementation Workflow

## Prerequisites
- Backend running on port 8080
- Frontend running on port 3000
- NVIDIA API key configured

## Step 1: Create Backend Models

Create these files in `backend/src/main/java/com/syntaxarena/backend/model/`:

```java
// TestValidationRequest.java
public class TestValidationRequest {
    private String code;
    private String language;
    private String problemDescription;
    // getters/setters
}

// TestValidationResponse.java  
public class TestValidationResponse {
    private boolean allPassed;
    private int passedCount;
    private int totalCount;
    private List<TestResult> results;
    private String feedback;
}
```

## Step 2: Create Test Validation Service

Create `backend/src/main/java/com/syntaxarena/backend/service/TestValidationService.java`:

- Use NVIDIA API to analyze if code is correct
- Execute user code with test inputs
- Compare outputs and return pass/fail

## Step 3: Create Controller

Create `backend/src/main/java/com/syntaxarena/backend/controller/BattleController.java`:

```java
@PostMapping("/validate-solution")
public TestValidationResponse validateSolution(@RequestBody TestValidationRequest request)
```

## Step 4: Update Frontend apiService.ts

Add method:
```typescript
validateSolution: async (code, language, problemDescription) => {
    // POST to /api/validate-solution
}
```

## Step 5: Update BattleArena.tsx

1. Add "Submit Solution" button next to "Run"
2. Call validateSolution on click
3. Show test results in Tests tab
4. Update progress bar (passedCount / totalCount * 100)
5. Show win modal when allPassed = true

## Step 6: Win/Lose Logic

```
IF allPassed = true:
  → Show "YOU WIN!" modal
  → Add XP reward
  → Stop timer

IF timer = 0 AND !allPassed:
  → Show "Time's Up!" modal

IF opponentProgress = 100 (simulated):
  → Show "Opponent Wins" modal
```

## Step 7: Restart Backend

```bash
// turbo
cd backend && mvn spring-boot:run
```

## Step 8: Test

1. Go to Battle Arena
2. Write solution code
3. Click Submit
4. Verify test results display
5. Verify win modal on success
