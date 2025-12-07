package com.city.mobility.entity;

import jakarta.persistence.*;


import java.time.LocalDateTime;
import lombok.*;
@Builder
@Entity
@Table(name = "transports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String origin;

    @Column(nullable = true)
    private String destination;

    @Column(nullable = true)
    private LocalDateTime departureTime;

    @Column(nullable = true)
    private LocalDateTime arrivalTime;

    private String status; // ON_TIME / DELAYED / CANCELLED
    private Integer delayMinutes;
    private Integer availableSeats;

    @ManyToOne
    @JoinColumn(name = "line_id")
    private TransportLine transportLine;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;
}
