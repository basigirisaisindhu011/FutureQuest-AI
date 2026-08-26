package com.careerquest.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_level_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"child_profile_id", "game_id", "level"})
})
public class GameLevelProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "child_profile_id", nullable = false)
    private Long childProfileId;

    @Column(name = "game_id", nullable = false)
    private String gameId;

    @Column(nullable = false)
    private String level; // EASY, MODERATE, MEDIUM, HARD

    @Column(nullable = false)
    private boolean unlocked = false;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(name = "stars_earned")
    private int starsEarned = 0;

    @Column(name = "xp_earned")
    private int xpEarned = 0;

    @Column(name = "accuracy")
    private double accuracy = 0.0;

    @Column(name = "attempts")
    private int attempts = 0;

    @Column(name = "hints_used")
    private int hintsUsed = 0;

    @Column(name = "replay_count")
    private int replayCount = 0;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public GameLevelProgress() {
        this.updatedAt = LocalDateTime.now();
    }

    public GameLevelProgress(Long childProfileId, String gameId, String level, boolean unlocked) {
        this.childProfileId = childProfileId;
        this.gameId = gameId;
        this.level = level;
        this.unlocked = unlocked;
        this.completed = false;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChildProfileId() {
        return childProfileId;
    }

    public void setChildProfileId(Long childProfileId) {
        this.childProfileId = childProfileId;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public boolean isUnlocked() {
        return unlocked;
    }

    public void setUnlocked(boolean unlocked) {
        this.unlocked = unlocked;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public int getStarsEarned() {
        return starsEarned;
    }

    public void setStarsEarned(int starsEarned) {
        this.starsEarned = starsEarned;
    }

    public int getXpEarned() {
        return xpEarned;
    }

    public void setXpEarned(int xpEarned) {
        this.xpEarned = xpEarned;
    }

    public double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(double accuracy) {
        this.accuracy = accuracy;
    }

    public int getAttempts() {
        return attempts;
    }

    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }

    public int getHintsUsed() {
        return hintsUsed;
    }

    public void setHintsUsed(int hintsUsed) {
        this.hintsUsed = hintsUsed;
    }

    public int getReplayCount() {
        return replayCount;
    }

    public void setReplayCount(int replayCount) {
        this.replayCount = replayCount;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
