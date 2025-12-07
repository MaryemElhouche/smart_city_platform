package com.city.data.config;

import com.city.data.entity.SensorNode;
import com.city.data.repository.SensorRepository;
import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.core.Neo4jClient;

@Configuration
public class Neo4jConfig {

    @Value("${spring.neo4j.uri}")
    private String uri;

    @Value("${spring.neo4j.authentication.username}")
    private String username;

    @Value("${spring.neo4j.authentication.password}")
    private String password;

    @Bean
    public Driver driver() {
        return GraphDatabase.driver(uri, AuthTokens.basic(username, password));
    }

    @Bean
    public Neo4jClient neo4jClient(Driver driver) {
        return Neo4jClient.create(driver);
    }

    // Initialisation de données
    @Bean
    public CommandLineRunner dataInitializer(SensorRepository sensorRepository) {
        return args -> {
            if (sensorRepository.count() == 0) {
                SensorNode s1 = new SensorNode();
                s1.setType("Temperature");
                s1.setValue(23.5);
                s1.setTimestamp("2025-12-05T10:00:00");

                SensorNode s2 = new SensorNode();
                s2.setType("Humidity");
                s2.setValue(60.0);
                s2.setTimestamp("2025-12-05T10:05:00");

                sensorRepository.save(s1);
                sensorRepository.save(s2);

                System.out.println("Initial sensor data inserted into Neo4j.");
            }
        };
    }
}
