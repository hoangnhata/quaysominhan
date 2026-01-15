package com.luckydraw.backend.service;

import com.luckydraw.backend.model.*;
import com.luckydraw.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LuckyDrawService {
    private final PrizeRepository prizeRepository;
    private final ParticipantRepository participantRepository;
    private final DrawHistoryRepository drawHistoryRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final Random random = new Random();

    // --- Participant Management ---

    @Transactional
    public Participant saveParticipant(Participant participant) {
        if (participant.getCheckInCode() == null || participant.getCheckInCode().isEmpty()) {
            participant.setCheckInCode("NV-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        return participantRepository.save(participant);
    }

    @Transactional
    public void deleteParticipant(Long id) {
        // Delete history first to avoid constraint violation
        drawHistoryRepository.deleteByParticipantId(id);
        participantRepository.deleteById(id);
    }

    @Transactional
    public void resetAllWinners() {
        List<Participant> winners = participantRepository.findAll().stream()
                .filter(Participant::getIsWinner)
                .peek(p -> p.setIsWinner(false))
                .collect(Collectors.toList());
        participantRepository.saveAll(winners);
        
        // Reset prize remaining quantities
        List<Prize> prizes = prizeRepository.findAll().stream()
                .peek(p -> p.setRemainingQuantity(p.getTotalQuantity()))
                .collect(Collectors.toList());
        prizeRepository.saveAll(prizes);
        
        // Clear history
        drawHistoryRepository.deleteAll();
    }

    // --- Prize Management ---

    @Transactional
    public Prize savePrize(Prize prize) {
        if (prize.getRemainingQuantity() == null) {
            prize.setRemainingQuantity(prize.getTotalQuantity());
        }
        return prizeRepository.save(prize);
    }

    @Transactional
    public void deletePrize(Long id) {
        drawHistoryRepository.deleteByPrizeId(id);
        prizeRepository.deleteById(id);
    }

    // --- Drawing Logic ---

    @Transactional
    public DrawHistory performAdminDraw(Long prizeId) {
        Prize prize = prizeRepository.findById(prizeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giải thưởng"));

        if (prize.getRemainingQuantity() <= 0) {
            throw new RuntimeException("Giải thưởng này đã hết!");
        }

        List<Participant> eligibleParticipants = participantRepository.findAll().stream()
                .filter(p -> !p.getIsWinner())
                .collect(Collectors.toList());

        if (eligibleParticipants.isEmpty()) {
            throw new RuntimeException("Không còn nhân viên nào hợp lệ để quay số!");
        }

        Participant winner = eligibleParticipants.get(random.nextInt(eligibleParticipants.size()));

        winner.setIsWinner(true);
        participantRepository.save(winner);

        prize.setRemainingQuantity(prize.getRemainingQuantity() - 1);
        prizeRepository.save(prize);

        DrawHistory history = new DrawHistory();
        history.setParticipant(winner);
        history.setPrize(prize);
        DrawHistory savedHistory = drawHistoryRepository.save(history);

        // Broadcast to frontend
        messagingTemplate.convertAndSend("/topic/winners", savedHistory);
        
        log.info("Winner: {} won {}", winner.getName(), prize.getName());
        return savedHistory;
    }

    @Transactional
    public void deleteDrawHistory(Long historyId) {
        DrawHistory history = drawHistoryRepository.findById(historyId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch sử trúng thưởng"));

        // Reset participant winner status
        Participant participant = history.getParticipant();
        if (participant != null) {
            participant.setIsWinner(false);
            participantRepository.save(participant);
        }

        // Return prize to pool
        Prize prize = history.getPrize();
        if (prize != null) {
            prize.setRemainingQuantity(prize.getRemainingQuantity() + 1);
            prizeRepository.save(prize);
        }

        drawHistoryRepository.deleteById(historyId);
    }

    public List<Prize> getAllPrizes() {
        return prizeRepository.findAll();
    }
}
