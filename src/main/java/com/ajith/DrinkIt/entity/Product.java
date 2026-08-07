package com.ajith.drinkit.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private Double price;

    private Integer stock;

    private String brand;

    private String imageUrl;

    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}