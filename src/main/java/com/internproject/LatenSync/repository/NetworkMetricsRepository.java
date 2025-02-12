package com.internproject.LatenSync.repository;

import com.internproject.LatenSync.entity.NetworkMetrics;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NetworkMetricsRepository extends JpaRepository<NetworkMetrics,Long> {
}
