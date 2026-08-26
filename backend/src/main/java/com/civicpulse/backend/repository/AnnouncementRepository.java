package com.civicpulse.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.civicpulse.backend.entity.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
}
