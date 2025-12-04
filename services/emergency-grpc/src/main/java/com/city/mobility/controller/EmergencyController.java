package com.city.mobility.controller;

import com.city.mobility.dto.EmergencyDTO;
import com.city.mobility.service.EmergencyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergencies")
@RequiredArgsConstructor
@Tag(name = "Emergency", description = "API de gestion des urgences")
public class EmergencyController {

    private final EmergencyService emergencyService;

    @GetMapping
    @Operation(summary = "Récupérer toutes les urgences")
    public ResponseEntity<List<EmergencyDTO>> getAllEmergencies() {
        return ResponseEntity.ok(emergencyService.getAllEmergencies());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer une urgence par ID")
    public ResponseEntity<EmergencyDTO> getEmergencyById(@PathVariable Long id) {
        EmergencyDTO emergency = emergencyService.getEmergencyById(id);
        return emergency != null ? ResponseEntity.ok(emergency) : ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Récupérer les urgences par statut")
    public ResponseEntity<List<EmergencyDTO>> getEmergenciesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(emergencyService.getEmergenciesByStatus(status));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Récupérer les urgences par type")
    public ResponseEntity<List<EmergencyDTO>> getEmergenciesByType(@PathVariable String type) {
        return ResponseEntity.ok(emergencyService.getEmergenciesByType(type));
    }

    @GetMapping("/severity/{severity}")
    @Operation(summary = "Récupérer les urgences par sévérité")
    public ResponseEntity<List<EmergencyDTO>> getEmergenciesBySeverity(@PathVariable String severity) {
        return ResponseEntity.ok(emergencyService.getEmergenciesBySeverity(severity));
    }

    @GetMapping("/location/{location}")
    @Operation(summary = "Récupérer les urgences par localisation")
    public ResponseEntity<List<EmergencyDTO>> getEmergenciesByLocation(@PathVariable String location) {
        return ResponseEntity.ok(emergencyService.getEmergenciesByLocation(location));
    }

    @PostMapping
    @Operation(summary = "Créer une nouvelle urgence")
    public ResponseEntity<EmergencyDTO> createEmergency(@RequestBody EmergencyDTO emergencyDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(emergencyService.createEmergency(emergencyDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une urgence")
    public ResponseEntity<EmergencyDTO> updateEmergency(@PathVariable Long id, @RequestBody EmergencyDTO emergencyDTO) {
        EmergencyDTO updated = emergencyService.updateEmergency(id, emergencyDTO);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une urgence")
    public ResponseEntity<Void> deleteEmergency(@PathVariable Long id) {
        emergencyService.deleteEmergency(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Emergency Service is UP");
    }
}
