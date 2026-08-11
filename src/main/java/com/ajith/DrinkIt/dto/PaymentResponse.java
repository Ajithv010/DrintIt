package com.ajith.drinkit.dto;

import java.time.LocalDateTime;

import com.ajith.drinkit.entity.PaymentMethod;
import com.ajith.drinkit.entity.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long paymentId;

    private Long orderId;

    private Double amount;

    private PaymentMethod paymentMethod;

    private PaymentStatus status;

    private String transactionId;

    private LocalDateTime paymentDate;
}