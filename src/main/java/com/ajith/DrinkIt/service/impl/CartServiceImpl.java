package com.ajith.drinkit.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;

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
        public CartResponse addToCart(
                        String email,
                        Long productId,
                        Integer quantity) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                // Validate quantity
                if (quantity == null || quantity <= 0) {
                        throw new InvalidCartOperationException(
                                        "Quantity must be greater than zero");
                }

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

                // Validate product status
                if (!product.getActive()) {
                        throw new InvalidCartOperationException(
                                        "Product is inactive");
                }

                Optional<CartItem> existingItem = cartItemRepository
                                .findByCartAndProduct(
                                                cart,
                                                product);

                if (existingItem.isPresent()) {

                        CartItem item = existingItem.get();

                        int newQuantity = item.getQuantity() + quantity;

                        // Check final quantity against stock
                        if (newQuantity > product.getStock()) {

                                throw new InsufficientStockException(
                                                "Insufficient stock");
                        }

                        item.setQuantity(newQuantity);

                        cartItemRepository.save(item);

                } else {

                        // Check requested quantity against stock
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

                return CartMapper.toResponse(
                                savedCart);
        }

        // =========================
        // GET CART
        // =========================

        @Override
        public CartResponse getCart(
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

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
        public CartResponse updateQuantity(
                        String email,
                        Long productId,
                        Integer quantity) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                Cart cart = cartRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cart not found"));

                Product product = productRepository
                                .findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found"));

                CartItem item = cartItemRepository
                                .findByCartAndProduct(
                                                cart,
                                                product)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found in cart"));

                // Validate quantity
                if (quantity == null || quantity <= 0) {

                        throw new InvalidCartOperationException(
                                        "Quantity must be greater than zero");
                }

                // Check product status
                if (!product.getActive()) {

                        throw new InvalidCartOperationException(
                                        "Product is inactive");
                }

                // Check stock
                if (quantity > product.getStock()) {

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
        public void removeFromCart(
                        String email,
                        Long productId) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                Cart cart = cartRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cart not found"));

                Product product = productRepository
                                .findById(productId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found"));

                CartItem item = cartItemRepository
                                .findByCartAndProduct(
                                                cart,
                                                product)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Product not found in cart"));

                cart.getItems().remove(item);

                cartItemRepository.delete(item);

                cartRepository.save(cart);
        }

        // =========================
        // CLEAR CART
        // =========================

        @Override
        public void clearCart(
                        String email) {

                User user = userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found"));

                Cart cart = cartRepository
                                .findByUser(user)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cart not found"));

                cart.getItems().clear();

                cartRepository.save(cart);
        }
}