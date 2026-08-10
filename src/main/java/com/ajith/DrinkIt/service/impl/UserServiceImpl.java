package com.ajith.drinkit.service.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ajith.drinkit.dto.UserMapper;
import com.ajith.drinkit.dto.UserRequest;
import com.ajith.drinkit.dto.UserResponse;
import com.ajith.drinkit.entity.Role;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.repository.RoleRepository;
import com.ajith.drinkit.repository.UserRepository;
import com.ajith.drinkit.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            RoleRepository roleRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    // =========================
    // REGISTER USER
    // =========================

    @Override
    public UserResponse registerUser(UserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role customerRole = roleRepository
                .findByRoleName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException(
                        "CUSTOMER role not found"));

        User user = UserMapper.toEntity(request);

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()));

        user.setEnabled(true);

        // Every newly registered user is CUSTOMER
        user.setRole(customerRole);

        User savedUser = userRepository.save(user);

        return UserMapper.toResponse(savedUser);
    }

    // =========================
    // ADMIN - GET ALL USERS
    // =========================

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    // =========================
    // ADMIN - GET USER BY ID
    // =========================

    @Override
    public UserResponse getUserById(Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found"));

        return UserMapper.toResponse(user);
    }

    // =========================
    // ADMIN - UPDATE USER
    // =========================

    @Override
    public UserResponse updateUser(
            Long id,
            UserRequest request) {

        User existingUser = userRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found"));

        existingUser.setFirstName(
                request.getFirstName());

        existingUser.setLastName(
                request.getLastName());

        existingUser.setEmail(
                request.getEmail());

        existingUser.setPhoneNumber(
                request.getPhoneNumber());

        if (request.getPassword() != null &&
                !request.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()));
        }

        User updatedUser = userRepository.save(existingUser);

        return UserMapper.toResponse(
                updatedUser);
    }

    // =========================
    // ADMIN - DELETE USER
    // =========================

    @Override
    public void deleteUser(Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "User not found"));

        userRepository.delete(user);
    }

    // =========================
    // CURRENT USER - GET PROFILE
    // =========================

    @Override
    public UserResponse getMyProfile(
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "User not found"));

        return UserMapper.toResponse(user);
    }

    // =========================
    // CURRENT USER - UPDATE PROFILE
    // =========================

    @Override
    public UserResponse updateMyProfile(
            String email,
            UserRequest request) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "User not found"));

        // Customer can update these fields
        user.setFirstName(
                request.getFirstName());

        user.setLastName(
                request.getLastName());

        user.setPhoneNumber(
                request.getPhoneNumber());

        // Customer can change password
        if (request.getPassword() != null &&
                !request.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()));
        }

        User updatedUser = userRepository.save(user);

        return UserMapper.toResponse(
                updatedUser);
    }
}