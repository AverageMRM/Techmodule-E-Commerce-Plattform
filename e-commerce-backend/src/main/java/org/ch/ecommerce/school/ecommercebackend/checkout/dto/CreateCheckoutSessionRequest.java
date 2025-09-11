package org.ch.ecommerce.school.ecommercebackend.checkout.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CreateCheckoutSessionRequest {
    @NotNull
    @Min(1)
    private Integer amountCents;

    private String currency = "CHF";

    public Integer getAmountCents() {
        return amountCents;
    }

    public void setAmountCents(Integer amountCents) {
        this.amountCents = amountCents;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
