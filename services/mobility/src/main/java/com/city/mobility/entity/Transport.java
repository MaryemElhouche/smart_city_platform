package com.city.mobility.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "transports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String lineNumber;
    
    @Column(nullable = false)
    private String type; // BUS, METRO, TRAIN
    
    @Column(nullable = false)
    private String origin;
    
    @Column(nullable = false)
    private String destination;
    
    @Column(nullable = false)
    private LocalDateTime departureTime;
    
    @Column(nullable = false)
    private LocalDateTime arrivalTime;
    
    private String status; // ON_TIME, DELAYED, CANCELLED
    
    private Integer delayMinutes;
    
    private Integer availableSeats;
}
