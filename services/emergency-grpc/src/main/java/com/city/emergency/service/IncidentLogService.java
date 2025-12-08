package com.city.emergency.service;


import com.city.emergency.dto.IncidentLogDTO;
import java.util.List;

public interface IncidentLogService {
    IncidentLogDTO create(IncidentLogDTO dto);
    List<IncidentLogDTO> getAll();
    IncidentLogDTO getById(Long id);
    IncidentLogDTO update(IncidentLogDTO dto);
    void delete(Long id);
}
