package com.ajith.drinkit.service;

import java.util.List;

import com.ajith.drinkit.entity.Order;

public interface OrderService {

    Order placeOrder(String email);

    List<Order> getMyOrders(String email);

    Order getOrderById(String email, Long orderId);

}