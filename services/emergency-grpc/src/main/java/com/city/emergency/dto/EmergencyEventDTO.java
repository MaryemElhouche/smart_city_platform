package com.city.emergency.dto;

import lombok.Data;

@Data
public class EmergencyEventDTO {

    private Long id;
    private String description;
    private String severity;
    private String status;
    private LocationDTO location;
    private Long assignedUnitId;
}
