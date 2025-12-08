package com.city.airquality.controller;

import com.city.airquality.dto.SensorDto;
import com.city.airquality.service.SensorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sensors")
public class SensorController {

    @Autowired
    private SensorService sensorService;

    @GetMapping
    public ResponseEntity<List<SensorDto>> getAllSensors() {
        return ResponseEntity.ok(sensorService.getAllSensors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SensorDto> getSensorById(@PathVariable String id) {
        return sensorService.getSensorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/zone/{zone}")
    public ResponseEntity<List<SensorDto>> getSensorsByZone(@PathVariable String zone) {
        return ResponseEntity.ok(sensorService.getSensorsByZone(zone));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SensorDto>> getSensorsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(sensorService.getSensorsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<SensorDto> createSensor(@RequestBody SensorDto sensorDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sensorService.createSensor(sensorDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SensorDto> updateSensor(@PathVariable String id, @RequestBody SensorDto sensorDto) {
        return sensorService.updateSensor(id, sensorDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSensor(@PathVariable String id) {
        return sensorService.deleteSensor(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
