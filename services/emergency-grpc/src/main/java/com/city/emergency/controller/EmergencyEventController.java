package com.city.emergency.controller;

import com.city.emergency.dto.EmergencyEventDTO;
import com.city.emergency.service.EmergencyEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EmergencyEventController {

    private final EmergencyEventService service;

    // CREATE
    @PostMapping
    public EmergencyEventDTO create(@RequestBody EmergencyEventDTO dto) {
        return service.create(dto);
    }

    // GET ALL
    @GetMapping
    public List<EmergencyEventDTO> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public EmergencyEventDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // ASSIGN UNIT
    @PutMapping("/{eventId}/assign/{unitId}")
    public EmergencyEventDTO assignUnit(
            @PathVariable Long eventId,
            @PathVariable Long unitId
    ) {
        return service.assignUnit(eventId, unitId);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
