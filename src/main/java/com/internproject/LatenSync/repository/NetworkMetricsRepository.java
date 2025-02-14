package com.internproject.LatenSync.repository;

import com.internproject.LatenSync.entity.NetworkMetrics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NetworkMetricsRepository extends JpaRepository<NetworkMetrics, Long> {
    List<NetworkMetrics> findByDeviceId(String deviceId);
}

