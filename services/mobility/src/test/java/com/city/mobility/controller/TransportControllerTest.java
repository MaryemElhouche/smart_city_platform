package com.city.mobility.controller;

import com.city.mobility.dto.TransportDTO;
import com.city.mobility.service.TransportService;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TransportController.class)
class TransportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransportService transportService;

    @Autowired
    private ObjectMapper objectMapper;

    private TransportDTO testTransport;

    @BeforeEach
    void setUp() {
        testTransport = new TransportDTO();
        testTransport.setId(1L);
        testTransport.setOrigin("Station A");
        testTransport.setDestination("Station B");
        testTransport.setDepartureTime(LocalDateTime.now());
        testTransport.setArrivalTime(LocalDateTime.now().plusHours(1));
        testTransport.setStatus("ON_TIME");
        testTransport.setDelayMinutes(0);
        testTransport.setAvailableSeats(30);
        testTransport.setLineId(1L);
        testTransport.setVehicleId(1L);
    }

    @Test
    void getAll_ShouldReturnTransportsList() throws Exception {
        when(transportService.getAllTransports()).thenReturn(Arrays.asList(testTransport));

        mockMvc.perform(get("/api/transports"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].origin").value("Station A"));
    }

    @Test
    void getById_ShouldReturnTransport() throws Exception {
        when(transportService.getTransportById(1L)).thenReturn(testTransport);

        mockMvc.perform(get("/api/transports/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.origin").value("Station A"))
                .andExpect(jsonPath("$.destination").value("Station B"));
    }

    @Test
    void create_ShouldReturnCreatedTransport() throws Exception {
        when(transportService.createTransport(any(TransportDTO.class))).thenReturn(testTransport);

        mockMvc.perform(post("/api/transports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testTransport)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.origin").value("Station A"));
    }

    @Test
    void update_ShouldReturnUpdatedTransport() throws Exception {
        testTransport.setStatus("DELAYED");
        testTransport.setDelayMinutes(10);
        when(transportService.updateTransport(anyLong(), any(TransportDTO.class))).thenReturn(testTransport);

        mockMvc.perform(put("/api/transports/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testTransport)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DELAYED"));
    }

    @Test
    void delete_ShouldReturn200() throws Exception {
        doNothing().when(transportService).deleteTransport(1L);

        mockMvc.perform(delete("/api/transports/1"))
                .andExpect(status().isOk());
    }
}
