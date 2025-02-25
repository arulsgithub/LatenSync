package com.internproject.LatenSync.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Data
@Entity
public class NetworkMetrics {



    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(length = 250, name = "device_id")
    private String deviceId;

    private double latency;
    private double packet_loss;
    private double throughput;
    private double jitter;

    @Column(length = 50)
    private String status;

    private Timestamp timestamp;

    @ManyToOne
    @JoinColumn(name = "device_id", referencedColumnName = "device_id", insertable = false, updatable = false)
    private Device device;
}