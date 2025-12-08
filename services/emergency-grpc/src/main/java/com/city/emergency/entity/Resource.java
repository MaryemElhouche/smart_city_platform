package com.city.emergency.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resources")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;         // Nom de la ressource (ex: Defibrillator, Extincteur)
    private String type;         // Type de ressource (Medical, Fire, Misc)
    private String status;       // AVAILABLE, IN_USE, MAINTENANCE

    @ManyToOne
    @JoinColumn(name = "unit_id")
    private EmergencyUnit assignedUnit; // Ressource assignée à une unité

    @ManyToOne
    @JoinColumn(name = "event_id")
    private EmergencyEvent assignedEvent; // Ressource assignée à un événement
}
