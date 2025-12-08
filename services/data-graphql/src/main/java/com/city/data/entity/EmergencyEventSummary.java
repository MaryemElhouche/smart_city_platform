package com.city.data.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "emergency_events")
public class EmergencyEventSummary {
    @Id
    private String id;
    private String type;
    private String location;
    private String status;
}
