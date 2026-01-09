package com.smartcampus.util;

import com.smartcampus.model.Location;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Demonstrates Serialization and File I/O for persistent storage.
 */
public class DataSerializer {
    private static final String FILE_NAME = "crowd_data.ser";

    public static void saveState(List<Location> locations) {
        try (ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(FILE_NAME))) {
            out.writeObject(locations);
            System.out.println("Data successfully serialized to " + FILE_NAME);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @SuppressWarnings("unchecked")
    public static List<Location> loadState() {
        File file = new File(FILE_NAME);
        if (!file.exists()) return new ArrayList<>();

        try (ObjectInputStream in = new ObjectInputStream(new FileInputStream(FILE_NAME))) {
            return (List<Location>) in.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
