package com.city.data.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.city.data.entity.CityOverview;

import java.util.Optional;

@Repository
public interface CityOverviewRepository extends MongoRepository<CityOverview, String> {
    Optional<CityOverview> findByZoneId(String zoneId);
}
