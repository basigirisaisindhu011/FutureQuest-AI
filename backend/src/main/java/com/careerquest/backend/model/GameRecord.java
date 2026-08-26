package com.careerquest.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "game_records")
public class GameRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "child_profile_id", nullable = false)
    private Long childProfileId;

    @Column(name = "game_type", nullable = false)
    private String gameType; // e.g. spell_quest, listen_spell, robot_builder, etc.

    @Column(name = "game_name")
    private String gameName; // e.g. "Spell Quest"

    @Column(name = "game_category")
    private String gameCategory; // e.g. "Communication & Language", "Technology & Logic", etc.

    @Column(nullable = false)
    private int score = 0;

    @Column(name = "points_earned", nullable = false)
    private int pointsEarned = 0;

    @Column(name = "difficulty")
    private String difficulty = "Medium"; // Beginner, Explorer, Master / Easy, Medium, Hard

    @Column(name = "completion_time")
    private int completionTime = 0; // in seconds

    @Column(name = "skills_detected", columnDefinition = "TEXT")
    private String skillsDetected = "";

    @Column(name = "career_domains", columnDefinition = "TEXT")
    private String careerDomains = "";

    @Column(name = "accuracy")
    private double accuracy = 100.0;

    @Column(name = "attempts")
    private int attempts = 1;

    @Column(name = "hints_used")
    private int hintsUsed = 0;

    @Column(name = "replay_count")
    private int replayCount = 1;

    @Column(name = "completion_status")
    private String completionStatus = "COMPLETED";

    @Column(name = "choices_made", columnDefinition = "TEXT")
    private String choicesMade = "";

    // Specific Communication & Language tracking fields
    @Column(name = "words_attempted")
    private int wordsAttempted = 0;

    @Column(name = "words_correct")
    private int wordsCorrect = 0;

    @Column(name = "sentence_completion_score")
    private int sentenceCompletionScore = 0;

    @Column(name = "story_length")
    private int storyLength = 0;

    @Column(name = "vocabulary_score")
    private int vocabularyScore = 0;

    @Column(name = "listening_score")
    private int listeningScore = 0;

    @Column(name = "date_play", nullable = false)
    private LocalDateTime datePlay;

    public GameRecord() {
        this.datePlay = LocalDateTime.now();
    }

    public GameRecord(Long childProfileId, String gameType, String gameName, int score, int pointsEarned, String difficulty, int completionTime, String skillsDetected, String careerDomains) {
        this.childProfileId = childProfileId;
        this.gameType = gameType;
        this.gameName = gameName;
        this.score = score;
        this.pointsEarned = pointsEarned;
        this.difficulty = difficulty;
        this.completionTime = completionTime;
        this.skillsDetected = skillsDetected;
        this.careerDomains = careerDomains;
        this.datePlay = LocalDateTime.now();
    }

    // Getters and Setters
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

    public String getGameType() {
        return gameType;
    }

    public void setGameType(String gameType) {
        this.gameType = gameType;
    }

    public String getGameName() {
        return gameName;
    }

    public void setGameName(String gameName) {
        this.gameName = gameName;
    }

    public String getGameCategory() {
        return gameCategory;
    }

    public void setGameCategory(String gameCategory) {
        this.gameCategory = gameCategory;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getPointsEarned() {
        return pointsEarned;
    }

    public void setPointsEarned(int pointsEarned) {
        this.pointsEarned = pointsEarned;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public int getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(int completionTime) {
        this.completionTime = completionTime;
    }

    public String getSkillsDetected() {
        return skillsDetected;
    }

    public void setSkillsDetected(String skillsDetected) {
        this.skillsDetected = skillsDetected;
    }

    public String getCareerDomains() {
        return careerDomains;
    }

    public void setCareerDomains(String careerDomains) {
        this.careerDomains = careerDomains;
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

    public String getCompletionStatus() {
        return completionStatus;
    }

    public void setCompletionStatus(String completionStatus) {
        this.completionStatus = completionStatus;
    }

    public String getChoicesMade() {
        return choicesMade;
    }

    public void setChoicesMade(String choicesMade) {
        this.choicesMade = choicesMade;
    }

    public int getWordsAttempted() {
        return wordsAttempted;
    }

    public void setWordsAttempted(int wordsAttempted) {
        this.wordsAttempted = wordsAttempted;
    }

    public int getWordsCorrect() {
        return wordsCorrect;
    }

    public void setWordsCorrect(int wordsCorrect) {
        this.wordsCorrect = wordsCorrect;
    }

    public int getSentenceCompletionScore() {
        return sentenceCompletionScore;
    }

    public void setSentenceCompletionScore(int sentenceCompletionScore) {
        this.sentenceCompletionScore = sentenceCompletionScore;
    }

    public int getStoryLength() {
        return storyLength;
    }

    public void setStoryLength(int storyLength) {
        this.storyLength = storyLength;
    }

    public int getVocabularyScore() {
        return vocabularyScore;
    }

    public void setVocabularyScore(int vocabularyScore) {
        this.vocabularyScore = vocabularyScore;
    }

    public int getListeningScore() {
        return listeningScore;
    }

    public void setListeningScore(int listeningScore) {
        this.listeningScore = listeningScore;
    }

    public LocalDateTime getDatePlay() {
        return datePlay;
    }

    public void setDatePlay(LocalDateTime datePlay) {
        this.datePlay = datePlay;
    }
}
