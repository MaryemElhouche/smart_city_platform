package com.city.mobility.service;

import com.city.mobility.dto.StationDTO;
import com.city.mobility.entity.Station;
import com.city.mobility.entity.TransportLine;
import com.city.mobility.repository.StationRepository;
import com.city.mobility.repository.TransportLineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StationService {

    private final StationRepository stationRepository;
    private final TransportLineRepository lineRepository;

    // ------------------ CREATE ------------------
    public StationDTO createStation(StationDTO dto) {
        Station s = new Station();
        s.setName(dto.getName());
        s.setLatitude(dto.getLatitude());
        s.setLongitude(dto.getLongitude());

        if (dto.getLineId() != null) {
            TransportLine line = lineRepository.findById(dto.getLineId()).orElse(null);
            s.setLine(line);
        }

        s = stationRepository.save(s);
        dto.setId(s.getId());
        return dto;
    }

    // ------------------ READ ALL ------------------
    public List<StationDTO> getAllStations() {
        return stationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ------------------ READ BY LINE ------------------
    public List<StationDTO> getStationsByLine(Long lineId) {
        return stationRepository.findByLineId(lineId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // ------------------ READ BY NAME ------------------
    public List<StationDTO> getStationsByNameContaining(String name) {
        return stationRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
// ------------------ READ BY ID ------------------
public StationDTO getStationById(Long id) {
    Station s = stationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Station not found with id: " + id));
    return toDTO(s);
}
 
    // ------------------ UPDATE ------------------
    public StationDTO updateStation(Long id, StationDTO dto) {
        Station s = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        s.setName(dto.getName());
        s.setLatitude(dto.getLatitude());
        s.setLongitude(dto.getLongitude());
        if (dto.getLineId() != null) {
            TransportLine line = lineRepository.findById(dto.getLineId()).orElse(null);
            s.setLine(line);
        }
        stationRepository.save(s);
        dto.setId(s.getId());
        return dto;
    }

    // ------------------ DELETE ------------------
    public void deleteStation(Long id) {
        stationRepository.deleteById(id);
    }

    // ------------------ Mapper: Entity → DTO ------------------
    private StationDTO toDTO(Station s) {
        StationDTO dto = new StationDTO();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setLatitude(s.getLatitude());
        dto.setLongitude(s.getLongitude());
        if (s.getLine() != null) dto.setLineId(s.getLine().getId());
        return dto;
    }
}
