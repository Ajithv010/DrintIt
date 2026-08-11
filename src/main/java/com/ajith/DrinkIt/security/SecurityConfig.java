package com.ajith.drinkit.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthenticationFilter) {

                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                // =========================
                // 401 UNAUTHORIZED
                // =========================

                AuthenticationEntryPoint authenticationEntryPoint = (request, response, authException) -> {

                        response.setStatus(
                                        HttpStatus.UNAUTHORIZED.value());

                        response.setContentType(
                                        "application/json");

                        response.getWriter().write("""
                                        {
                                            "status": 401,
                                            "error": "Unauthorized",
                                            "message": "Authentication required"
                                        }
                                        """);
                };

                // =========================
                // 403 FORBIDDEN
                // =========================

                AccessDeniedHandler accessDeniedHandler = (request, response, accessDeniedException) -> {

                        response.setStatus(
                                        HttpStatus.FORBIDDEN.value());

                        response.setContentType(
                                        "application/json");

                        response.getWriter().write("""
                                        {
                                            "status": 403,
                                            "error": "Forbidden",
                                            "message": "Access denied"
                                        }
                                        """);
                };

                http
                                // =========================
                                // CSRF
                                // =========================

                                .csrf(csrf -> csrf.disable())

                                // =========================
                                // AUTHORIZATION
                                // =========================

                                .authorizeHttpRequests(auth -> auth

                                                // =========================
                                                // PUBLIC ENDPOINTS
                                                // =========================

                                                .requestMatchers(
                                                                "/api/users/register",
                                                                "/api/auth/login",
                                                                "/error")
                                                .permitAll()

                                                // =========================
                                                // PRODUCTS
                                                // =========================

                                                // CUSTOMER + ADMIN
                                                // View products
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/products/**")
                                                .hasAnyRole("CUSTOMER", "ADMIN")

                                                // ADMIN ONLY
                                                // Create product
                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/products/**")
                                                .hasRole("ADMIN")

                                                // Update product
                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/products/**")
                                                .hasRole("ADMIN")

                                                // Delete product
                                                .requestMatchers(
                                                                HttpMethod.DELETE,
                                                                "/api/products/**")
                                                .hasRole("ADMIN")

                                                // =========================
                                                // CATEGORIES
                                                // =========================

                                                // CUSTOMER + ADMIN
                                                // View categories
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/categories/**")
                                                .hasAnyRole("CUSTOMER", "ADMIN")

                                                // ADMIN ONLY
                                                // Create category
                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/categories/**")
                                                .hasRole("ADMIN")

                                                // Update category
                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/categories/**")
                                                .hasRole("ADMIN")

                                                // Delete category
                                                .requestMatchers(
                                                                HttpMethod.DELETE,
                                                                "/api/categories/**")
                                                .hasRole("ADMIN")

                                                // =========================
                                                // CURRENT USER PROFILE
                                                // =========================

                                                // CUSTOMER + ADMIN
                                                // View own profile
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/users/me")
                                                .hasAnyRole("CUSTOMER", "ADMIN")

                                                // CUSTOMER + ADMIN
                                                // Update own profile
                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/users/me")
                                                .hasAnyRole("CUSTOMER", "ADMIN")

                                                // =========================
                                                // USER MANAGEMENT
                                                // ADMIN ONLY
                                                // =========================

                                                // Get all users / get user by ID
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/users/**")
                                                .hasRole("ADMIN")

                                                // Update user by ID
                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/users/**")
                                                .hasRole("ADMIN")

                                                // Delete user
                                                .requestMatchers(
                                                                HttpMethod.DELETE,
                                                                "/api/users/**")
                                                .hasRole("ADMIN")

                                                // =========================
                                                // CART
                                                // CUSTOMER + ADMIN
                                                // =========================

                                                .requestMatchers(
                                                                "/api/cart/**")
                                                .hasAnyRole("CUSTOMER", "ADMIN")

                                                // =========================
                                                // ORDERS
                                                // CUSTOMER ONLY
                                                // =========================

                                                .requestMatchers(
                                                                "/api/orders/**")
                                                .hasRole("CUSTOMER")
                                                .requestMatchers("/api/admin/orders/**")
                                                .hasRole("ADMIN")
                                                .requestMatchers("/api/payments/**")
                                                .hasRole("CUSTOMER")
                                                .requestMatchers("/api/addresses/**")
                                                .hasRole("CUSTOMER")

                                                // =========================
                                                // EVERYTHING ELSE
                                                // =========================

                                                .anyRequest()
                                                .authenticated())

                                // =========================
                                // EXCEPTION HANDLING
                                // =========================

                                .exceptionHandling(exception -> exception

                                                .authenticationEntryPoint(
                                                                authenticationEntryPoint)

                                                .accessDeniedHandler(
                                                                accessDeniedHandler))

                                // =========================
                                // JWT FILTER
                                // =========================

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class)

                                // =========================
                                // DISABLE BASIC AUTH
                                // =========================

                                .httpBasic(httpBasic -> httpBasic.disable());

                return http.build();
        }
}