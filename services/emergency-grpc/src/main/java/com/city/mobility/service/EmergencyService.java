package com.city.mobility.service;

import com.city.mobility.dto.EmergencyDTO;
import com.city.mobility.entity.Emergency;
import com.city.mobility.repository.EmergencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;

    public List<EmergencyDTO> getAllEmergencies() {
        return emergencyRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public EmergencyDTO getEmergencyById(Long id) {
        return emergencyRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    public List<EmergencyDTO> getEmergenciesByStatus(String status) {
        return emergencyRepository.findByStatus(status).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<EmergencyDTO> getEmergenciesByType(String type) {
        return emergencyRepository.findByType(type).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<EmergencyDTO> getEmergenciesBySeverity(String severity) {
        return emergencyRepository.findBySeverity(severity).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<EmergencyDTO> getEmergenciesByLocation(String location) {
        return emergencyRepository.findByLocation(location).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public EmergencyDTO createEmergency(EmergencyDTO emergencyDTO) {
        Emergency emergency = convertToEntity(emergencyDTO);
        Emergency saved = emergencyRepository.save(emergency);
        return convertToDTO(saved);
    }

    public EmergencyDTO updateEmergency(Long id, EmergencyDTO emergencyDTO) {
        return emergencyRepository.findById(id).map(existing -> {
            existing.setType(emergencyDTO.getType());
            existing.setLocation(emergencyDTO.getLocation());
            existing.setDescription(emergencyDTO.getDescription());
            existing.setSeverity(emergencyDTO.getSeverity());
            existing.setStatus(emergencyDTO.getStatus());
            existing.setReportedAt(emergencyDTO.getReportedAt());
            existing.setResolvedAt(emergencyDTO.getResolvedAt());
            existing.setResponderCount(emergencyDTO.getResponderCount());
            existing.setRemarks(emergencyDTO.getRemarks());
            return convertToDTO(emergencyRepository.save(existing));
        }).orElse(null);
    }

    public void deleteEmergency(Long id) {
        emergencyRepository.deleteById(id);
    }

    private EmergencyDTO convertToDTO(Emergency emergency) {
        return new EmergencyDTO(emergency.getId(), emergency.getType(), emergency.getLocation(), emergency.getDescription(), emergency.getSeverity(), emergency.getStatus(), emergency.getReportedAt(), emergency.getResolvedAt(), emergency.getResponderCount(), emergency.getRemarks());
    }

    private Emergency convertToEntity(EmergencyDTO dto) {
        return new Emergency(dto.getId(), dto.getType(), dto.getLocation(), dto.getDescription(), dto.getSeverity(), dto.getStatus(), dto.getReportedAt(), dto.getResolvedAt(), dto.getResponderCount(), dto.getRemarks());
    }
}
