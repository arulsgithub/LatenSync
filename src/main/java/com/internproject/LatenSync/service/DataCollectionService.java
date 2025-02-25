package com.internproject.LatenSync.service;

import com.internproject.LatenSync.entity.NetworkMetrics;

public interface DataCollectionService {

    double getThroughput();
    double getPacketLoss(String ping_str);
    double getLatency(String ping_str);
    double getJitter();
    void collectMetrics(String device_id) throws Exception;
    String run(String ip_addr) throws Exception;
    void stopMonitoring(String deviceId);

    boolean isMonitoring(String deviceId);

    String getDeviceStatus(double latency,double packetLoss,double jitter,double throughput);
    void sendAlert(String device_id);
}