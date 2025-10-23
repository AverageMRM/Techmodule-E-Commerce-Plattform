package org.ch.ecommerce.school.ecommercebackend.product;

import jakarta.persistence.criteria.Join;
import org.ch.ecommerce.school.ecommercebackend.category.Category;
import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecifications {

    private ProductSpecifications() {}

    public static Specification<Product> statusActive() {
        return (root, query, cb) -> cb.equal(root.get("status"), ProductStatus.ACTIVE);
    }

    public static Specification<Product> search(String term) {
        if (term == null || term.isBlank()) return null;
        String like = "%" + term.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("title")), like),
                cb.like(cb.lower(root.get("description")), like)
        );
    }

    public static Specification<Product> categorySlug(String slug) {
        if (slug == null || slug.isBlank()) return null;
        return (root, query, cb) -> {
            query.distinct(true);
            Join<Product, Category> join = root.join("categories");
            return cb.equal(join.get("slug"), slug);
        };
    }
}
