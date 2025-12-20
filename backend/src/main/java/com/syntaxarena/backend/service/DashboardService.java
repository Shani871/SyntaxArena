package com.syntaxarena.backend.service;

import com.syntaxarena.backend.model.DashboardResponse;
import com.syntaxarena.backend.model.DashboardResponse.ActivityData;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class DashboardService {

    // Mock Database State
    private int currentXp = 15420;
    private int rank = 42;
    private int streak = 7;
    private final Random random = new Random();

    public DashboardResponse getDashboardStats() {
        // Simulate real-time updates (e.g. XP growing slightly, or rank fluctuating)
        if (random.nextDouble() > 0.7) {
            currentXp += random.nextInt(50);
        }

        // Mock activity data
        List<ActivityData> activity = new ArrayList<>();
        String[] days = { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
        for (String day : days) {
            activity.add(new ActivityData(day, random.nextInt(30) + 10, random.nextInt(25) + 5));
        }

        return new DashboardResponse(
                "Shani871", // Assume logged in user
                currentXp,
                rank,
                streak,
                activity,
                List.of("Backend Fundamentals", "API Design", "Spring Boot"));
    }
}
