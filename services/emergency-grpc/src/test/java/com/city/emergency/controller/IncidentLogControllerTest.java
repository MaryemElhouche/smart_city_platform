package com.city.emergency.controller;

import com.city.emergency.dto.IncidentLogDTO;
import com.city.emergency.service.IncidentLogService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IncidentLogController.class)
class IncidentLogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IncidentLogService service;

    @Autowired
    private ObjectMapper objectMapper;

    private IncidentLogDTO testLog;

    @BeforeEach
    void setUp() {
        testLog = IncidentLogDTO.builder()
                .id(1L)
                .message("Unit dispatched to location")
                .timestamp(LocalDateTime.now())
                .eventId(1L)
                .unitId(2L)
                .resourceId(3L)
                .build();
    }

    @Test
    void getAll_ShouldReturnLogsList() throws Exception {
        when(service.getAll()).thenReturn(Arrays.asList(testLog));

        mockMvc.perform(get("/api/logs"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].message").value("Unit dispatched to location"));
    }

    @Test
    void getById_ShouldReturnLog() throws Exception {
        when(service.getById(1L)).thenReturn(testLog);

        mockMvc.perform(get("/api/logs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Unit dispatched to location"));
    }

    @Test
    void create_ShouldReturnCreatedLog() throws Exception {
        when(service.create(any(IncidentLogDTO.class))).thenReturn(testLog);

        mockMvc.perform(post("/api/logs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testLog)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Unit dispatched to location"));
    }

    @Test
    void update_ShouldReturnUpdatedLog() throws Exception {
        testLog.setMessage("Updated message");
        when(service.update(any(IncidentLogDTO.class))).thenReturn(testLog);

        mockMvc.perform(put("/api/logs/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testLog)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Updated message"));
    }

    @Test
    void delete_ShouldReturn200() throws Exception {
        doNothing().when(service).delete(1L);

        mockMvc.perform(delete("/api/logs/1"))
                .andExpect(status().isOk());
    }
}
