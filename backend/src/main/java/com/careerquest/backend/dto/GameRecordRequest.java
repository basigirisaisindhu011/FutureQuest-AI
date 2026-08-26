package com.careerquest.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class GameRecordRequest {

    @NotBlank(message = "Game type is required")
    private String gameType;

    private String gameName;
    private String gameCategory;
    private int score;
    private int pointsEarned;
    private String difficulty;
    private Integer completionTime;
    private String skillsDetected;
    private String careerDomains;

    private double accuracy = 100.0;
    private int attempts = 1;
    private int hintsUsed = 0;
    private int replayCount = 1;
    private String completionStatus = "COMPLETED";
    private String choicesMade = "";

    // Communication tracking fields
    private int wordsAttempted = 0;
    private int wordsCorrect = 0;
    private int sentenceCompletionScore = 0;
    private int storyLength = 0;
    private int vocabularyScore = 0;
    private int listeningScore = 0;

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

    public Integer getCompletionTime() {
        return completionTime;
    }

    public void setCompletionTime(Integer completionTime) {
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
}
