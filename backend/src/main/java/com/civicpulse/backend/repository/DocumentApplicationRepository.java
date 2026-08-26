package com.civicpulse.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.civicpulse.backend.entity.DocumentApplication;
import com.civicpulse.backend.entity.User;

public interface DocumentApplicationRepository extends JpaRepository<DocumentApplication, Long> {

    List<DocumentApplication> findByUser(User user);

}
