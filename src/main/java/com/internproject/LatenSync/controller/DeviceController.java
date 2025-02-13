package com.internproject.LatenSync.controller;

import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.service.DeviceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService){
        super();
        this.deviceService=deviceService;
    }

    @GetMapping
    public List<Device> listAllDevice(){
        return deviceService.getAllDevice();
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
}
