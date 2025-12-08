package com.city.mobility.dto;

import lombok.Data;

@Data
public class VehicleDTO {
    private Long id;
    private String registrationNumber;
    private Integer capacity;
    private String status;
}
