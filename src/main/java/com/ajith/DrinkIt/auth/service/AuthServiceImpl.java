package com.ajith.drinkit.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ajith.drinkit.auth.dto.LoginRequest;
import com.ajith.drinkit.auth.dto.LoginResponse;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.exception.AuthenticationException;
import com.ajith.drinkit.repository.UserRepository;
import com.ajith.drinkit.security.JwtService;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new AuthenticationException(
                        "Invalid email or password"));

        boolean matches = passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword());

        if (!matches) {
            throw new AuthenticationException(
                    "Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new LoginResponse(token);
    }
}