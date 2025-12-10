package com.city.data.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoIterable;

@WebMvcTest(MongoTestController.class)
class MongoTestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MongoTemplate mongoTemplate;

    @Test
    void testMongoConnection_WhenSuccessful_ShouldReturnSuccess() throws Exception {
        MongoDatabase mockDatabase = mock(MongoDatabase.class);
        MongoIterable<String> mockCollections = mock(MongoIterable.class);
        
        when(mongoTemplate.getDb()).thenReturn(mockDatabase);
        when(mockDatabase.getName()).thenReturn("test_db");
        when(mockDatabase.listCollectionNames()).thenReturn(mockCollections);
        when(mockCollections.into(org.mockito.ArgumentMatchers.any())).thenReturn(Arrays.asList("collection1", "collection2"));

        mockMvc.perform(get("/api/test/mongo-connection"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.connected").value(true))
                .andExpect(jsonPath("$.database").value("test_db"));
    }

    @Test
    void testMongoConnection_WhenFailed_ShouldReturnFailed() throws Exception {
        when(mongoTemplate.getDb()).thenThrow(new RuntimeException("Connection failed"));

        mockMvc.perform(get("/api/test/mongo-connection"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("FAILED"))
                .andExpect(jsonPath("$.connected").value(false));
    }
}
