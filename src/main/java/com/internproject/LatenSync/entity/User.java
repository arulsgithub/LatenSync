package com.internproject.LatenSync.entity;

import jakarta.persistence.Id;

import java.util.List;

public class User {

    @Id
    private String id;
    private String user_name;
    private String password;
    private List<Device> list_devices;
}
