package com.ajith.drinkit.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ajith.drinkit.dto.CartResponse;
import com.ajith.drinkit.entity.Cart;
import com.ajith.drinkit.entity.CartItem;
import com.ajith.drinkit.entity.Product;
import com.ajith.drinkit.entity.User;
import com.ajith.drinkit.exception.InsufficientStockException;
import com.ajith.drinkit.exception.InvalidCartOperationException;
import com.ajith.drinkit.exception.ResourceNotFoundException;
import com.ajith.drinkit.mapper.CartMapper;
import com.ajith.drinkit.repository.CartItemRepository;
import com.ajith.drinkit.repository.CartRepository;
import com.ajith.drinkit.repository.ProductRepository;
import com.ajith.drinkit.repository.UserRepository;
import com.ajith.drinkit.service.CartService;

@Service
public class CartServiceImpl implements CartService {

        private final CartRepository cartRepository;
        private final CartItemRepository cartItemRepository;
        private final ProductRepository productRepository;
        private final UserRepository userRepository;

        public CartServiceImpl(
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {

                this.cartRepository = cartRepository;
                this.cartItemRepository = cartItemRepository;
                this.productRepository = productRepository;
                this.userRepository = userRepository;
        }

        // =========================
        // ADD TO CART
        // =========================

        @Override
        @Transactional
        public CartResponse addToCart(
                        String email,
                        Long productId,
                        Integer quantity) {

                User user = getUser(email);

                validateProductId(productId);
                validateQuantity(quantity);

                Cart cart = cartRepository
                                .findByUser(user)
                                .orElseGet(() -> {

                                        Cart newCart = new Cart();

                                        newCart.setUser(user);

                                        return cartRepository.save(newCart);
                                });

                Product product = productRepository
                                .findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found"));

                if (!Boolean.TRUE.equals(product.getActive())) {

                        throw new InvalidCartOperationException(
                                        "Product is inactive");
                }

                if (product.getStock() == null ||
                                product.getStock() <= 0) {

                        throw new InsufficientStockException(
                                        "Product is out of stock");
                }

                Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(
                                cart,
                                product);

                if (existingItem.isPresent()) {

                        CartItem item = existingItem.get();

                        int newQuantity = item.getQuantity() + quantity;

                        if (newQuantity > product.getStock()) {

                                throw new InsufficientStockException(
                                                "Insufficient stock");
                        }

                        item.setQuantity(newQuantity);

                        cartItemRepository.save(item);

                } else {

                        if (quantity > product.getStock()) {

                                throw new InsufficientStockException(
                                                "Insufficient stock");
                        }

                        CartItem item = new CartItem();

                        item.setCart(cart);
                        item.setProduct(product);
                        item.setQuantity(quantity);

                        cartItemRepository.save(item);

                        cart.getItems().add(item);
                }

                Cart savedCart = cartRepository.save(cart);

                return CartMapper.toResponse(savedCart);
        }

        // =========================
        // GET CART
        // =========================

        @Override
        @Transactional(readOnly = true)
        public CartResponse getCart(
                        String email) {

                User user = getUser(email);

                Cart cart = cartRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cart not found"));

                return CartMapper.toResponse(cart);
        }

        // =========================
        // UPDATE QUANTITY
        // =========================

        @Override
        @Transactional
        public CartResponse updateQuantity(
                        String email,
                        Long productId,
                        Integer quantity) {

                User user = getUser(email);

                validateProductId(productId);
                validateQuantity(quantity);

                Cart cart = cartRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cart not found"));

                Product product = productRepository
                                .findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found"));

                CartItem item = cartItemRepository.findByCartAndProduct(
                                cart,
                                product)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found in cart"));

                if (!Boolean.TRUE.equals(product.getActive())) {

                        throw new InvalidCartOperationException(
                                        "Product is inactive");
                }

                if (product.getStock() == null ||
                                quantity > product.getStock()) {

                        throw new InsufficientStockException(
                                        "Insufficient stock");
                }

                item.setQuantity(quantity);

                cartItemRepository.save(item);

                return CartMapper.toResponse(cart);
        }

        // =========================
        // REMOVE ITEM
        // =========================

        @Override
        @Transactional
        public void removeFromCart(
                        String email,
                        Long productId) {

                User user = getUser(email);

                validateProductId(productId);

                Cart cart = cartRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cart not found"));

                Product product = productRepository
                                .findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found"));

                CartItem item = cartItemRepository.findByCartAndProduct(
                                cart,
                                product)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found in cart"));

                cart.getItems().remove(item);

                cartItemRepository.delete(item);
        }

        // =========================
        // CLEAR CART
        // =========================

        @Override
        @Transactional
        public void clearCart(
                        String email) {

                User user = getUser(email);

                Cart cart = cartRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cart not found"));

                cart.getItems().clear();

                cartRepository.save(cart);
        }

        // =========================
        // GET USER
        // =========================

        private User getUser(String email) {

                return userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));
        }

        // =========================
        // VALIDATE PRODUCT ID
        // =========================

        private void validateProductId(Long productId) {

                if (productId == null || productId <= 0) {

                        throw new InvalidCartOperationException(
                                        "Product ID must be valid");
                }
        }

        // =========================
        // VALIDATE QUANTITY
        // =========================

        private void validateQuantity(Integer quantity) {

                if (quantity == null || quantity <= 0) {

                        throw new InvalidCartOperationException(
                                        "Quantity must be greater than zero");
                }
        }
}