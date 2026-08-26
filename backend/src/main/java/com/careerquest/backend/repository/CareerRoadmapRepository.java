package com.careerquest.backend.repository;

import com.careerquest.backend.model.CareerRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CareerRoadmapRepository extends JpaRepository<CareerRoadmap, Long> {
    List<CareerRoadmap> findByCareerId(Long careerId);
}
