package com.internproject.LatenSync.service.impl;



import com.internproject.LatenSync.entity.Alert;
import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.entity.NetworkMetrics;
import com.internproject.LatenSync.repository.AlertRepository;
import com.internproject.LatenSync.repository.NetworkMetricsRepository;
import com.internproject.LatenSync.webSocket.WebSocketNotificationService;
import com.internproject.LatenSync.service.DataCollectionService;
import com.internproject.LatenSync.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
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
   private AlertRepository alertRepository;
    @Autowired
    private DeviceService deviceService;
    @Autowired
    private WebSocketNotificationService webSocketNotificationService;

    private final ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
    private final ConcurrentHashMap<String, ScheduledFuture<?>> activeTasks = new ConcurrentHashMap<>();

    public DataCollectionServiceImpl() {
        taskScheduler.initialize();
    }

    @Override
    public double getThroughput() {
        Random random=new Random();
        return (double) Math.round(random.nextDouble()*8800)/100;
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
        Random random=new Random();
        return (double)Math.round(random.nextDouble()*2200)/100;
    }

    @Override
    public void collectMetrics(String deviceId) {
        if (activeTasks.containsKey(deviceId)) {
            System.out.println("Device " + deviceId + " is already being monitored.");
            return;
        }

        Device currentDevice = deviceService.getDeviceById(deviceId);
        String deviceIp = currentDevice.getIp_addr();

        ScheduledFuture<?> future = taskScheduler.scheduleAtFixedRate(() -> {
            try {
                String pingData = run(deviceIp);
                double latency = getLatency(pingData);
                double packetLoss = getPacketLoss(pingData);
                double jitter=getJitter();
                double throughput=getThroughput();
                String status = getDeviceStatus(latency,packetLoss,jitter,throughput);
                if(status.equals("Bad")){ sendAlert(deviceId);}
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
            } catch (Exception e) {
                System.err.println("Error collecting metrics for device " + deviceId + ": " + e.getMessage());
            }
        }, 1000); //1 secs

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
    public String getDeviceStatus(double latency,double packetLoss,double jitter, double throughput) {
        if(latency ==0 && packetLoss==0) return "Excellent";
        else if((latency>0&&latency<=50) && (packetLoss>0&&packetLoss<=50)) return "Good";
        else return "Bad";
    }

    @Override
    public void sendAlert(String device_id) {
        Alert alert = new Alert();
        alert.setDevice_id(device_id);
        alert.setMessage("Critical alert for device " + device_id );
        alert.setTime(Timestamp.valueOf(LocalDateTime.now()));

        alertRepository.save(alert);


        webSocketNotificationService.sendNotification(device_id, alert.getMessage());


        webSocketNotificationService.sendBroadcastNotification(alert.getMessage());
    }
}

