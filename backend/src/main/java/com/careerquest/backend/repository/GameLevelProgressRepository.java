package com.careerquest.backend.repository;

import com.careerquest.backend.model.GameLevelProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GameLevelProgressRepository extends JpaRepository<GameLevelProgress, Long> {
    List<GameLevelProgress> findByChildProfileIdAndGameId(Long childProfileId, String gameId);
    Optional<GameLevelProgress> findByChildProfileIdAndGameIdAndLevel(Long childProfileId, String gameId, String level);
    List<GameLevelProgress> findByChildProfileId(Long childProfileId);
}
