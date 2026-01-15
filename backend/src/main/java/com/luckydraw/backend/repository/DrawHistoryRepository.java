package com.luckydraw.backend.repository;

import com.luckydraw.backend.model.DrawHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface DrawHistoryRepository extends JpaRepository<DrawHistory, Long> {
    @Transactional
    void deleteByParticipantId(Long participantId);

    @Transactional
    void deleteByPrizeId(Long prizeId);
}
