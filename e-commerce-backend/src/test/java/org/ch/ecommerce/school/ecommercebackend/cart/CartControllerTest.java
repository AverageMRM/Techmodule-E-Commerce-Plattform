package org.ch.ecommerce.school.ecommercebackend.cart;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CartController.class)
@AutoConfigureMockMvc(addFilters = false)
class CartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private org.ch.ecommerce.school.ecommercebackend.product.ProductRepository productRepository;

    @TestConfiguration
    static class MockConfig {
        @Bean CartRepository cartRepository() { return Mockito.mock(CartRepository.class); }
        @Bean CartItemRepository cartItemRepository() { return Mockito.mock(CartItemRepository.class); }
        @Bean org.ch.ecommerce.school.ecommercebackend.product.ProductRepository productRepository() { return Mockito.mock(org.ch.ecommerce.school.ecommercebackend.product.ProductRepository.class); }
    }

    @Test
    void addItem_qtyLessOrEqualZero_returnsBadRequest() throws Exception {
        String body = "{\n  \"productId\": 1,\n  \"qty\": 0\n}";
        mockMvc.perform(post("/api/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateItem_missingQty_returnsBadRequest() throws Exception {
        // Ensure the controller finds an item, then fails validation on missing qty
        CartItem existing = new CartItem();
        when(cartItemRepository.findById(anyLong())).thenReturn(java.util.Optional.of(existing));
        String body = "{}";
        mockMvc.perform(patch("/api/cart/items/123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteItem_notFound_returnsNotFound() throws Exception {
        when(cartItemRepository.findById(anyLong())).thenReturn(Optional.empty());
        mockMvc.perform(delete("/api/cart/items/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void addItem_productNotFound_returnsNotFound() throws Exception {
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());
        String body = "{\n  \"productId\": 999,\n  \"qty\": 1\n}";
        mockMvc.perform(post("/api/cart/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound());
    }
}
