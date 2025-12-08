package com.city.mobility.controller;

import com.city.mobility.dto.StationDTO;
import com.city.mobility.service.StationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
@RequiredArgsConstructor
public class StationController {

    private final StationService stationService;

    // CREATE
    @PostMapping
    public ResponseEntity<StationDTO> create(@RequestBody StationDTO dto) {
        StationDTO created = stationService.createStation(dto);
        return ResponseEntity.ok(created);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<StationDTO>> getAll() {
        return ResponseEntity.ok(stationService.getAllStations());
    }

 @GetMapping("/{id}")
public ResponseEntity<StationDTO> getById(@PathVariable Long id) {
    return ResponseEntity.ok(stationService.getStationById(id));
}


    // READ BY LINE
    @GetMapping("/line/{lineId}")
    public ResponseEntity<List<StationDTO>> getByLine(@PathVariable Long lineId) {
        return ResponseEntity.ok(stationService.getStationsByLine(lineId));
    }

    // SEARCH BY NAME (partially)
    @GetMapping("/search")
    public ResponseEntity<List<StationDTO>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(stationService.getStationsByNameContaining(name));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<StationDTO> update(@PathVariable Long id, @RequestBody StationDTO dto) {
        StationDTO updated = stationService.updateStation(id, dto);
        return ResponseEntity.ok(updated);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        stationService.deleteStation(id);
        return ResponseEntity.noContent().build();
    }
}
