package com.internproject.LatenSync.service;

public interface DataCollectionService {

    double getThroughput();
    double getPacketLoss(String ping_str);
    double getLatency(String ping_str);
    double getJitter();
    void collectMetrics(String device_id) throws Exception;
    String run(String ip_addr) throws Exception;
    void stopMonitoring(String deviceId);
}
