package com.city.emergency.service.impl;

import com.city.emergency.dto.EmergencyUnitDTO;
import com.city.emergency.entity.EmergencyUnit;
import com.city.emergency.repository.EmergencyUnitRepository;
import com.city.emergency.service.EmergencyUnitService;
import com.city.emergency.service.mapper.EmergencyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmergencyUnitServiceImpl implements EmergencyUnitService {

    private final EmergencyUnitRepository repo;
    private final EmergencyMapper mapper;

    @Override
    public EmergencyUnitDTO create(EmergencyUnitDTO dto) {
        EmergencyUnit unit = EmergencyUnit.builder()
                .type(dto.getType())
                .status(dto.getStatus())
                .currentLocation(mapper.toLocation(dto.getCurrentLocation()))
                .build();

        return mapper.toUnitDTO(repo.save(unit));
    }

    @Override
    public List<EmergencyUnitDTO> getAll() {
        return repo.findAll().stream()
                .map(mapper::toUnitDTO)
                .toList();
    }

    @Override
    public EmergencyUnitDTO getById(Long id) {
        EmergencyUnit unit = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found with id: " + id));
        return mapper.toUnitDTO(unit);
    }

    @Override
    public EmergencyUnitDTO updateStatus(Long id, String status) {
        EmergencyUnit unit = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Unit not found with id: " + id));

        unit.setStatus(status);
        return mapper.toUnitDTO(repo.save(unit));
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Unit not found with id: " + id);
        }
        repo.deleteById(id);
    }
}
