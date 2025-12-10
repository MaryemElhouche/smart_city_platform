package com.city.airquality.controller;

import com.city.airquality.dto.SensorDto;
import com.city.airquality.service.SensorService;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SensorController.class)
class SensorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SensorService sensorService;

    @Autowired
    private ObjectMapper objectMapper;

    private SensorDto testSensor;

    @BeforeEach
    void setUp() {
        testSensor = new SensorDto();
        testSensor.setId("sensor-1");
        testSensor.setZone("zone-1");
        testSensor.setStatus("active");
    }

    @Test
    void getAllSensors_ShouldReturnSensorsList() throws Exception {
        when(sensorService.getAllSensors()).thenReturn(Arrays.asList(testSensor));

        mockMvc.perform(get("/api/sensors"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value("sensor-1"));
    }

    @Test
    void getSensorById_WhenExists_ShouldReturnSensor() throws Exception {
        when(sensorService.getSensorById("sensor-1")).thenReturn(Optional.of(testSensor));

        mockMvc.perform(get("/api/sensors/sensor-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("sensor-1"));
    }

    @Test
    void getSensorById_WhenNotExists_ShouldReturn404() throws Exception {
        when(sensorService.getSensorById("invalid")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/sensors/invalid"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getSensorsByZone_ShouldReturnSensorsList() throws Exception {
        when(sensorService.getSensorsByZone("zone-1")).thenReturn(Arrays.asList(testSensor));

        mockMvc.perform(get("/api/sensors/zone/zone-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].zone").value("zone-1"));
    }

    @Test
    void createSensor_ShouldReturnCreatedSensor() throws Exception {
        when(sensorService.createSensor(any(SensorDto.class))).thenReturn(testSensor);

        mockMvc.perform(post("/api/sensors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testSensor)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("sensor-1"));
    }

    @Test
    void deleteSensor_WhenExists_ShouldReturn204() throws Exception {
        when(sensorService.deleteSensor("sensor-1")).thenReturn(true);

        mockMvc.perform(delete("/api/sensors/sensor-1"))
                .andExpect(status().isNoContent());
    }
}
