package com.smartcampus.service;

import com.smartcampus.model.Location;
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Demonstrates TCP Socket Networking and Multithreading.
 * This class handles concurrent connections from clients for real-time crowd updates.
 */
public class TCPSocketServer {
    private static final int PORT = 8080;
    private final ExecutorService threadPool = Executors.newFixedThreadPool(10);

    public void start() {
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Java TCP Server started on port " + PORT);
            while (true) {
                Socket clientSocket = serverSocket.accept();
                // Process each client in a separate thread (Concurrency)
                threadPool.execute(() -> handleClient(clientSocket));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void handleClient(Socket socket) {
        try (ObjectInputStream in = new ObjectInputStream(socket.getInputStream());
             ObjectOutputStream out = new ObjectOutputStream(socket.getOutputStream())) {
            
            // Read serialized data from client
            String qrCode = (String) in.readObject();
            System.out.println("Received QR Scan via TCP: " + qrCode);
            
            // Send response back
            out.writeObject("Update Received");
            
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
