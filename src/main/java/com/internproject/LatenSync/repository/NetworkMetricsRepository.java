package com.internproject.LatenSync.repository;

import com.internproject.LatenSync.entity.NetworkMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface NetworkMetricsRepository extends JpaRepository<NetworkMetrics, Long> {
    List<NetworkMetrics> findByDeviceId(String deviceId);
    List<NetworkMetrics> findByDeviceIdOrderByTimestampDesc(String deviceId, PageRequest pageRequest);
}
