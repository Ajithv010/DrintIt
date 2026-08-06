package com.ajith.drinkit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ajith.drinkit.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

}