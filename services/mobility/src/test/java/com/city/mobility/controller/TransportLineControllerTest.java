package com.city.mobility.controller;

import com.city.mobility.dto.TransportLineDTO;
import com.city.mobility.service.TransportLineService;
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

@WebMvcTest(TransportLineController.class)
class TransportLineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransportLineService lineService;

    @Autowired
    private ObjectMapper objectMapper;

    private TransportLineDTO testLine;

    @BeforeEach
    void setUp() {
        testLine = new TransportLineDTO();
        testLine.setId(1L);
        testLine.setLineNumber("Line A");
        testLine.setType("BUS");
        testLine.setStationIds(Arrays.asList(1L, 2L, 3L));
    }

    @Test
    void getAll_ShouldReturnLinesList() throws Exception {
        when(lineService.getAllLines()).thenReturn(Arrays.asList(testLine));

        mockMvc.perform(get("/api/lines"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].lineNumber").value("Line A"));
    }

    @Test
    void getById_ShouldReturnLine() throws Exception {
        when(lineService.getLineById(1L)).thenReturn(testLine);

        mockMvc.perform(get("/api/lines/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lineNumber").value("Line A"))
                .andExpect(jsonPath("$.type").value("BUS"));
    }

    @Test
    void create_ShouldReturnCreatedLine() throws Exception {
        when(lineService.createLine(any(TransportLineDTO.class))).thenReturn(testLine);

        mockMvc.perform(post("/api/lines")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testLine)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lineNumber").value("Line A"));
    }

    @Test
    void update_ShouldReturnUpdatedLine() throws Exception {
        testLine.setLineNumber("Line B");
        when(lineService.updateLine(anyLong(), any(TransportLineDTO.class))).thenReturn(testLine);

        mockMvc.perform(put("/api/lines/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testLine)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lineNumber").value("Line B"));
    }

    @Test
    void delete_ShouldReturn200() throws Exception {
        doNothing().when(lineService).deleteLine(1L);

        mockMvc.perform(delete("/api/lines/1"))
                .andExpect(status().isOk());
    }
}
