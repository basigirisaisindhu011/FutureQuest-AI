package com.careerquest.backend.controller;

import com.careerquest.backend.dto.FeedbackRequest;
import com.careerquest.backend.model.ChildProfile;
import com.careerquest.backend.model.Feedback;
import com.careerquest.backend.model.User;
import com.careerquest.backend.repository.ChildProfileRepository;
import com.careerquest.backend.repository.FeedbackRepository;
import com.careerquest.backend.repository.GameRecordRepository;
import com.careerquest.backend.repository.QuizRecordRepository;
import com.careerquest.backend.repository.CareerInfoRepository;
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
    private final GameRecordRepository games;
    private final QuizRecordRepository quizzes;
    private final CareerInfoRepository careers;

    public FeedbackController(
            FeedbackRepository feedbackRepository,
            ChildProfileRepository childProfileRepository,
            NotificationService notificationService, GameRecordRepository games,
            QuizRecordRepository quizzes, CareerInfoRepository careers) {
        this.feedbackRepository = feedbackRepository;
        this.childProfileRepository = childProfileRepository;
        this.notificationService = notificationService;
        this.games = games;
        this.quizzes = quizzes;
        this.careers = careers;
    }

    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        User user = getAuthenticatedUser();
        ChildProfile child = childProfileRepository.findLockedByUserId(user.getId()).orElse(null);
        boolean valid = switch (request.getActivityType()) {
            case "game" -> child != null && games.findById(request.getActivityId())
                    .map(record -> record.getChildProfileId().equals(child.getId())).orElse(false);
            case "quiz" -> child != null && quizzes.findById(request.getActivityId())
                    .map(record -> record.getChildProfileId().equals(child.getId())).orElse(false);
            case "career" -> careers.existsById(request.getActivityId());
            default -> false;
        };
        if (!valid) throw new IllegalArgumentException("Choose an activity belonging to your account");
        java.util.Optional<Feedback> existing = feedbackRepository.findByActivityTypeAndActivityId(request.getActivityType(), request.getActivityId())
                .stream().filter(item -> item.getUserId().equals(user.getId())).findFirst();
        if (existing.isPresent()) return ResponseEntity.ok(existing.get());
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
            java.util.Optional.ofNullable(child).ifPresent(profile -> {
                profile.setPoints(profile.getPoints() + 10);
                profile.setLevel(profile.getPoints() / 150 + 1);
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
