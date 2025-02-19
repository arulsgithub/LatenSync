package com.internproject.LatenSync.controller;

import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/devices")
@Component
public class DeviceController {

    @Autowired
    DeviceService deviceService;

//    @GetMapping
//    public List<Device> listAllDevice(){
//        return deviceService.getAllDevice();
//    }

    @GetMapping
    public ResponseEntity<List<String>> listAllDeviceIds(){
        return new ResponseEntity<>(deviceService.getAllDeviceIds(), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Device> addDevice(@RequestBody Device device){
        return new ResponseEntity<>(deviceService.addDevice(device), HttpStatus.CREATED);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeDevice(@PathVariable("id") String d_id){
        deviceService.removeDevice(d_id);
        return new ResponseEntity<>("Device removed successfully",HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable("id") String d_id){
        return new ResponseEntity<>(deviceService.getDeviceById(d_id),HttpStatus.FOUND);
    }
}