package com.luckydraw.backend.repository;

import com.luckydraw.backend.model.Honor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HonorRepository extends JpaRepository<Honor, Long> {
    List<Honor> findByCategory(String category);
}

