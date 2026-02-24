package com.IndiExport.backend.service.admin;

import com.IndiExport.backend.dto.admin.AdminUserResponse;
import com.IndiExport.backend.entity.Role;
import com.IndiExport.backend.entity.User;
import com.IndiExport.backend.entity.User.UserStatus;
import com.IndiExport.backend.exception.ResourceNotFoundException;
import com.IndiExport.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<AdminUserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToAdminResponse);
    }

    @Transactional
    public AdminUserResponse toggleUserStatus(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() == UserStatus.ACTIVE) {
            user.setStatus(UserStatus.SUSPENDED);
        } else if (user.getStatus() == UserStatus.SUSPENDED) {
            user.setStatus(UserStatus.ACTIVE);
        }
        
        return mapToAdminResponse(userRepository.save(user));
    }

    private AdminUserResponse mapToAdminResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .status(user.getStatus())
                .roles(user.getRoles().stream()
                        .map(role -> "ROLE_" + role.getName().name())
                        .collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}
