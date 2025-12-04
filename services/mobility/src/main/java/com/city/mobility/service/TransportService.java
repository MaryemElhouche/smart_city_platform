package com.city.mobility.service;

import com.city.mobility.dto.TransportDTO;
import com.city.mobility.entity.Transport;
import com.city.mobility.repository.TransportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransportService {

    private final TransportRepository transportRepository;

    public List<TransportDTO> getAllTransports() {
        return transportRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public TransportDTO getTransportById(Long id) {
        return transportRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    public List<TransportDTO> getTransportsByLine(String lineNumber) {
        return transportRepository.findByLineNumber(lineNumber).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<TransportDTO> getTransportsByRoute(String origin, String destination) {
        return transportRepository.findByOriginAndDestination(origin, destination).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public TransportDTO createTransport(TransportDTO transportDTO) {
        Transport transport = convertToEntity(transportDTO);
        Transport saved = transportRepository.save(transport);
        return convertToDTO(saved);
    }

    public TransportDTO updateTransport(Long id, TransportDTO transportDTO) {
        return transportRepository.findById(id).map(existing -> {
            existing.setLineNumber(transportDTO.getLineNumber());
            existing.setType(transportDTO.getType());
            existing.setOrigin(transportDTO.getOrigin());
            existing.setDestination(transportDTO.getDestination());
            existing.setDepartureTime(transportDTO.getDepartureTime());
            existing.setArrivalTime(transportDTO.getArrivalTime());
            existing.setStatus(transportDTO.getStatus());
            existing.setDelayMinutes(transportDTO.getDelayMinutes());
            existing.setAvailableSeats(transportDTO.getAvailableSeats());
            return convertToDTO(transportRepository.save(existing));
        }).orElse(null);
    }

    public void deleteTransport(Long id) {
        transportRepository.deleteById(id);
    }

    private TransportDTO convertToDTO(Transport transport) {
        return new TransportDTO(transport.getId(), transport.getLineNumber(), transport.getType(), transport.getOrigin(), transport.getDestination(), transport.getDepartureTime(), transport.getArrivalTime(), transport.getStatus(), transport.getDelayMinutes(), transport.getAvailableSeats());
    }

    private Transport convertToEntity(TransportDTO dto) {
        return new Transport(dto.getId(), dto.getLineNumber(), dto.getType(), dto.getOrigin(), dto.getDestination(), dto.getDepartureTime(), dto.getArrivalTime(), dto.getStatus(), dto.getDelayMinutes(), dto.getAvailableSeats());
    }
}
