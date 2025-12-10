package com.city.mobility.controller;

import com.city.mobility.dto.StationDTO;
import com.city.mobility.service.StationService;
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

@WebMvcTest(StationController.class)
class StationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StationService stationService;

    @Autowired
    private ObjectMapper objectMapper;

    private StationDTO testStation;

    @BeforeEach
    void setUp() {
        testStation = new StationDTO();
        testStation.setId(1L);
        testStation.setName("Central Station");
        testStation.setLatitude(40.7128);
        testStation.setLongitude(-74.0060);
        testStation.setLineId(1L);
    }

    @Test
    void getAll_ShouldReturnStationsList() throws Exception {
        when(stationService.getAllStations()).thenReturn(Arrays.asList(testStation));

        mockMvc.perform(get("/api/stations"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].name").value("Central Station"));
    }

    @Test
    void getById_ShouldReturnStation() throws Exception {
        when(stationService.getStationById(1L)).thenReturn(testStation);

        mockMvc.perform(get("/api/stations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Central Station"))
                .andExpect(jsonPath("$.latitude").value(40.7128));
    }

    @Test
    void getByLine_ShouldReturnStationsList() throws Exception {
        when(stationService.getStationsByLine(1L)).thenReturn(Arrays.asList(testStation));

        mockMvc.perform(get("/api/stations/line/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].lineId").value(1));
    }

    @Test
    void searchByName_ShouldReturnStationsList() throws Exception {
        when(stationService.getStationsByNameContaining("Central")).thenReturn(Arrays.asList(testStation));

        mockMvc.perform(get("/api/stations/search")
                        .param("name", "Central"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Central Station"));
    }

    @Test
    void create_ShouldReturnCreatedStation() throws Exception {
        when(stationService.createStation(any(StationDTO.class))).thenReturn(testStation);

        mockMvc.perform(post("/api/stations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testStation)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Central Station"));
    }

    @Test
    void update_ShouldReturnUpdatedStation() throws Exception {
        testStation.setName("Updated Station");
        when(stationService.updateStation(anyLong(), any(StationDTO.class))).thenReturn(testStation);

        mockMvc.perform(put("/api/stations/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testStation)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Station"));
    }

    @Test
    void delete_ShouldReturn204() throws Exception {
        doNothing().when(stationService).deleteStation(1L);

        mockMvc.perform(delete("/api/stations/1"))
                .andExpect(status().isNoContent());
    }
}
