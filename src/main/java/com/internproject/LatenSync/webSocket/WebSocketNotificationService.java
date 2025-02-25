package com.internproject.LatenSync.webSocket;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Broadcast alert to all users
    public void sendBroadcastNotification(String message) {
        messagingTemplate.convertAndSend("/topic/alerts", message);
    }

    // Send alert to a specific user (based on device ID)
    public void sendNotification(String deviceId, String message) {
        messagingTemplate.convertAndSendToUser(deviceId, "/alerts", message);
    }
}

