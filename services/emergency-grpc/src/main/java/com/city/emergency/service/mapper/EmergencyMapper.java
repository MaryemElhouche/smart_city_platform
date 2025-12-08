package com.city.emergency.service.mapper;

import com.city.emergency.entity.*;
import com.city.emergency.grpc.*;
import com.city.emergency.dto.*;

import org.springframework.stereotype.Component;
import com.google.protobuf.Timestamp;
import java.time.ZoneId;
import java.time.Instant;

@Component

public class EmergencyMapper {

    // -------- LOCATION --------
    public LocationMessage toLocationMessage(Location entity) {
        if (entity == null) return null;

        return LocationMessage.newBuilder()
                .setId(entity.getId())
                .setLatitude(entity.getLatitude())
                .setLongitude(entity.getLongitude())
                .setAddress(entity.getAddress())
                .build();
    }

    public Location toLocationEntity(LocationMessage msg) {
        if (msg == null) return null;

        return Location.builder()
                .id(msg.getId())
                .latitude(msg.getLatitude())
                .longitude(msg.getLongitude())
                .address(msg.getAddress())
                .build();
    }

    // -------- EMERGENCY EVENT --------
    public EmergencyEventResponse toEventResponse(EmergencyEvent event) {
        if (event == null) return null;

        EmergencyEventResponse.Builder b = EmergencyEventResponse.newBuilder()
                .setId(event.getId())
                .setTitle(event.getTitle())
                .setDescription(event.getDescription() == null ? "" : event.getDescription())
                .setSeverity(event.getSeverity())
                .setStatus(event.getStatus());

        if (event.getAssignedUnit() != null)
            b.setAssignedUnitId(event.getAssignedUnit().getId());

        if (event.getLocation() != null)
            b.setLocation(toLocationMessage(event.getLocation()));

        return b.build();
    }

    public EmergencyEvent toEventEntity(CreateEmergencyEventRequest req) {
        if (req == null) return null;

        EmergencyEvent e = new EmergencyEvent();
        e.setTitle(req.getTitle());
        e.setDescription(req.getDescription());
        e.setSeverity(req.getSeverity());
        e.setStatus(req.getStatus());
        e.setLocation(toLocationEntity(req.getLocation()));

        return e; // assignedUnit handled in service
    }

    // -------- UNIT --------
    public EmergencyUnitResponse toUnitResponse(EmergencyUnit unit) {
        if (unit == null) return null;

        EmergencyUnitResponse.Builder b = EmergencyUnitResponse.newBuilder()
                .setId(unit.getId())
                .setName(unit.getName())
                .setType(unit.getType())
                .setStatus(unit.getStatus());

        if (unit.getCurrentLocation() != null)
            b.setCurrentLocation(toLocationMessage(unit.getCurrentLocation()));

        // resource ids
        if (unit.getResources() != null)
            unit.getResources().forEach(r -> b.addResourceIds(r.getId()));

        // log ids
        if (unit.getIncidentLogs() != null)
            unit.getIncidentLogs().forEach(l -> b.addIncidentLogIds(l.getId()));

        return b.build();
    }

    public EmergencyUnit toUnitEntity(CreateEmergencyUnitRequest req) {
        if (req == null) return null;

        EmergencyUnit u = new EmergencyUnit();
        u.setName(req.getName());
        u.setType(req.getType());
        u.setStatus(req.getStatus());

        // relations set in service layer
        return u;
    }

    // -------- RESOURCE --------
    public ResourceResponse toResourceResponse(Resource r) {
        if (r == null) return null;

        ResourceResponse.Builder b = ResourceResponse.newBuilder()
                .setId(r.getId())
                .setName(r.getName())
                .setType(r.getType())
                .setStatus(r.getStatus());

        if (r.getAssignedUnit() != null)
            b.setAssignedUnitId(r.getAssignedUnit().getId());

        if (r.getAssignedEvent() != null)
            b.setAssignedEventId(r.getAssignedEvent().getId());

        return b.build();
    }

    public Resource toResourceEntity(CreateResourceRequest req) {
        if (req == null) return null;

        Resource r = new Resource();
        r.setName(req.getName());
        r.setType(req.getType());
        r.setStatus(req.getStatus());
        return r;  // assignedUnit + assignedEvent handled in service
    }

    // -------- INCIDENT LOG --------
    public IncidentLogResponse toIncidentLogResponse(IncidentLog log) {
        if (log == null) return null;

        IncidentLogResponse.Builder b = IncidentLogResponse.newBuilder()
                .setId(log.getId())
                .setMessage(log.getMessage())
                ;

        if (log.getTimestamp() != null) {
            Instant instant = log.getTimestamp().atZone(ZoneId.systemDefault()).toInstant();
            Timestamp ts = Timestamp.newBuilder()
                    .setSeconds(instant.getEpochSecond())
                    .setNanos(instant.getNano())
                    .build();
            b.setTimestamp(ts);
        }

        if (log.getEvent() != null)
            b.setEventId(log.getEvent().getId());

        if (log.getUnit() != null)
            b.setUnitId(log.getUnit().getId());

        if (log.getResource() != null)
            b.setResourceId(log.getResource().getId());

        return b.build();
    }

    public IncidentLog toIncidentLogEntity(CreateIncidentLogRequest req) {
        if (req == null) return null;

        IncidentLog i = new IncidentLog();
        i.setMessage(req.getMessage());
        // timestamp, event, unit, resource set in service
        return i;
    }

    // ---------------------------
    // DTO <-> ENTITY helpers used by REST/service layer
    // ---------------------------
    public LocationDTO toLocationDTO(Location entity) {
        if (entity == null) return null;
        return LocationDTO.builder()
                .id(entity.getId())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .address(entity.getAddress())
                .build();
    }

    public Location toLocationEntity(LocationDTO dto) {
        if (dto == null) return null;
        Location l = new Location();
        l.setId(dto.getId());
        l.setLatitude(dto.getLatitude());
        l.setLongitude(dto.getLongitude());
        l.setAddress(dto.getAddress());
        return l;
    }

    public EmergencyUnit toEmergencyUnitEntity(EmergencyUnitDTO dto) {
        if (dto == null) return null;
        EmergencyUnit u = new EmergencyUnit();
        u.setName(dto.getName());
        u.setType(dto.getType());
        u.setStatus(dto.getStatus());
        return u;
    }

    public EmergencyUnitDTO toEmergencyUnitDTO(EmergencyUnit unit) {
        if (unit == null) return null;
        EmergencyUnitDTO.EmergencyUnitDTOBuilder b = EmergencyUnitDTO.builder()
                .id(unit.getId())
                .name(unit.getName())
                .type(unit.getType())
                .status(unit.getStatus())
                .location(toLocationDTO(unit.getCurrentLocation()));

        if (unit.getResources() != null)
            b.resourceIds(unit.getResources().stream().map(r -> r.getId()).toList());

        if (unit.getIncidentLogs() != null)
            b.incidentLogIds(unit.getIncidentLogs().stream().map(lg -> lg.getId()).toList());

        return b.build();
    }

    public Resource toResourceEntity(ResourceDTO dto, EmergencyUnit unit, EmergencyEvent event) {
        if (dto == null) return null;
        Resource r = new Resource();
        r.setName(dto.getName());
        r.setType(dto.getType());
        r.setStatus(dto.getStatus());
        if (unit != null) r.setAssignedUnit(unit);
        if (event != null) r.setAssignedEvent(event);
        return r;
    }

    public ResourceDTO toResourceDTO(Resource r) {
        if (r == null) return null;
        return ResourceDTO.builder()
                .id(r.getId())
                .name(r.getName())
                .type(r.getType())
                .status(r.getStatus())
                .assignedUnitId(r.getAssignedUnit() != null ? r.getAssignedUnit().getId() : null)
                .assignedEventId(r.getAssignedEvent() != null ? r.getAssignedEvent().getId() : null)
                .build();
    }
}
