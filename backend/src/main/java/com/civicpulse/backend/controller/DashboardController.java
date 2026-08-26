package com.civicpulse.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.civicpulse.backend.dto.DashboardStats;
import com.civicpulse.backend.service.IssueService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final IssueService issueService;

    public DashboardController(IssueService issueService) {
        this.issueService = issueService;
    }

    @GetMapping("/stats")
    public DashboardStats getStats() {
        return issueService.getDashboardStats();
    }
}