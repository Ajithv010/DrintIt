package com.ajith.drinkit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ajith.drinkit.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

}