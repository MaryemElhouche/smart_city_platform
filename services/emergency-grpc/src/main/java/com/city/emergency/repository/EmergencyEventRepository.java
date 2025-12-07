package com.city.emergency.repository;

import com.city.emergency.entity.EmergencyEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmergencyEventRepository extends JpaRepository<EmergencyEvent, Long> {

}
