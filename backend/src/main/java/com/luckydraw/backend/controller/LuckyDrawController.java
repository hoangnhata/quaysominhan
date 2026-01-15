package com.luckydraw.backend.controller;

import com.luckydraw.backend.model.DrawHistory;
import com.luckydraw.backend.model.Participant;
import com.luckydraw.backend.model.Prize;
import com.luckydraw.backend.repository.DrawHistoryRepository;
import com.luckydraw.backend.repository.ParticipantRepository;
import com.luckydraw.backend.repository.PrizeRepository;
import com.luckydraw.backend.service.LuckyDrawService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/lucky-draw")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LuckyDrawController {
    private final LuckyDrawService luckyDrawService;
    private final PrizeRepository prizeRepository;
    private final DrawHistoryRepository drawHistoryRepository;
    private final ParticipantRepository participantRepository;

    private final String UPLOAD_DIR = "uploads";

    // --- SHARED ENDPOINTS ---

    @GetMapping("/prizes")
    public ResponseEntity<List<Prize>> getPrizes() {
        return ResponseEntity.ok(luckyDrawService.getAllPrizes());
    }

    @GetMapping("/recent-winners")
    public ResponseEntity<List<DrawHistory>> getRecentWinners() {
        return ResponseEntity.ok(drawHistoryRepository.findAll(
            Sort.by(Sort.Direction.DESC, "drawTime")
        ).stream().limit(10).toList());
    }

    // --- PARTICIPANT MANAGEMENT ---

    @GetMapping("/admin/participants")
    public ResponseEntity<List<Participant>> getAllParticipants() {
        return ResponseEntity.ok(participantRepository.findAll(Sort.by(Sort.Direction.DESC, "id")));
    }

    @PostMapping("/check-in") // Used for both manual check-in and Excel import
    public ResponseEntity<?> createParticipant(@RequestBody Participant participant) {
        try {
            return ResponseEntity.ok(luckyDrawService.saveParticipant(participant));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } 
    }

    @PutMapping("/admin/participants/{id}")
    public ResponseEntity<?> updateParticipant(@PathVariable Long id, @RequestBody Participant participant) {
        participant.setId(id);
        return ResponseEntity.ok(luckyDrawService.saveParticipant(participant));
    }

    @DeleteMapping("/admin/participants/{id}")
    public ResponseEntity<?> deleteParticipant(@PathVariable Long id) {
        luckyDrawService.deleteParticipant(id);
        return ResponseEntity.ok().build();
    }

    // --- PRIZE MANAGEMENT ---

    @PostMapping("/admin/prizes")
    public ResponseEntity<Prize> createPrize(@RequestBody Prize prize) {
        return ResponseEntity.ok(luckyDrawService.savePrize(prize));
    }

    @PutMapping("/admin/prizes/{id}")
    public ResponseEntity<Prize> updatePrize(@PathVariable Long id, @RequestBody Prize prize) {
        prize.setId(id);
        return ResponseEntity.ok(luckyDrawService.savePrize(prize));
    }

    @DeleteMapping("/admin/prizes/{id}")
    public ResponseEntity<Void> deletePrize(@PathVariable Long id) {
        luckyDrawService.deletePrize(id);
        return ResponseEntity.ok().build();
    }

    // --- DRAWING OPERATIONS ---

    @PostMapping("/admin/draw/{prizeId}")
    public ResponseEntity<?> adminDraw(@PathVariable Long prizeId) {
        try {
            DrawHistory result = luckyDrawService.performAdminDraw(prizeId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/admin/draw/{id}")
    public ResponseEntity<?> deleteDrawHistory(@PathVariable Long id) {
        try {
            luckyDrawService.deleteDrawHistory(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/admin/reset")
    public ResponseEntity<?> resetSystem() {
        luckyDrawService.resetAllWinners();
        return ResponseEntity.ok().body("System reset successful");
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<?> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalParticipants", participantRepository.count());
        stats.put("totalDraws", drawHistoryRepository.count());
        stats.put("prizes", prizeRepository.findAll());
        return ResponseEntity.ok(stats);
    }

    // --- FILE UPLOAD ---

    @PostMapping("/admin/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Vui lòng chọn file!");
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            String fileUrl = "http://localhost:8080/uploads/" + fileName;
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Lỗi tải file: " + e.getMessage());
        }
    }
}
