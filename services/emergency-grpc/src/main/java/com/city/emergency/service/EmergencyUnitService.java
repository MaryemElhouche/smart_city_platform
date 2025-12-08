package com.city.emergency.service;

import com.city.emergency.dto.EmergencyUnitDTO;
import java.util.List;

public interface EmergencyUnitService {

    EmergencyUnitDTO create(EmergencyUnitDTO dto);

    EmergencyUnitDTO update(Long id, EmergencyUnitDTO dto);

    EmergencyUnitDTO updateStatus(Long id, String status);

    EmergencyUnitDTO getById(Long id);

    List<EmergencyUnitDTO> getAll();

    void delete(Long id);
}
