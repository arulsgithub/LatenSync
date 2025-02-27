package com.internproject.LatenSync.service.impl;

import com.internproject.LatenSync.entity.NetworkMetrics;
import com.internproject.LatenSync.exception.ResourceNotFoundException;
import com.internproject.LatenSync.repository.NetworkMetricsRepository;
import com.internproject.LatenSync.service.NetworkMetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import java.util.List;

@Component
@Service
public class NetworkMetricsServiceImpl implements NetworkMetricsService {

    @Autowired
    NetworkMetricsRepository networkMetricsRepository;

    @Override
    public NetworkMetrics addMetrics(NetworkMetrics metrics) {
        return networkMetricsRepository.save(metrics);
    }

    @Override
    public List<NetworkMetrics> getAllMetrics() {
        return networkMetricsRepository.findAll();
    }

    @Override
    public void removeMetrics(Long id) {
        networkMetricsRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Metrics","Id",id));
        networkMetricsRepository.deleteById(id);
    }

    @Override
    public List<NetworkMetrics> getMetricsByDeviceId(String deviceId) {
        return networkMetricsRepository.findByDeviceId(deviceId);
    }

    @Override
    public List<NetworkMetrics> getMetricsByDeviceId(String deviceId, int limit) {
        return networkMetricsRepository.findByDeviceIdOrderByTimestampDesc(deviceId, PageRequest.of(0, limit));
    }
}