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

                // ========================================
                // 401 UNAUTHORIZED
                // ========================================

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

                // ========================================
                // 403 FORBIDDEN
                // ========================================

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
                                // ========================================
                                // CSRF
                                // ========================================

                                .csrf(csrf -> csrf.disable())

                                // ========================================
                                // AUTHORIZATION
                                // ========================================

                                .authorizeHttpRequests(auth -> {

                                        // ====================================
                                        // PUBLIC
                                        // ====================================

                                        auth.requestMatchers(
                                                        HttpMethod.POST,
                                                        "/api/users/register").permitAll();

                                        auth.requestMatchers(
                                                        HttpMethod.POST,
                                                        "/api/auth/login").permitAll();

                                        auth.requestMatchers(
                                                        "/error").permitAll();

                                        // ====================================
                                        // PRODUCTS
                                        // ====================================

                                        auth.requestMatchers(
                                                        HttpMethod.GET,
                                                        "/api/products/**").permitAll();

                                        auth.requestMatchers(
                                                        HttpMethod.POST,
                                                        "/api/products/**").hasRole("ADMIN");

                                        auth.requestMatchers(
                                                        HttpMethod.PUT,
                                                        "/api/products/**").hasRole("ADMIN");

                                        auth.requestMatchers(
                                                        HttpMethod.DELETE,
                                                        "/api/products/**").hasRole("ADMIN");

                                        // ====================================
                                        // CATEGORIES
                                        // ====================================

                                        auth.requestMatchers(
                                                        HttpMethod.GET,
                                                        "/api/categories/**").permitAll();

                                        auth.requestMatchers(
                                                        HttpMethod.POST,
                                                        "/api/categories/**").hasRole("ADMIN");

                                        auth.requestMatchers(
                                                        HttpMethod.PUT,
                                                        "/api/categories/**").hasRole("ADMIN");

                                        auth.requestMatchers(
                                                        HttpMethod.DELETE,
                                                        "/api/categories/**").hasRole("ADMIN");

                                        // ====================================
                                        // CURRENT USER
                                        // ====================================

                                        auth.requestMatchers(
                                                        HttpMethod.GET,
                                                        "/api/users/me").hasAnyRole(
                                                                        "CUSTOMER",
                                                                        "ADMIN");

                                        auth.requestMatchers(
                                                        HttpMethod.PUT,
                                                        "/api/users/me").hasAnyRole(
                                                                        "CUSTOMER",
                                                                        "ADMIN");

                                        // ====================================
                                        // USER MANAGEMENT
                                        // ADMIN ONLY
                                        // ====================================

                                        auth.requestMatchers(
                                                        HttpMethod.GET,
                                                        "/api/users/**").hasRole("ADMIN");

                                        auth.requestMatchers(
                                                        HttpMethod.PUT,
                                                        "/api/users/**").hasRole("ADMIN");

                                        auth.requestMatchers(
                                                        HttpMethod.DELETE,
                                                        "/api/users/**").hasRole("ADMIN");

                                        // ====================================
                                        // ADMIN APIs
                                        // ====================================

                                        auth.requestMatchers(
                                                        "/api/admin/**").hasRole("ADMIN");

                                        // ====================================
                                        // ADMIN ORDERS
                                        // ====================================

                                        auth.requestMatchers(
                                                        HttpMethod.GET,
                                                        "/api/orders/admin/all").hasRole("ADMIN");

                                        auth.requestMatchers(
                                                        HttpMethod.GET,
                                                        "/api/orders/admin/**").hasRole("ADMIN");

                                        auth.requestMatchers(
                                                        HttpMethod.PUT,
                                                        "/api/orders/*/status").hasRole("ADMIN");

                                        // ====================================
                                        // CART
                                        // ====================================

                                        auth.requestMatchers(
                                                        "/api/cart/**").hasRole("CUSTOMER");

                                        // ====================================
                                        // CUSTOMER - PLACE ORDER
                                        // ====================================

                                        auth.requestMatchers(
                                                        HttpMethod.POST,
                                                        "/api/orders").hasRole("CUSTOMER");

                                        // ====================================
                                        // CUSTOMER - CANCEL ORDER
                                        // ====================================

                                        auth.requestMatchers(
                                                        HttpMethod.DELETE,
                                                        "/api/orders/**").hasRole("CUSTOMER");

                                        auth.requestMatchers(
                                                        HttpMethod.PUT,
                                                        "/api/orders/*/cancel").hasRole("CUSTOMER");

                                        // ====================================
                                        // CUSTOMER - READ ORDERS
                                        // ====================================

                                        auth.requestMatchers(
                                                        HttpMethod.GET,
                                                        "/api/orders/**").hasAnyRole(
                                                                        "CUSTOMER",
                                                                        "ADMIN");

                                        // ====================================
                                        // PAYMENTS
                                        // ====================================

                                        auth.requestMatchers(
                                                        "/api/payments/**").hasRole("CUSTOMER");

                                        // ====================================
                                        // ADDRESSES
                                        // ====================================

                                        auth.requestMatchers(
                                                        "/api/addresses/**").hasRole("CUSTOMER");

                                        // ====================================
                                        // EVERYTHING ELSE
                                        // ====================================

                                        auth.anyRequest().authenticated();
                                })

                                // ========================================
                                // EXCEPTION HANDLING
                                // ========================================

                                .exceptionHandling(exception -> exception

                                                .authenticationEntryPoint(
                                                                authenticationEntryPoint)

                                                .accessDeniedHandler(
                                                                accessDeniedHandler))

                                // ========================================
                                // JWT FILTER
                                // ========================================

                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class)

                                // ========================================
                                // DISABLE BASIC AUTH
                                // ========================================

                                .httpBasic(
                                                httpBasic -> httpBasic.disable());

                return http.build();
        }
}