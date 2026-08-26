package com.careerquest.backend.repository;

import com.careerquest.backend.model.GameRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GameRecordRepository extends JpaRepository<GameRecord, Long> {
    List<GameRecord> findByChildProfileId(Long childProfileId);
}
