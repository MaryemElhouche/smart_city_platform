package com.city.emergency.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;      // REQUIRED
    private String type;        // ambulance, police, fire-truck
    private String status;      // AVAILABLE, BUSY, OFFLINE

    @OneToOne(cascade = CascadeType.ALL)
    private Location currentLocation;
}
