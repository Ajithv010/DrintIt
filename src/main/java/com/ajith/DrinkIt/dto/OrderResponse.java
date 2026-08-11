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

    private List<OrderItemResponse> items;

    private Double totalAmount;

    private AddressResponse deliveryAddress;
}