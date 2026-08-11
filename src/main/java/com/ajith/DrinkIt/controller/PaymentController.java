package com.ajith.drinkit.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ajith.drinkit.dto.PaymentRequest;
import com.ajith.drinkit.dto.PaymentResponse;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // =========================
    // MAKE PAYMENT
    // =========================

    @PostMapping
    public ResponseEntity<PaymentResponse> makePayment(
            Authentication authentication,
            @RequestBody PaymentRequest request) {

        User user = (User) authentication.getPrincipal();

        String email = user.getEmail();

        PaymentResponse payment = paymentService.makePayment(
                email,
                request);

        return new ResponseEntity<>(
                payment,
                HttpStatus.CREATED);
    }

    // =========================
    // GET PAYMENT BY ORDER
    // =========================

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(
            Authentication authentication,
            @PathVariable Long orderId) {

        User user = (User) authentication.getPrincipal();

        String email = user.getEmail();

        return ResponseEntity.ok(
                paymentService.getPaymentByOrderId(
                        email,
                        orderId));
    }
}