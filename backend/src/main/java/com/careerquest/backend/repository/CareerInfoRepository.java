package com.careerquest.backend.repository;

import com.careerquest.backend.model.CareerInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CareerInfoRepository extends JpaRepository<CareerInfo, Long> {
    Optional<CareerInfo> findByName(String name);
    List<CareerInfo> findByDomain(String domain);
}
