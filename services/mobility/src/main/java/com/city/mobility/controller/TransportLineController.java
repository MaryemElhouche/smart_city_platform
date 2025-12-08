package com.city.mobility.controller;

import com.city.mobility.dto.TransportLineDTO;
import com.city.mobility.service.TransportLineService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lines")
@RequiredArgsConstructor
public class TransportLineController {

    private final TransportLineService lineService;

    @GetMapping
    public List<TransportLineDTO> getAll() {
        return lineService.getAllLines();
    }

    @GetMapping("/{id}")
    public TransportLineDTO getById(@PathVariable Long id) {
        return lineService.getLineById(id);
    }

    @PostMapping
    public TransportLineDTO create(@RequestBody TransportLineDTO dto) {
        return lineService.createLine(dto);
    }

    @PutMapping("/{id}")
    public TransportLineDTO update(@PathVariable Long id, @RequestBody TransportLineDTO dto) {
        return lineService.updateLine(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        lineService.deleteLine(id);
    }
}
