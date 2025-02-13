package com.internproject.LatenSync.service;

import com.internproject.LatenSync.entity.Device;

import java.util.List;

public interface DeviceService {

    public Device addDevice(Device device);
    public List<Device> getAllDevice();
    public void removeDevice(String id);
}
