package com.city.data.controller;

import com.city.data.entity.*;
import com.city.data.service.DataService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.graphql.GraphQlTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.graphql.test.tester.GraphQlTester;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@GraphQlTest(GraphQLController.class)
class GraphQLControllerTest {

    @Autowired
    private GraphQlTester graphQlTester;

    @MockBean
    private DataService dataService;

    private CityOverview testCityOverview;
    private IncidentSummary testIncidentSummary;
    private TravelSuggestions testTravelSuggestions;

    @BeforeEach
    void setUp() {
        // Setup Zone
        Zone zone = new Zone();
        zone.setId("zone-1");
        zone.setName("Downtown");
        zone.setCoordinates("40.7128,-74.0060");

        // Setup CityOverview
        testCityOverview = new CityOverview();
        testCityOverview.setId("overview-1");
        testCityOverview.setZone(zone);
        testCityOverview.setCurrentAQI(75.5);
        testCityOverview.setTrendingPollutants(Arrays.asList("PM2.5", "O3"));
        testCityOverview.setNearestStations(Collections.emptyList());
        testCityOverview.setActiveIncidents(Collections.emptyList());

        // Setup IncidentSummary
        testIncidentSummary = new IncidentSummary();
        testIncidentSummary.setId("incident-1");
        testIncidentSummary.setType("FIRE");
        testIncidentSummary.setLocation("123 Main St");
        testIncidentSummary.setStatus("ACTIVE");
        testIncidentSummary.setEtaOfUnit("5 min");

        // Setup TravelSuggestions
        testTravelSuggestions = new TravelSuggestions();
        testTravelSuggestions.setFromStation("Station A");
        testTravelSuggestions.setToStation("Station B");
        testTravelSuggestions.setRecommendedLine("Line 1");
        testTravelSuggestions.setAirQualityRecommendation("Good air quality along route");
    }

    @Test
    void getCityOverview_ShouldReturnCityOverview() {
        when(dataService.getCityOverview("zone-1")).thenReturn(Optional.of(testCityOverview));

        graphQlTester.document("""
                    query {
                        getCityOverview(zoneId: "zone-1") {
                            zone {
                                id
                                name
                            }
                            currentAQI
                            trendingPollutants
                        }
                    }
                """)
                .execute()
                .path("getCityOverview.zone.name")
                .entity(String.class)
                .isEqualTo("Downtown");
    }

    @Test
    void getCityOverview_WhenNotFound_ShouldReturnNull() {
        when(dataService.getCityOverview("invalid")).thenReturn(Optional.empty());

        graphQlTester.document("""
                    query {
                        getCityOverview(zoneId: "invalid") {
                            zone {
                                id
                            }
                        }
                    }
                """)
                .execute()
                .path("getCityOverview")
                .valueIsNull();
    }

    @Test
    void getTravelSuggestions_ShouldReturnSuggestions() {
        when(dataService.getTravelSuggestions("Station A", "Station B")).thenReturn(Optional.of(testTravelSuggestions));

        graphQlTester.document("""
                    query {
                        getTravelSuggestions(from: "Station A", to: "Station B") {
                            fromStation
                            toStation
                            recommendedLine
                            airQualityRecommendation
                        }
                    }
                """)
                .execute()
                .path("getTravelSuggestions.recommendedLine")
                .entity(String.class)
                .isEqualTo("Line 1");
    }

    @Test
    void getIncidentSummary_ShouldReturnIncident() {
        when(dataService.getIncidentSummary("incident-1")).thenReturn(Optional.of(testIncidentSummary));

        graphQlTester.document("""
                    query {
                        getIncidentSummary(id: "incident-1") {
                            id
                            type
                            location
                            status
                            etaOfUnit
                        }
                    }
                """)
                .execute()
                .path("getIncidentSummary.type")
                .entity(String.class)
                .isEqualTo("FIRE");
    }

    @Test
    void getAllIncidents_ShouldReturnIncidentsList() {
        when(dataService.getAllIncidents()).thenReturn(Arrays.asList(testIncidentSummary));

        graphQlTester.document("""
                    query {
                        getAllIncidents {
                            id
                            type
                            status
                        }
                    }
                """)
                .execute()
                .path("getAllIncidents[0].type")
                .entity(String.class)
                .isEqualTo("FIRE");
    }
}
