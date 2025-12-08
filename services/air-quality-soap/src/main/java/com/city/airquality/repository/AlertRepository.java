package com.city.airquality.repository;

import com.city.airquality.entity.Alert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends MongoRepository<Alert, String> {
    List<Alert> findByZone(String zone);
    List<Alert> findBySeverity(String severity);
    List<Alert> findByResolved(boolean resolved);
    List<Alert> findByZoneAndResolved(String zone, boolean resolved);
}
