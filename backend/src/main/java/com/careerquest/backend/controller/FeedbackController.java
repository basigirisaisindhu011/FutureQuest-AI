package com.careerquest.backend.controller;

import com.careerquest.backend.dto.FeedbackRequest;
import com.careerquest.backend.model.ChildProfile;
import com.careerquest.backend.model.Feedback;
import com.careerquest.backend.model.User;
import com.careerquest.backend.repository.ChildProfileRepository;
import com.careerquest.backend.repository.FeedbackRepository;
import com.careerquest.backend.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackRepository feedbackRepository;
    private final ChildProfileRepository childProfileRepository;
    private final NotificationService notificationService;

    public FeedbackController(
            FeedbackRepository feedbackRepository,
            ChildProfileRepository childProfileRepository,
            NotificationService notificationService) {
        this.feedbackRepository = feedbackRepository;
        this.childProfileRepository = childProfileRepository;
        this.notificationService = notificationService;
    }

    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public ResponseEntity<?> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        User user = getAuthenticatedUser();
        Feedback feedback = new Feedback(
                user.getId(),
                request.getActivityType(),
                request.getActivityId(),
                request.getRating(),
                request.getComment()
        );
        feedbackRepository.save(feedback);

        // Award +10 XP bonus if user is a CHILD
        if ("CHILD".equalsIgnoreCase(user.getRole())) {
            childProfileRepository.findByUserId(user.getId()).ifPresent(profile -> {
                profile.setPoints(profile.getPoints() + 10);
                childProfileRepository.save(profile);

                notificationService.createNotification(
                        user.getId(),
                        "Bonus XP Earned",
                        "Thanks for your feedback! You earned +10 XP.",
                        "INFO"
                );
            });
        }

        return ResponseEntity.ok(feedback);
    }
}
