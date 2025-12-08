package com.city.emergency.controller;

import com.city.emergency.dto.ResourceDTO;
import com.city.emergency.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService service;

    // Créer une ressource
    @PostMapping
    public ResourceDTO create(@RequestBody ResourceDTO dto) {
        return service.create(dto);
    }

    // Récupérer toutes les ressources
    @GetMapping
    public List<ResourceDTO> getAll() {
        return service.getAll();
    }

    // Mettre à jour le statut d'une ressource
    @PutMapping("/{id}/status")
    public ResourceDTO updateStatus(@PathVariable Long id, @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    // Supprimer une ressource
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
