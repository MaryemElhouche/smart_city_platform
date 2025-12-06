package com.city.airquality.service;

import com.city.airquality.dto.ZoneDto;
import com.city.airquality.entity.Zone;
import com.city.airquality.repository.ZoneRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ZoneService {

    private static final Logger log = LoggerFactory.getLogger(ZoneService.class);

    @Autowired
    private ZoneRepository zoneRepository;

    public List<ZoneDto> getAllZones() {
        return zoneRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<ZoneDto> getZoneById(String id) {
        return zoneRepository.findById(id).map(this::convertToDto);
    }

    public Optional<ZoneDto> getZoneByName(String name) {
        return zoneRepository.findByName(name).map(this::convertToDto);
    }

    public List<ZoneDto> getZonesByType(String type) {
        return zoneRepository.findByType(type).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ZoneDto createZone(ZoneDto zoneDto) {
        Zone zone = convertToEntity(zoneDto);
        zone.setUpdatedAt(LocalDateTime.now());
        Zone saved = zoneRepository.save(zone);
        log.info("Created new zone: {}", saved.getName());
        return convertToDto(saved);
    }

    public Optional<ZoneDto> updateZone(String id, ZoneDto zoneDto) {
        return zoneRepository.findById(id).map(existing -> {
            existing.setName(zoneDto.getName());
            existing.setPopulation(zoneDto.getPopulation());
            existing.setType(zoneDto.getType());
            existing.setAdminRegion(zoneDto.getAdminRegion());
            existing.setAreaKm2(zoneDto.getAreaKm2());
            existing.setUpdatedAt(LocalDateTime.now());
            Zone updated = zoneRepository.save(existing);
            log.info("Updated zone: {}", updated.getName());
            return convertToDto(updated);
        });
    }

    public boolean deleteZone(String id) {
        if (zoneRepository.existsById(id)) {
            zoneRepository.deleteById(id);
            log.info("Deleted zone with id: {}", id);
            return true;
        }
        return false;
    }

    private ZoneDto convertToDto(Zone zone) {
        ZoneDto dto = new ZoneDto();
        dto.setId(zone.getId());
        dto.setName(zone.getName());
        dto.setPopulation(zone.getPopulation());
        dto.setType(zone.getType());
        dto.setAdminRegion(zone.getAdminRegion());
        dto.setAreaKm2(zone.getAreaKm2());
        dto.setUpdatedAt(zone.getUpdatedAt());
        return dto;
    }

    private Zone convertToEntity(ZoneDto dto) {
        Zone zone = new Zone();
        zone.setId(dto.getId());
        zone.setName(dto.getName());
        zone.setPopulation(dto.getPopulation());
        zone.setType(dto.getType());
        zone.setAdminRegion(dto.getAdminRegion());
        zone.setAreaKm2(dto.getAreaKm2());
        zone.setUpdatedAt(dto.getUpdatedAt());
        return zone;
    }
}
