package com.city.airquality.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.geo.GeoJsonPolygon;
import java.time.LocalDateTime;

@Document(collection = "zones")
public class Zone {

    @Id
    private String id;
    private String name;
    private Integer population;
    private String type;
    private String adminRegion;
    private Double areaKm2;
    private GeoJsonPolygon polygon;
    private LocalDateTime updatedAt;

    public Zone() {}

    public Zone(String id, String name, Integer population, String type, String adminRegion,
                Double areaKm2, GeoJsonPolygon polygon, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.population = population;
        this.type = type;
        this.adminRegion = adminRegion;
        this.areaKm2 = areaKm2;
        this.polygon = polygon;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getPopulation() { return population; }
    public void setPopulation(Integer population) { this.population = population; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getAdminRegion() { return adminRegion; }
    public void setAdminRegion(String adminRegion) { this.adminRegion = adminRegion; }

    public Double getAreaKm2() { return areaKm2; }
    public void setAreaKm2(Double areaKm2) { this.areaKm2 = areaKm2; }

    public GeoJsonPolygon getPolygon() { return polygon; }
    public void setPolygon(GeoJsonPolygon polygon) { this.polygon = polygon; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

