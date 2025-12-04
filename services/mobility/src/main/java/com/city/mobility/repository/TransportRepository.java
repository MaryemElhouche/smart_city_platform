package com.city.mobility.repository;

import com.city.mobility.entity.Transport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransportRepository extends JpaRepository<Transport, Long> {
    List<Transport> findByLineNumber(String lineNumber);
    List<Transport> findByType(String type);
    List<Transport> findByOriginAndDestination(String origin, String destination);
    List<Transport> findByStatus(String status);
}
