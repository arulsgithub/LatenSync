package com.internproject.LatenSync.repository;

import com.internproject.LatenSync.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {

    User findByUserName(String userName);
}
