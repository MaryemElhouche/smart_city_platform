package com.city.airquality.entity;

import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sensors")
public class Sensor {

    @Id
    private String id;
    private String zone;
    private String model;
    private String manufacturer;
    private String firmwareVersion;
    private LocalDateTime installedAt;
    private LocalDateTime lastCalibration;
    private Double latitude;
    private Double longitude;
    private String status;
    private String ipAddress;

    public Sensor() {}

    public Sensor(String id, String zone, String model, String manufacturer, String firmwareVersion,
                  LocalDateTime installedAt, LocalDateTime lastCalibration,
                  Double latitude, Double longitude, String status, String ipAddress) {
        this.id = id;
        this.zone = zone;
        this.model = model;
        this.manufacturer = manufacturer;
        this.firmwareVersion = firmwareVersion;
        this.installedAt = installedAt;
        this.lastCalibration = lastCalibration;
        this.latitude = latitude;
        this.longitude = longitude;
        this.status = status;
        this.ipAddress = ipAddress;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public String getFirmwareVersion() { return firmwareVersion; }
    public void setFirmwareVersion(String firmwareVersion) { this.firmwareVersion = firmwareVersion; }

    public LocalDateTime getInstalledAt() { return installedAt; }
    public void setInstalledAt(LocalDateTime installedAt) { this.installedAt = installedAt; }

    public LocalDateTime getLastCalibration() { return lastCalibration; }
    public void setLastCalibration(LocalDateTime lastCalibration) { this.lastCalibration = lastCalibration; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
}
