package com.city.airquality.service;

import com.city.airquality.dto.SensorDto;
import com.city.airquality.entity.Sensor;
import com.city.airquality.repository.SensorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SensorService {

    private static final Logger log = LoggerFactory.getLogger(SensorService.class);

    @Autowired
    private SensorRepository sensorRepository;

    public List<SensorDto> getAllSensors() {
        return sensorRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<SensorDto> getSensorById(String id) {
        return sensorRepository.findById(id).map(this::convertToDto);
    }

    public List<SensorDto> getSensorsByZone(String zone) {
        return sensorRepository.findByZone(zone).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<SensorDto> getSensorsByStatus(String status) {
        return sensorRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public SensorDto createSensor(SensorDto sensorDto) {
        Sensor sensor = convertToEntity(sensorDto);
        Sensor saved = sensorRepository.save(sensor);
        log.info("Created new sensor in zone: {}", saved.getZone());
        return convertToDto(saved);
    }

    public Optional<SensorDto> updateSensor(String id, SensorDto sensorDto) {
        return sensorRepository.findById(id).map(existing -> {
            existing.setZone(sensorDto.getZone());
            existing.setModel(sensorDto.getModel());
            existing.setManufacturer(sensorDto.getManufacturer());
            existing.setFirmwareVersion(sensorDto.getFirmwareVersion());
            existing.setInstalledAt(sensorDto.getInstalledAt());
            existing.setLastCalibration(sensorDto.getLastCalibration());
            existing.setLatitude(sensorDto.getLatitude());
            existing.setLongitude(sensorDto.getLongitude());
            existing.setStatus(sensorDto.getStatus());
            existing.setIpAddress(sensorDto.getIpAddress());
            Sensor updated = sensorRepository.save(existing);
            log.info("Updated sensor: {}", updated.getId());
            return convertToDto(updated);
        });
    }

    public boolean deleteSensor(String id) {
        if (sensorRepository.existsById(id)) {
            sensorRepository.deleteById(id);
            log.info("Deleted sensor with id: {}", id);
            return true;
        }
        return false;
    }

    private SensorDto convertToDto(Sensor sensor) {
        SensorDto dto = new SensorDto();
        dto.setId(sensor.getId());
        dto.setZone(sensor.getZone());
        dto.setModel(sensor.getModel());
        dto.setManufacturer(sensor.getManufacturer());
        dto.setFirmwareVersion(sensor.getFirmwareVersion());
        dto.setInstalledAt(sensor.getInstalledAt());
        dto.setLastCalibration(sensor.getLastCalibration());
        dto.setLatitude(sensor.getLatitude());
        dto.setLongitude(sensor.getLongitude());
        dto.setStatus(sensor.getStatus());
        dto.setIpAddress(sensor.getIpAddress());
        return dto;
    }

    private Sensor convertToEntity(SensorDto dto) {
        Sensor sensor = new Sensor();
        sensor.setId(dto.getId());
        sensor.setZone(dto.getZone());
        sensor.setModel(dto.getModel());
        sensor.setManufacturer(dto.getManufacturer());
        sensor.setFirmwareVersion(dto.getFirmwareVersion());
        sensor.setInstalledAt(dto.getInstalledAt());
        sensor.setLastCalibration(dto.getLastCalibration());
        sensor.setLatitude(dto.getLatitude());
        sensor.setLongitude(dto.getLongitude());
        sensor.setStatus(dto.getStatus());
        sensor.setIpAddress(dto.getIpAddress());
        return sensor;
    }
}
