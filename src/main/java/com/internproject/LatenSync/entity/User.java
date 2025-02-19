package com.internproject.LatenSync.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(length = 100, nullable = false, unique = true)
    private String user_name;
    @Column(nullable = false)
    private String password;
    @Column(length = 50, nullable = false)
    private String user_type;
}
