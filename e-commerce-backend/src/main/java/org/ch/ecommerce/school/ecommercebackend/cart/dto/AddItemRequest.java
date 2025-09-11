package org.ch.ecommerce.school.ecommercebackend.cart.dto;

import java.util.UUID;

public class AddItemRequest {
    private UUID cartId; // optional; when null, a new cart will be created
    private Long productId;
    private Integer qty;

    public UUID getCartId() { return cartId; }
    public void setCartId(UUID cartId) { this.cartId = cartId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
}
