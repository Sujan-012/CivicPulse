package com.civicpulse.backend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.civicpulse.backend.dto.DocumentApplicationRequest;
import com.civicpulse.backend.entity.DocumentApplication;
import com.civicpulse.backend.entity.Role;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.repository.DocumentApplicationRepository;
import com.civicpulse.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentApplicationController {

    private final DocumentApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public DocumentApplicationController(DocumentApplicationRepository applicationRepository,
                                          UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    // Submit a new application (citizen)
    @PostMapping
    public ResponseEntity<DocumentApplication> apply(@RequestBody DocumentApplicationRequest request) {

        User currentUser = getCurrentUser();

        DocumentApplication application = new DocumentApplication();
        application.setDocumentType(request.getDocumentType());
        application.setApplicantName(request.getApplicantName());
        application.setContactNumber(request.getContactNumber());
        application.setAddress(request.getAddress());
        application.setRemarks(request.getRemarks());
        application.setStatus("Pending");
        application.setUser(currentUser);

        return ResponseEntity.ok(applicationRepository.save(application));
    }

    // Get applications: admin sees all, citizen sees their own
    @GetMapping
    public ResponseEntity<List<DocumentApplication>> getApplications() {

        User currentUser = getCurrentUser();

        List<DocumentApplication> applications = currentUser.getRole() == Role.ADMIN
                ? applicationRepository.findAll()
                : applicationRepository.findByUser(currentUser);

        return ResponseEntity.ok(applications);
    }

    // Admin updates application status and sends a response back to the citizen
    @PutMapping("/{id}/status")
    public ResponseEntity<DocumentApplication> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String response) {

        DocumentApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);

        if (response != null && !response.isBlank()) {
            application.setAdminResponse(response);
        }

        return ResponseEntity.ok(applicationRepository.save(application));
    }

    // Admin uploads the soft copy of the approved document (PDF/image) and approves it
    @PostMapping("/{id}/upload-document")
    public ResponseEntity<DocumentApplication> uploadDocument(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String response) throws IOException {

        User currentUser = getCurrentUser();

        if (currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admins can upload documents");
        }

        DocumentApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setDocumentFile(file.getBytes());
        application.setDocumentFileName(file.getOriginalFilename());
        application.setDocumentFileType(file.getContentType());
        application.setStatus("Approved");

        if (response != null && !response.isBlank()) {
            application.setAdminResponse(response);
        } else {
            application.setAdminResponse("Your document is ready. Download it below.");
        }

        return ResponseEntity.ok(applicationRepository.save(application));
    }

    // Download the soft copy (citizen who owns it, or admin)
    @GetMapping("/{id}/download")
    public ResponseEntity<ByteArrayResource> downloadDocument(@PathVariable Long id) {

        User currentUser = getCurrentUser();

        DocumentApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        boolean isOwner = application.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You are not allowed to download this document");
        }

        if (!application.isDocumentAvailable()) {
            throw new RuntimeException("No document has been uploaded for this application yet");
        }

        ByteArrayResource resource = new ByteArrayResource(application.getDocumentFile());

        String fileName = application.getDocumentFileName() != null
                ? application.getDocumentFileName()
                : "document";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        application.getDocumentFileType() != null
                                ? application.getDocumentFileType()
                                : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(fileName).build().toString())
                .body(resource);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
