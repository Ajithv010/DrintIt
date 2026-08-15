package com.ajith.drinkit.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long orderId;

    private LocalDateTime orderDate;

    private String status;

    // =========================
    // CUSTOMER
    // =========================

    private String customerName;

    private String customerEmail;

    private String customerPhone;

    // =========================
    // ORDER ITEMS
    // =========================

    private List<OrderItemResponse> items;

    // =========================
    // TOTAL
    // =========================

    private Double totalAmount;

    // =========================
    // DELIVERY ADDRESS
    // =========================

    private AddressResponse deliveryAddress;
}