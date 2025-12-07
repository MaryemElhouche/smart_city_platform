package com.city.emergency.config;

import com.city.emergency.entity.EmergencyEvent;
import com.city.emergency.entity.EmergencyUnit;
import com.city.emergency.entity.Location;
import com.city.emergency.repository.EmergencyEventRepository;
import com.city.emergency.repository.EmergencyUnitRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final EmergencyEventRepository eventRepo;
    private final EmergencyUnitRepository unitRepo;

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
    }
}
