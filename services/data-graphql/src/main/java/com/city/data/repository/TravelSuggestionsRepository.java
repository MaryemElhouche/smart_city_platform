package com.city.data.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.city.data.entity.TravelSuggestions;

import java.util.Optional;

@Repository
public interface TravelSuggestionsRepository extends MongoRepository<TravelSuggestions, String> {
    Optional<TravelSuggestions> findByFromStationAndToStation(String fromStation, String toStation);
}
