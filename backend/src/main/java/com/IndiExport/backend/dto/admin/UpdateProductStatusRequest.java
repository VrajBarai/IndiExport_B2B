package com.IndiExport.backend.dto.admin;

import com.IndiExport.backend.entity.Product.ProductStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateProductStatusRequest {
    @NotNull(message = "Status is required")
    private ProductStatus status;
    private String reason;
}
