package com.city.mobility.config;

import com.city.mobility.entity.Transport;
import com.city.mobility.repository.TransportRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(TransportRepository repo) {
        return args -> {
            repo.save(new Transport(null, "42", "BUS", "Station A", "Station B", LocalDateTime.now().plusMinutes(5), LocalDateTime.now().plusMinutes(35), "ON_TIME", 0, 20));
            repo.save(new Transport(null, "5", "METRO", "Station C", "Station D", LocalDateTime.now().plusMinutes(10), LocalDateTime.now().plusMinutes(25), "DELAYED", 5, 100));
        };
    }
}
