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

        // ========================================
        // PLACE ORDER
        // ========================================

        @Override
        @Transactional
        public OrderResponse placeOrder(
                        String email,
                        Long addressId) {

                User user = getUser(email);

                if (addressId == null || addressId <= 0) {
                        throw new InvalidCartOperationException(
                                        "Address ID is required");
                }

                Address address = addressRepository
                                .findByIdAndUser(addressId, user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Address not found"));

                Cart cart = cartRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cart not found"));

                if (cart.getItems().isEmpty()) {
                        throw new InvalidCartOperationException(
                                        "Cart is empty");
                }

                Order order = new Order();

                order.setUser(user);
                order.setDeliveryAddress(address);
                order.setCreatedAt(LocalDateTime.now());
                order.setStatus(OrderStatus.PENDING);

                double total = 0.0;

                for (CartItem cartItem : cart.getItems()) {

                        Product product = cartItem.getProduct();

                        if (product == null) {
                                throw new InvalidCartOperationException(
                                                "Cart contains an invalid product");
                        }

                        if (!Boolean.TRUE.equals(product.getActive())) {
                                throw new InvalidCartOperationException(
                                                "Product is inactive: "
                                                                + product.getName());
                        }

                        if (product.getStock() == null ||
                                        product.getStock() < 0) {

                                throw new InvalidCartOperationException(
                                                "Invalid stock for product: "
                                                                + product.getName());
                        }

                        if (cartItem.getQuantity() == null ||
                                        cartItem.getQuantity() <= 0) {

                                throw new InvalidCartOperationException(
                                                "Invalid quantity for product: "
                                                                + product.getName());
                        }

                        if (cartItem.getQuantity() > product.getStock()) {
                                throw new InsufficientStockException(
                                                "Insufficient stock for product: "
                                                                + product.getName());
                        }

                        if (product.getPrice() == null ||
                                        product.getPrice() <= 0) {

                                throw new InvalidCartOperationException(
                                                "Invalid price for product: "
                                                                + product.getName());
                        }

                        OrderItem orderItem = new OrderItem();

                        orderItem.setOrder(order);
                        orderItem.setProduct(product);
                        orderItem.setQuantity(
                                        cartItem.getQuantity());

                        orderItem.setPrice(
                                        product.getPrice());

                        double subtotal = product.getPrice()
                                        * cartItem.getQuantity();

                        orderItem.setSubtotal(subtotal);

                        order.getItems().add(orderItem);

                        total += subtotal;

                        product.setStock(
                                        product.getStock()
                                                        - cartItem.getQuantity());

                        productRepository.save(product);
                }

                order.setTotalAmount(total);

                Order savedOrder = orderRepository.save(order);

                cart.getItems().clear();

                cartRepository.save(cart);

                return OrderMapper.toResponse(savedOrder);
        }

        // ========================================
        // CUSTOMER - GET MY ORDERS
        // ========================================

        @Override
        @Transactional(readOnly = true)
        public List<OrderResponse> getMyOrders(
                        String email) {

                User user = getUser(email);

                return orderRepository
                                .findByUserOrderByCreatedAtDesc(user)
                                .stream()
                                .map(OrderMapper::toResponse)
                                .toList();
        }

        // ========================================
        // CUSTOMER - GET MY ORDER BY ID
        // ========================================

        @Override
        @Transactional(readOnly = true)
        public OrderResponse getOrderById(
                        String email,
                        Long orderId) {

                User user = getUser(email);

                Order order = getOrder(orderId);

                checkOwnership(order, user);

                return OrderMapper.toResponse(order);
        }

        // ========================================
        // CUSTOMER - CANCEL ORDER
        // ========================================

        @Override
        @Transactional
        public OrderResponse cancelOrder(
                        String email,
                        Long orderId) {

                User user = getUser(email);

                Order order = getOrder(orderId);

                checkOwnership(order, user);

                if (order.getStatus() != OrderStatus.PENDING) {
                        throw new InvalidOrderStatusException(
                                        "Only pending orders can be cancelled");
                }

                restoreStock(order);

                order.setStatus(
                                OrderStatus.CANCELLED);

                Order savedOrder = orderRepository.save(order);

                return OrderMapper.toResponse(savedOrder);
        }

        // ========================================
        // ADMIN - GET ALL ORDERS
        // ========================================

        @Override
        @Transactional(readOnly = true)
        public List<OrderResponse> getAllOrders() {

                return orderRepository
                                .findAll()
                                .stream()
                                .map(OrderMapper::toResponse)
                                .toList();
        }

        // ========================================
        // ADMIN - GET ORDER BY ID
        // ========================================

        @Override
        @Transactional(readOnly = true)
        public OrderResponse getAdminOrderById(
                        Long orderId) {

                Order order = getOrder(orderId);

                return OrderMapper.toResponse(order);
        }

        // ========================================
        // ADMIN - UPDATE ORDER STATUS
        // ========================================

        @Override
        @Transactional
        public OrderResponse updateOrderStatus(
                        Long orderId,
                        String status) {

                Order order = getOrder(orderId);

                if (status == null ||
                                status.trim().isEmpty()) {

                        throw new InvalidOrderStatusException(
                                        "Order status is required");
                }

                OrderStatus newStatus;

                try {

                        newStatus = OrderStatus.valueOf(
                                        status.trim().toUpperCase());

                } catch (IllegalArgumentException e) {

                        throw new InvalidOrderStatusException(
                                        "Invalid order status. Use PENDING, CONFIRMED, DELIVERED or CANCELLED");
                }

                OrderStatus currentStatus = order.getStatus();

                if (currentStatus == OrderStatus.DELIVERED) {
                        throw new InvalidOrderStatusException(
                                        "Delivered order cannot be changed");
                }

                if (currentStatus == OrderStatus.CANCELLED) {
                        throw new InvalidOrderStatusException(
                                        "Cancelled order cannot be changed");
                }

                if (currentStatus == newStatus) {
                        throw new InvalidOrderStatusException(
                                        "Order already has this status");
                }

                // ========================================
                // PENDING
                // ========================================

                if (currentStatus == OrderStatus.PENDING) {

                        if (newStatus == OrderStatus.CONFIRMED) {

                                order.setStatus(
                                                OrderStatus.CONFIRMED);

                        } else if (newStatus == OrderStatus.CANCELLED) {

                                restoreStock(order);

                                order.setStatus(
                                                OrderStatus.CANCELLED);

                        } else {

                                throw new InvalidOrderStatusException(
                                                "PENDING order can only be CONFIRMED or CANCELLED");
                        }
                }

                // ========================================
                // CONFIRMED
                // ========================================

                else if (currentStatus == OrderStatus.CONFIRMED) {

                        if (newStatus == OrderStatus.DELIVERED) {

                                order.setStatus(
                                                OrderStatus.DELIVERED);

                        } else {

                                throw new InvalidOrderStatusException(
                                                "CONFIRMED order can only be DELIVERED");
                        }
                }

                Order savedOrder = orderRepository.save(order);

                return OrderMapper.toResponse(savedOrder);
        }

        // ========================================
        // GET USER
        // ========================================

        private User getUser(String email) {

                return userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));
        }

        // ========================================
        // GET ORDER
        // ========================================

        private Order getOrder(Long orderId) {

                if (orderId == null || orderId <= 0) {

                        throw new InvalidOrderStatusException(
                                        "Order ID must be valid");
                }

                return orderRepository
                                .findById(orderId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Order not found"));
        }

        // ========================================
        // OWNERSHIP
        // ========================================

        private void checkOwnership(
                        Order order,
                        User user) {

                if (order.getUser() == null ||
                                !order.getUser()
                                                .getId()
                                                .equals(user.getId())) {

                        throw new AccessDeniedException(
                                        "You do not have permission to access this order");
                }
        }

        // ========================================
        // RESTORE STOCK
        // ========================================

        private void restoreStock(Order order) {

                for (OrderItem orderItem : order.getItems()) {

                        Product product = orderItem.getProduct();

                        if (product == null) {
                                continue;
                        }

                        int currentStock = product.getStock() == null
                                        ? 0
                                        : product.getStock();

                        product.setStock(
                                        currentStock
                                                        + orderItem.getQuantity());

                        productRepository.save(product);
                }
        }
}