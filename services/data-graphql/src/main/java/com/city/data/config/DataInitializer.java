package com.city.data.config;

import com.city.data.entity.*;
import com.city.data.repository.CityOverviewRepository;
import com.city.data.repository.IncidentSummaryRepository;
import com.city.data.repository.TravelSuggestionsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private CityOverviewRepository cityOverviewRepository;

    @Autowired
    private TravelSuggestionsRepository travelSuggestionsRepository;

    @Autowired
    private IncidentSummaryRepository incidentSummaryRepository;

    @Override
    public void run(String... args) {
        try {
            // Check if data already exists to prevent duplication
            if (cityOverviewRepository.count() > 0) {
                logger.info("Data already exists in MongoDB. Skipping initialization.");
                return;
            }
            
            logger.info("Initializing sample data in MongoDB Atlas...");
            initializeData();
            logger.info("Sample data initialized successfully in MongoDB Atlas!");
        } catch (Exception e) {
            logger.warn("Could not initialize sample data in MongoDB: {}. The application will continue without sample data.", e.getMessage());
        }
    }
    
    private void initializeData() {

        // Initialize Zones
        Zone downtownZone = new Zone("zone1", "Downtown", "40.7128,-74.0060");
        Zone suburbanZone = new Zone("zone2", "Suburban", "40.7589,-73.9851");

        // Initialize Stations
        Station station1 = new Station("station1", "Central Station", "Downtown Center");
        Station station2 = new Station("station2", "North Station", "North District");
        Station station3 = new Station("station3", "East Station", "East Side");

        // Initialize Emergency Events
        EmergencyEventSummary event1 = new EmergencyEventSummary("event1", "Fire", "Main Street", "Active");
        EmergencyEventSummary event2 = new EmergencyEventSummary("event2", "Medical", "Park Avenue", "Resolved");

        // Initialize City Overviews
        CityOverview overview1 = new CityOverview(
            "overview1",
            downtownZone,
            75.5,
            Arrays.asList("PM2.5", "NO2", "CO"),
            Arrays.asList(station1, station2),
            Arrays.asList(event1)
        );

        CityOverview overview2 = new CityOverview(
            "overview2",
            suburbanZone,
            45.2,
            Arrays.asList("O3", "PM10"),
            Arrays.asList(station3),
            Arrays.asList(event2)
        );

        cityOverviewRepository.saveAll(Arrays.asList(overview1, overview2));

        // Initialize Travel Suggestions
        TravelSuggestions travel1 = new TravelSuggestions(
            "travel1",
            "Central Station",
            "North Station",
            "Line A",
            "Good air quality - safe to travel"
        );

        TravelSuggestions travel2 = new TravelSuggestions(
            "travel2",
            "North Station",
            "East Station",
            "Line B",
            "Moderate air quality - consider wearing a mask"
        );

        travelSuggestionsRepository.saveAll(Arrays.asList(travel1, travel2));

        // Initialize Incident Summaries
        IncidentSummary incident1 = new IncidentSummary(
            "incident1",
            "Fire",
            "Main Street, Downtown",
            "In Progress",
            "5 minutes"
        );

        IncidentSummary incident2 = new IncidentSummary(
            "incident2",
            "Medical Emergency",
            "Park Avenue, Suburban",
            "Resolved",
            "N/A"
        );

        IncidentSummary incident3 = new IncidentSummary(
            "incident3",
            "Traffic Accident",
            "Highway 101",
            "Active",
            "10 minutes"
        );

        incidentSummaryRepository.saveAll(Arrays.asList(incident1, incident2, incident3));
    }
}
