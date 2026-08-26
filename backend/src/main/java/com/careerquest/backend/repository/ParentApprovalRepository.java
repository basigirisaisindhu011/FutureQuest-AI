package com.careerquest.backend.repository;

import com.careerquest.backend.model.ParentApproval;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ParentApprovalRepository extends JpaRepository<ParentApproval, Long> {
    List<ParentApproval> findByParentIdAndApprovalStatus(Long parentId, String status);
    Optional<ParentApproval> findByParentIdAndChildId(Long parentId, Long childId);
    Optional<ParentApproval> findByChildId(Long childId);
}
