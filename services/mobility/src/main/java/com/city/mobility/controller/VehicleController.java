package com.city.mobility.controller;

import com.city.mobility.dto.VehicleDTO;
import com.city.mobility.service.VehicleService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public List<VehicleDTO> getAll() {
        return vehicleService.getAllVehicles();
    }

 @PostMapping
    public ResponseEntity<VehicleDTO> createVehicle(@RequestBody VehicleDTO dto) {
    VehicleDTO saved = vehicleService.saveVehicle(dto);
    return ResponseEntity.ok(saved);
}

}
