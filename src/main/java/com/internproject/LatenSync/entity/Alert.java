package com.internproject.LatenSync.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Data
@Entity
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Alert_id;
    @Column(length = 250)
    private String device_id;
    private Timestamp time;
    @Column(length = 200)
    private String message;
}