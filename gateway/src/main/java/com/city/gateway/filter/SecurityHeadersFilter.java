package com.city.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class SecurityHeadersFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        exchange.getResponse().beforeCommit(() -> {
            HttpHeaders headers = exchange.getResponse().getHeaders();
            String path = exchange.getRequest().getPath().value();
            
            // Add security headers only if not already present
            if (!headers.containsKey("X-Content-Type-Options")) {
                headers.add("X-Content-Type-Options", "nosniff");
            }
            if (!headers.containsKey("X-Frame-Options")) {
                headers.add("X-Frame-Options", "DENY");
            }
            if (!headers.containsKey("X-XSS-Protection")) {
                headers.add("X-XSS-Protection", "1; mode=block");
            }
            if (!headers.containsKey("Strict-Transport-Security")) {
                headers.add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            }
            if (!headers.containsKey("Content-Security-Policy")) {
                // Relaxed CSP for GraphiQL to allow loading from unpkg CDN
                if (path.startsWith("/graphql")) {
                    headers.add("Content-Security-Policy", 
                        "default-src 'self'; " +
                        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; " +
                        "style-src 'self' 'unsafe-inline' https://unpkg.com; " +
                        "img-src 'self' data:; " +
                        "connect-src 'self'");
                } else {
                    headers.add("Content-Security-Policy", "default-src 'self'");
                }
            }
            if (!headers.containsKey("Referrer-Policy")) {
                headers.add("Referrer-Policy", "strict-origin-when-cross-origin");
            }
            if (!headers.containsKey("Permissions-Policy")) {
                headers.add("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
            }
            
            return Mono.empty();
        });
        
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -2;
    }
}
