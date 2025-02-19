package com.internproject.LatenSync.service.impl;

import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.entity.User;
import com.internproject.LatenSync.exception.ResourceNotFoundException;
import com.internproject.LatenSync.repository.DeviceRepository;
import com.internproject.LatenSync.repository.UserRepository;
import com.internproject.LatenSync.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeviceServiceImpl implements DeviceService {

    @Autowired
    DeviceRepository deviceRepository;
    @Autowired
    UserRepository userRepository;

    @Override
    public Device addDevice(Device device) {
        if (device.getUserName() == null || device.getUserName().isEmpty()) {
            throw new IllegalArgumentException("UserName must not be null or empty");
        }

        User user = userRepository.findByUserName(device.getUserName());
        if (user == null) {
            throw new ResourceNotFoundException("User", "UserName", device.getUserName());
        }

        device.setUser(user);
        return deviceRepository.save(device);
    }


    @Override
    public void removeDevice(String id) {
        deviceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Device", "Id", id));
        deviceRepository.deleteById(id);
    }

    @Override
    public Device getDeviceById(String id) {
        return deviceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Device", "Id", id));
    }

    @Override
    public List<String> getAllDeviceIds() {
        return deviceRepository.findAll().stream()
                .map(Device::getDevice_id)
                .collect(Collectors.toList());
    }

    @Override
    public List<Device> getDevicesByUserName(String userName) {
        return deviceRepository.findByUser_UserName(userName);
    }
}