package com.city.mobility.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.*;

@Builder
@Entity
@Table(name = "stations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;       // Exemple: "Tunis Marine"
    private Double latitude;
    private Double longitude;

    @ManyToOne
    @JoinColumn(name = "line_id")
    private TransportLine line;  // Association avec TransportLine
}
