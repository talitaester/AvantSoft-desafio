package com.example.product_api.controller;

import com.example.product_api.dto.ProductDTO;
import com.example.product_api.model.Product;
import com.example.product_api.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<ProductDTO> create(@Valid @RequestBody ProductDTO dto) {
        if (dto.id() != null) {
            return ResponseEntity.badRequest().build();
        }

        Product product = productService.create(dto);
        ProductDTO responseDTO = convertToDTO(product);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> update(@PathVariable UUID id, @Valid @RequestBody ProductDTO dto) {
        ProductDTO updateDTO = new ProductDTO(id, dto.name(), dto.price(), dto.sku());
        Product product = productService.update(updateDTO);
        ProductDTO responseDTO = convertToDTO(product);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable UUID id) {
        String message = productService.del(id);
        return ResponseEntity.ok(message);
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAll() {
        List<ProductDTO> products = productService.get()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getById(@PathVariable UUID id) {
        Product product = productService.getById(id);
        ProductDTO responseDTO = convertToDTO(product);
        return ResponseEntity.ok(responseDTO);
    }

    private ProductDTO convertToDTO(Product product) {
        String missingLetter = productService.findMissingLetter(product);
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getSku()
        );
    }
}