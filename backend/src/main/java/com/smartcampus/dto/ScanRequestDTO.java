package com.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScanRequestDTO {
    @NotBlank(message = "QR Code is required")
    private String qrCode;

    @NotBlank(message = "Scan type is required")
    @Pattern(regexp = "entry|exit", message = "Type must be 'entry' or 'exit'")
    private String type;
}
