package com.internproject.LatenSync.controller;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Handle messages sent from frontend
    @MessageMapping("/send-alert")
    @SendTo("/topic/alerts")
    public String sendAlert(String alertMessage) {
        return alertMessage; // Broadcast to all subscribers
    }

    // Additional method for programmatically sending notifications from other parts of your application
    public void sendNotificationToUser(String userId, String message) {
        messagingTemplate.convertAndSendToUser(userId, "/alerts", message);
    }

    // Method to broadcast notification to all users
    public void broadcastNotification(String message) {
        messagingTemplate.convertAndSend("/topic/alerts", message);
    }
}