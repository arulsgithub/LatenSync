package com.internproject.LatenSync.service.impl;

import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.exception.ResourceNotFoundException;
import com.internproject.LatenSync.repository.DeviceRepository;
import com.internproject.LatenSync.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Component
@Service
public class DeviceServiceImpl implements DeviceService {

    @Autowired
    DeviceRepository deviceRepository;

    @Override
    public Device addDevice(Device device) {
        return deviceRepository.save(device);
    }

//    @Override
//    public List<Device> getAllDevice() {
//        return deviceRepository.findAll();
//    }

    @Override
    public void removeDevice(String id) {
        deviceRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Device","Id",id));
        deviceRepository.deleteById(id);
    }

    @Override
    public Device getDeviceById(String id) {
        return deviceRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Device","Id",id));
    }

    @Override
    public List<String> getAllDeviceIds() {
        return deviceRepository.findAll().stream()
                .map(Device::getDevice_id) // Extract only device_id
                .collect(Collectors.toList());
    }

}
