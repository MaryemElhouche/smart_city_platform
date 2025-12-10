package com.city.emergency.controller;

import com.city.emergency.dto.ResourceDTO;
import com.city.emergency.service.ResourceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResourceController.class)
class ResourceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResourceService service;

    @Autowired
    private ObjectMapper objectMapper;

    private ResourceDTO testResource;

    @BeforeEach
    void setUp() {
        testResource = ResourceDTO.builder()
                .id(1L)
                .name("Fire Hose")
                .type("EQUIPMENT")
                .status("AVAILABLE")
                .assignedUnitId(1L)
                .assignedEventId(null)
                .build();
    }

    @Test
    void getAll_ShouldReturnResourcesList() throws Exception {
        when(service.getAll()).thenReturn(Arrays.asList(testResource));

        mockMvc.perform(get("/api/resources"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].name").value("Fire Hose"));
    }

    @Test
    void create_ShouldReturnCreatedResource() throws Exception {
        when(service.create(any(ResourceDTO.class))).thenReturn(testResource);

        mockMvc.perform(post("/api/resources")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testResource)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Fire Hose"))
                .andExpect(jsonPath("$.type").value("EQUIPMENT"));
    }

    @Test
    void updateStatus_ShouldReturnUpdatedResource() throws Exception {
        testResource.setStatus("IN_USE");
        when(service.updateStatus(1L, "IN_USE")).thenReturn(testResource);

        mockMvc.perform(put("/api/resources/1/status")
                        .param("status", "IN_USE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_USE"));
    }

    @Test
    void delete_ShouldReturn200() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(delete("/api/resources/1"))
                .andExpect(status().isOk());
    }
}
