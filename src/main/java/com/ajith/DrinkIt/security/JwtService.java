package com.ajith.drinkit.security;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

        private final Key key;

        public JwtService(
                        @Value("${jwt.secret}") String secret) {

                this.key = Keys.hmacShaKeyFor(
                                secret.getBytes(StandardCharsets.UTF_8));
        }

        public String generateToken(String email) {

                return Jwts.builder()
                                .subject(email)
                                .issuedAt(new Date())
                                .expiration(
                                                new Date(
                                                                System.currentTimeMillis()
                                                                                + 1000 * 60 * 60))
                                .signWith((SecretKey) key)
                                .compact();
        }

        public String extractEmail(String token) {

                Claims claims = Jwts.parser()
                                .verifyWith((SecretKey) key)
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();

                return claims.getSubject();
        }
}