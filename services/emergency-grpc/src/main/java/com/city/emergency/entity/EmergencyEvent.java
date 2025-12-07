package com.city.emergency.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;         // REQUIRED
    private String description;
    private String severity;           // LOW, MEDIUM, HIGH, CRITICAL
    private String status;             // REPORTED, IN_PROGRESS, RESOLVED

    @OneToOne(cascade = CascadeType.ALL)
    private Location location;

    @ManyToOne
    private EmergencyUnit assignedUnit;
}
