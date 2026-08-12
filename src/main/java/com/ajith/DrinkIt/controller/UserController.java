package com.ajith.drinkit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import com.ajith.drinkit.dto.UserRequest;
import com.ajith.drinkit.dto.UserResponse;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

        private final UserService userService;

        public UserController(UserService userService) {
                this.userService = userService;
        }

        // =========================
        // PUBLIC
        // =========================

        @PostMapping("/register")
        public ResponseEntity<UserResponse> registerUser(
                        @Valid @RequestBody UserRequest request) {

                return new ResponseEntity<>(
                                userService.registerUser(request),
                                HttpStatus.CREATED);
        }

        // =========================
        // CURRENT USER
        // =========================

        @GetMapping("/me")
        public ResponseEntity<UserResponse> getMyProfile(
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();

                String email = user.getEmail();

                return ResponseEntity.ok(
                                userService.getMyProfile(email));
        }

        @PutMapping("/me")
        public ResponseEntity<UserResponse> updateMyProfile(
                        Authentication authentication,
                        @Valid @RequestBody UserRequest request) {

                User user = (User) authentication.getPrincipal();

                String email = user.getEmail();

                return ResponseEntity.ok(
                                userService.updateMyProfile(
                                                email,
                                                request));
        }

        // =========================
        // ADMIN ONLY
        // =========================

        @GetMapping
        public ResponseEntity<List<UserResponse>> getAllUsers() {

                return ResponseEntity.ok(
                                userService.getAllUsers());
        }

        @GetMapping("/{id}")
        public ResponseEntity<UserResponse> getUserById(
                        @PathVariable Long id) {

                return ResponseEntity.ok(
                                userService.getUserById(id));
        }

        @PutMapping("/{id}")
        public ResponseEntity<UserResponse> updateUser(
                        @PathVariable Long id,
                        @Valid @RequestBody UserRequest request) {

                return ResponseEntity.ok(
                                userService.updateUser(id, request));
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<String> deleteUser(
                        @PathVariable Long id) {

                userService.deleteUser(id);

                return ResponseEntity.ok(
                                "User deleted successfully");
        }
}