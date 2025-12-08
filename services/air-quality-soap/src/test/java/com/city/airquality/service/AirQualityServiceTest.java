package com.city.airquality.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.city.airquality.dto.MeasurementDto;
import com.city.airquality.entity.Measurement;
import com.city.airquality.repository.MeasurementRepository;
import com.city.airquality.service.MeasurementService;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AirQualityServiceTest {

    @Mock
    private MeasurementRepository repository;

    @InjectMocks
    private MeasurementService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetLatestMeasurementByZone() {
        // Arrange
        String zone = "Tunis";
        Measurement entity = new Measurement();
        entity.setZone(zone);
        entity.setAqi(75);
        entity.setPm25(22.5);

        when(repository.findFirstByZoneOrderByMeasurementTimeDesc(zone)).thenReturn(entity);

        // Act
        java.util.Optional<MeasurementDto> result = service.getLatestMeasurementByZone(zone);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(zone, result.get().getZone());
        assertEquals(75, result.get().getAqi());
        verify(repository, times(1)).findFirstByZoneOrderByMeasurementTimeDesc(zone);
    }

    @Test
    void testGetMeasurementsByZone() {
        // Arrange
        String zone = "Tunis";
        Measurement entity1 = new Measurement();
        entity1.setZone(zone);
        entity1.setAqi(75);
        entity1.setPm25(22.5);

        Measurement entity2 = new Measurement();
        entity2.setZone(zone);
        entity2.setAqi(80);
        entity2.setPm25(25.0);

        when(repository.findByZone(zone)).thenReturn(java.util.Arrays.asList(entity1, entity2));

        // Act
        java.util.List<MeasurementDto> result = service.getMeasurementsByZone(zone);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(zone, result.get(0).getZone());
        verify(repository, times(1)).findByZone(zone);
    }
}