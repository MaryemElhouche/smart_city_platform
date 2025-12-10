package com.city.airquality.controller;

import com.city.airquality.dto.ZoneDto;
import com.city.airquality.service.ZoneService;
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
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ZoneController.class)
class ZoneControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ZoneService zoneService;

    @Autowired
    private ObjectMapper objectMapper;

    private ZoneDto testZone;

    @BeforeEach
    void setUp() {
        testZone = new ZoneDto();
        testZone.setId("zone-1");
        testZone.setName("Downtown");
        testZone.setPopulation(50000);
        testZone.setType("urban");
        testZone.setAdminRegion("Central");
        testZone.setAreaKm2(25.5);
        testZone.setUpdatedAt(LocalDateTime.now());
    }

    @Test
    void getAllZones_ShouldReturnZonesList() throws Exception {
        when(zoneService.getAllZones()).thenReturn(Arrays.asList(testZone));

        mockMvc.perform(get("/api/zones"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].name").value("Downtown"));
    }

    @Test
    void getZoneById_WhenExists_ShouldReturnZone() throws Exception {
        when(zoneService.getZoneById("zone-1")).thenReturn(Optional.of(testZone));

        mockMvc.perform(get("/api/zones/zone-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Downtown"));
    }

    @Test
    void getZoneById_WhenNotExists_ShouldReturn404() throws Exception {
        when(zoneService.getZoneById("invalid")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/zones/invalid"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createZone_ShouldReturnCreatedZone() throws Exception {
        when(zoneService.createZone(any(ZoneDto.class))).thenReturn(testZone);

        mockMvc.perform(post("/api/zones")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testZone)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Downtown"));
    }

    @Test
    void updateZone_WhenExists_ShouldReturnUpdatedZone() throws Exception {
        when(zoneService.updateZone(anyString(), any(ZoneDto.class))).thenReturn(Optional.of(testZone));

        mockMvc.perform(put("/api/zones/zone-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testZone)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Downtown"));
    }

    @Test
    void deleteZone_WhenExists_ShouldReturn204() throws Exception {
        when(zoneService.deleteZone("zone-1")).thenReturn(true);

        mockMvc.perform(delete("/api/zones/zone-1"))
                .andExpect(status().isNoContent());
    }
}
