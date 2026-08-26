package com.careerquest.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuizRecordRequest {

    @NotBlank
    private String quizType; // personality, skill, domain

    @NotNull
    private Integer score;

    @NotBlank
    private String responses; // JSON string of user answers

    public QuizRecordRequest() {
    }

    public String getQuizType() {
        return quizType;
    }

    public void setQuizType(String quizType) {
        this.quizType = quizType;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getResponses() {
        return responses;
    }

    public void setResponses(String responses) {
        this.responses = responses;
    }
}
