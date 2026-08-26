package com.careerquest.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_records")
public class QuizRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "child_profile_id", nullable = false)
    private Long childProfileId;

    @Column(name = "quiz_type", nullable = false)
    private String quizType; // personality, skill, domain

    @Column(nullable = false)
    private int score;

    @Column(columnDefinition = "TEXT")
    private String responses; // JSON string of user answers

    @Column(name = "date_attempt", nullable = false)
    private LocalDateTime dateAttempt;

    public QuizRecord() {
    }

    public QuizRecord(Long childProfileId, String quizType, int score, String responses) {
        this.childProfileId = childProfileId;
        this.quizType = quizType;
        this.score = score;
        this.responses = responses;
        this.dateAttempt = LocalDateTime.now();
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

    public String getQuizType() {
        return quizType;
    }

    public void setQuizType(String quizType) {
        this.quizType = quizType;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getResponses() {
        return responses;
    }

    public void setResponses(String responses) {
        this.responses = responses;
    }

    public LocalDateTime getDateAttempt() {
        return dateAttempt;
    }

    public void setDateAttempt(LocalDateTime dateAttempt) {
        this.dateAttempt = dateAttempt;
    }
}
