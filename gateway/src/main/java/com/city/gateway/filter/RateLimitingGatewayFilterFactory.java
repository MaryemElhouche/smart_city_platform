package com.city.gateway.filter;

import io.github.resilience4j.ratelimiter.RateLimiter;
import io.github.resilience4j.ratelimiter.RateLimiterConfig;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import io.github.resilience4j.reactor.ratelimiter.operator.RateLimiterOperator;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Component
public class RateLimitingGatewayFilterFactory extends AbstractGatewayFilterFactory<RateLimitingGatewayFilterFactory.Config> {

    private final RateLimiterRegistry rateLimiterRegistry;

    public RateLimitingGatewayFilterFactory() {
        super(Config.class);
        
        RateLimiterConfig config = RateLimiterConfig.custom()
            .limitRefreshPeriod(Duration.ofSeconds(1))
            .limitForPeriod(10)
            .timeoutDuration(Duration.ofMillis(100))
            .build();
            
        this.rateLimiterRegistry = RateLimiterRegistry.of(config);
    }

    @Override
    public GatewayFilter apply(Config config) {
        RateLimiter rateLimiter = rateLimiterRegistry.rateLimiter("gateway-rate-limiter");
        
        return (exchange, chain) -> {
            return Mono.just(exchange)
                .transformDeferred(RateLimiterOperator.of(rateLimiter))
                .flatMap(chain::filter)
                .onErrorResume(throwable -> {
                    exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                    return exchange.getResponse().setComplete();
                });
        };
    }

    public static class Config {
        // Configuration properties if needed
    }
}
