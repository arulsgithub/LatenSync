package com.internproject.LatenSync.controller;

import com.internproject.LatenSync.entity.NetworkMetrics;
import com.internproject.LatenSync.service.DataCollectionService;
import com.internproject.LatenSync.service.NetworkMetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

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

    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    // Start monitoring and stream data in real-time
    @GetMapping(value = "/stream/{deviceId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamMetrics(@PathVariable String deviceId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        new Thread(() -> {
            try {
                while (dataCollectionService.isMonitoring(deviceId)) {
                    List<NetworkMetrics> latestMetrics = networkMetricsService.getMetricsByDeviceId(deviceId);
                    if (!latestMetrics.isEmpty()) {
                        emitter.send(latestMetrics.get(latestMetrics.size() - 1));
                    }
                    Thread.sleep(5000); // Send updates every 5 seconds
                }
            } catch (IOException | InterruptedException e) {
                emitter.completeWithError(e);
            } finally {
                emitters.remove(emitter);
            }
        }).start();

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        return emitter;
    }

}