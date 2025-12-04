package com.city.mobility.repository;

import com.city.mobility.entity.Emergency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyRepository extends JpaRepository<Emergency, Long> {
    List<Emergency> findByStatus(String status);
    List<Emergency> findByType(String type);
    List<Emergency> findBySeverity(String severity);
    List<Emergency> findByLocation(String location);
}
