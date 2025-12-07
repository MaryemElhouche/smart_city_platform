package com.city.emergency.service.impl;

import com.city.emergency.dto.EmergencyEventDTO;
import com.city.emergency.entity.EmergencyEvent;
import com.city.emergency.entity.EmergencyUnit;
import com.city.emergency.repository.EmergencyEventRepository;
import com.city.emergency.repository.EmergencyUnitRepository;
import com.city.emergency.service.EmergencyEventService;
import com.city.emergency.service.mapper.EmergencyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyEventServiceImpl implements EmergencyEventService {

    private final EmergencyEventRepository eventRepo;
    private final EmergencyUnitRepository unitRepo;
    private final EmergencyMapper mapper;

    @Override
    public EmergencyEventDTO create(EmergencyEventDTO dto) {
        EmergencyEvent event = EmergencyEvent.builder()
                .description(dto.getDescription())
                .severity(dto.getSeverity())
                .status("REPORTED")
                .location(mapper.toLocation(dto.getLocation()))
                .build();

        eventRepo.save(event);
        dto.setId(event.getId());
        return dto;
    }

    @Override
    public List<EmergencyEventDTO> getAll() {
        return eventRepo.findAll().stream().map(e -> {
            EmergencyEventDTO dto = new EmergencyEventDTO();
            dto.setId(e.getId());
            dto.setDescription(e.getDescription());
            dto.setSeverity(e.getSeverity());
            dto.setStatus(e.getStatus());
            dto.setLocation(mapper.toLocationDTO(e.getLocation()));
            dto.setAssignedUnitId(
                    e.getAssignedUnit() != null ? e.getAssignedUnit().getId() : null
            );
            return dto;
        }).toList();
    }

    @Override
    public EmergencyEventDTO getById(Long id) {
        EmergencyEvent e = eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        EmergencyEventDTO dto = new EmergencyEventDTO();
        dto.setId(e.getId());
        dto.setDescription(e.getDescription());
        dto.setSeverity(e.getSeverity());
        dto.setStatus(e.getStatus());
        dto.setLocation(mapper.toLocationDTO(e.getLocation()));
        dto.setAssignedUnitId(e.getAssignedUnit() != null ? e.getAssignedUnit().getId() : null);
        return dto;
    }

    @Override
    public EmergencyEventDTO assignUnit(Long eventId, Long unitId) {
        EmergencyEvent event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        EmergencyUnit unit = unitRepo.findById(unitId)
                .orElseThrow(() -> new RuntimeException("Unit not found with id: " + unitId));

        event.setAssignedUnit(unit);
        event.setStatus("IN_PROGRESS");

        eventRepo.save(event);
        return getById(eventId);
    }

    @Override
    public void delete(Long id) {
        if (!eventRepo.existsById(id)) {
            throw new RuntimeException("Event not found with id: " + id);
        }
        eventRepo.deleteById(id);
    }
}
