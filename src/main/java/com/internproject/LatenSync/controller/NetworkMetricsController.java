package com.internproject.LatenSync.controller;

import com.internproject.LatenSync.entity.NetworkMetrics;
import com.internproject.LatenSync.service.DataCollectionService;
import com.internproject.LatenSync.service.NetworkMetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
public class NetworkMetricsController {

    @Autowired
    private DataCollectionService dataCollectionService;

    @Autowired
    private NetworkMetricsService networkMetricsService;

    // Start monitoring a device
    @PostMapping("/start/{deviceId}")
    public ResponseEntity<String> startMonitoring(@PathVariable String deviceId) throws Exception {
        dataCollectionService.collectMetrics(deviceId);
        return ResponseEntity.ok("Monitoring started for device: " + deviceId);
    }

    // Stop monitoring a device
    @PostMapping("/stop/{deviceId}")
    public ResponseEntity<String> stopMonitoring(@PathVariable String deviceId) {
        dataCollectionService.stopMonitoring(deviceId);
        return ResponseEntity.ok("Monitoring stopped for device: " + deviceId);
    }

    // Get all collected metrics
    @GetMapping("/all")
    public ResponseEntity<List<NetworkMetrics>> getAllMetrics() {
        List<NetworkMetrics> metrics = networkMetricsService.getAllMetrics();
        return new ResponseEntity<>(metrics, HttpStatus.OK);
    }

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<List<NetworkMetrics>> getMetricsByDevice(@PathVariable String deviceId) {
        List<NetworkMetrics> metrics = networkMetricsService.getMetricsByDeviceId(deviceId);
        if (metrics.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(metrics);
        }
        return ResponseEntity.ok(metrics);
    }

}
