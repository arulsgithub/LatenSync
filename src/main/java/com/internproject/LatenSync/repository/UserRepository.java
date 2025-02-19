package com.internproject.LatenSync.repository;

import com.internproject.LatenSync.entity.NetworkMetrics;
import com.internproject.LatenSync.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User,Long> {

    User findByUserName(String userName);
}
