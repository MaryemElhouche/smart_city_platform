package com.city.mobility.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TransportDTO {
    private Long id;
    private String origin;
    private String destination;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private String status;
    private Integer delayMinutes;
    private Integer availableSeats;

    private Long lineId;
    private Long vehicleId;
}
