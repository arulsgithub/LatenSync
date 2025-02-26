package com.internproject.LatenSync.webSocket;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Add endpoint with SockJS support for fallback
        registry.addEndpoint("/wss")
                .setAllowedOrigins("http://localhost:5173") // Allow React frontend
                .withSockJS(); // Fallback for older browsers

        // Add the same endpoint without SockJS for direct WebSocket connection
        registry.addEndpoint("/wss")
                .setAllowedOrigins("http://localhost:5173");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/user"); // Message broadcasting
        registry.setApplicationDestinationPrefixes("/app"); // Prefix for sending messages
        registry.setUserDestinationPrefix("/user"); // Private messaging
    }
}