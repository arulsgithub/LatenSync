package com.internproject.LatenSync.service;

import com.internproject.LatenSync.entity.Device;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


public interface DeviceService {
    Device addDevice(Device device);
    void removeDevice(String id);
    Device getDeviceById(String id);
    List<String> getAllDeviceIds();
    List<Device> getDevicesByUserName(String userName);
    List<Device> getAllDevices();

    List<Device> parseAndSaveExcel(MultipartFile file) throws IOException;
    Long getDeviceCount();
}