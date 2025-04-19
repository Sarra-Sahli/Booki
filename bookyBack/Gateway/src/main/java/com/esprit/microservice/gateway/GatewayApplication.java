package com.esprit.microservice.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }


   /*@Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder){
        return builder.routes()
                .route("carts", r->r.path("/carts/**")
                        .uri("http://localhost:8081"))
                .build();
    }



    */

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("cart-service", r -> r.path("/carts/**")
                        .uri("lb://BOOKI"))
                .route("complaint-service", r -> r.path("/api/complaints/**")
                        .uri("lb://complaint-service"))
                .route("book-service", r -> r.path("/**")
                        .uri("lb://GestionLivres"))
                .build();
    }

}



