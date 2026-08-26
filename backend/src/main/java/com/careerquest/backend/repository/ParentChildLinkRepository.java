package com.careerquest.backend.repository;

import com.careerquest.backend.model.ParentChildLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParentChildLinkRepository extends JpaRepository<ParentChildLink, Long> {
    List<ParentChildLink> findByParentId(Long parentId);
    Optional<ParentChildLink> findByParentIdAndChildProfileId(Long parentId, Long childProfileId);
    boolean existsByParentIdAndChildProfileId(Long parentId, Long childProfileId);
}
