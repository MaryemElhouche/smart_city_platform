package com.city.emergency.controller;

import com.city.emergency.dto.EmergencyEventDTO;
import com.city.emergency.dto.LocationDTO;
import com.city.emergency.service.EmergencyEventService;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmergencyEventController.class)
class EmergencyEventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmergencyEventService service;

    @Autowired
    private ObjectMapper objectMapper;

    private EmergencyEventDTO testEvent;

    @BeforeEach
    void setUp() {
        LocationDTO location = LocationDTO.builder()
                .id(1L)
                .latitude(40.7128)
                .longitude(-74.0060)
                .address("123 Main St")
                .build();

        testEvent = new EmergencyEventDTO();
        testEvent.setId(1L);
        testEvent.setDescription("Fire at downtown building");
        testEvent.setSeverity("HIGH");
        testEvent.setStatus("ACTIVE");
        testEvent.setLocation(location);
    }

    @Test
    void getAll_ShouldReturnEventsList() throws Exception {
        when(service.getAll()).thenReturn(Arrays.asList(testEvent));

        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].description").value("Fire at downtown building"));
    }

    @Test
    void getById_ShouldReturnEvent() throws Exception {
        when(service.getById(1L)).thenReturn(testEvent);

        mockMvc.perform(get("/api/events/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Fire at downtown building"))
                .andExpect(jsonPath("$.severity").value("HIGH"));
    }

    @Test
    void create_ShouldReturnCreatedEvent() throws Exception {
        when(service.create(any(EmergencyEventDTO.class))).thenReturn(testEvent);

        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testEvent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Fire at downtown building"));
    }

    @Test
    void assignUnit_ShouldReturnUpdatedEvent() throws Exception {
        testEvent.setAssignedUnitId(5L);
        when(service.assignUnit(1L, 5L)).thenReturn(testEvent);

        mockMvc.perform(put("/api/events/1/assign/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assignedUnitId").value(5));
    }

    @Test
    void delete_ShouldReturn200() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(delete("/api/events/1"))
                .andExpect(status().isOk());
    }
}
