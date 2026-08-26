package com.careerquest.backend.repository;

import com.careerquest.backend.model.ChildProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ChildProfileRepository extends JpaRepository<ChildProfile, Long> {
    Optional<ChildProfile> findByUserId(Long userId);
    List<ChildProfile> findByParentId(Long parentId);
    List<ChildProfile> findTop20ByNicknameContainingIgnoreCase(String nickname);
    Optional<ChildProfile> findByPlayerCode(String playerCode);
}
