package com.civicpulse.backend.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "document_applications")
public class DocumentApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g. "Aadhar Card", "Birth Certificate", "Income Certificate"
    @Column(nullable = false)
    private String documentType;

    @Column(nullable = false)
    private String applicantName;

    @Column(nullable = false)
    private String contactNumber;

    @Column(nullable = false)
    private String address;

    @Column(length = 1000)
    private String remarks;

    // Pending, Under Review, Approved, Rejected
    @Column(nullable = false)
    private String status;

    // Admin's message back to the citizen (e.g. document ready, collection info, rejection reason)
    @Column(length = 1000)
    private String adminResponse;

    // Soft copy of the approved document, uploaded by the admin
    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] documentFile;

    private String documentFileName;

    private String documentFileType;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @PrePersist
    public void onCreate() {
        createdDate = LocalDateTime.now();
    }

    public DocumentApplication() {
    }

    public Long getId() {
        return id;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminResponse() {
        return adminResponse;
    }

    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }

    @JsonIgnore
    public byte[] getDocumentFile() {
        return documentFile;
    }

    public void setDocumentFile(byte[] documentFile) {
        this.documentFile = documentFile;
    }

    public String getDocumentFileName() {
        return documentFileName;
    }

    public void setDocumentFileName(String documentFileName) {
        this.documentFileName = documentFileName;
    }

    public String getDocumentFileType() {
        return documentFileType;
    }

    public void setDocumentFileType(String documentFileType) {
        this.documentFileType = documentFileType;
    }

    // Exposed to frontend so it knows whether to show a Download button
    public boolean isDocumentAvailable() {
        return documentFile != null && documentFile.length > 0;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
