package com.city.data.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.city.data.entity.IncidentSummary;

@Repository
public interface IncidentSummaryRepository extends MongoRepository<IncidentSummary, String> {
}
