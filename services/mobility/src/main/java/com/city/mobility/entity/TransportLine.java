package com.city.mobility.entity;

import jakarta.persistence.*;
import java.util.List;
import lombok.*;
@Builder
@Entity
@Table(name = "transport_lines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String lineNumber;
    private String type; // BUS / METRO / TRAIN

    @OneToMany(mappedBy = "line", cascade = CascadeType.ALL)
    private List<Station> stations;
}
