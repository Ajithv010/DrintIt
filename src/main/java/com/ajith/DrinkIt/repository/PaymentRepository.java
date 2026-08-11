package com.ajith.drinkit.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ajith.drinkit.entity.Order;
import com.ajith.drinkit.entity.Payment;

public interface PaymentRepository
        extends JpaRepository<Payment, Long> {

    Optional<Payment> findByOrder(Order order);

    boolean existsByOrder(Order order);
}