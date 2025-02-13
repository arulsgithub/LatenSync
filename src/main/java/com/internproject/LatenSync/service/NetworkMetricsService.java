package com.internproject.LatenSync.service;

import com.internproject.LatenSync.entity.Device;
import com.internproject.LatenSync.entity.NetworkMetrics;

import java.util.List;

public interface NetworkMetricsService {

    NetworkMetrics addMetrics(NetworkMetrics metrics);
    List<NetworkMetrics> getAllMetrics();
    void removeMetrics(Long id);
    NetworkMetrics getMetricsById(Long id);
}
