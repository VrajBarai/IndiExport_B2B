package com.IndiExport.backend.dto.admin;

import com.IndiExport.backend.entity.User.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
public class AdminUserResponse {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private UserStatus status;
    private Set<String> roles;
    private LocalDateTime createdAt;
}
