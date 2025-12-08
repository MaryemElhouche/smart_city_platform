package com.city.emergency.service;

import com.city.emergency.dto.ResourceDTO;
import java.util.List;

public interface ResourceService {

    ResourceDTO create(ResourceDTO dto);
    List<ResourceDTO> getAll();
    ResourceDTO updateStatus(Long id, String status);
    void delete(Long id);
}
