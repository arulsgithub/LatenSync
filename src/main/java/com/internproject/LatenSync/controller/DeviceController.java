package com.internproject.LatenSync.controller;

import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    DeviceService deviceService;

    @GetMapping
    public ResponseEntity<List<String>> listAllDeviceIds() {
        // Check authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return new ResponseEntity<>(deviceService.getAllDeviceIds(), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Device> addDevice(@RequestBody Device device) {
        // Check authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Device savedDevice = deviceService.addDevice(device);
        return new ResponseEntity<>(savedDevice, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeDevice(@PathVariable("id") String d_id) {
        // Check authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        deviceService.removeDevice(d_id);
        return new ResponseEntity<>("Device removed successfully", HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable("id") String d_id) {
        // Check authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return new ResponseEntity<>(deviceService.getDeviceById(d_id), HttpStatus.FOUND);
    }

    @GetMapping("/user/{userName}")
    public ResponseEntity<List<Device>> getDevicesByUserName(@PathVariable String userName) {
        // Check authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return new ResponseEntity<>(deviceService.getDevicesByUserName(userName), HttpStatus.OK);
    }
}
