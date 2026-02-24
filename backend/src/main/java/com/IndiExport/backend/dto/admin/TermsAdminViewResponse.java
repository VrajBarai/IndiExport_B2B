package com.IndiExport.backend.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TermsAdminViewResponse {
    private TermsResponse activeVersion;
    private List<TermsResponse> history;
}
