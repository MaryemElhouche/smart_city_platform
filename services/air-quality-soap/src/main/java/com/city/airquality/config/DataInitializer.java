package com.city.airquality.config;

import com.city.airquality.entity.Zone;
import com.city.airquality.entity.Sensor;
import com.city.airquality.entity.Measurement;
import com.city.airquality.entity.Alert;
import com.city.airquality.repository.ZoneRepository;
import com.city.airquality.repository.SensorRepository;
import com.city.airquality.repository.MeasurementRepository;
import com.city.airquality.repository.AlertRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    private final ZoneRepository zoneRepository;
    private final SensorRepository sensorRepository;
    private final MeasurementRepository measurementRepository;
    private final AlertRepository alertRepository;
    
    public DataInitializer(ZoneRepository zoneRepository, 
                          SensorRepository sensorRepository,
                          MeasurementRepository measurementRepository,
                          AlertRepository alertRepository) {
        this.zoneRepository = zoneRepository;
        this.sensorRepository = sensorRepository;
        this.measurementRepository = measurementRepository;
        this.alertRepository = alertRepository;
    }
    
    @Override
    public void run(String... args) {
        // Check if data already exists to prevent duplication
        if (zoneRepository.count() > 0) {
            System.out.println("Data already initialized. Skipping initialization.");
            return;
        }
        
        System.out.println("Initializing air quality data for Tunisian zones...");
        
        // Initialize Zones
        List<Zone> zones = Arrays.asList(
            createZone("Tunis", 1200000, "Urban", "Tunis", 346.0),
            createZone("Sfax", 955000, "Urban", "Sfax", 220.0),
            createZone("Sousse", 674000, "Urban", "Sousse", 45.0),
            createZone("Kairouan", 186000, "Urban", "Kairouan", 50.0),
            createZone("Bizerte", 568000, "Urban", "Bizerte", 568.0),
            createZone("Gabes", 374000, "Urban", "Gabes", 375.0),
            createZone("Ariana", 576000, "Urban", "Ariana", 83.0),
            createZone("Gafsa", 337000, "Urban", "Gafsa", 8990.0),
            createZone("Monastir", 548000, "Urban", "Monastir", 1019.0),
            createZone("Hammamet", 73000, "Tourism", "Nabeul", 36.0)
        );
        zoneRepository.saveAll(zones);
        System.out.println("Initialized " + zones.size() + " zones");
        
        // Initialize Sensors
        List<Sensor> sensors = Arrays.asList(
            createSensor("Tunis", "AQM-2000", "Honeywell", "active", 36.8065, 10.1815),
            createSensor("Sfax", "AQM-2000", "Bosch", "active", 34.7406, 10.7603),
            createSensor("Sousse", "AQM-3000", "Honeywell", "active", 35.8256, 10.6411),
            createSensor("Kairouan", "AQM-2000", "Siemens", "active", 35.6781, 10.0963),
            createSensor("Bizerte", "AQM-3000", "Bosch", "active", 37.2744, 9.8739),
            createSensor("Gabes", "AQM-2000", "Honeywell", "maintenance", 33.8815, 10.0982),
            createSensor("Ariana", "AQM-3000", "Siemens", "active", 36.8625, 10.1956),
            createSensor("Gafsa", "AQM-2000", "Bosch", "active", 34.4250, 8.7842),
            createSensor("Monastir", "AQM-3000", "Honeywell", "active", 35.7643, 10.8113),
            createSensor("Hammamet", "AQM-2000", "Siemens", "active", 36.4000, 10.6167)
        );
        sensorRepository.saveAll(sensors);
        System.out.println("Initialized " + sensors.size() + " sensors");
        
        // Initialize Measurements
        List<Measurement> measurements = Arrays.asList(
            createMeasurement(sensors.get(0).getId(), "Tunis", 75, 22.5, 35.2, 40.1, 420.3, 65.4, 24.5, 55.0),
            createMeasurement(sensors.get(1).getId(), "Sfax", 85, 28.3, 42.1, 45.2, 450.6, 70.2, 26.8, 48.0),
            createMeasurement(sensors.get(2).getId(), "Sousse", 65, 18.7, 30.5, 35.8, 390.2, 58.9, 23.2, 60.0),
            createMeasurement(sensors.get(3).getId(), "Kairouan", 55, 15.2, 25.8, 30.4, 360.5, 52.3, 22.1, 52.0),
            createMeasurement(sensors.get(4).getId(), "Bizerte", 60, 17.8, 28.9, 33.6, 380.7, 55.6, 21.5, 65.0),
            createMeasurement(sensors.get(5).getId(), "Gabes", 90, 32.1, 48.5, 50.3, 480.9, 75.8, 28.9, 42.0),
            createMeasurement(sensors.get(6).getId(), "Ariana", 70, 20.5, 33.2, 38.7, 410.4, 62.1, 25.0, 58.0),
            createMeasurement(sensors.get(7).getId(), "Gafsa", 95, 35.6, 52.3, 55.1, 510.2, 80.4, 30.2, 38.0),
            createMeasurement(sensors.get(8).getId(), "Monastir", 58, 16.4, 27.3, 32.2, 370.8, 54.2, 22.8, 62.0),
            createMeasurement(sensors.get(9).getId(), "Hammamet", 52, 14.8, 24.1, 28.9, 350.3, 50.7, 21.0, 68.0)
        );
        measurementRepository.saveAll(measurements);
        System.out.println("Initialized " + measurements.size() + " measurements");
        
        // Initialize Alerts
        List<Alert> alerts = Arrays.asList(
            createAlert("Gabes", "AIR_QUALITY", "PM2.5", 32.1, "HIGH", "Sensor detected high PM2.5 levels"),
            createAlert("Gafsa", "AIR_QUALITY", "PM2.5", 35.6, "CRITICAL", "Sensor detected critical PM2.5 levels")
        );
        alertRepository.saveAll(alerts);
        System.out.println("Initialized " + alerts.size() + " alerts");
    }
    
    private Zone createZone(String name, Integer population, String type, String adminRegion, Double areaKm2) {
        Zone zone = new Zone();
        zone.setName(name);
        zone.setPopulation(population);
        zone.setType(type);
        zone.setAdminRegion(adminRegion);
        zone.setAreaKm2(areaKm2);
        zone.setUpdatedAt(LocalDateTime.now());
        return zone;
    }
    
    private Sensor createSensor(String zone, String model, String manufacturer, String status, Double lat, Double lon) {
        Sensor sensor = new Sensor();
        sensor.setZone(zone);
        sensor.setModel(model);
        sensor.setManufacturer(manufacturer);
        sensor.setFirmwareVersion("1.0.0");
        sensor.setInstalledAt(LocalDateTime.now().minusMonths(6));
        sensor.setLastCalibration(LocalDateTime.now().minusDays(30));
        sensor.setLatitude(lat);
        sensor.setLongitude(lon);
        sensor.setStatus(status);
        sensor.setIpAddress("10.0.0." + (int)(Math.random() * 255));
        return sensor;
    }
    
    private Measurement createMeasurement(String sensorId, String zone, int aqi, double pm25, double pm10, 
                                         double no2, double co2, double o3, double temp, double humidity) {
        Measurement measurement = new Measurement();
        measurement.setSensorId(sensorId);
        measurement.setZone(zone);
        measurement.setAqi(aqi);
        measurement.setPm25(pm25);
        measurement.setPm10(pm10);
        measurement.setNo2(no2);
        measurement.setCo2(co2);
        measurement.setO3(o3);
        measurement.setTemperature(temp);
        measurement.setHumidity(humidity);
        measurement.setBatteryLevel(85);
        measurement.setSource("SENSOR");
        measurement.setMeasurementTime(LocalDateTime.now());
        measurement.setIngestedAt(LocalDateTime.now());
        return measurement;
    }
    
    private Alert createAlert(String zone, String type, String metric, Double value, String severity, String description) {
        Alert alert = new Alert();
        alert.setZone(zone);
        alert.setType(type);
        alert.setMetric(metric);
        alert.setValue(value);
        alert.setSeverity(severity);
        alert.setCreatedAt(LocalDateTime.now());
        alert.setResolved(false);
        alert.setSource("AUTOMATED");
        alert.setDescription(description);
        return alert;
    }
}
