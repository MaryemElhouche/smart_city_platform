package com.city.airquality.controller;

import com.city.airquality.dto.MeasurementDto;
import com.city.airquality.service.MeasurementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/measurements")
public class MeasurementController {

    @Autowired
    private MeasurementService measurementService;

    @GetMapping
    public ResponseEntity<List<MeasurementDto>> getAllMeasurements() {
        return ResponseEntity.ok(measurementService.getAllMeasurements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeasurementDto> getMeasurementById(@PathVariable String id) {
        return measurementService.getMeasurementById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/zone/{zone}")
    public ResponseEntity<List<MeasurementDto>> getMeasurementsByZone(@PathVariable String zone) {
        return ResponseEntity.ok(measurementService.getMeasurementsByZone(zone));
    }

    @GetMapping("/sensor/{sensorId}")
    public ResponseEntity<List<MeasurementDto>> getMeasurementsBySensor(@PathVariable String sensorId) {
        return ResponseEntity.ok(measurementService.getMeasurementsBySensor(sensorId));
    }

    @GetMapping("/zone/{zone}/latest")
    public ResponseEntity<MeasurementDto> getLatestMeasurementByZone(@PathVariable String zone) {
        return measurementService.getLatestMeasurementByZone(zone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MeasurementDto> createMeasurement(@RequestBody MeasurementDto measurementDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(measurementService.createMeasurement(measurementDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeasurement(@PathVariable String id) {
        return measurementService.deleteMeasurement(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
