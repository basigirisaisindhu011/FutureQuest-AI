package com.careerquest.backend.repository;

import com.careerquest.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByGameIdAndDifficultyAndAgeGroupAndActiveTrue(String gameId, String difficulty, String ageGroup);
    List<Question> findByGameIdAndDifficultyAndActiveTrue(String gameId, String difficulty);
    List<Question> findByGameIdAndActiveTrue(String gameId);
}
