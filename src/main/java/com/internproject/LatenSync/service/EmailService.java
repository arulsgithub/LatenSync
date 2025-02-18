package com.internproject.LatenSync.service;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
}
