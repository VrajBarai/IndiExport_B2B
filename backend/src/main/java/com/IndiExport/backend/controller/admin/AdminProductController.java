package com.IndiExport.backend.controller.admin;

import com.IndiExport.backend.dto.admin.AdminProductResponse;
import com.IndiExport.backend.dto.admin.UpdateProductStatusRequest;
import com.IndiExport.backend.service.admin.AdminProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService productService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AdminProductResponse>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @PatchMapping("/{productId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminProductResponse> updateProductStatus(
            @PathVariable UUID productId,
            @RequestBody @Valid UpdateProductStatusRequest request) {
        return ResponseEntity.ok(productService.updateProductStatus(productId, request));
    }
}
