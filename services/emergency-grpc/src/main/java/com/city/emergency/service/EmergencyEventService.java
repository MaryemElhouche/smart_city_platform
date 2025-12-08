package com.city.emergency.service;

import com.city.emergency.dto.EmergencyEventDTO;
import java.util.List;

public interface EmergencyEventService {

    EmergencyEventDTO create(EmergencyEventDTO dto);

    List<EmergencyEventDTO> getAll();

    EmergencyEventDTO getById(Long id);

    EmergencyEventDTO assignUnit(Long eventId, Long unitId);

    void delete(Long id);
}
