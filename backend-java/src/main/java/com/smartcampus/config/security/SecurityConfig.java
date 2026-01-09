package com.smartcampus.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SecurityConfig {
    
    @Bean
    public String dummySecurityBean() {
        // This is a placeholder for actual security configuration logic
        // which would include JWT filters, authentication providers, etc.
        return "SecurityInitialized";
    }
}
