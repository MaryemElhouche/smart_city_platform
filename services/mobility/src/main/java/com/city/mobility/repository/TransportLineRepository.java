package com.city.mobility.repository;

import com.city.mobility.entity.TransportLine;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportLineRepository extends JpaRepository<TransportLine, Long> {


    Optional<TransportLine> findByLineNumber(String lineNumber);    
}
