package com.city.emergency.controller;

import com.city.emergency.dto.EmergencyUnitDTO;
import com.city.emergency.service.EmergencyUnitService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
public class EmergencyUnitController {

    private final EmergencyUnitService service;

    // CREATE
    @PostMapping
    public EmergencyUnitDTO create(@RequestBody EmergencyUnitDTO dto) {
        return service.create(dto);
    }

    // GET ALL
    @GetMapping
    public List<EmergencyUnitDTO> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public EmergencyUnitDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // UPDATE STATUS
    @PutMapping("/{id}/status")
    public EmergencyUnitDTO updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return service.updateStatus(id, status);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
