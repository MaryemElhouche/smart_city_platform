package com.city.mobility.service;

import com.city.mobility.dto.TransportLineDTO;
import com.city.mobility.entity.TransportLine;
import com.city.mobility.repository.TransportLineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransportLineService {

    private final TransportLineRepository lineRepository;

    public TransportLineDTO createLine(TransportLineDTO dto) {
        TransportLine line = new TransportLine();
        line.setLineNumber(dto.getLineNumber());
        line.setType(dto.getType());
        line = lineRepository.save(line);
        dto.setId(line.getId());
        return dto;
    }

    public TransportLineDTO updateLine(Long id, TransportLineDTO dto) {
        TransportLine line = lineRepository.findById(id).orElseThrow(() -> new RuntimeException("Line not found"));
        line.setLineNumber(dto.getLineNumber());
        line.setType(dto.getType());
        lineRepository.save(line);
        dto.setId(line.getId());
        return dto;
    }

    public List<TransportLineDTO> getAllLines() {
        return lineRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TransportLineDTO getLineById(Long id) {
        return lineRepository.findById(id).map(this::toDTO).orElse(null);
    }

    public void deleteLine(Long id) {
        lineRepository.deleteById(id);
    }

    private TransportLineDTO toDTO(TransportLine line) {
        TransportLineDTO dto = new TransportLineDTO();
        dto.setId(line.getId());
        dto.setLineNumber(line.getLineNumber());
        dto.setType(line.getType());
        return dto;
    }
}
