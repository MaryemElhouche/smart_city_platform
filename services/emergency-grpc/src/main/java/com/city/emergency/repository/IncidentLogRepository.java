package com.city.emergency.repository;

import com.city.emergency.entity.IncidentLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentLogRepository extends JpaRepository<IncidentLog, Long> {
}
