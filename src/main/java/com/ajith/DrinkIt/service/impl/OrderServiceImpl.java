package com.ajith.drinkit.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ajith.drinkit.dto.OrderResponse;
import com.ajith.drinkit.entity.Address;
import com.ajith.drinkit.entity.Cart;
import com.ajith.drinkit.entity.CartItem;
import com.ajith.drinkit.entity.Order;
import com.ajith.drinkit.entity.OrderItem;
import com.ajith.drinkit.entity.OrderStatus;
import com.ajith.drinkit.entity.Product;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.exception.AccessDeniedException;
import com.ajith.drinkit.exception.InsufficientStockException;
import com.ajith.drinkit.exception.InvalidCartOperationException;
import com.ajith.drinkit.exception.InvalidOrderStatusException;
import com.ajith.drinkit.exception.ResourceNotFoundException;
import com.ajith.drinkit.mapper.OrderMapper;
import com.ajith.drinkit.repository.AddressRepository;
import com.ajith.drinkit.repository.CartRepository;
import com.ajith.drinkit.repository.OrderRepository;
import com.ajith.drinkit.repository.ProductRepository;
import com.ajith.drinkit.repository.UserRepository;
import com.ajith.drinkit.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {

        private final OrderRepository orderRepository;
        private final CartRepository cartRepository;
        private final UserRepository userRepository;
        private final ProductRepository productRepository;
        private final AddressRepository addressRepository;

        public OrderServiceImpl(
                        OrderRepository orderRepository,
                        CartRepository cartRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository,
                        AddressRepository addressRepository) {

                this.orderRepository = orderRepository;
                this.cartRepository = cartRepository;
                this.userRepository = userRepository;
                this.productRepository = productRepository;
                this.addressRepository = addressRepository;
        }

        // =========================
        // PLACE ORDER / CHECKOUT
        // =========================

        @Override
        @Transactional
        public OrderResponse placeOrder(
                        String email,
                        Long addressId) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                // =========================
                // FIND USER'S ADDRESS
                // =========================

                Address address = addressRepository
                                .findByIdAndUser(addressId, user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Address not found"));

                // =========================
                // FIND CART
                // =========================

                Cart cart = cartRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cart not found"));

                // =========================
                // CHECK CART
                // =========================

                if (cart.getItems().isEmpty()) {

                        throw new InvalidCartOperationException(
                                        "Cart is empty");
                }

                // =========================
                // CREATE ORDER
                // =========================

                Order order = new Order();

                order.setUser(user);
                order.setDeliveryAddress(address);
                order.setCreatedAt(LocalDateTime.now());
                order.setStatus(OrderStatus.PENDING);

                double total = 0.0;

                // =========================
                // PROCESS CART ITEMS
                // =========================

                for (CartItem cartItem : cart.getItems()) {

                        Product product = cartItem.getProduct();

                        // =========================
                        // PRODUCT STATUS
                        // =========================

                        if (!product.getActive()) {

                                throw new InvalidCartOperationException(
                                                "Product is inactive: "
                                                                + product.getName());
                        }

                        // =========================
                        // STOCK VALIDATION
                        // =========================

                        if (cartItem.getQuantity() > product.getStock()) {

                                throw new InsufficientStockException(
                                                "Insufficient stock for product: "
                                                                + product.getName());
                        }

                        // =========================
                        // CREATE ORDER ITEM
                        // =========================

                        OrderItem orderItem = new OrderItem();

                        orderItem.setOrder(order);
                        orderItem.setProduct(product);

                        orderItem.setQuantity(
                                        cartItem.getQuantity());

                        // Save price at purchase time
                        orderItem.setPrice(
                                        product.getPrice());

                        // Calculate subtotal
                        double subtotal = product.getPrice()
                                        * cartItem.getQuantity();

                        orderItem.setSubtotal(subtotal);

                        order.getItems().add(orderItem);

                        // =========================
                        // CALCULATE TOTAL
                        // =========================

                        total += subtotal;

                        // =========================
                        // REDUCE STOCK
                        // =========================

                        product.setStock(
                                        product.getStock()
                                                        - cartItem.getQuantity());

                        productRepository.save(product);
                }

                // =========================
                // SET ORDER TOTAL
                // =========================

                order.setTotalAmount(total);

                // =========================
                // SAVE ORDER
                // =========================

                Order savedOrder = orderRepository.save(order);

                // =========================
                // CLEAR CART
                // =========================

                cart.getItems().clear();

                cartRepository.save(cart);

                return OrderMapper.toResponse(
                                savedOrder);
        }

        // =========================
        // GET MY ORDERS
        // =========================

        @Override
        public List<OrderResponse> getMyOrders(
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                return orderRepository
                                .findByUser(user)
                                .stream()
                                .map(OrderMapper::toResponse)
                                .toList();
        }

        // =========================
        // GET MY ORDER BY ID
        // =========================

        @Override
        public OrderResponse getOrderById(
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

                // Customer can access only their own order
                if (!order.getUser()
                                .getId()
                                .equals(user.getId())) {

                        throw new AccessDeniedException(
                                        "You do not have permission to access this order");
                }

                return OrderMapper.toResponse(order);
        }

        // =========================
        // GET ALL ORDERS - ADMIN
        // =========================

        @Override
        public List<OrderResponse> getAllOrders() {

                return orderRepository
                                .findAll()
                                .stream()
                                .map(OrderMapper::toResponse)
                                .toList();
        }

        // =========================
        // UPDATE ORDER STATUS - ADMIN
        // =========================

        @Override
        public OrderResponse updateOrderStatus(
                        Long orderId,
                        String status) {

                Order order = orderRepository
                                .findById(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Order not found"));

                // =========================
                // VALIDATE STATUS INPUT
                // =========================

                if (status == null ||
                                status.isBlank()) {

                        throw new InvalidOrderStatusException(
                                        "Order status is required");
                }

                OrderStatus newStatus;

                try {

                        newStatus = OrderStatus.valueOf(
                                        status.trim().toUpperCase());

                } catch (IllegalArgumentException ex) {

                        throw new InvalidOrderStatusException(
                                        "Invalid order status: " + status);
                }

                OrderStatus currentStatus = order.getStatus();

                // =========================
                // VALID STATUS TRANSITIONS
                // =========================

                if (currentStatus == OrderStatus.PENDING) {

                        if (newStatus != OrderStatus.CONFIRMED &&
                                        newStatus != OrderStatus.CANCELLED) {

                                throw new InvalidOrderStatusException(
                                                "Cannot change order status from "
                                                                + currentStatus
                                                                + " to "
                                                                + newStatus);
                        }
                }

                else if (currentStatus == OrderStatus.CONFIRMED) {

                        if (newStatus != OrderStatus.DELIVERED &&
                                        newStatus != OrderStatus.CANCELLED) {

                                throw new InvalidOrderStatusException(
                                                "Cannot change order status from "
                                                                + currentStatus
                                                                + " to "
                                                                + newStatus);
                        }
                }

                else if (currentStatus == OrderStatus.DELIVERED) {

                        throw new InvalidOrderStatusException(
                                        "Delivered orders cannot be modified");
                }

                else if (currentStatus == OrderStatus.CANCELLED) {

                        throw new InvalidOrderStatusException(
                                        "Cancelled orders cannot be modified");
                }

                // =========================
                // UPDATE STATUS
                // =========================

                order.setStatus(newStatus);

                Order updatedOrder = orderRepository.save(order);

                return OrderMapper.toResponse(
                                updatedOrder);
        }
}