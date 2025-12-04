package com.city.mobility.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyDTO {
    private Long id;
    private String type;
    private String location;
    private String description;
    private String severity;
    private String status;
    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;
    private Integer responderCount;
    private String remarks;
}
