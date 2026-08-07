package com.ajith.drinkit.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ajith.drinkit.auth.dto.LoginRequest;
import com.ajith.drinkit.auth.dto.LoginResponse;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.repository.UserRepository;
import com.ajith.drinkit.security.JwtService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        System.out.println("Email entered: " + loginRequest.getEmail());

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("User found: " + user.getEmail());

        boolean matches = passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword());

        System.out.println("Password matches: " + matches);

        if (!matches) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(token);
    }
}