package com.city.emergency.service.impl;

import com.city.emergency.dto.IncidentLogDTO;
import com.city.emergency.entity.IncidentLog;
import com.city.emergency.repository.IncidentLogRepository;
import com.city.emergency.repository.EmergencyEventRepository;
import com.city.emergency.repository.EmergencyUnitRepository;
import com.city.emergency.repository.ResourceRepository;
import com.city.emergency.service.IncidentLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentLogServiceImpl implements IncidentLogService {

    private final IncidentLogRepository repo;
    private final EmergencyEventRepository eventRepo;
    private final EmergencyUnitRepository unitRepo;
    private final ResourceRepository resourceRepo;

    @Override
    public IncidentLogDTO create(IncidentLogDTO dto) {
        IncidentLog log = IncidentLog.builder()
                .message(dto.getMessage())
                .timestamp(dto.getTimestamp() != null ? dto.getTimestamp() : LocalDateTime.now())
                .event(dto.getEventId() != null ? eventRepo.findById(dto.getEventId()).orElse(null) : null)
                .unit(dto.getUnitId() != null ? unitRepo.findById(dto.getUnitId()).orElse(null) : null)
                .resource(dto.getResourceId() != null ? resourceRepo.findById(dto.getResourceId()).orElse(null) : null)
                .build();
        IncidentLog saved = repo.save(log);
        dto.setId(saved.getId());
        return dto;
    }

    @Override
    public List<IncidentLogDTO> getAll() {
        return repo.findAll().stream()
                .map(l -> IncidentLogDTO.builder()
                        .id(l.getId())
                        .message(l.getMessage())
                        .timestamp(l.getTimestamp())
                        .eventId(l.getEvent() != null ? l.getEvent().getId() : null)
                        .unitId(l.getUnit() != null ? l.getUnit().getId() : null)
                        .resourceId(l.getResource() != null ? l.getResource().getId() : null)
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public IncidentLogDTO getById(Long id) {
        IncidentLog log = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("IncidentLog not found"));
        return IncidentLogDTO.builder()
                .id(log.getId())
                .message(log.getMessage())
                .timestamp(log.getTimestamp())
                .eventId(log.getEvent() != null ? log.getEvent().getId() : null)
                .unitId(log.getUnit() != null ? log.getUnit().getId() : null)
                .resourceId(log.getResource() != null ? log.getResource().getId() : null)
                .build();
    }

    @Override
    public IncidentLogDTO update(IncidentLogDTO dto) {
        IncidentLog log = repo.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("IncidentLog not found"));
        log.setMessage(dto.getMessage());
        log.setTimestamp(dto.getTimestamp() != null ? dto.getTimestamp() : log.getTimestamp());
        // Optionnel : mettre à jour les liens Event, Unit, Resource si nécessaire
        repo.save(log);
        return dto;
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
