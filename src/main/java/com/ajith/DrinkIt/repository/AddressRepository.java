package com.ajith.drinkit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ajith.drinkit.entity.Address;
import com.ajith.drinkit.entity.User;

public interface AddressRepository
        extends JpaRepository<Address, Long> {

    // =========================
    // ALL ADDRESSES
    // =========================

    List<Address> findByUser(User user);

    // =========================
    // ACTIVE ADDRESSES
    // =========================

    List<Address> findByUserAndActiveTrue(
            User user);

    // =========================
    // ALL ADDRESS BY ID
    // =========================

    Optional<Address> findByIdAndUser(
            Long id,
            User user);

    // =========================
    // ACTIVE ADDRESS BY ID
    // =========================

    Optional<Address> findByIdAndUserAndActiveTrue(
            Long id,
            User user);
}