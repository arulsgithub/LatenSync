package com.internproject.LatenSync.service.impl;

import com.internproject.LatenSync.entity.Alert;
import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.entity.NetworkMetrics;
import com.internproject.LatenSync.entity.User;
import com.internproject.LatenSync.repository.AlertRepository;
import com.internproject.LatenSync.repository.NetworkMetricsRepository;
import com.internproject.LatenSync.service.DataCollectionService;
import com.internproject.LatenSync.service.DeviceService;
import com.internproject.LatenSync.service.EmailService;
import com.internproject.LatenSync.service.UserService;
import com.internproject.LatenSync.webSocket.WebSocketNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.security.concurrent.DelegatingSecurityContextRunnable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DataCollectionServiceImpl implements DataCollectionService {

    @Autowired
    private NetworkMetricsRepository networkMetricsRepository;

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private WebSocketNotificationService webSocketNotificationService;

    @Autowired
    private EmailService emailService; // Inject EmailService
    @Autowired
    private UserService userService;

    private final ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
    private final ConcurrentHashMap<String, ScheduledFuture<?>> activeTasks = new ConcurrentHashMap<>();

    public DataCollectionServiceImpl() {
        taskScheduler.initialize();
    }

    public String currentUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    @Override
    public double getThroughput() {
        return new Random().nextDouble() * 88;
    }

    @Override
    public String run(String ip_addr) throws IOException {
        Process process = Runtime.getRuntime().exec("ping -n 1 " + ip_addr);
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = bufferedReader.readLine()) != null) {
            sb.append(line).append("\n");
        }
        return sb.toString();
    }

    @Override
    public double getPacketLoss(String ping_str) {
        Pattern pattern = Pattern.compile("Lost = \\d+ \\((\\d+)% loss\\)");
        Matcher matcher = pattern.matcher(ping_str);
        return matcher.find() ? Double.parseDouble(matcher.group(1)) : 0.0;
    }

    @Override
    public double getLatency(String ping_str) {
        Pattern pattern = Pattern.compile("Minimum = (\\d+)ms, Maximum = (\\d+)ms, Average = (\\d+)ms");
        Matcher matcher = pattern.matcher(ping_str);
        return matcher.find() ? Double.parseDouble(matcher.group(3)) : 0.0;
    }

    @Override
    public double getJitter() {
        return new Random().nextDouble() * 22;
    }


    @Override
    public void collectMetrics(String deviceId) {
        if (activeTasks.containsKey(deviceId)) {
            System.out.println("Device " + deviceId + " is already being monitored.");
            return;
        }

        Device currentDevice = deviceService.getDeviceById(deviceId);
        String deviceIp = currentDevice.getIp_addr();

        SecurityContext securityContext = SecurityContextHolder.getContext();

        ScheduledFuture<?> future = taskScheduler.scheduleAtFixedRate(new DelegatingSecurityContextRunnable(() -> {
            try {
                String pingData = run(deviceIp);
                double latency = getLatency(pingData);
                double packetLoss = getPacketLoss(pingData);
                double jitter = getJitter();
                double throughput = getThroughput();
                String status = getDeviceStatus(latency, packetLoss, jitter, throughput);

                NetworkMetrics metrics = new NetworkMetrics();
                metrics.setDeviceId(deviceId);
                metrics.setJitter(jitter);
                metrics.setThroughput(throughput);
                metrics.setStatus(status);
                metrics.setLatency(latency);
                metrics.setPacket_loss(packetLoss);
                metrics.setTimestamp(Timestamp.valueOf(LocalDateTime.now()));

                networkMetricsRepository.save(metrics);
                System.out.println("Metrics collected for device " + deviceId);

                if (latency > 80 || packetLoss > 10 || jitter > 20 || throughput > 70) {
                    String userEmail = currentUser();
                    User user = userService.getUserByUserName(userEmail);
                    sendMail(userEmail,latency,jitter,throughput,packetLoss,deviceId);
                }

            } catch (Exception e) {
                System.err.println("Error collecting metrics for device " + deviceId + ": " + e.getMessage());
            }
        }, securityContext), 1000); // 1 sec

        activeTasks.put(deviceId, future);
    }

    @Override
    public void stopMonitoring(String deviceId) {
        ScheduledFuture<?> future = activeTasks.remove(deviceId);
        if (future != null) {
            future.cancel(true);
            System.out.println("Stopped monitoring for device: " + deviceId);
        } else {
            System.out.println("No active monitoring found for device: " + deviceId);
        }
    }

    @Override
    public boolean isMonitoring(String deviceId) {
        return activeTasks.containsKey(deviceId);
    }

    @Override
    public String getDeviceStatus(double latency, double packetLoss, double jitter, double throughput) {
        if (latency == 0 && packetLoss == 0) return "Excellent";
        else if ((latency > 0 && latency <= 50) && (packetLoss > 0 && packetLoss <= 50)) return "Good";
        else return "Bad";
    }

    public void sendMail(String userEmail, double latency, double jitter, double throughput, double packetLoss, String deviceId){

        StringBuilder emailMessage = new StringBuilder();


        if (packetLoss > 10) {
            emailMessage.append(String.format("Packet Loss: %s%%\n", packetLoss));
        }
        if (latency > 80) {
            emailMessage.append(String.format("Latency: %.2f ms\n", latency));
        }
        if (jitter > 20) {
            emailMessage.append(String.format("Jitter: %.2f ms\n", jitter));
        }
        if (throughput > 70) {
            emailMessage.append(String.format("Throughput: %.2f Mbps\n", throughput));
        }

        Alert alert = new Alert();


        String emailSubject = "Critical Network Metrics Alert";
        String finalMessage = "Critical network metrics detected for device " + deviceId + ":\n\n" + emailMessage;

        alert.setDevice_id(deviceId);
        alert.setMessage(emailMessage.toString());
        alert.setTime(Timestamp.valueOf(LocalDateTime.now()));

        alertRepository.save(alert);

        User user = userService.getUserByUserName(userEmail);

        if (userEmail != null && !userEmail.isEmpty() && user.getUser_type().equals("user")) {
            //emailService.sendEmail(userEmail, emailSubject, finalMessage);
            System.out.println("Email sent to " + userEmail);
        } else {
            System.out.println("No email address associated with device " + deviceId);
        }
    }

    @Override
    public void sendAlert(String device_id) {
        Alert alert = new Alert();
        alert.setDevice_id(device_id);
        alert.setMessage("Critical alert for device " + device_id);
        alert.setTime(Timestamp.valueOf(LocalDateTime.now()));

        alertRepository.save(alert);

        webSocketNotificationService.sendNotification(device_id, alert.getMessage());
        webSocketNotificationService.sendBroadcastNotification(alert.getMessage());
    }



}