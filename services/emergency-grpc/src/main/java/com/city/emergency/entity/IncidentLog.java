package com.city.emergency.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "incident_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;             // Description de l'incident ou action
    private LocalDateTime timestamp;    // Date et heure

    @ManyToOne
    @JoinColumn(name = "event_id")
    private EmergencyEvent event;       // Événement associé

    @ManyToOne
    @JoinColumn(name = "unit_id")
    private EmergencyUnit unit;         // Unité impliquée (optionnel)

    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;          // Ressource impliquée (optionnel)
}
