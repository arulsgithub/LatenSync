package com.internproject.LatenSync.controller;

import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.entity.User;
import com.internproject.LatenSync.service.DeviceService;
import com.internproject.LatenSync.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;



import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;



@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    @Autowired
    DeviceService deviceService;

    @Autowired
    UserService userService;

    @GetMapping
    public ResponseEntity<List<String>> listCurrentUserDevices() {
        // Get the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }


        String username = authentication.getName();

        User user = userService.getUserByUserName(username);

        String userType = user.getUser_type();  // Now we have the user_type

        if ("user".equals(userType)) {
            // Fetch devices for the current user
            List<String> deviceIds = deviceService.getDevicesByUserName(username)
                    .stream()
                    .map(Device::getDevice_id)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(deviceIds);
        } else if ("admin".equals(userType)) {
            return new ResponseEntity<>(deviceService.getAllDeviceIds(), HttpStatus.OK);
        }

        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
    }



    @PostMapping("/add")
    public ResponseEntity<Device> addDevice(@RequestBody Device device) {

        Device savedDevice = deviceService.addDevice(device);
        return new ResponseEntity<>(savedDevice, HttpStatus.OK);
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

        return new ResponseEntity<>(deviceService.getDeviceById(d_id), HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getDeviceCount(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return new ResponseEntity<>(deviceService.getDeviceCount(),HttpStatus.OK);
    }


    @PostMapping("/upload")
    public ResponseEntity<String> uploadDevices(@RequestParam("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
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
