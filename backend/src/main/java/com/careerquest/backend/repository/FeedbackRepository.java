package com.careerquest.backend.repository;

import com.careerquest.backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByActivityTypeAndActivityId(String type, Long id);
}
