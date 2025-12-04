package com.city.mobility.config;

import com.city.mobility.entity.Emergency;
import com.city.mobility.repository.EmergencyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(EmergencyRepository repo) {
        return args -> {
            repo.save(new Emergency(null, "FIRE", "Downtown Plaza", "Building fire on 5th floor", "HIGH", "ACTIVE", LocalDateTime.now(), null, 15, "Firefighters dispatched"));
            repo.save(new Emergency(null, "ACCIDENT", "Highway 101 North", "Multi-vehicle collision", "CRITICAL", "ACTIVE", LocalDateTime.now(), null, 20, "Ambulances on the way"));
            repo.save(new Emergency(null, "MEDICAL", "Central Hospital", "Patient emergency in ER", "MEDIUM", "IN_PROGRESS", LocalDateTime.now().minusMinutes(30), null, 5, "Stabilized"));
        };
    }
}
