package com.city.data.repository;

import com.city.data.entity.SensorNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface SensorRepository extends Neo4jRepository<SensorNode, Long> {
}
