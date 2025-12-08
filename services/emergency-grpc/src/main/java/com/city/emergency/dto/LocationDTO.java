package com.city.emergency.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationDTO {
    private Long id;          // optionnel, pour retrouver l'entité
    private double latitude;
    private double longitude;
    private String address;   // ajouté pour correspondre à l'entité
}
