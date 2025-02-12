package com.internproject.LatenSync.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Alert_id;
    @Column(length = 250)
    private String device_id;
    @Column(length = 300)
    private String metric_affected;
    private double threshold_exceeded;
    @Column(length = 50)
    private String alert_level;
    @Column(length = 50)
    private String message;
}
