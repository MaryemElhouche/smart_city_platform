package com.city.airquality.controller;

import com.city.airquality.dto.AlertDto;
import com.city.airquality.service.AlertService;
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

@WebMvcTest(AlertController.class)
class AlertControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AlertService alertService;

    @Autowired
    private ObjectMapper objectMapper;

    private AlertDto testAlert;

    @BeforeEach
    void setUp() {
        testAlert = new AlertDto();
        testAlert.setId("alert-1");
        testAlert.setZone("zone-1");
        testAlert.setSeverity("HIGH");
    }

    @Test
    void getAllAlerts_ShouldReturnAlertsList() throws Exception {
        when(alertService.getAllAlerts()).thenReturn(Arrays.asList(testAlert));

        mockMvc.perform(get("/api/alerts"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].id").value("alert-1"));
    }

    @Test
    void getAlertById_WhenExists_ShouldReturnAlert() throws Exception {
        when(alertService.getAlertById("alert-1")).thenReturn(Optional.of(testAlert));

        mockMvc.perform(get("/api/alerts/alert-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("alert-1"));
    }

    @Test
    void getAlertById_WhenNotExists_ShouldReturn404() throws Exception {
        when(alertService.getAlertById("invalid")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/alerts/invalid"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAlertsByZone_ShouldReturnAlertsList() throws Exception {
        when(alertService.getAlertsByZone("zone-1")).thenReturn(Arrays.asList(testAlert));

        mockMvc.perform(get("/api/alerts/zone/zone-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].zone").value("zone-1"));
    }

    @Test
    void getAlertsBySeverity_ShouldReturnAlertsList() throws Exception {
        when(alertService.getAlertsBySeverity("HIGH")).thenReturn(Arrays.asList(testAlert));

        mockMvc.perform(get("/api/alerts/severity/HIGH"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].severity").value("HIGH"));
    }

    @Test
    void getUnresolvedAlerts_ShouldReturnAlertsList() throws Exception {
        when(alertService.getUnresolvedAlerts()).thenReturn(Arrays.asList(testAlert));

        mockMvc.perform(get("/api/alerts/unresolved"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("alert-1"));
    }

    @Test
    void createAlert_ShouldReturnCreatedAlert() throws Exception {
        when(alertService.createAlert(any(AlertDto.class))).thenReturn(testAlert);

        mockMvc.perform(post("/api/alerts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testAlert)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("alert-1"));
    }

    @Test
    void resolveAlert_WhenExists_ShouldReturnResolvedAlert() throws Exception {
        when(alertService.resolveAlert("alert-1")).thenReturn(Optional.of(testAlert));

        mockMvc.perform(put("/api/alerts/alert-1/resolve"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("alert-1"));
    }

    @Test
    void deleteAlert_WhenExists_ShouldReturn204() throws Exception {
        when(alertService.deleteAlert("alert-1")).thenReturn(true);

        mockMvc.perform(delete("/api/alerts/alert-1"))
                .andExpect(status().isNoContent());
    }
}
