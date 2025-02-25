package com.internproject.LatenSync.controller;

import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    DeviceService deviceService;

    @GetMapping
    public ResponseEntity<List<String>> listAllDeviceIds() {
        return new ResponseEntity<>(deviceService.getAllDeviceIds(), HttpStatus.OK);
    }



    @PostMapping("/add")
    public ResponseEntity<Device> addDevice(@RequestBody Device device) {
        Device savedDevice = deviceService.addDevice(device);
        return new ResponseEntity<>(savedDevice, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeDevice(@PathVariable("id") String d_id) {
        deviceService.removeDevice(d_id);
        return new ResponseEntity<>("Device removed successfully", HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable("id") String d_id) {
        return new ResponseEntity<>(deviceService.getDeviceById(d_id), HttpStatus.FOUND);
    }

    @GetMapping("/user/{userName}")
    public ResponseEntity<List<Device>> getDevicesByUserName(@PathVariable String userName) {
        return new ResponseEntity<>(deviceService.getDevicesByUserName(userName), HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getDeviceCount(){
        return new ResponseEntity<>(deviceService.getDeviceCount(),HttpStatus.OK);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadDevices(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty!");
        }

        try {
            List<Device> savedDevices = deviceService.parseAndSaveExcel(file);
            return ResponseEntity.ok("Successfully added " + savedDevices.size() + " devices!");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }
}