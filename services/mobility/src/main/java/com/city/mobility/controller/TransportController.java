package com.city.mobility.controller;

import com.city.mobility.dto.TransportDTO;
import com.city.mobility.service.TransportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transports")
@RequiredArgsConstructor
public class TransportController {

    private final TransportService transportService;

    @GetMapping
    public List<TransportDTO> getAll() {
        return transportService.getAllTransports();
    }

    @GetMapping("/{id}")
    public TransportDTO getById(@PathVariable Long id) {
        return transportService.getTransportById(id);
    }

    @PostMapping
    public TransportDTO create(@RequestBody TransportDTO dto) {
        return transportService.createTransport(dto);
    }

    @PutMapping("/{id}")
    public TransportDTO update(@PathVariable Long id, @RequestBody TransportDTO dto) {
        return transportService.updateTransport(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        transportService.deleteTransport(id);
    }
}
