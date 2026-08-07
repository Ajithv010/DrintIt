package com.ajith.drinkit.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ajith.drinkit.auth.dto.LoginRequest;
import com.ajith.drinkit.auth.dto.LoginResponse;
import com.ajith.drinkit.auth.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {

        System.out.println("LOGIN API HIT");

        LoginResponse response = authService.login(loginRequest);

        return ResponseEntity.ok(response);
    }
}