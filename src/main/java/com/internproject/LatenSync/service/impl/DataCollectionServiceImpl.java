package com.internproject.LatenSync.service.impl;

import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.entity.NetworkMetrics;
import com.internproject.LatenSync.repository.DeviceRepository;
import com.internproject.LatenSync.repository.NetworkMetricsRepository;
import com.internproject.LatenSync.service.DataCollectionService;
import com.internproject.LatenSync.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Component
public class DataCollectionServiceImpl implements DataCollectionService {

    @Autowired
    NetworkMetricsRepository networkMetricsRepository;

    @Autowired
    DeviceService deviceService;

    @Override
    public double getThroughput() {
        return new Random().nextDouble()*88;
    }

    @Override
    public String run(String ip_addr) throws IOException {

        Process process = Runtime.getRuntime().exec("ping -n 5 "+ip_addr);
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        StringBuilder sb = new StringBuilder();
        while (bufferedReader.readLine() != null) {
            line = bufferedReader.readLine();
            sb.append(line).append("\n");

        }
        return sb.toString();
    }

    @Override
    public double getPacketLoss(String ping_str){
        Pattern pattern = Pattern.compile("Lost = \\d+ \\((\\d+)% loss\\)");
        Matcher matcher = pattern.matcher(ping_str);
        String packet_loss = matcher.find() ? matcher.group(1) : "N/A";

        if ("N/A".equals(packet_loss)) {
            return 0.0; // or return -1 or another default value
        }

        return Double.parseDouble(packet_loss);
    }

    @Override
    public double getLatency(String ping_str) {

        Pattern pattern = Pattern.compile("Minimum = (\\d+)ms, Maximum = (\\d+)ms, Average = (\\d+)ms");
        Matcher matcher = pattern.matcher(ping_str);

        String latency_min = "N/A", latency_max = "N/A", latency_avg = "N/A";
        if (matcher.find()) {
            latency_min = matcher.group(1);
            latency_max = matcher.group(2);
            latency_avg = matcher.group(3);
        }

        if ("N/A".equals(latency_avg)) {
            return 0.0;
        }
        return Double.parseDouble(latency_avg);
    }

    @Override
    public double getJitter() {
        return new Random().nextDouble()*22;
    }

    @Scheduled(fixedRate = 60000)
    @Override
    public void collectMetrics(String device_id) throws Exception {

        Device current_device = deviceService.getDeviceById(device_id);


        String device_ip = current_device.getIp_addr();
        String ping = run(device_ip);
        double latency = getLatency(ping);
        double packet_loss = getPacketLoss(ping);
        String status = (latency > 120 || packet_loss > 5)?"Poor":"Good";

        NetworkMetrics metrics = new NetworkMetrics();
        metrics.setDevice_id(device_id);
        metrics.setJitter(getJitter());
        metrics.setThroughput(getThroughput());
        metrics.setStatus(status);
        metrics.setLatency(latency);
        metrics.setPacket_loss(packet_loss);
        metrics.setTimestamp(Timestamp.valueOf(LocalDateTime.now()));

        networkMetricsRepository.save(metrics);
    }
}
