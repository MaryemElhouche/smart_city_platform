package com.city.mobility.config;

import com.city.mobility.entity.*;
import com.city.mobility.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final VehicleRepository vehicleRepository;
    private final TransportLineRepository lineRepository;
    private final TransportRepository transportRepository;
    private final StationRepository stationRepository;

    @Override
    public void run(String... args) throws Exception {

        // -------------------- Vehicles --------------------
        Vehicle v1 = vehicleRepository.findByRegistrationNumber("TUN123")
                .orElseGet(() -> vehicleRepository.save(
                        Vehicle.builder()
                                .registrationNumber("TUN123")
                                .capacity(50)
                                .status("ACTIVE")
                                .build()
                ));

        Vehicle v2 = vehicleRepository.findByRegistrationNumber("TUN456")
                .orElseGet(() -> vehicleRepository.save(
                        Vehicle.builder()
                                .registrationNumber("TUN456")
                                .capacity(30)
                                .status("ACTIVE")
                                .build()
                ));

        // -------------------- Transport Lines --------------------
        TransportLine l1 = lineRepository.findByLineNumber("Ligne 1")
                .orElseGet(() -> lineRepository.save(
                        TransportLine.builder()
                                .lineNumber("Ligne 1")
                                .type("Métro Tunis")
                                .build()
                ));

        TransportLine l2 = lineRepository.findByLineNumber("Ligne 2")
                .orElseGet(() -> lineRepository.save(
                        TransportLine.builder()
                                .lineNumber("Ligne 2")
                                .type("Bus Ariana")
                                .build()
                ));

        // -------------------- Stations --------------------
        Station s1 = stationRepository.findByName("Gare Tunis Marine")
                .orElseGet(() -> stationRepository.save(
                        Station.builder()
                                .name("Gare Tunis Marine")
                                .latitude(36.8065)
                                .longitude(10.1815)
                                .line(l1)
                                .build()
                ));

        Station s2 = stationRepository.findByName("Bab Saadoun")
                .orElseGet(() -> stationRepository.save(
                        Station.builder()
                                .name("Bab Saadoun")
                                .latitude(36.8062)
                                .longitude(10.1685)
                                .line(l2)
                                .build()
                ));

        // -------------------- Transports --------------------
        LocalDateTime t1Departure = LocalDateTime.now().plusHours(1);
        LocalDateTime t2Departure = LocalDateTime.now().plusHours(3);

        if (!transportRepository.existsByOriginAndDestinationAndDepartureTime("Tunis", "La Marsa", t1Departure)) {
            transportRepository.save(
                    Transport.builder()
                            .origin("Tunis")
                            .destination("La Marsa")
                            .departureTime(t1Departure)
                            .arrivalTime(t1Departure.plusHours(1))
                            .status("ON_TIME")
                            .delayMinutes(0)
                            .availableSeats(v1.getCapacity())
                            .transportLine(l1)
                            .vehicle(v1)
                            .build()
            );
        }

        if (!transportRepository.existsByOriginAndDestinationAndDepartureTime("Ariana", "Tunis", t2Departure)) {
            transportRepository.save(
                    Transport.builder()
                            .origin("Ariana")
                            .destination("Tunis")
                            .departureTime(t2Departure)
                            .arrivalTime(t2Departure.plusHours(1))
                            .status("ON_TIME")
                            .delayMinutes(0)
                            .availableSeats(v2.getCapacity())
                            .transportLine(l2)
                            .vehicle(v2)
                            .build()
            );
        }

        System.out.println("✅ Initial data loaded");
    }
}
