package com.city.mobility.repository;

import com.city.mobility.entity.Transport;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportRepository extends JpaRepository<Transport, Long> {

    boolean existsByOriginAndDestinationAndDepartureTime(String origin, String destination, LocalDateTime departureTime);
}
