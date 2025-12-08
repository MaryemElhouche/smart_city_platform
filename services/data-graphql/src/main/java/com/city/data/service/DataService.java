package com.city.data.service;

import com.city.data.entity.CityOverview;
import com.city.data.entity.IncidentSummary;
import com.city.data.entity.TravelSuggestions;
import com.city.data.repository.CityOverviewRepository;
import com.city.data.repository.IncidentSummaryRepository;
import com.city.data.repository.TravelSuggestionsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DataService {

    @Autowired
    private CityOverviewRepository cityOverviewRepository;

    @Autowired
    private TravelSuggestionsRepository travelSuggestionsRepository;

    @Autowired
    private IncidentSummaryRepository incidentSummaryRepository;

    // CityOverview methods
    public Optional<CityOverview> getCityOverview(String zoneId) {
        return cityOverviewRepository.findByZoneId(zoneId);
    }

    public CityOverview saveCityOverview(CityOverview cityOverview) {
        return cityOverviewRepository.save(cityOverview);
    }

    // TravelSuggestions methods
    public Optional<TravelSuggestions> getTravelSuggestions(String from, String to) {
        return travelSuggestionsRepository.findByFromStationAndToStation(from, to);
    }

    public TravelSuggestions saveTravelSuggestions(TravelSuggestions travelSuggestions) {
        return travelSuggestionsRepository.save(travelSuggestions);
    }

    // IncidentSummary methods
    public Optional<IncidentSummary> getIncidentSummary(String id) {
        return incidentSummaryRepository.findById(id);
    }

    public List<IncidentSummary> getAllIncidents() {
        return incidentSummaryRepository.findAll();
    }

    public IncidentSummary saveIncidentSummary(IncidentSummary incidentSummary) {
        return incidentSummaryRepository.save(incidentSummary);
    }
}
