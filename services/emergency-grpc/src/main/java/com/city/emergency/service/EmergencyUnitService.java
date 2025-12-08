package com.city.emergency.service;

import com.city.emergency.dto.EmergencyUnitDTO;

import java.util.List;

public interface EmergencyUnitService {

    EmergencyUnitDTO create(EmergencyUnitDTO dto);

    List<EmergencyUnitDTO> getAll();

    EmergencyUnitDTO getById(Long id);

    EmergencyUnitDTO updateStatus(Long id, String status);

    void delete(Long id);
}
