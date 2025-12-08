package com.city.airquality.repository;

import com.city.airquality.entity.Zone;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ZoneRepository extends MongoRepository<Zone, String> {
    Optional<Zone> findByName(String name);
    List<Zone> findByType(String type);
    List<Zone> findByAdminRegion(String adminRegion);
}
