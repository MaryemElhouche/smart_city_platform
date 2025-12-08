package com.city.data.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class MongoTestController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/mongo-connection")
    public Map<String, Object> testMongoConnection() {
        Map<String, Object> response = new HashMap<>();
        try {
            // Test connection by getting database name
            String dbName = mongoTemplate.getDb().getName();
            
            // Get collection names
            var collections = mongoTemplate.getDb().listCollectionNames();
            
            response.put("status", "SUCCESS");
            response.put("connected", true);
            response.put("database", dbName);
            response.put("collections", collections.into(new java.util.ArrayList<>()));
            response.put("message", "MongoDB connection is working!");
            
        } catch (Exception e) {
            response.put("status", "FAILED");
            response.put("connected", false);
            response.put("error", e.getMessage());
            response.put("message", "MongoDB connection failed!");
        }
        return response;
    }
}
