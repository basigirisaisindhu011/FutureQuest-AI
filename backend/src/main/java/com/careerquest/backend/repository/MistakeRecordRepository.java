package com.careerquest.backend.repository;

import com.careerquest.backend.model.MistakeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MistakeRecordRepository extends JpaRepository<MistakeRecord, Long> {
    List<MistakeRecord> findByUserId(Long userId);
    List<MistakeRecord> findByUserIdAndStatus(Long userId, String status);
    Optional<MistakeRecord> findByUserIdAndQuestionText(Long userId, String questionText);
}
