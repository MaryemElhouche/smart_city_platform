package com.city.mobility.controller;

import com.city.mobility.dto.TransportDTO;
import com.city.mobility.service.TransportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transports")
@RequiredArgsConstructor
@Tag(name = "Transport", description = "API de gestion des transports publics")
public class TransportController {

    private final TransportService transportService;

    @GetMapping
    @Operation(summary = "Récupérer tous les transports")
    public ResponseEntity<List<TransportDTO>> getAllTransports() {
        return ResponseEntity.ok(transportService.getAllTransports());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un transport par ID")
    public ResponseEntity<TransportDTO> getTransportById(@PathVariable Long id) {
        TransportDTO transport = transportService.getTransportById(id);
        return transport != null ? ResponseEntity.ok(transport) : ResponseEntity.notFound().build();
    }

    @GetMapping("/line/{lineNumber}")
    @Operation(summary = "Récupérer les transports par ligne")
    public ResponseEntity<List<TransportDTO>> getTransportsByLine(@PathVariable String lineNumber) {
        return ResponseEntity.ok(transportService.getTransportsByLine(lineNumber));
    }

    @GetMapping("/route")
    @Operation(summary = "Récupérer les transports par trajet")
    public ResponseEntity<List<TransportDTO>> getTransportsByRoute(@RequestParam String origin, @RequestParam String destination) {
        return ResponseEntity.ok(transportService.getTransportsByRoute(origin, destination));
    }

    @PostMapping
    @Operation(summary = "Créer un nouveau transport")
    public ResponseEntity<TransportDTO> createTransport(@RequestBody TransportDTO transportDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transportService.createTransport(transportDTO));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un transport")
    public ResponseEntity<TransportDTO> updateTransport(@PathVariable Long id, @RequestBody TransportDTO transportDTO) {
        TransportDTO updated = transportService.updateTransport(id, transportDTO);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un transport")
    public ResponseEntity<Void> deleteTransport(@PathVariable Long id) {
        transportService.deleteTransport(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Mobility REST Service is UP");
    }
}
