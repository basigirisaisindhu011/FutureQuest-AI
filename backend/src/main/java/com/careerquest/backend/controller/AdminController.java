package com.careerquest.backend.controller;

import com.careerquest.backend.model.*;
import com.careerquest.backend.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final ChildProfileRepository childProfileRepository;
    private final CareerInfoRepository careerInfoRepository;
    private final CareerRoadmapRepository careerRoadmapRepository;
    private final LearningResourceRepository learningResourceRepository;
    private final FeedbackRepository feedbackRepository;
    private final GameRecordRepository gameRecordRepository;

    public AdminController(
            UserRepository userRepository,
            ChildProfileRepository childProfileRepository,
            CareerInfoRepository careerInfoRepository,
            CareerRoadmapRepository careerRoadmapRepository,
            LearningResourceRepository learningResourceRepository,
            FeedbackRepository feedbackRepository,
            GameRecordRepository gameRecordRepository) {
        this.userRepository = userRepository;
        this.childProfileRepository = childProfileRepository;
        this.careerInfoRepository = careerInfoRepository;
        this.careerRoadmapRepository = careerRoadmapRepository;
        this.learningResourceRepository = learningResourceRepository;
        this.feedbackRepository = feedbackRepository;
        this.gameRecordRepository = gameRecordRepository;
    }

    // 1. User Management
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("{\"message\": \"User deleted successfully.\"}");
    }

    // 2. Career Information CRUD
    @GetMapping("/careers")
    public ResponseEntity<?> getAllCareers() {
        return ResponseEntity.ok(careerInfoRepository.findAll());
    }

    @PostMapping("/careers")
    public ResponseEntity<?> createCareer(@RequestBody CareerInfo careerInfo) {
        return ResponseEntity.ok(careerInfoRepository.save(careerInfo));
    }

    @PutMapping("/careers/{id}")
    public ResponseEntity<?> updateCareer(@PathVariable Long id, @RequestBody CareerInfo careerInfo) {
        CareerInfo existing = careerInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Career info not found"));
        existing.setName(careerInfo.getName());
        existing.setDomain(careerInfo.getDomain());
        existing.setDescription(careerInfo.getDescription());
        return ResponseEntity.ok(careerInfoRepository.save(existing));
    }

    @DeleteMapping("/careers/{id}")
    public ResponseEntity<?> deleteCareer(@PathVariable Long id) {
        careerInfoRepository.deleteById(id);
        return ResponseEntity.ok("{\"message\": \"Career deleted successfully.\"}");
    }

    // 3. Roadmap CRUD
    @PostMapping("/careers/{careerId}/roadmap")
    public ResponseEntity<?> addRoadmap(@PathVariable Long careerId, @RequestBody CareerRoadmap roadmap) {
        roadmap.setCareerId(careerId);
        return ResponseEntity.ok(careerRoadmapRepository.save(roadmap));
    }

    @PutMapping("/roadmaps/{id}")
    public ResponseEntity<?> updateRoadmap(@PathVariable Long id, @RequestBody CareerRoadmap roadmap) {
        CareerRoadmap existing = careerRoadmapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Roadmap not found"));
        existing.setEducationLevel(roadmap.getEducationLevel());
        existing.setRequiredSkills(roadmap.getRequiredSkills());
        existing.setRecommendedCourses(roadmap.getRecommendedCourses());
        existing.setFutureOpportunities(roadmap.getFutureOpportunities());
        existing.setOverview(roadmap.getOverview());
        return ResponseEntity.ok(careerRoadmapRepository.save(existing));
    }

    // 4. Learning Resources CRUD
    @PostMapping("/careers/{careerId}/resources")
    public ResponseEntity<?> addResource(@PathVariable Long careerId, @RequestBody LearningResource resource) {
        resource.setCareerId(careerId);
        return ResponseEntity.ok(learningResourceRepository.save(resource));
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        learningResourceRepository.deleteById(id);
        return ResponseEntity.ok("{\"message\": \"Resource deleted successfully.\"}");
    }

    // 5. Feedback Viewing
    @GetMapping("/feedback")
    public ResponseEntity<?> getFeedbacks() {
        return ResponseEntity.ok(feedbackRepository.findAll());
    }

    // 6. Overall Platform Analytics
    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        stats.put("totalUsers", totalUsers);

        List<User> allUsers = userRepository.findAll();
        Map<String, Long> roleCounts = allUsers.stream()
                .collect(Collectors.groupingBy(User::getRole, Collectors.counting()));
        stats.put("roleSplit", roleCounts);

        // Aggregate Interest distribution
        List<ChildProfile> profiles = childProfileRepository.findAll();
        Map<String, Integer> interestCounts = new HashMap<>();
        for (ChildProfile profile : profiles) {
            if (profile.getInterests() != null && !profile.getInterests().isEmpty()) {
                for (String tag : profile.getInterests().split(",")) {
                    String clean = tag.trim();
                    interestCounts.put(clean, interestCounts.getOrDefault(clean, 0) + 1);
                }
            }
        }
        stats.put("popularInterests", interestCounts);

        // Feedback average ratings
        List<Feedback> feedbacks = feedbackRepository.findAll();
        double avgRating = feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);
        stats.put("averageFeedbackRating", avgRating);

        // Group feedback by activity
        Map<String, Double> gameRatings = feedbacks.stream()
                .filter(f -> "game".equalsIgnoreCase(f.getActivityType()))
                // Group by activity ID (can map to specific games) or comment fields
                .collect(Collectors.groupingBy(Feedback::getActivityType, Collectors.averagingDouble(Feedback::getRating)));
        stats.put("gameRatings", gameRatings);

        return ResponseEntity.ok(stats);
    }
}
