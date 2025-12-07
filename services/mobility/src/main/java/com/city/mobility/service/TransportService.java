package com.city.mobility.service;

import com.city.mobility.dto.TransportDTO;
import com.city.mobility.entity.Transport;
import com.city.mobility.entity.TransportLine;
import com.city.mobility.entity.Vehicle;
import com.city.mobility.repository.TransportRepository;
import com.city.mobility.repository.TransportLineRepository;
import com.city.mobility.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransportService {

    private final TransportRepository transportRepository;
    private final TransportLineRepository lineRepository;
    private final VehicleRepository vehicleRepository;

    // CREATE
    public TransportDTO createTransport(TransportDTO dto) {
        Transport t = new Transport();
        t.setOrigin(dto.getOrigin());
        t.setDestination(dto.getDestination());
        t.setDepartureTime(dto.getDepartureTime());
        t.setArrivalTime(dto.getArrivalTime());
        t.setStatus(dto.getStatus());
        t.setDelayMinutes(dto.getDelayMinutes());
        t.setAvailableSeats(dto.getAvailableSeats());

        // map TransportLine
        if (dto.getLineId() != null) {
            TransportLine line = lineRepository.findById(dto.getLineId()).orElse(null);
            t.setTransportLine(line);
        }

        // map Vehicle
        if (dto.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId()).orElse(null);
            t.setVehicle(vehicle);
        }

        t = transportRepository.save(t);
        dto.setId(t.getId());
        return dto;
    }

    // READ ALL
    public List<TransportDTO> getAllTransports() {
        return transportRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // READ ONE
    public TransportDTO getTransportById(Long id) {
        return transportRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    // UPDATE
    public TransportDTO updateTransport(Long id, TransportDTO dto) {
        Transport t = transportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transport not found"));

        t.setOrigin(dto.getOrigin());
        t.setDestination(dto.getDestination());
        t.setDepartureTime(dto.getDepartureTime());
        t.setArrivalTime(dto.getArrivalTime());
        t.setStatus(dto.getStatus());
        t.setDelayMinutes(dto.getDelayMinutes());
        t.setAvailableSeats(dto.getAvailableSeats());

        if (dto.getLineId() != null) {
            TransportLine line = lineRepository.findById(dto.getLineId()).orElse(null);
            t.setTransportLine(line);
        }

        if (dto.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId()).orElse(null);
            t.setVehicle(vehicle);
        }

        transportRepository.save(t);
        dto.setId(t.getId());
        return dto;
    }

    // DELETE
    public void deleteTransport(Long id) {
        transportRepository.deleteById(id);
    }

    // Helper DTO mapping
    private TransportDTO toDTO(Transport t) {
        TransportDTO dto = new TransportDTO();
        dto.setId(t.getId());
        dto.setOrigin(t.getOrigin());
        dto.setDestination(t.getDestination());
        dto.setDepartureTime(t.getDepartureTime());
        dto.setArrivalTime(t.getArrivalTime());
        dto.setStatus(t.getStatus());
        dto.setDelayMinutes(t.getDelayMinutes());
        dto.setAvailableSeats(t.getAvailableSeats());
        if (t.getTransportLine() != null) dto.setLineId(t.getTransportLine().getId());
        if (t.getVehicle() != null) dto.setVehicleId(t.getVehicle().getId());
        return dto;
    }
}
