package com.city.emergency.service.impl;

import com.city.emergency.dto.EmergencyUnitDTO;
import com.city.emergency.dto.LocationDTO;
import com.city.emergency.entity.EmergencyUnit;
import com.city.emergency.entity.Location;
import com.city.emergency.entity.Resource;
import com.city.emergency.entity.IncidentLog;
import com.city.emergency.repository.EmergencyUnitRepository;
import com.city.emergency.repository.ResourceRepository;
import com.city.emergency.repository.IncidentLogRepository;
import com.city.emergency.service.EmergencyUnitService;
import com.city.emergency.service.mapper.EmergencyMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyUnitServiceImpl implements EmergencyUnitService {

    private final EmergencyUnitRepository unitRepo;
    private final ResourceRepository resourceRepo;
    private final IncidentLogRepository logRepo;
    private final EmergencyMapper mapper;

    @Override
    public EmergencyUnitDTO create(EmergencyUnitDTO dto) {

        EmergencyUnit unit = mapper.toEmergencyUnitEntity(dto);

        // ---- Handle Location by cascade ----
        if (dto.getLocation() != null) {
            Location loc = mapper.toLocationEntity(dto.getLocation());
            unit.setCurrentLocation(loc);  // saved automatically via CASCADE
        }

        // ---- Resources ----
        if (dto.getResourceIds() != null) {
            unit.setResources(resourceRepo.findAllById(dto.getResourceIds()));
        }

        // ---- Logs ----
        if (dto.getIncidentLogIds() != null) {
            unit.setIncidentLogs(logRepo.findAllById(dto.getIncidentLogIds()));
        }

        return mapper.toEmergencyUnitDTO(unitRepo.save(unit));
    }

    @Override
    public EmergencyUnitDTO update(Long id, EmergencyUnitDTO dto) {
        EmergencyUnit unit = unitRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency Unit not found"));

        unit.setName(dto.getName());
        unit.setType(dto.getType());
        unit.setStatus(dto.getStatus());

        // ---- Update Location (again handled via cascade) ----
        if (dto.getLocation() != null) {
            Location updatedLocation = mapper.toLocationEntity(dto.getLocation());
            updatedLocation.setId(unit.getCurrentLocation() != null ? unit.getCurrentLocation().getId() : null);
            unit.setCurrentLocation(updatedLocation);
        }

        if (dto.getResourceIds() != null) {
            unit.setResources(resourceRepo.findAllById(dto.getResourceIds()));
        }

        if (dto.getIncidentLogIds() != null) {
            unit.setIncidentLogs(logRepo.findAllById(dto.getIncidentLogIds()));
        }

        return mapper.toEmergencyUnitDTO(unitRepo.save(unit));
    }

    @Override
    public EmergencyUnitDTO updateStatus(Long id, String status) {
        EmergencyUnit unit = unitRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found"));
        unit.setStatus(status);
        return mapper.toEmergencyUnitDTO(unitRepo.save(unit));
    }

    @Override
    public EmergencyUnitDTO getById(Long id) {
        EmergencyUnit unit = unitRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found"));
        return mapper.toEmergencyUnitDTO(unit);
    }

    @Override
    public List<EmergencyUnitDTO> getAll() {
        return unitRepo.findAll().stream()
                .map(mapper::toEmergencyUnitDTO)
                .toList();
    }

    @Override
    public void delete(Long id) {
        unitRepo.deleteById(id);
    }
}
