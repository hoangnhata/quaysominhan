package com.luckydraw.backend.controller;

import com.luckydraw.backend.model.Honor;
import com.luckydraw.backend.repository.HonorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/honors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HonorController {
    private final HonorRepository honorRepository;

    @GetMapping
    public ResponseEntity<List<Honor>> getAllHonors() {
        return ResponseEntity.ok(honorRepository.findAll(Sort.by(Sort.Direction.DESC, "id")));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Honor>> getHonorsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(honorRepository.findByCategory(category));
    }

    @PostMapping
    public ResponseEntity<Honor> createHonor(@RequestBody Honor honor) {
        return ResponseEntity.ok(honorRepository.save(honor));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Honor> updateHonor(@PathVariable Long id, @RequestBody Honor honor) {
        honor.setId(id);
        return ResponseEntity.ok(honorRepository.save(honor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHonor(@PathVariable Long id) {
        honorRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}

