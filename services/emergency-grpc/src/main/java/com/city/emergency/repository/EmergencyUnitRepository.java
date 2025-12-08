package com.city.emergency.repository;

import com.city.emergency.entity.EmergencyUnit;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmergencyUnitRepository extends JpaRepository<EmergencyUnit, Long> {
        Optional<EmergencyUnit> findByName(String name);   // IMPORTANT


}
