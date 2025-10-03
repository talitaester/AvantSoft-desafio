package com.example.product_api.dto;

import java.util.UUID;

public record ProductDTO(UUID id, String name, Double price, String sku, String missingLetter
) {
    //create
    public ProductDTO(String name, Double price, String sku) {
        this(null, name, price, sku, null);
    }

    // update
    public ProductDTO(String name, Double price, String sku, String missingLetter) {
        this(null, name, price, sku, missingLetter);
    }

    // with missing letter
    public ProductDTO(UUID id, String name, Double price, String sku) {
        this(id, name, price, sku, null);
    }
}