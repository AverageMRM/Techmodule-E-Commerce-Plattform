package org.ch.ecommerce.school.ecommercebackend.cart.dto;

public class CartItemDto {
    private Long id;
    private Long productId;
    private Integer qty;
    private Integer unitPriceCents;
    private String currency;
    private Integer lineTotalCents;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }

    public Integer getUnitPriceCents() { return unitPriceCents; }
    public void setUnitPriceCents(Integer unitPriceCents) { this.unitPriceCents = unitPriceCents; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Integer getLineTotalCents() { return lineTotalCents; }
    public void setLineTotalCents(Integer lineTotalCents) { this.lineTotalCents = lineTotalCents; }
}
