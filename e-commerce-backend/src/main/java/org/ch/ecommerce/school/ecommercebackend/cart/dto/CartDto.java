package org.ch.ecommerce.school.ecommercebackend.cart.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CartDto {
    private UUID id;
    private String currency;
    private List<CartItemDto> items = new ArrayList<>();
    private Integer totalCents;
    private Integer itemCount;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public List<CartItemDto> getItems() { return items; }
    public void setItems(List<CartItemDto> items) { this.items = items; }

    public Integer getTotalCents() { return totalCents; }
    public void setTotalCents(Integer totalCents) { this.totalCents = totalCents; }

    public Integer getItemCount() { return itemCount; }
    public void setItemCount(Integer itemCount) { this.itemCount = itemCount; }
}
