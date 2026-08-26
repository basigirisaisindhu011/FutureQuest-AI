package com.careerquest.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "game_id", nullable = false)
    private String gameId;

    @Column(name = "age_group", nullable = false)
    private String ageGroup; // 8-10, 11-13, 14-16, 17+

    @Column(nullable = false)
    private String difficulty; // EASY, MODERATE, MEDIUM, HARD

    @Column(name = "question_type")
    private String questionType; // MULTIPLE_CHOICE, SPELLING, ORDERING, VOICE, STORY

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson; // Comma-separated or JSON array of options

    @Column(name = "correct_answer", columnDefinition = "TEXT")
    private String correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String hint;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "skill_tags")
    private String skillTags;

    @Column(nullable = false)
    private boolean active = true;

    public Question() {
    }

    public Question(String gameId, String ageGroup, String difficulty, String questionType, String questionText, String optionsJson, String correctAnswer, String hint, String explanation, String skillTags) {
        this.gameId = gameId;
        this.ageGroup = ageGroup;
        this.difficulty = difficulty;
        this.questionType = questionType;
        this.questionText = questionText;
        this.optionsJson = optionsJson;
        this.correctAnswer = correctAnswer;
        this.hint = hint;
        this.explanation = explanation;
        this.skillTags = skillTags;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getAgeGroup() {
        return ageGroup;
    }

    public void setAgeGroup(String ageGroup) {
        this.ageGroup = ageGroup;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getOptionsJson() {
        return optionsJson;
    }

    public void setOptionsJson(String optionsJson) {
        this.optionsJson = optionsJson;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getSkillTags() {
        return skillTags;
    }

    public void setSkillTags(String skillTags) {
        this.skillTags = skillTags;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
