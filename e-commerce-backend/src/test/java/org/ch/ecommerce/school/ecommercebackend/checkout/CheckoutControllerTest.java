package org.ch.ecommerce.school.ecommercebackend.checkout;

import com.stripe.model.PaymentIntent;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CheckoutController.class)
@AutoConfigureMockMvc(addFilters = false)
class CheckoutControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private StripeService stripeService;

    @TestConfiguration
    static class MockConfig {
        @Bean
        StripeService stripeService() { return Mockito.mock(StripeService.class); }
    }

    @Test
    void createSession_success() throws Exception {
        PaymentIntent intent = Mockito.mock(PaymentIntent.class);
        when(intent.getClientSecret()).thenReturn("cs_test_123");
        when(intent.getId()).thenReturn("pi_test_123");
        when(stripeService.createPaymentIntent(anyLong(), anyString())).thenReturn(intent);

        String body = "{\n  \"amountCents\": 1200,\n  \"currency\": \"CHF\"\n}";

        mockMvc.perform(post("/api/checkout/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clientSecret").value("cs_test_123"))
                .andExpect(jsonPath("$.paymentIntentId").value("pi_test_123"));
    }

    @Test
    void createSession_validationError_amountTooSmall() throws Exception {
        String body = "{\n  \"amountCents\": 0,\n  \"currency\": \"CHF\"\n}";

        mockMvc.perform(post("/api/checkout/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }
}
