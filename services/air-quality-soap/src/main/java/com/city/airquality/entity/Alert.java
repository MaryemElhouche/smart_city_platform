package com.city.airquality.entity;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "alerts")
public class Alert {

    @Id
    private String id;
    private String zone;
    private String type;
    private String metric;
    private Double value;
    private String severity;
    private LocalDateTime createdAt;
    private boolean resolved;
    private LocalDateTime resolvedAt;
    private String source;
    private String description;

    public Alert() {}

    public Alert(String id, String zone, String type, String metric, Double value,
                 String severity, LocalDateTime createdAt, boolean resolved,
                 LocalDateTime resolvedAt, String source, String description) {
        this.id = id;
        this.zone = zone;
        this.type = type;
        this.metric = metric;
        this.value = value;
        this.severity = severity;
        this.createdAt = createdAt;
        this.resolved = resolved;
        this.resolvedAt = resolvedAt;
        this.source = source;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMetric() { return metric; }
    public void setMetric(String metric) { this.metric = metric; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isResolved() { return resolved; }
    public void setResolved(boolean resolved) { this.resolved = resolved; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
