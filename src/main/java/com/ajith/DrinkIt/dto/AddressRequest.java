package com.ajith.drinkit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {

    private String fullName;

    private String phoneNumber;

    private String addressLine;

    private String city;

    private String state;

    private String pincode;
}