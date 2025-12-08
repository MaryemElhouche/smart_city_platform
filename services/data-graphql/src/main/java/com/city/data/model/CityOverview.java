package com.city.data.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "city_overviews")
public class CityOverview {
    @Id
    private String id;
    private Zone zone;
    private Double currentAQI;
    private List<String> trendingPollutants;
    private List<Station> nearestStations;
    private List<EmergencyEventSummary> activeIncidents;
}
