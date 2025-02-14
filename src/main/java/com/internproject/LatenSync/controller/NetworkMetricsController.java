package com.internproject.LatenSync.controller;

import com.internproject.LatenSync.entity.NetworkMetrics;
import com.internproject.LatenSync.service.DataCollectionService;
import com.internproject.LatenSync.service.NetworkMetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Component
@RestController
@RequestMapping("/api/metrics")
public class NetworkMetricsController {

    @Autowired
    private DataCollectionService dataCollectionService;
    @Autowired
    private NetworkMetricsService networkMetricsService;


    @GetMapping("/collect/{deviceId}")
    public ResponseEntity<List<NetworkMetrics>> collectMetrics(@PathVariable String deviceId) throws Exception {
            dataCollectionService.collectMetrics(deviceId);
            List<NetworkMetrics> metrics = networkMetricsService.getAllMetrics();
            return new ResponseEntity<>(metrics, HttpStatus.OK);
    }

}
