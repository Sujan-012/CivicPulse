package com.civicpulse.backend.dto;

public class AnnouncementRequest {

    private String title;
    private String description;
    private String dueDate; // ISO format string, optional, e.g. "2026-09-30T00:00:00"

    public AnnouncementRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }
}
