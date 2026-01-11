package com.smartcampus.util;

import java.util.regex.Pattern;

public class ValidatorUtils {
    private static final Pattern STUDENT_ID_PATTERN = Pattern.compile("^[0-9]{9,11}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@uiu.ac.bd$");

    public static boolean isValidStudentId(String id) {
        return id != null && STUDENT_ID_PATTERN.matcher(id).matches();
    }

    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
}
