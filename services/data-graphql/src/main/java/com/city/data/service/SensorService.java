package com.city.data.service;

import com.city.data.dto.SensorInput;
import com.city.data.entity.SensorNode;
import com.city.data.repository.SensorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SensorService {

    private final SensorRepository repo;

    public SensorService(SensorRepository repo) {
        this.repo = repo;
    }

    // Récupérer tous les capteurs
    public List<SensorNode> getAllSensors() {
        return repo.findAll();
    }

    // Récupérer un capteur par ID
    public SensorNode getSensorById(Long id) {
        Optional<SensorNode> sensor = repo.findById(id);
        return sensor.orElse(null); // ou lever une exception si préféré
    }

    // Ajouter un capteur (mutation GraphQL)
    public SensorNode createSensor(SensorInput input) {
        SensorNode s = new SensorNode();
        s.setType(input.getType());
        s.setValue(input.getValue());
        s.setTimestamp(input.getTimestamp());
        return repo.save(s);
    }

    // Mettre à jour la valeur d'un capteur
    public SensorNode updateSensorValue(Long id, Double value) {
        SensorNode s = getSensorById(id);
        if (s != null) {
            s.setValue(value);
            return repo.save(s);
        }
        return null; // ou lever une exception
    }
}
