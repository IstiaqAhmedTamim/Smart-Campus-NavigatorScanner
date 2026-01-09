package com.smartcampus.integration;

import com.smartcampus.model.ScanRequestDTO;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class ExternalApiGateway {
    
    public void notifyExternalSystem(ScanRequestDTO scan) {
        try {
            URL url = new URL("https://api.campus-system.edu/v1/sync");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            
            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = scan.toString().getBytes("utf-8");
                os.write(input, 0, input.length);
            }
            
            int responseCode = conn.getResponseCode();
            System.out.println("External Sync Status: " + responseCode);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
