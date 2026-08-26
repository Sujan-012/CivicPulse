package com.civicpulse.backend.controller;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.civicpulse.backend.dto.AnnouncementRequest;
import com.civicpulse.backend.entity.Announcement;
import com.civicpulse.backend.repository.AnnouncementRepository;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "http://localhost:5173")
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    public AnnouncementController(AnnouncementRepository announcementRepository) {
        this.announcementRepository = announcementRepository;
    }

    // Anyone logged in can view announcements
    @GetMapping
    public ResponseEntity<List<Announcement>> getAll() {
        List<Announcement> announcements = announcementRepository.findAll();

        announcements.sort(Comparator.comparing(Announcement::getCreatedDate).reversed());

        return ResponseEntity.ok(announcements);
    }

    // Admin creates an announcement
    @PostMapping
    public ResponseEntity<Announcement> create(@RequestBody AnnouncementRequest request) {

        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle());
        announcement.setDescription(request.getDescription());

        if (request.getDueDate() != null && !request.getDueDate().isBlank()) {
            announcement.setDueDate(LocalDateTime.parse(request.getDueDate()));
        }

        return ResponseEntity.ok(announcementRepository.save(announcement));
    }

    // Admin deletes an announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        announcementRepository.deleteById(id);
        return ResponseEntity.ok("Announcement deleted successfully");
    }
}
