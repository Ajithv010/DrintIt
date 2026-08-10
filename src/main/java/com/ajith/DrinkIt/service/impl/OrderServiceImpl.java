package com.ajith.drinkit.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ajith.drinkit.dto.OrderResponse;
import com.ajith.drinkit.entity.Cart;
import com.ajith.drinkit.entity.CartItem;
import com.ajith.drinkit.entity.Order;
import com.ajith.drinkit.entity.OrderItem;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.mapper.OrderMapper;
import com.ajith.drinkit.repository.CartRepository;
import com.ajith.drinkit.repository.OrderRepository;
import com.ajith.drinkit.repository.UserRepository;
import com.ajith.drinkit.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public OrderServiceImpl(
            OrderRepository orderRepository,
            CartRepository cartRepository,
            UserRepository userRepository) {

        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    @Override
    public OrderResponse placeOrder(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();

        order.setUser(user);
        order.setOrderDate(java.time.LocalDateTime.now());
        order.setStatus("PLACED");

        double total = 0;

        for (CartItem cartItem : cart.getItems()) {

            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());

            order.getItems().add(orderItem);

            total += cartItem.getProduct().getPrice()
                    * cartItem.getQuantity();
        }

        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        return OrderMapper.toResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getMyOrders(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUser(user)
                .stream()
                .map(OrderMapper::toResponse)
                .toList();
    }

    @Override
    public OrderResponse getOrderById(
            String email,
            Long orderId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return OrderMapper.toResponse(order);
    }
}