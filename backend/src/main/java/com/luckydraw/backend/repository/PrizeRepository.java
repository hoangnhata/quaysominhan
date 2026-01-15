package com.luckydraw.backend.repository;

import com.luckydraw.backend.model.Prize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PrizeRepository extends JpaRepository<Prize, Long> {
    @Query("SELECT p FROM Prize p WHERE p.remainingQuantity > 0")
    List<Prize> findAvailablePrizes();
}

