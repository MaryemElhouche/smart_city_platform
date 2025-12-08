package com.city.emergency.config;

import com.city.emergency.entity.EmergencyEvent;
import com.city.emergency.entity.EmergencyUnit;
import com.city.emergency.entity.Location;
import com.city.emergency.entity.Resource;
import com.city.emergency.entity.IncidentLog;
import com.city.emergency.repository.EmergencyEventRepository;
import com.city.emergency.repository.EmergencyUnitRepository;
import com.city.emergency.repository.ResourceRepository;
import com.city.emergency.repository.IncidentLogRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final EmergencyEventRepository eventRepo;
    private final EmergencyUnitRepository unitRepo;
    private final ResourceRepository resourceRepo;
    private final IncidentLogRepository logRepo;

    @PostConstruct
    public void initData() {

        // -----------------------------
        // 1) Emergency Units
        // -----------------------------
        if (unitRepo.count() == 0) {
            EmergencyUnit unit1 = EmergencyUnit.builder()
                    .name("Ambulance 101")
                    .type("AMBULANCE")
                    .status("AVAILABLE")
                    .build();

            EmergencyUnit unit2 = EmergencyUnit.builder()
                    .name("Fire Truck 5")
                    .type("FIRE_TRUCK")
                    .status("BUSY")
                    .build();

            unitRepo.save(unit1);
            unitRepo.save(unit2);
        }

        // -----------------------------
        // 2) Emergency Events
        // -----------------------------
        if (eventRepo.count() == 0) {

            // get existing units
            EmergencyUnit ambulance = unitRepo.findByName("Ambulance 101").orElse(null);

            // create embedded Location without repository
            Location tunisLocation = Location.builder()
                .latitude(36.8065)
                .longitude(10.1815)
                .address("Tunis Centre")
                .build();

            EmergencyEvent evt1 = EmergencyEvent.builder()
                .title("Accident de route")
                .description("Collision entre deux voitures")
                .severity("HIGH")
                .location(tunisLocation)       // location embedded
                .assignedUnit(ambulance)
                .build();

            eventRepo.save(evt1);
        }

        // -----------------------------
        // 3) Resources
        // -----------------------------
        // create some default resources if they don't exist
        boolean hasMedical = resourceRepo.findAll().stream().anyMatch(r -> "Medical Kit".equals(r.getName()));
        if (!hasMedical) {
            EmergencyUnit ambulance = unitRepo.findByName("Ambulance 101").orElse(null);
            EmergencyUnit firetruck = unitRepo.findByName("Fire Truck 5").orElse(null);

            Resource res1 = Resource.builder()
                .name("Medical Kit")
                .type("MEDICAL")
                .status("AVAILABLE")
                .assignedUnit(ambulance)
                .build();

            Resource res2 = Resource.builder()
                .name("Fire Hose")
                .type("FIRE")
                .status("AVAILABLE")
                .assignedUnit(firetruck)
                .build();

            Resource res3 = Resource.builder()
                .name("Rescue Ladder")
                .type("MISC")
                .status("MAINTENANCE")
                .build();

            resourceRepo.save(res1);
            resourceRepo.save(res2);
            resourceRepo.save(res3);
        }

        // -----------------------------
        // 4) Incident Logs
        // -----------------------------
        boolean hasLog = logRepo.findAll().stream().anyMatch(l -> l.getMessage() != null && l.getMessage().contains("Arrived on scene"));
        if (!hasLog) {
            // link to existing event/unit/resource if available
            EmergencyEvent anyEvent = eventRepo.findAll().stream().findFirst().orElse(null);
            EmergencyUnit anyUnit = unitRepo.findAll().stream().findFirst().orElse(null);
            Resource anyResource = resourceRepo.findAll().stream().findFirst().orElse(null);

            IncidentLog log1 = IncidentLog.builder()
                .message("Arrived on scene")
                .timestamp(java.time.LocalDateTime.now())
                .event(anyEvent)
                .unit(anyUnit)
                .resource(anyResource)
                .build();

            IncidentLog log2 = IncidentLog.builder()
                .message("Stabilized patient and loaded into ambulance")
                .timestamp(java.time.LocalDateTime.now())
                .event(anyEvent)
                .unit(anyUnit)
                .build();

            logRepo.save(log1);
            logRepo.save(log2);
        }
    }
}
