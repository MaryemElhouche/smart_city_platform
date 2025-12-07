package com.city.mobility.dto;

import lombok.Data;

@Data
public class StationDTO {
    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;
    private Long lineId;
}
