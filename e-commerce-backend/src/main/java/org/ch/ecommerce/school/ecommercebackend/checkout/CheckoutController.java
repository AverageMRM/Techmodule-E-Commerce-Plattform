package org.ch.ecommerce.school.ecommercebackend.checkout;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.validation.Valid;
import org.ch.ecommerce.school.ecommercebackend.checkout.dto.CreateCheckoutSessionRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
public class CheckoutController {

    private final StripeService stripeService;

    public CheckoutController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/session")
    public ResponseEntity<Map<String, Object>> createSession(@Valid @RequestBody CreateCheckoutSessionRequest req) {
        try {
            PaymentIntent intent = stripeService.createPaymentIntent(req.getAmountCents().longValue(), req.getCurrency());
            Map<String, Object> body = new HashMap<>();
            body.put("clientSecret", intent.getClientSecret());
            body.put("paymentIntentId", intent.getId());
            return ResponseEntity.ok(body);
        } catch (StripeException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
        }
    }
}
