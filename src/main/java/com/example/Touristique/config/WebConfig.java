package com.example.Touristique.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadDir = "file:/C:/Users/YCode/Desktop/Touristique/uploads/services/";
        System.out.println("Mapping /uploads/services/** to " + uploadDir);
        registry.addResourceHandler("/uploads/services/**")
                .addResourceLocations(uploadDir)
                .setCachePeriod(0);
    }
}