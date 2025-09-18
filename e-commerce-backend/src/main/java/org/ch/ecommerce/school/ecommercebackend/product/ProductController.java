package org.ch.ecommerce.school.ecommercebackend.product;

import org.ch.ecommerce.school.ecommercebackend.product.dto.ProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<Page<ProductDto>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Specification<Product> spec = Specification.allOf(
                ProductSpecifications.statusActive(),
                ProductSpecifications.search(search),
                ProductSpecifications.categorySlug(category)
        );
        return ResponseEntity.ok(repository.findAll(spec, pageable).map(ProductDto::fromEntity));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductDto> getBySlug(@PathVariable String slug) {
        return repository.findBySlug(slug)
                .map(ProductDto::fromEntity)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }
}
