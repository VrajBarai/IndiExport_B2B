package com.IndiExport.backend.dto.admin;

import com.IndiExport.backend.entity.Product.ProductStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminProductResponse {
    private UUID id;
    private String name;
    private String sku;
    private String sellerName;
    private String companyName;
    private long pricePaise;
    private String unit;
    private int stockQuantity;
    private ProductStatus status;
    private LocalDateTime createdAt;
    private String thumbnailUrl;
}
