package com.careerquest.backend.repository;

import com.careerquest.backend.model.ChildProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChildProfileRepository extends JpaRepository<ChildProfile, Long> {
    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @org.springframework.data.jpa.repository.Query("select p from ChildProfile p where p.userId = :userId")
    Optional<ChildProfile> findLockedByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
    Optional<ChildProfile> findByUserId(Long userId);
    List<ChildProfile> findByParentId(Long parentId);
    List<ChildProfile> findTop20ByNicknameContainingIgnoreCase(String nickname);
    Optional<ChildProfile> findByPlayerCode(String playerCode);
}
