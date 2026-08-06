package com.ajith.drinkit.service;

import com.ajith.drinkit.entity.User;
import java.util.List;

public interface UserService {

    User registerUser(User user);

    List<User> getAllUsers();
}