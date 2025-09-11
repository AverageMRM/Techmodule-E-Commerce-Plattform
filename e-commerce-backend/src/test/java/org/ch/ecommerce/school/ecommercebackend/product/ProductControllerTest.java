package org.ch.ecommerce.school.ecommercebackend.product;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @TestConfiguration
    static class MockConfig {
        @Bean
        ProductRepository productRepository() {
            return Mockito.mock(ProductRepository.class);
        }
    }

    @Test
    void getBySlug_returnsProduct() throws Exception {
        Product p = new Product();
        p.setId(1L);
        p.setSlug("basic-tshirt");
        p.setTitle("Basic T-Shirt");
        when(productRepository.findBySlug("basic-tshirt")).thenReturn(Optional.of(p));

        mockMvc.perform(get("/api/products/basic-tshirt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("basic-tshirt"))
                .andExpect(jsonPath("$.title").value("Basic T-Shirt"));
    }

    @Test
    void getBySlug_notFound() throws Exception {
        when(productRepository.findBySlug("unknown")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/products/unknown"))
                .andExpect(status().isNotFound());
    }

    @Test
    void list_returnsPage() throws Exception {
        Product p = new Product();
        p.setId(2L);
        p.setSlug("leder-geldboerse");
        p.setTitle("Leder Geldbörse");
        Page<Product> page = new PageImpl<>(List.of(p), PageRequest.of(0,20), 1);
        // When using JpaSpecificationExecutor, Spring will call findAll(Specification, Pageable)
        when(productRepository.findAll(any(org.springframework.data.jpa.domain.Specification.class), any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].slug").value("leder-geldboerse"));
    }
}
