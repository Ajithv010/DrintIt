package com.ajith.drinkit.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // USER
    // =========================

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // =========================
    // NAME
    // =========================

    @Column(nullable = false)
    private String fullName;

    // =========================
    // PHONE
    // =========================

    @Column(nullable = false)
    private String phoneNumber;

    // =========================
    // ADDRESS
    // =========================

    @Column(nullable = false)
    private String addressLine;

    // =========================
    // CITY
    // =========================

    @Column(nullable = false)
    private String city;

    // =========================
    // STATE
    // =========================

    @Column(nullable = false)
    private String state;

    // =========================
    // PINCODE
    // =========================

    @Column(nullable = false)
    private String pincode;

    // =========================
    // ACTIVE
    // =========================

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean active = true;

    // =========================
    // DEFAULT VALUE
    // =========================

    @PrePersist
    protected void onCreate() {

        if (active == null) {
            active = true;
        }
    }
}