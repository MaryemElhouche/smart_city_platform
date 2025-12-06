package com.city.airquality.service;

import com.city.airquality.dto.AlertDto;
import com.city.airquality.entity.Alert;
import com.city.airquality.repository.AlertRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);

    @Autowired
    private AlertRepository alertRepository;

    public List<AlertDto> getAllAlerts() {
        return alertRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<AlertDto> getAlertById(String id) {
        return alertRepository.findById(id).map(this::convertToDto);
    }

    public List<AlertDto> getAlertsByZone(String zone) {
        return alertRepository.findByZone(zone).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<AlertDto> getAlertsBySeverity(String severity) {
        return alertRepository.findBySeverity(severity).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<AlertDto> getUnresolvedAlerts() {
        return alertRepository.findByResolved(false).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AlertDto createAlert(AlertDto alertDto) {
        Alert alert = convertToEntity(alertDto);
        alert.setCreatedAt(LocalDateTime.now());
        alert.setResolved(false);
        Alert saved = alertRepository.save(alert);
        log.info("Created new alert for zone: {} with severity: {}", saved.getZone(), saved.getSeverity());
        return convertToDto(saved);
    }

    public Optional<AlertDto> resolveAlert(String id) {
        return alertRepository.findById(id).map(alert -> {
            alert.setResolved(true);
            alert.setResolvedAt(LocalDateTime.now());
            Alert updated = alertRepository.save(alert);
            log.info("Resolved alert: {}", updated.getId());
            return convertToDto(updated);
        });
    }

    public boolean deleteAlert(String id) {
        if (alertRepository.existsById(id)) {
            alertRepository.deleteById(id);
            log.info("Deleted alert with id: {}", id);
            return true;
        }
        return false;
    }

    private AlertDto convertToDto(Alert alert) {
        AlertDto dto = new AlertDto();
        dto.setId(alert.getId());
        dto.setZone(alert.getZone());
        dto.setType(alert.getType());
        dto.setMetric(alert.getMetric());
        dto.setValue(alert.getValue());
        dto.setSeverity(alert.getSeverity());
        dto.setCreatedAt(alert.getCreatedAt());
        dto.setResolved(alert.isResolved());
        dto.setResolvedAt(alert.getResolvedAt());
        dto.setSource(alert.getSource());
        dto.setDescription(alert.getDescription());
        return dto;
    }

    private Alert convertToEntity(AlertDto dto) {
        Alert alert = new Alert();
        alert.setId(dto.getId());
        alert.setZone(dto.getZone());
        alert.setType(dto.getType());
        alert.setMetric(dto.getMetric());
        alert.setValue(dto.getValue());
        alert.setSeverity(dto.getSeverity());
        alert.setCreatedAt(dto.getCreatedAt());
        alert.setResolved(dto.isResolved());
        alert.setResolvedAt(dto.getResolvedAt());
        alert.setSource(dto.getSource());
        alert.setDescription(dto.getDescription());
        return alert;
    }
}
