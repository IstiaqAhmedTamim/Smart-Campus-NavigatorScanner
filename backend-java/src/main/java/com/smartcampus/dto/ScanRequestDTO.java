package com.smartcampus.dto;

import java.io.Serializable;

public class ScanRequestDTO implements Serializable {
    private String qrCode;
    private String userId;
    private String scanType; // ENTRY or EXIT

    public ScanRequestDTO() {}

    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getScanType() { return scanType; }
    public void setScanType(String scanType) { this.scanType = scanType; }
}
