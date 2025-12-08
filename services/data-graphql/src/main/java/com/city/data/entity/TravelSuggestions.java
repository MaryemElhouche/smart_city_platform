package com.city.data.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "travel_suggestions")
public class TravelSuggestions {
    @Id
    private String id;
    private String fromStation;
    private String toStation;
    private String recommendedLine;
    private String airQualityRecommendation;
}
