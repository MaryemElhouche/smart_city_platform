package com.city.data.repository;

import com.city.data.model.TravelSuggestions;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TravelSuggestionsRepository extends MongoRepository<TravelSuggestions, String> {
    Optional<TravelSuggestions> findByFromStationAndToStation(String fromStation, String toStation);
}
