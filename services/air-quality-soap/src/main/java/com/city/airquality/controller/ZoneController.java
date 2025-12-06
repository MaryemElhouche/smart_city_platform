package com.city.airquality.controller;

import com.city.airquality.dto.ZoneDto;
import com.city.airquality.service.ZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/zones")
public class ZoneController {

    @Autowired
    private ZoneService zoneService;

    @GetMapping
    public ResponseEntity<List<ZoneDto>> getAllZones() {
        return ResponseEntity.ok(zoneService.getAllZones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ZoneDto> getZoneById(@PathVariable String id) {
        return zoneService.getZoneById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<ZoneDto> getZoneByName(@PathVariable String name) {
        return zoneService.getZoneByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ZoneDto>> getZonesByType(@PathVariable String type) {
        return ResponseEntity.ok(zoneService.getZonesByType(type));
    }

    @PostMapping
    public ResponseEntity<ZoneDto> createZone(@RequestBody ZoneDto zoneDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(zoneService.createZone(zoneDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ZoneDto> updateZone(@PathVariable String id, @RequestBody ZoneDto zoneDto) {
        return zoneService.updateZone(id, zoneDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteZone(@PathVariable String id) {
        return zoneService.deleteZone(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
