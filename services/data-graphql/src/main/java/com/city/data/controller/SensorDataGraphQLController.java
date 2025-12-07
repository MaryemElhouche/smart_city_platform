package com.city.data.controller;

import com.city.data.entity.SensorNode;
import com.city.data.repository.SensorRepository;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.Argument;

import java.util.List;
@Controller
public class SensorDataGraphQLController {

    private final SensorRepository sensorRepository;

    public SensorDataGraphQLController(SensorRepository sensorRepository) {
        this.sensorRepository = sensorRepository;
    }

    @QueryMapping
    public List<SensorNode> getAllSensorData() {
        return sensorRepository.findAll();
    }

    @MutationMapping
    public SensorNode addSensorData(@Argument String type,
                                    @Argument Double value,
                                    @Argument String timestamp) {
        SensorNode sensorNode = new SensorNode();
        sensorNode.setType(type);
        sensorNode.setValue(value);
        sensorNode.setTimestamp(timestamp);
        return sensorRepository.save(sensorNode);
    }
}
