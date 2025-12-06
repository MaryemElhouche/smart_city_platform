package com.city.airquality.controller;

import com.city.airquality.dto.AlertDto;
import com.city.airquality.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping
    public ResponseEntity<List<AlertDto>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlertDto> getAlertById(@PathVariable String id) {
        return alertService.getAlertById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/zone/{zone}")
    public ResponseEntity<List<AlertDto>> getAlertsByZone(@PathVariable String zone) {
        return ResponseEntity.ok(alertService.getAlertsByZone(zone));
    }

    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<AlertDto>> getAlertsBySeverity(@PathVariable String severity) {
        return ResponseEntity.ok(alertService.getAlertsBySeverity(severity));
    }

    @GetMapping("/unresolved")
    public ResponseEntity<List<AlertDto>> getUnresolvedAlerts() {
        return ResponseEntity.ok(alertService.getUnresolvedAlerts());
    }

    @PostMapping
    public ResponseEntity<AlertDto> createAlert(@RequestBody AlertDto alertDto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(alertService.createAlert(alertDto));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<AlertDto> resolveAlert(@PathVariable String id) {
        return alertService.resolveAlert(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable String id) {
        return alertService.deleteAlert(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
