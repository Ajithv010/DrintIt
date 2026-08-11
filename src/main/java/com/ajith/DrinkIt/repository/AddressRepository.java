package com.ajith.drinkit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ajith.drinkit.entity.Address;
import com.ajith.drinkit.entity.User;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUser(User user);

    Optional<Address> findByIdAndUser(Long id, User user);
}