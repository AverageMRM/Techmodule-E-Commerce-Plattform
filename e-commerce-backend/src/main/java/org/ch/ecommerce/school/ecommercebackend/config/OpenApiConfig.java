package org.ch.ecommerce.school.ecommercebackend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI shopOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Techmodule E-Commerce API")
                        .description("OpenAPI documentation for the E-Commerce backend."
                                + "\nIncludes public catalog endpoints and will be extended with auth, checkout, and admin APIs.")
                        .version("0.0.1"));
    }
}
