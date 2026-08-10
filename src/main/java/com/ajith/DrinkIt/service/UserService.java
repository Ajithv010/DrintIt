package com.ajith.drinkit.service;

import java.util.List;

import com.ajith.drinkit.dto.UserRequest;
import com.ajith.drinkit.dto.UserResponse;
import com.ajith.drinkit.entity.User;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UserRequest request);

    void deleteUser(Long id);

    // Logged-in user's profile
    UserResponse getMyProfile(String email);

    UserResponse updateMyProfile(
            String email,
            UserRequest request);
}