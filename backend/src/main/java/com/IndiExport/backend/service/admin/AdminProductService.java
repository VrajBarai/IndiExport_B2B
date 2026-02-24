package com.IndiExport.backend.service.admin;

import com.IndiExport.backend.dto.admin.AdminProductResponse;
import com.IndiExport.backend.dto.admin.UpdateProductStatusRequest;
import com.IndiExport.backend.entity.Product;
import com.IndiExport.backend.exception.ResourceNotFoundException;
import com.IndiExport.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<AdminProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::mapToAdminResponse);
    }

    @Transactional
    public AdminProductResponse updateProductStatus(UUID productId, UpdateProductStatusRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setStatus(request.getStatus());
        // In a real app, we'd store the rejection reason in a separate audit log or notification
        return mapToAdminResponse(productRepository.save(product));
    }

    private AdminProductResponse mapToAdminResponse(Product product) {
        return AdminProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .sku(product.getSku())
                .sellerName(product.getSeller().getUser().getFullName())
                .companyName(product.getSeller().getCompanyName())
                .pricePaise(product.getPricePaise())
                .unit(product.getQuantityUnit())
                .stockQuantity(product.getStockQuantity())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .thumbnailUrl(product.getThumbnailUrl())
                .build();
    }
}
