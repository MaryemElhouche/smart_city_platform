package com.city.mobility.dto;

import lombok.Data;
import java.util.List;

@Data
public class TransportLineDTO {
    private Long id;
    private String lineNumber;
    private String type;
    private List<Long> stationIds; // seulement les IDs
}
