package com.city.emergency.controller;

import com.city.emergency.dto.IncidentLogDTO;
import com.city.emergency.service.IncidentLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class IncidentLogController {

    private final IncidentLogService service;

    // ================== CREATE ==================
    @PostMapping
    public IncidentLogDTO create(@RequestBody IncidentLogDTO dto) {
        return service.create(dto);
    }

    // ================== READ ALL ==================
    @GetMapping
    public List<IncidentLogDTO> getAll() {
        return service.getAll();
    }

    // ================== READ BY ID ==================
    @GetMapping("/{id}")
    public IncidentLogDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // ================== UPDATE ==================
    @PutMapping("/{id}")
    public IncidentLogDTO update(@PathVariable Long id, @RequestBody IncidentLogDTO dto) {
        dto.setId(id);
        return service.update(dto);
    }

    // ================== DELETE ==================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
