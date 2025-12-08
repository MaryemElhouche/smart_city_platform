package com.city.emergency.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDTO {
    private Long id;
    private String name;
    private String type;
    private String status;
    private Long assignedUnitId;
    private Long assignedEventId;
}
