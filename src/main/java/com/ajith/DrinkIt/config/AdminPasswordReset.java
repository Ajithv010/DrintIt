package com.ajith.drinkit.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.repository.UserRepository;

@Configuration
public class AdminPasswordReset {

    @Bean
    CommandLineRunner resetAdminPassword(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            User admin = userRepository
                    .findByEmail("drinkit.admin@gmail.com")
                    .orElseThrow(() -> new RuntimeException(
                            "Admin user not found"));

            admin.setPassword(
                    passwordEncoder.encode("Admin@123"));

            userRepository.save(admin);

            System.out.println(
                    "=================================");
            System.out.println(
                    "ADMIN PASSWORD RESET SUCCESSFUL");
            System.out.println(
                    "Email: drinkit.admin@gmail.com");
            System.out.println(
                    "Password: Admin@123");
            System.out.println(
                    "=================================");
        };
    }
}