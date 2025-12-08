package com.city.emergency.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentLogDTO {
    private Long id;
    private String message;
    private LocalDateTime timestamp;
    private Long eventId;
    private Long unitId;
    private Long resourceId;
}
