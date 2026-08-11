package com.ajith.drinkit.service.impl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ajith.drinkit.dto.PaymentRequest;
import com.ajith.drinkit.dto.PaymentResponse;
import com.ajith.drinkit.entity.Order;
import com.ajith.drinkit.entity.OrderStatus;
import com.ajith.drinkit.entity.Payment;
import com.ajith.drinkit.entity.PaymentStatus;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.exception.AccessDeniedException;
import com.ajith.drinkit.exception.InvalidPaymentException;
import com.ajith.drinkit.exception.ResourceNotFoundException;
import com.ajith.drinkit.repository.OrderRepository;
import com.ajith.drinkit.repository.PaymentRepository;
import com.ajith.drinkit.repository.UserRepository;
import com.ajith.drinkit.service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public PaymentServiceImpl(
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            UserRepository userRepository) {

        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // MAKE PAYMENT
    // =========================

    @Override
    @Transactional
    public PaymentResponse makePayment(
            String email,
            PaymentRequest request) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found"));

        if (request == null ||
                request.getOrderId() == null) {

            throw new InvalidPaymentException(
                    "Order ID is required");
        }

        if (request.getPaymentMethod() == null) {

            throw new InvalidPaymentException(
                    "Payment method is required");
        }

        Order order = orderRepository
                .findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found"));

        // =========================
        // OWNERSHIP CHECK
        // =========================

        if (!order.getUser()
                .getId()
                .equals(user.getId())) {

            throw new AccessDeniedException(
                    "You do not have permission to pay for this order");
        }

        // =========================
        // ORDER STATUS CHECK
        // =========================

        if (order.getStatus() != OrderStatus.PENDING) {

            throw new InvalidPaymentException(
                    "Payment is allowed only for PENDING orders");
        }

        // =========================
        // DUPLICATE PAYMENT CHECK
        // =========================

        if (paymentRepository.existsByOrder(order)) {

            throw new InvalidPaymentException(
                    "Payment already exists for this order");
        }

        // =========================
        // CREATE PAYMENT
        // =========================

        Payment payment = new Payment();

        payment.setOrder(order);

        payment.setPaymentMethod(
                request.getPaymentMethod());

        payment.setAmount(
                order.getTotalAmount());

        payment.setPaymentDate(
                LocalDateTime.now());

        // =========================
        // SIMULATE PAYMENT RESULT
        // =========================

        boolean success = Boolean.TRUE.equals(
                request.getSimulateSuccess());

        if (success) {

            payment.setStatus(
                    PaymentStatus.SUCCESS);

            payment.setTransactionId(
                    "TXN-" + UUID.randomUUID());

            // Payment successful
            // → Confirm order

            order.setStatus(
                    OrderStatus.CONFIRMED);

        } else {

            payment.setStatus(
                    PaymentStatus.FAILED);

            payment.setTransactionId(
                    null);

            // Payment failed
            // → Order remains PENDING
        }

        Payment savedPayment = paymentRepository.save(payment);

        orderRepository.save(order);

        return toResponse(savedPayment);
    }

    // =========================
    // GET PAYMENT BY ORDER
    // =========================

    @Override
    public PaymentResponse getPaymentByOrderId(
            String email,
            Long orderId) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found"));

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found"));

        // =========================
        // OWNERSHIP CHECK
        // =========================

        if (!order.getUser()
                .getId()
                .equals(user.getId())) {

            throw new AccessDeniedException(
                    "You do not have permission to view this payment");
        }

        Payment payment = paymentRepository
                .findByOrder(order)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found"));

        return toResponse(payment);
    }

    // =========================
    // ENTITY → RESPONSE
    // =========================

    private PaymentResponse toResponse(
            Payment payment) {

        return new PaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getStatus(),
                payment.getTransactionId(),
                payment.getPaymentDate());
    }
}