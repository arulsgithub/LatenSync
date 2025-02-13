package com.internproject.LatenSync.controller;

import com.internproject.LatenSync.entity.NetworkMetrics;
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
    NetworkMetricsService networkMetricsService;

    @GetMapping
    public List<NetworkMetrics> listAllDevice(){
        return networkMetricsService.getAllMetrics();
    }

    @PostMapping("/add")
    public ResponseEntity<NetworkMetrics> addDevice(@RequestBody NetworkMetrics metrics){
        return new ResponseEntity<>(networkMetricsService.addMetrics(metrics), HttpStatus.CREATED);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeDevice(@PathVariable("id") Long d_id){
        networkMetricsService.removeMetrics(d_id);
        return new ResponseEntity<>("Device removed successfully",HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<NetworkMetrics> getDeviceById(@PathVariable("id") Long d_id){
        return new ResponseEntity<>(networkMetricsService.getMetricsById(d_id),HttpStatus.FOUND);
    }
}
