package com.ajith.drinkit.service;

import com.ajith.drinkit.dto.PaymentRequest;
import com.ajith.drinkit.dto.PaymentResponse;

public interface PaymentService {

    PaymentResponse makePayment(
            String email,
            PaymentRequest request);

    PaymentResponse getPaymentByOrderId(
            String email,
            Long orderId);
}