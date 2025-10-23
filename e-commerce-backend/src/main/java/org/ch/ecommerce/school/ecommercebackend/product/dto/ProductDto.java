package org.ch.ecommerce.school.ecommercebackend.product.dto;

import org.ch.ecommerce.school.ecommercebackend.product.Product;

/**
 * API DTO for exposing product data to clients without leaking JPA internals.
 */
public record ProductDto(
        Long id,
        String slug,
        String title,
        String description,
        Integer priceCents,
        String currency
) {
    public static ProductDto fromEntity(Product p) {
        if (p == null) return null;
        return new ProductDto(
                p.getId(),
                p.getSlug(),
                p.getTitle(),
                p.getDescription(),
                p.getPriceCents(),
                p.getCurrency()
        );
    }
}
