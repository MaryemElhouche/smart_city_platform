package com.city.airquality.repository;

import com.city.airquality.entity.Measurement;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MeasurementRepository extends MongoRepository<Measurement, String> {
    List<Measurement> findByZone(String zone);
    List<Measurement> findBySensorId(String sensorId);
    List<Measurement> findByZoneOrderByMeasurementTimeDesc(String zone);
    Measurement findFirstByZoneOrderByMeasurementTimeDesc(String zone);
}
