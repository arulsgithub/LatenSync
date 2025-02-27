package com.internproject.LatenSync.controller;

import com.internproject.LatenSync.entity.Alert;
import com.internproject.LatenSync.entity.NetworkMetrics;
import com.internproject.LatenSync.repository.AlertRepository;
import com.internproject.LatenSync.service.DataCollectionService;
import com.internproject.LatenSync.service.NetworkMetricsService;
import com.internproject.LatenSync.utility.CsvExporter;
import com.internproject.LatenSync.utility.ExcelExporter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/metrics")
public class NetworkMetricsController {

    @Autowired
    private DataCollectionService dataCollectionService;
    @Autowired
    private NetworkMetricsService networkMetricsService;

    @Autowired
    private AlertRepository alertRepository;

    @PostMapping("/start/{deviceId}")
    public ResponseEntity<String> startMonitoring(@PathVariable String deviceId) throws Exception {
        dataCollectionService.collectMetrics(deviceId);
        return ResponseEntity.ok("Monitoring started for device: " + deviceId);
    }




    @GetMapping("/download/{deviceId}/{limit}")
    public void downloadMetrics(
            @PathVariable String deviceId,
            @PathVariable int limit,
            @RequestParam(required = false, defaultValue = "csv") String format,
            HttpServletResponse response) throws IOException {

        // Fetch metrics for the device with a limit on the number of records
        List<NetworkMetrics> metrics = networkMetricsService.getMetricsByDeviceId(deviceId, limit);

        if (metrics.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("No metrics found for device: " + deviceId);
            return;
        }

        // Set response headers based on the format
        if ("csv".equalsIgnoreCase(format)) {
            response.setContentType("text/csv");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=metrics_" + deviceId + ".csv");
            CsvExporter.exportToCsv(response.getWriter(), metrics);
        } else if ("xls".equalsIgnoreCase(format)) {
            response.setContentType("application/vnd.ms-excel");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=metrics_" + deviceId + ".xls");
            ExcelExporter.exportToExcel(response.getOutputStream(), metrics);
        } else {
            throw new IllegalArgumentException("Unsupported format: " + format);
        }
    }
    @PostMapping("/stop/{deviceId}")
    public ResponseEntity<String> stopMonitoring(@PathVariable String deviceId) {
        dataCollectionService.stopMonitoring(deviceId);
        return ResponseEntity.ok("Monitoring stopped for device: " + deviceId);
    }


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

    @GetMapping(value = "/stream/{deviceId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamMetrics(@PathVariable String deviceId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        new Thread(() -> {
            try {
                while (dataCollectionService.isMonitoring(deviceId)) {
                    List<NetworkMetrics> latestMetrics = networkMetricsService.getMetricsByDeviceId(deviceId);
                    if (!latestMetrics.isEmpty()) {
                        emitter.send(latestMetrics.getLast());
                    }
                    Thread.sleep(3000);
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