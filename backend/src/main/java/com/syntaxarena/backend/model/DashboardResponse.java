package com.syntaxarena.backend.model;

import java.util.List;

public class DashboardResponse {
    private String username;
    private int xp;
    private int rank;
    private int streak;
    private List<ActivityData> activityData;
    private List<String> recentTutorials;

    public DashboardResponse(String username, int xp, int rank, int streak, List<ActivityData> activityData,
            List<String> recentTutorials) {
        this.username = username;
        this.xp = xp;
        this.rank = rank;
        this.streak = streak;
        this.activityData = activityData;
        this.recentTutorials = recentTutorials;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }

    public int getStreak() {
        return streak;
    }

    public void setStreak(int streak) {
        this.streak = streak;
    }

    public List<ActivityData> getActivityData() {
        return activityData;
    }

    public void setActivityData(List<ActivityData> activityData) {
        this.activityData = activityData;
    }

    public List<String> getRecentTutorials() {
        return recentTutorials;
    }

    public void setRecentTutorials(List<String> recentTutorials) {
        this.recentTutorials = recentTutorials;
    }

    public static class ActivityData {
        private String day;
        private int current;
        private int previous;

        public ActivityData(String day, int current, int previous) {
            this.day = day;
            this.current = current;
            this.previous = previous;
        }

        public String getDay() {
            return day;
        }

        public int getCurrent() {
            return current;
        }

        public int getPrevious() {
            return previous;
        }
    }
}
