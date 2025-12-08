package com.city.data;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class DataGraphqlApplication {
    public static void main(String[] args) {
        SpringApplication.run(DataGraphqlApplication.class, args);
    }
}
