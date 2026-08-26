package com.careerquest.backend.repository;

import com.careerquest.backend.model.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {
    List<LearningResource> findByCareerId(Long careerId);
}
