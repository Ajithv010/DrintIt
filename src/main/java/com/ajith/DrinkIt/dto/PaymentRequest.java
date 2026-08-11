package com.ajith.drinkit.dto;

import com.ajith.drinkit.entity.PaymentMethod;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    private Long orderId;

    private PaymentMethod paymentMethod;

    private Boolean simulateSuccess;
}