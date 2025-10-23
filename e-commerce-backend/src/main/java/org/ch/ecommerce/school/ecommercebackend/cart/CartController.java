package org.ch.ecommerce.school.ecommercebackend.cart;

import org.ch.ecommerce.school.ecommercebackend.cart.dto.AddItemRequest;
import org.ch.ecommerce.school.ecommercebackend.cart.dto.CartDto;
import org.ch.ecommerce.school.ecommercebackend.cart.dto.CartItemDto;
import org.ch.ecommerce.school.ecommercebackend.cart.dto.UpdateItemRequest;
import org.ch.ecommerce.school.ecommercebackend.product.Product;
import org.ch.ecommerce.school.ecommercebackend.product.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class CartController {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartController(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/cart")
    public ResponseEntity<CartDto> getCart(@RequestParam(required = false) UUID cartId) {
        Cart cart;
        if (cartId != null) {
            cart = cartRepository.findById(cartId).orElseGet(() -> cartRepository.save(new Cart()));
        } else {
            cart = cartRepository.save(new Cart());
        }
        return ResponseEntity.ok(toDto(cart));
    }

    @PostMapping("/cart/items")
    public ResponseEntity<CartDto> addItem(@RequestBody AddItemRequest req) {
        if (req.getQty() == null || req.getQty() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "qty must be > 0");
        }
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        Cart cart = (req.getCartId() != null)
                ? cartRepository.findById(req.getCartId()).orElseGet(() -> cartRepository.save(new Cart()))
                : cartRepository.save(new Cart());

        // Ensure currency consistency; if new cart, currency already default; set to product currency if differs and cart has no items
        if (!cart.getCurrency().equals(product.getCurrency())) {
            if (cart.getItems() == null || cart.getItems().isEmpty()) {
                cart.setCurrency(product.getCurrency());
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Currency mismatch between cart and product");
            }
        }

        Optional<CartItem> existing = cartItemRepository.findByCart_IdAndProductId(cart.getId(), product.getId());
        CartItem item;
        if (existing.isPresent()) {
            item = existing.get();
            item.setQty(item.getQty() + req.getQty());
            // Keep the snapshot price as-is; alternatively, refresh to current price
        } else {
            item = new CartItem();
            item.setCart(cart);
            item.setProductId(product.getId());
            item.setQty(req.getQty());
            item.setUnitPriceCents(product.getPriceCents());
            item.setCurrency(product.getCurrency());
        }
        cartItemRepository.save(item);
        // Reload cart to include mapped items
        cart = cartRepository.findById(cart.getId()).orElseThrow();
        return ResponseEntity.ok(toDto(cart));
    }

    @PatchMapping("/cart/items/{itemId}")
    public ResponseEntity<CartDto> updateItem(@PathVariable Long itemId, @RequestBody UpdateItemRequest req) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        if (req.getQty() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "qty is required");
        }
        Cart cart = item.getCart();
        if (req.getQty() <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQty(req.getQty());
            cartItemRepository.save(item);
        }
        cart = cartRepository.findById(cart.getId()).orElseThrow();
        return ResponseEntity.ok(toDto(cart));
    }

    @DeleteMapping("/cart/items/{itemId}")
    public ResponseEntity<CartDto> deleteItem(@PathVariable Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        Cart cart = item.getCart();
        cartItemRepository.delete(item);
        cart = cartRepository.findById(cart.getId()).orElseThrow();
        return ResponseEntity.ok(toDto(cart));
    }

    private CartDto toDto(Cart cart) {
        CartDto dto = new CartDto();
        dto.setId(cart.getId());
        dto.setCurrency(cart.getCurrency());
        List<CartItemDto> itemDtos = new ArrayList<>();
        int total = 0;
        int itemCount = 0;
        if (cart.getItems() != null) {
            for (CartItem it : cart.getItems()) {
                CartItemDto ci = new CartItemDto();
                ci.setId(it.getId());
                ci.setProductId(it.getProductId());
                ci.setQty(it.getQty());
                ci.setUnitPriceCents(it.getUnitPriceCents());
                ci.setCurrency(it.getCurrency());
                int line = it.getQty() * it.getUnitPriceCents();
                ci.setLineTotalCents(line);
                itemDtos.add(ci);
                total += line;
                itemCount += it.getQty();
            }
        }
        dto.setItems(itemDtos);
        dto.setTotalCents(total);
        dto.setItemCount(itemCount);
        return dto;
    }
}
