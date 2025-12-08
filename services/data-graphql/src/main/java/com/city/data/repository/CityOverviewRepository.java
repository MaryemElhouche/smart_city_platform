package com.city.data.repository;

import com.city.data.model.CityOverview;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CityOverviewRepository extends MongoRepository<CityOverview, String> {
    Optional<CityOverview> findByZoneId(String zoneId);
}
