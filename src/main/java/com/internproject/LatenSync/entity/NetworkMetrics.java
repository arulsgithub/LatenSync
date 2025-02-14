package com.internproject.LatenSync.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.time.ZonedDateTime;

@Data
//@Getter
//@Setter
//@AllArgsConstructor
@Entity
public class NetworkMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(length = 250)
    private String device_id;
    private double latency;
    private double packet_loss;
    private double throughput;
    private double jitter;
    @Column(length = 50)
    private String status;
    private Timestamp timestamp;
}
