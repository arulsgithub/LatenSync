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

    // Send alert to a specific user
    public void sendNotification(String userId, String message) {
        messagingTemplate.convertAndSendToUser(userId, "/alerts", message);
    }

    // Send a JSON notification (more structured data)
    public void sendJsonNotification(String userId, Object data) {
        messagingTemplate.convertAndSendToUser(userId, "/alerts", data);
    }

    // Send a broadcast JSON notification
    public void sendBroadcastJsonNotification(Object data) {
        messagingTemplate.convertAndSend("/topic/alerts", data);
    }
}