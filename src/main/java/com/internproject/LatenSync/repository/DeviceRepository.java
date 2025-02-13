package com.internproject.LatenSync.repository;

import com.internproject.LatenSync.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeviceRepository extends JpaRepository<Device,String> {
}
