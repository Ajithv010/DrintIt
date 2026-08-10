package com.ajith.drinkit.service;

import java.util.List;

import com.ajith.drinkit.dto.OrderResponse;

public interface OrderService {

    OrderResponse placeOrder(String email);

    List<OrderResponse> getMyOrders(String email);

    OrderResponse getOrderById(String email, Long orderId);
}