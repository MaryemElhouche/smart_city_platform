package com.city.airquality.dto;

import java.time.LocalDateTime;

public class SensorDto {
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

    public SensorDto() {}

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
