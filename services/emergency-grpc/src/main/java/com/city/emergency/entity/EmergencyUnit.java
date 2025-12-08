package com.city.emergency.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;    // REQUIRED
    private String type;    // ambulance, police, fire-truck
    private String status;  // AVAILABLE, BUSY, OFFLINE

    // ---- RELATIONS ----

    // Plusieurs unités peuvent partager la même localisation (ex: même zone)
    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location currentLocation;

    // Une unité peut avoir plusieurs ressources
    @OneToMany(mappedBy = "assignedUnit", cascade = CascadeType.ALL)
    private List<Resource> resources;

    // Une unité peut avoir plusieurs logs d'incidents
    @OneToMany(mappedBy = "unit", cascade = CascadeType.ALL)
    private List<IncidentLog> incidentLogs;
}
