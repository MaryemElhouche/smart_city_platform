package com.city.mobility.service;

import com.city.mobility.dto.VehicleDTO;
import com.city.mobility.entity.Vehicle;
import com.city.mobility.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleDTO saveVehicle(VehicleDTO dto) {
        Vehicle v = new Vehicle();
        v.setId(dto.getId());
        v.setRegistrationNumber(dto.getRegistrationNumber());
        v.setCapacity(dto.getCapacity());
        v.setStatus(dto.getStatus());
        v = vehicleRepository.save(v);
        dto.setId(v.getId());
        return dto;
    }

    public List<VehicleDTO> getAllVehicles() {
        return vehicleRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public VehicleDTO getVehicleById(Long id) {
        return vehicleRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    private VehicleDTO toDTO(Vehicle v) {
        VehicleDTO dto = new VehicleDTO();
        dto.setId(v.getId());
        dto.setRegistrationNumber(v.getRegistrationNumber());
        dto.setCapacity(v.getCapacity());
        dto.setStatus(v.getStatus());
        return dto;
    }
}
