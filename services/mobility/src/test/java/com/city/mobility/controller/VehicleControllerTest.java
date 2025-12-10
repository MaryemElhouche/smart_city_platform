package com.city.mobility.controller;

import com.city.mobility.dto.VehicleDTO;
import com.city.mobility.service.VehicleService;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VehicleController.class)
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VehicleService vehicleService;

    @Autowired
    private ObjectMapper objectMapper;

    private VehicleDTO testVehicle;

    @BeforeEach
    void setUp() {
        testVehicle = new VehicleDTO();
        testVehicle.setId(1L);
        testVehicle.setRegistrationNumber("BUS-001");
        testVehicle.setCapacity(50);
        testVehicle.setStatus("ACTIVE");
    }

    @Test
    void getAll_ShouldReturnVehiclesList() throws Exception {
        when(vehicleService.getAllVehicles()).thenReturn(Arrays.asList(testVehicle));

        mockMvc.perform(get("/api/vehicles"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].registrationNumber").value("BUS-001"));
    }

    @Test
    void createVehicle_ShouldReturnCreatedVehicle() throws Exception {
        when(vehicleService.saveVehicle(any(VehicleDTO.class))).thenReturn(testVehicle);

        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testVehicle)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.registrationNumber").value("BUS-001"))
                .andExpect(jsonPath("$.capacity").value(50));
    }
}
