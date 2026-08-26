package com.careerquest.backend.repository;

import com.careerquest.backend.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByChildProfileIdOrderByGeneratedDateDesc(Long childProfileId);
}
