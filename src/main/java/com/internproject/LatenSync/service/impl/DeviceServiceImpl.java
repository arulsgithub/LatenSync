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

import java.util.List;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;


@Service
public class DeviceServiceImpl implements DeviceService {

    @Autowired
    DeviceRepository deviceRepository;
    @Autowired
    UserRepository userRepository;

    @Override
    public Device addDevice(Device device) {
        if (device.getUsername() == null || device.getUsername().isEmpty()) {
            throw new IllegalArgumentException("UserName must not be null or empty");
        }

        User user = userRepository.findByUserName(device.getUsername());
        if (user == null) {
            throw new ResourceNotFoundException("User", "UserName", device.getUsername());
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

    @Override
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }


    @Override
    public Long getDeviceCount() {
        return deviceRepository.count();
    }

    @Override
    public List<Device> parseAndSaveExcel(MultipartFile file) throws IOException {
        List<Device> devices = new ArrayList<>();
        InputStream inputStream = file.getInputStream();
        Workbook workbook = new XSSFWorkbook(inputStream);
        Sheet sheet = workbook.getSheetAt(0); // Get first sheet

        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue; // Skip header row

            Device device = new Device();
            device.setDevice_id(getStringCellValue(row.getCell(0)));
            device.setDevice_name(getStringCellValue(row.getCell(1)));
            device.setDevice_type(getStringCellValue(row.getCell(2)));
            device.setIp_addr(getStringCellValue(row.getCell(3)));
            device.setMac_addr(getStringCellValue(row.getCell(4)));
            device.setLocation(getStringCellValue(row.getCell(5)));

            devices.add(device);
        }

        workbook.close();

        // Save all devices in DB
        return deviceRepository.saveAll(devices);
    }
    private String getStringCellValue(Cell cell) {
        if (cell == null) return "";

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf((long) cell.getNumericCellValue()); // Convert to long to avoid decimals
                }
            case BOOLEAN:
                return Boolean.toString(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            case BLANK:
                return "";
            default:
                return cell.toString();
        }
    }
}