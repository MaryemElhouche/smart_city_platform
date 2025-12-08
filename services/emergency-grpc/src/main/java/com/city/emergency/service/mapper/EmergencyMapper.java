package com.city.emergency.service.mapper;

import com.city.emergency.dto.*;
import com.city.emergency.entity.*;
import org.springframework.stereotype.Component;

@Component
public class EmergencyMapper {

    public Location toLocation(LocationDTO dto) {
        if (dto == null) return null;
        return Location.builder()
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .build();
    }

    public EmergencyUnitDTO toUnitDTO(EmergencyUnit unit) {
        EmergencyUnitDTO dto = new EmergencyUnitDTO();
        dto.setId(unit.getId());
        dto.setType(unit.getType());
        dto.setStatus(unit.getStatus());
        dto.setCurrentLocation(toLocationDTO(unit.getCurrentLocation()));
        return dto;
    }

    public LocationDTO toLocationDTO(Location loc) {
        if (loc == null) return null;
        LocationDTO dto = new LocationDTO();
        dto.setLatitude(loc.getLatitude());
        dto.setLongitude(loc.getLongitude());
        return dto;
    }
}
