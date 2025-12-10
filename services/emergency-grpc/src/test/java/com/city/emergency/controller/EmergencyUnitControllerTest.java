package com.city.emergency.controller;

import com.city.emergency.dto.EmergencyUnitDTO;
import com.city.emergency.dto.LocationDTO;
import com.city.emergency.service.EmergencyUnitService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmergencyUnitController.class)
class EmergencyUnitControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmergencyUnitService service;

    @Autowired
    private ObjectMapper objectMapper;

    private EmergencyUnitDTO testUnit;

    @BeforeEach
    void setUp() {
        LocationDTO location = LocationDTO.builder()
                .id(1L)
                .latitude(40.7128)
                .longitude(-74.0060)
                .address("Station 5")
                .build();

        testUnit = EmergencyUnitDTO.builder()
                .id(1L)
                .name("Fire Truck 1")
                .type("FIRE")
                .status("AVAILABLE")
                .location(location)
                .resourceIds(Collections.emptyList())
                .incidentLogIds(Collections.emptyList())
                .build();
    }

    @Test
    void getAll_ShouldReturnUnitsList() throws Exception {
        when(service.getAll()).thenReturn(Arrays.asList(testUnit));

        mockMvc.perform(get("/api/units"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].name").value("Fire Truck 1"));
    }

    @Test
    void getById_ShouldReturnUnit() throws Exception {
        when(service.getById(1L)).thenReturn(testUnit);

        mockMvc.perform(get("/api/units/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Fire Truck 1"))
                .andExpect(jsonPath("$.type").value("FIRE"));
    }

    @Test
    void create_ShouldReturnCreatedUnit() throws Exception {
        when(service.create(any(EmergencyUnitDTO.class))).thenReturn(testUnit);

        mockMvc.perform(post("/api/units")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUnit)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Fire Truck 1"));
    }

    @Test
    void updateStatus_ShouldReturnUpdatedUnit() throws Exception {
        testUnit.setStatus("BUSY");
        when(service.updateStatus(1L, "BUSY")).thenReturn(testUnit);

        mockMvc.perform(put("/api/units/1/status")
                        .param("status", "BUSY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("BUSY"));
    }

    @Test
    void delete_ShouldReturn200() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(delete("/api/units/1"))
                .andExpect(status().isOk());
    }
}
