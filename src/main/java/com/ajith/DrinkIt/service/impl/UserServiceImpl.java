package com.ajith.drinkit.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.repository.UserRepository;
import com.ajith.drinkit.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}