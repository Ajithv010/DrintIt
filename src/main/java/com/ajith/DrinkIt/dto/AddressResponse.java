package com.ajith.drinkit.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.ajith.drinkit.dto.AddressResponse;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {

    private Long id;

    private String fullName;

    private String phoneNumber;

    private String addressLine;

    private String city;

    private String state;

    private String pincode;
}