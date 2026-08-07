package com.ajith.drinkit.auth.service;

import com.ajith.drinkit.auth.dto.LoginRequest;
import com.ajith.drinkit.auth.dto.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest loginRequest);

}