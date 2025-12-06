package com.city.airquality.repository;

import com.city.airquality.entity.Sensor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SensorRepository extends MongoRepository<Sensor, String> {
    List<Sensor> findByZone(String zone);
    List<Sensor> findByStatus(String status);
    List<Sensor> findByManufacturer(String manufacturer);
}
