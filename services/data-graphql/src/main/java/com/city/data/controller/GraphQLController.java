package com.city.data.controller;

import com.city.data.model.CityOverview;
import com.city.data.model.IncidentSummary;
import com.city.data.model.TravelSuggestions;
import com.city.data.service.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class GraphQLController {

    @Autowired
    private DataService dataService;

    @QueryMapping
    public CityOverview getCityOverview(@Argument String zoneId) {
        return dataService.getCityOverview(zoneId).orElse(null);
    }

    @QueryMapping
    public TravelSuggestions getTravelSuggestions(@Argument String from, @Argument String to) {
        return dataService.getTravelSuggestions(from, to).orElse(null);
    }

    @QueryMapping
    public IncidentSummary getIncidentSummary(@Argument String id) {
        return dataService.getIncidentSummary(id).orElse(null);
    }

    @QueryMapping
    public List<IncidentSummary> getAllIncidents() {
        return dataService.getAllIncidents();
    }
}
