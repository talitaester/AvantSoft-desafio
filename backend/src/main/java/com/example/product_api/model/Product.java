package com.example.product_api.model;


import com.example.product_api.dto.ProductDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Name can not be null")
    @Column(nullable = false)
    private String name;

    @Positive(message = "Price must be bigger than zero")
    @Column(nullable = false)
    private Double price;

    @Column( unique =  true, nullable = false, updatable = false)
    private String sku;


    public Product() {
    }


    public Product(String name, Double price, String sku) {
        this.name = name;
        this.price = price;
        this.sku = sku;
    }

    public UUID getId() {
        return id;
    }

    private void setId(UUID id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

}

