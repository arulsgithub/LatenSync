
package com.internproject.LatenSync.service;

import com.internproject.LatenSync.entity.NetworkMetrics;

import java.util.List;

public interface NetworkMetricsService {

    NetworkMetrics addMetrics(NetworkMetrics metrics);
    List<NetworkMetrics> getAllMetrics();
    void removeMetrics(Long id);
    List<NetworkMetrics> getMetricsByDeviceId(String deviceId);

    List<NetworkMetrics> getMetricsByDeviceId(String deviceId, int limit);
}
