package com.city.data.repository;

import com.city.data.model.IncidentSummary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentSummaryRepository extends MongoRepository<IncidentSummary, String> {
}
