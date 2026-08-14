package com.ajith.drinkit.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter
                extends OncePerRequestFilter {

        private final JwtService jwtService;
        private final UserRepository userRepository;

        public JwtAuthenticationFilter(
                        JwtService jwtService,
                        UserRepository userRepository) {

                this.jwtService = jwtService;
                this.userRepository = userRepository;
        }

        @Override
        protected boolean shouldNotFilter(
                        HttpServletRequest request) {

                String path = request.getServletPath();

                return path.equals("/api/auth/login")
                                || path.equals("/api/users/register");
        }

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain)
                        throws ServletException, IOException {

                String authHeader = request.getHeader("Authorization");

                // ========================================
                // NO TOKEN
                // ========================================

                if (authHeader == null
                                || !authHeader.startsWith("Bearer ")) {

                        filterChain.doFilter(
                                        request,
                                        response);

                        return;
                }

                String token = authHeader.substring(7);

                try {

                        // ========================================
                        // EXTRACT EMAIL FROM JWT
                        // ========================================

                        String email = jwtService.extractEmail(token);

                        // ========================================
                        // FIND USER
                        // ========================================

                        User user = userRepository
                                        .findByEmail(email)
                                        .orElseThrow(() -> new RuntimeException(
                                                        "User not found"));

                        // ========================================
                        // CHECK USER ENABLED
                        // ========================================

                        if (!Boolean.TRUE.equals(
                                        user.getEnabled())) {

                                sendUnauthorized(
                                                response,
                                                "User account is disabled");

                                return;
                        }

                        // ========================================
                        // GET ROLE
                        // ========================================

                        String roleName = user.getRole()
                                        .getRoleName();

                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(
                                        "ROLE_" + roleName);

                        // ========================================
                        // CREATE AUTHENTICATION
                        // ========================================

                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                        Collections.singletonList(
                                                        authority));

                        authentication.setDetails(
                                        new WebAuthenticationDetailsSource()
                                                        .buildDetails(request));

                        SecurityContextHolder
                                        .getContext()
                                        .setAuthentication(
                                                        authentication);

                } catch (Exception e) {

                        // ========================================
                        // ONLY JWT/AUTHENTICATION ERRORS
                        // ========================================

                        e.printStackTrace();

                        SecurityContextHolder
                                        .clearContext();

                        sendUnauthorized(
                                        response,
                                        "Invalid or expired token");

                        return;
                }

                // ========================================
                // CONTINUE REQUEST
                // ========================================
                //
                // IMPORTANT:
                //
                // This MUST be OUTSIDE the try/catch.
                //
                // Therefore authorization errors such as
                // 403 are handled by Spring Security instead
                // of being incorrectly converted to 401.
                //

                filterChain.doFilter(
                                request,
                                response);
        }

        // ========================================
        // SEND 401
        // ========================================

        private void sendUnauthorized(
                        HttpServletResponse response,
                        String message)
                        throws IOException {

                response.setStatus(
                                HttpServletResponse.SC_UNAUTHORIZED);

                response.setContentType(
                                "application/json");

                response.getWriter().write(
                                """
                                                {
                                                    "status": 401,
                                                    "error": "Unauthorized",
                                                    "message": "%s"
                                                }
                                                """.formatted(message));
        }
}