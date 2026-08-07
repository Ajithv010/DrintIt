package com.ajith.drinkit.service;

import com.ajith.drinkit.dto.UserRequest;
import com.ajith.drinkit.dto.UserResponse;
import com.ajith.drinkit.entity.User;
import java.util.List;

public interface UserService {

    UserResponse registerUser(UserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    User updateUser(Long id, User user);

    void deleteUser(Long id);

}