package com.city.data.dto;

public class SensorInput {

    private String type;
    private Double value;
    private String timestamp;

    // Constructeurs
    public SensorInput() {
    }

    public SensorInput(String type, Double value, String timestamp) {
        this.type = type;
        this.value = value;
        this.timestamp = timestamp;
    }

    // Getters et Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
