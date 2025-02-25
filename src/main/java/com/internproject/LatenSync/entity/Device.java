package com.internproject.LatenSync.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

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
    private String location;

    @Column(name = "user_name", length = 100)
    @JsonProperty("user_name")
    private String userName;


    @ManyToOne
    @JoinColumn(name = "user_name", referencedColumnName = "user_name", insertable = false, updatable = false)
    private User user;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // Add this annotation
    private List<NetworkMetrics> networkMetrics;
}