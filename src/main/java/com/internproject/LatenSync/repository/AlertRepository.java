package com.internproject.LatenSync.repository;

import com.internproject.LatenSync.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert,Long> {
}
