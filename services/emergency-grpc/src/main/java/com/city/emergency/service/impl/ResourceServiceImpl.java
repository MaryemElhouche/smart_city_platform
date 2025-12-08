package com.city.emergency.service.impl;

import com.city.emergency.dto.ResourceDTO;
import com.city.emergency.entity.EmergencyEvent;
import com.city.emergency.entity.EmergencyUnit;
import com.city.emergency.entity.Resource;
import com.city.emergency.repository.EmergencyEventRepository;
import com.city.emergency.repository.EmergencyUnitRepository;
import com.city.emergency.repository.ResourceRepository;
import com.city.emergency.service.ResourceService;
import com.city.emergency.service.mapper.EmergencyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository repo;
    private final EmergencyUnitRepository unitRepo;
    private final EmergencyEventRepository eventRepo;
    private final EmergencyMapper mapper;

    @Override
    public ResourceDTO create(ResourceDTO dto) {
        EmergencyUnit unit = dto.getAssignedUnitId() != null
                ? unitRepo.findById(dto.getAssignedUnitId()).orElse(null)
                : null;

        EmergencyEvent event = dto.getAssignedEventId() != null
                ? eventRepo.findById(dto.getAssignedEventId()).orElse(null)
                : null;

        Resource res = mapper.toResourceEntity(dto, unit, event);
        Resource saved = repo.save(res);
        return mapper.toResourceDTO(saved);
    }

    @Override
    public List<ResourceDTO> getAll() {
        return repo.findAll().stream()
                .map(mapper::toResourceDTO)
                .toList();
    }

    @Override
    public ResourceDTO updateStatus(Long id, String status) {
        Resource res = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        res.setStatus(status);
        return mapper.toResourceDTO(repo.save(res));
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
