package com.city.airquality.controller;

import com.city.airquality.dto.MeasurementDto;
import com.city.airquality.service.MeasurementService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MeasurementController.class)
class MeasurementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MeasurementService measurementService;

    @Autowired
    private ObjectMapper objectMapper;

    private MeasurementDto testMeasurement;

    @BeforeEach
    void setUp() {
        testMeasurement = new MeasurementDto();
        testMeasurement.setId("measurement-1");
        testMeasurement.setZone("zone-1");
        testMeasurement.setSensorId("sensor-1");
    }

    @Test
    void getAllMeasurements_ShouldReturnMeasurementsList() throws Exception {
        when(measurementService.getAllMeasurements()).thenReturn(Arrays.asList(testMeasurement));

        mockMvc.perform(get("/api/measurements"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value("measurement-1"));
    }

    @Test
    void getMeasurementById_WhenExists_ShouldReturnMeasurement() throws Exception {
        when(measurementService.getMeasurementById("measurement-1")).thenReturn(Optional.of(testMeasurement));

        mockMvc.perform(get("/api/measurements/measurement-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("measurement-1"));
    }

    @Test
    void getMeasurementById_WhenNotExists_ShouldReturn404() throws Exception {
        when(measurementService.getMeasurementById("invalid")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/measurements/invalid"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getMeasurementsByZone_ShouldReturnMeasurementsList() throws Exception {
        when(measurementService.getMeasurementsByZone("zone-1")).thenReturn(Arrays.asList(testMeasurement));

        mockMvc.perform(get("/api/measurements/zone/zone-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].zone").value("zone-1"));
    }

    @Test
    void getMeasurementsBySensor_ShouldReturnMeasurementsList() throws Exception {
        when(measurementService.getMeasurementsBySensor("sensor-1")).thenReturn(Arrays.asList(testMeasurement));

        mockMvc.perform(get("/api/measurements/sensor/sensor-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sensorId").value("sensor-1"));
    }

    @Test
    void createMeasurement_ShouldReturnCreatedMeasurement() throws Exception {
        when(measurementService.createMeasurement(any(MeasurementDto.class))).thenReturn(testMeasurement);

        mockMvc.perform(post("/api/measurements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testMeasurement)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("measurement-1"));
    }

    @Test
    void deleteMeasurement_WhenExists_ShouldReturn204() throws Exception {
        when(measurementService.deleteMeasurement("measurement-1")).thenReturn(true);

        mockMvc.perform(delete("/api/measurements/measurement-1"))
                .andExpect(status().isNoContent());
    }
}
