package com.city.emergency.dto;

import lombok.Data;

@Data
public class EmergencyUnitDTO {

    private Long id;
    private String type;
    private String status;
    private LocationDTO currentLocation;
}
