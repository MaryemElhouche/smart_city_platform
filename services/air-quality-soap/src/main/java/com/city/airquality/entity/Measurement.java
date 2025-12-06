package com.city.airquality.entity;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "air_quality_measurements")
public class Measurement {

    @Id
    private String id;
    private String sensorId;
    private String zone;
    private Integer aqi;
    private Double pm25;
    private Double pm10;
    private Double no2;
    private Double co2;
    private Double o3;
    private Double temperature;
    private Double humidity;
    private Integer batteryLevel;
    private String source;
    private String rawRef;
    private LocalDateTime measurementTime;
    private LocalDateTime ingestedAt;

    public Measurement() {}

    public Measurement(String id, String sensorId, String zone, Integer aqi, Double pm25, Double pm10,
                       Double no2, Double co2, Double o3, Double temperature, Double humidity,
                       Integer batteryLevel, String source, String rawRef,
                       LocalDateTime measurementTime, LocalDateTime ingestedAt) {
        this.id = id;
        this.sensorId = sensorId;
        this.zone = zone;
        this.aqi = aqi;
        this.pm25 = pm25;
        this.pm10 = pm10;
        this.no2 = no2;
        this.co2 = co2;
        this.o3 = o3;
        this.temperature = temperature;
        this.humidity = humidity;
        this.batteryLevel = batteryLevel;
        this.source = source;
        this.rawRef = rawRef;
        this.measurementTime = measurementTime;
        this.ingestedAt = ingestedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSensorId() { return sensorId; }
    public void setSensorId(String sensorId) { this.sensorId = sensorId; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public Integer getAqi() { return aqi; }
    public void setAqi(Integer aqi) { this.aqi = aqi; }

    public Double getPm25() { return pm25; }
    public void setPm25(Double pm25) { this.pm25 = pm25; }

    public Double getPm10() { return pm10; }
    public void setPm10(Double pm10) { this.pm10 = pm10; }

    public Double getNo2() { return no2; }
    public void setNo2(Double no2) { this.no2 = no2; }

    public Double getCo2() { return co2; }
    public void setCo2(Double co2) { this.co2 = co2; }

    public Double getO3() { return o3; }
    public void setO3(Double o3) { this.o3 = o3; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getHumidity() { return humidity; }
    public void setHumidity(Double humidity) { this.humidity = humidity; }

    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getRawRef() { return rawRef; }
    public void setRawRef(String rawRef) { this.rawRef = rawRef; }

    public LocalDateTime getMeasurementTime() { return measurementTime; }
    public void setMeasurementTime(LocalDateTime measurementTime) { this.measurementTime = measurementTime; }

    public LocalDateTime getIngestedAt() { return ingestedAt; }
    public void setIngestedAt(LocalDateTime ingestedAt) { this.ingestedAt = ingestedAt; }
}
