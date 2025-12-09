package com.city.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class RequestLoggingFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        String timestamp = LocalDateTime.now().format(formatter);
        String method = request.getMethod().toString();
        String path = request.getURI().getPath();
        String clientIp = getClientIp(request);
        
        logger.info("[{}] {} {} from {}", timestamp, method, path, clientIp);
        
        // Add custom headers for tracking
        ServerHttpRequest modifiedRequest = request.mutate()
            .header("X-Request-Time", timestamp)
            .header("X-Client-IP", clientIp)
            .build();
        
        return chain.filter(exchange.mutate().request(modifiedRequest).build());
    }

    private String getClientIp(ServerHttpRequest request) {
        String ip = request.getHeaders().getFirst("X-Forwarded-For");
        if (ip == null || ip.isEmpty()) {
            ip = request.getHeaders().getFirst("X-Real-IP");
        }
        if (ip == null || ip.isEmpty()) {
            ip = request.getRemoteAddress() != null ? 
                request.getRemoteAddress().getAddress().getHostAddress() : "unknown";
        }
        return ip;
    }

    @Override
    public int getOrder() {
        return -1; // Execute before other filters
    }
}
