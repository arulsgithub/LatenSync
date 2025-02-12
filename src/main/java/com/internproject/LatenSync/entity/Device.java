package com.internproject.LatenSync.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
public class Device {

    @Id
    private String device_id;
    @Column(length = 100)
    private String device_name;
    @Column(length = 100)
    private String device_type;
    @Column(length = 100)
    private String ip_addr;
    @Column(length = 100)
    private String mac_addr;
    @Column(length = 100)
    private String device_status;
}
