package com.internproject.LatenSync.service;

import com.internproject.LatenSync.entity.Device;

import java.util.List;

public interface DeviceService {

    Device addDevice(Device device);
    //List<Device> getAllDevice();
    List<String> getAllDeviceIds();
    void removeDevice(String id);
    Device getDeviceById(String id);

}
