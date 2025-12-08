package com.city.emergency.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyUnitDTO {

    private Long id;

    private String name;
    private String type;
    private String status;

    // Location gérée en cascade → donc représentée directement dans DTO
    private LocationDTO location;

    // Relations (IDs uniquement)
    private List<Long> resourceIds;
    private List<Long> incidentLogIds;
}
