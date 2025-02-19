package com.internproject.LatenSync.repository;

import com.internproject.LatenSync.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, String> {
    List<Device> findByUser_UserName(String userName);
}