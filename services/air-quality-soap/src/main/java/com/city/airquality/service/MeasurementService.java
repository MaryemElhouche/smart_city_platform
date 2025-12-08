package com.city.airquality.service;

import com.city.airquality.dto.MeasurementDto;
import com.city.airquality.entity.Measurement;
import com.city.airquality.repository.MeasurementRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MeasurementService {

    private static final Logger log = LoggerFactory.getLogger(MeasurementService.class);

    @Autowired
    private MeasurementRepository measurementRepository;

    public List<MeasurementDto> getAllMeasurements() {
        return measurementRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<MeasurementDto> getMeasurementById(String id) {
        return measurementRepository.findById(id).map(this::convertToDto);
    }

    public List<MeasurementDto> getMeasurementsByZone(String zone) {
        return measurementRepository.findByZone(zone).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<MeasurementDto> getMeasurementsBySensor(String sensorId) {
        return measurementRepository.findBySensorId(sensorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<MeasurementDto> getLatestMeasurementByZone(String zone) {
        Measurement measurement = measurementRepository.findFirstByZoneOrderByMeasurementTimeDesc(zone);
        return Optional.ofNullable(measurement).map(this::convertToDto);
    }

    public MeasurementDto createMeasurement(MeasurementDto measurementDto) {
        Measurement measurement = convertToEntity(measurementDto);
        measurement.setIngestedAt(LocalDateTime.now());
        Measurement saved = measurementRepository.save(measurement);
        log.info("Created new measurement for zone: {}", saved.getZone());
        return convertToDto(saved);
    }

    public boolean deleteMeasurement(String id) {
        if (measurementRepository.existsById(id)) {
            measurementRepository.deleteById(id);
            log.info("Deleted measurement with id: {}", id);
            return true;
        }
        return false;
    }

    private MeasurementDto convertToDto(Measurement measurement) {
        MeasurementDto dto = new MeasurementDto();
        dto.setId(measurement.getId());
        dto.setSensorId(measurement.getSensorId());
        dto.setZone(measurement.getZone());
        dto.setAqi(measurement.getAqi());
        dto.setPm25(measurement.getPm25());
        dto.setPm10(measurement.getPm10());
        dto.setNo2(measurement.getNo2());
        dto.setCo2(measurement.getCo2());
        dto.setO3(measurement.getO3());
        dto.setTemperature(measurement.getTemperature());
        dto.setHumidity(measurement.getHumidity());
        dto.setBatteryLevel(measurement.getBatteryLevel());
        dto.setSource(measurement.getSource());
        dto.setRawRef(measurement.getRawRef());
        dto.setMeasurementTime(measurement.getMeasurementTime());
        dto.setIngestedAt(measurement.getIngestedAt());
        return dto;
    }

    private Measurement convertToEntity(MeasurementDto dto) {
        Measurement measurement = new Measurement();
        measurement.setId(dto.getId());
        measurement.setSensorId(dto.getSensorId());
        measurement.setZone(dto.getZone());
        measurement.setAqi(dto.getAqi());
        measurement.setPm25(dto.getPm25());
        measurement.setPm10(dto.getPm10());
        measurement.setNo2(dto.getNo2());
        measurement.setCo2(dto.getCo2());
        measurement.setO3(dto.getO3());
        measurement.setTemperature(dto.getTemperature());
        measurement.setHumidity(dto.getHumidity());
        measurement.setBatteryLevel(dto.getBatteryLevel());
        measurement.setSource(dto.getSource());
        measurement.setRawRef(dto.getRawRef());
        measurement.setMeasurementTime(dto.getMeasurementTime());
        measurement.setIngestedAt(dto.getIngestedAt());
        return measurement;
    }
}
