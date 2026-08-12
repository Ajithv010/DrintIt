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
                                                // PUBLIC
                                                // =========================

                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/users/register")
                                                .permitAll()

                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/auth/login")
                                                .permitAll()

                                                .requestMatchers(
                                                                "/error")
                                                .permitAll()

                                                // =========================
                                                // PRODUCTS
                                                // =========================

                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/products/**")
                                                .hasAnyRole(
                                                                "CUSTOMER",
                                                                "ADMIN")

                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/products/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/products/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers(
                                                                HttpMethod.DELETE,
                                                                "/api/products/**")
                                                .hasRole("ADMIN")

                                                // =========================
                                                // CATEGORIES
                                                // =========================

                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/categories/**")
                                                .hasAnyRole(
                                                                "CUSTOMER",
                                                                "ADMIN")

                                                .requestMatchers(
                                                                HttpMethod.POST,
                                                                "/api/categories/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/categories/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers(
                                                                HttpMethod.DELETE,
                                                                "/api/categories/**")
                                                .hasRole("ADMIN")

                                                // =========================
                                                // CURRENT USER
                                                // =========================

                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/users/me")
                                                .hasAnyRole(
                                                                "CUSTOMER",
                                                                "ADMIN")

                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/users/me")
                                                .hasAnyRole(
                                                                "CUSTOMER",
                                                                "ADMIN")

                                                // =========================
                                                // USER MANAGEMENT
                                                // ADMIN ONLY
                                                // =========================

                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/api/users/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers(
                                                                HttpMethod.PUT,
                                                                "/api/users/**")
                                                .hasRole("ADMIN")

                                                .requestMatchers(
                                                                HttpMethod.DELETE,
                                                                "/api/users/**")
                                                .hasRole("ADMIN")

                                                // =========================
                                                // CART
                                                // CUSTOMER ONLY
                                                // =========================

                                                .requestMatchers(
                                                                "/api/cart/**")
                                                .hasRole("CUSTOMER")

                                                // =========================
                                                // ORDERS
                                                // CUSTOMER ONLY
                                                // =========================

                                                .requestMatchers(
                                                                "/api/orders/**")
                                                .hasRole("CUSTOMER")

                                                // =========================
                                                // PAYMENTS
                                                // CUSTOMER ONLY
                                                // =========================

                                                .requestMatchers(
                                                                "/api/payments/**")
                                                .hasRole("CUSTOMER")

                                                // =========================
                                                // ADDRESSES
                                                // CUSTOMER ONLY
                                                // =========================

                                                .requestMatchers(
                                                                "/api/addresses/**")
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