package com.example.product_api.service;

import com.example.product_api.dto.ProductDTO;
import com.example.product_api.model.Product;
import com.example.product_api.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product create(ProductDTO dto){
        return productRepository.save(moveToEntity(dto));
    }

    private Product moveToEntity(ProductDTO dto) {
        return new Product(dto.name(), dto.price(), dto.sku());
    }

    public String del(UUID id){
         productRepository.deleteById(id);
         return "\n" +
                 "Product deleted successfully";
    }

    public Product update(ProductDTO dto){
        return productRepository.save(moveToEntity(dto));
    }

    public List<Product> get(){
        return productRepository.findAll();
    }

    public Product getById(UUID id){
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }



    public String findMissingLetter(Product product) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            return "_";
        }

        String lowerCaseName = product.getName().toLowerCase();
        boolean[] alphabet = new boolean[26]; // a-zs

        for (char c : lowerCaseName.toCharArray()) {
            if (c >= 'a' && c <= 'z') {
                alphabet[c - 'a'] = true;
            }
        }

        for (int i = 0; i < 26; i++) {
            if (!alphabet[i]) {
                return String.valueOf((char) ('a' + i));
            }
        }

        return "_";
    }

}
