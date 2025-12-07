package com.city.mobility.repository;

import com.city.mobility.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {

    List<Station> findByLineId(Long lineId);
Optional<Station> findByName(String name);

    // Recherche par nom partiel (ignore la casse)
    List<Station> findByNameContainingIgnoreCase(String name);
}
