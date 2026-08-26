package com.careerquest.backend.repository;

import com.careerquest.backend.model.QuizRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizRecordRepository extends JpaRepository<QuizRecord, Long> {
    List<QuizRecord> findByChildProfileId(Long childProfileId);
}
