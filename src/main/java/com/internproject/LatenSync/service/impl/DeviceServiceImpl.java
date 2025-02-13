package com.internproject.LatenSync.service.impl;

import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.exception.ResourceNotFoundException;
import com.internproject.LatenSync.repository.DeviceRepository;
import com.internproject.LatenSync.service.DeviceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeviceServiceImpl implements DeviceService {

    private final DeviceRepository deviceRepository;

    public DeviceServiceImpl(DeviceRepository deviceRepository){
        super();
        this.deviceRepository=deviceRepository;
    }

    @Override
    public Device addDevice(Device device) {
        return deviceRepository.save(device);
    }

    @Override
    public List<Device> getAllDevice() {
        return deviceRepository.findAll();
    }

    @Override
    public void removeDevice(String id) {
        deviceRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Device","Id",id));
        deviceRepository.deleteById(id);
    }
}
