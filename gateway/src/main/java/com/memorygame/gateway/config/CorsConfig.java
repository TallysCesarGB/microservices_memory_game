package com.memorygame.gateway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS Configuration para React Native Mobile App
 * 
 * Permite que o app mobile (rodando em Expo) se comunique com o gateway REST.
 * SEM ISSO, a requisição POST /api/auth/login vai falhar com erro CORS.
 * 
 * Cenários:
 * - Android Emulator: http://10.0.2.2:8081 (host visto do emulator)
 * - iOS Simulator: http://localhost:8081
 * - Expo Web: http://localhost:19006
 * - Expo Metro: http://<sua-ip>:8083
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
            .addMapping("/**")
            .allowedOriginPatterns(
                "http://localhost:*",           // Localhost qualquer porta
                "http://127.0.0.1:*",           // IP local
                "http://10.0.2.2:*",            // Android Emulator
                "exp://localhost:*",            // Expo Metro localhost
                "exp://192.168.*.*:*",          // Expo Metro WiFi (192.168.x.x)
                "exp://10.*.*.*:*"              // Expo Metro rede local
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
            .allowedHeaders(
                "Content-Type",
                "Authorization",
                "X-Requested-With",
                "Accept",
                "Origin"
            )
            .allowCredentials(true)
            .maxAge(3600)
            .exposedHeaders(
                "Content-Type",
                "Authorization"
            );
    }
}
