package com.ajith.drinkit.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // ORDER
    // =========================

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // =========================
    // PRODUCT
    // =========================

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // =========================
    // QUANTITY
    // =========================

    @Column(nullable = false)
    private Integer quantity;

    // =========================
    // PRICE AT TIME OF ORDER
    // =========================

    @Column(nullable = false)
    private Double price;

    // =========================
    // SUBTOTAL
    // =========================

    @Column(nullable = false)
    private Double subtotal;
}