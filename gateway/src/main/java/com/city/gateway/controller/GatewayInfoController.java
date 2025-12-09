package com.city.gateway.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/gateway")
public class GatewayInfoController {

    @Autowired
    private RouteLocator routeLocator;

    @GetMapping("/info")
    public Map<String, Object> getGatewayInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "Smart City API Gateway");
        info.put("version", "1.0.0");
        info.put("status", "UP");
        info.put("description", "Central API Gateway for Smart City Platform microservices");
        return info;
    }

    @GetMapping("/routes")
    public Flux<Map<String, String>> getRoutes() {
        return routeLocator.getRoutes()
                .map(route -> {
                    Map<String, String> routeInfo = new HashMap<>();
                    routeInfo.put("id", route.getId());
                    routeInfo.put("uri", route.getUri().toString());
                    routeInfo.put("predicates", route.getPredicate().toString());
                    return routeInfo;
                });
    }

    @GetMapping("/services")
    public Map<String, Object> getAvailableServices() {
        Map<String, Object> services = new HashMap<>();
        
        Map<String, String> airQuality = new HashMap<>();
        airQuality.put("name", "Air Quality Service");
        airQuality.put("type", "SOAP");
        airQuality.put("path", "/air-quality/**");
        airQuality.put("port", "8083");
        
        Map<String, String> mobility = new HashMap<>();
        mobility.put("name", "Mobility Service");
        mobility.put("type", "REST");
        mobility.put("path", "/mobility/**");
        mobility.put("port", "8081");
        
        Map<String, String> emergency = new HashMap<>();
        emergency.put("name", "Emergency Service");
        emergency.put("type", "gRPC/HTTP");
        emergency.put("path", "/emergency/**");
        emergency.put("port", "8082");
        
        Map<String, String> dataGraphql = new HashMap<>();
        dataGraphql.put("name", "Data GraphQL Service");
        dataGraphql.put("type", "GraphQL");
        dataGraphql.put("path", "/graphql/**");
        dataGraphql.put("port", "8084");
        
        services.put("air-quality-soap", airQuality);
        services.put("mobility", mobility);
        services.put("emergency-grpc", emergency);
        services.put("data-graphql", dataGraphql);
        
        return services;
    }
}
