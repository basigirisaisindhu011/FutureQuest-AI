package com.careerquest.backend.controller;

import com.careerquest.backend.model.*;
import com.careerquest.backend.repository.*;
import com.careerquest.backend.service.UserService;
import com.careerquest.backend.dto.ChildProfileRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.*;

@RestController
@RequestMapping("/api/parent")
public class ParentController {

    private final UserService userService;
    private final ChildProfileRepository childProfileRepository;
    private final ParentChildLinkRepository parentChildLinkRepository;
    private final GameRecordRepository gameRecordRepository;
    private final GameLevelProgressRepository gameLevelProgressRepository;

    public ParentController(
            UserService userService,
            ChildProfileRepository childProfileRepository,
            ParentChildLinkRepository parentChildLinkRepository,
            GameRecordRepository gameRecordRepository,
            GameLevelProgressRepository gameLevelProgressRepository) {
        this.userService = userService;
        this.childProfileRepository = childProfileRepository;
        this.parentChildLinkRepository = parentChildLinkRepository;
        this.gameRecordRepository = gameRecordRepository;
        this.gameLevelProgressRepository = gameLevelProgressRepository;
    }

    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping("/link-child")
    public ResponseEntity<?> linkChildByCode(@RequestBody Map<String, String> payload) {
        User parent = getAuthenticatedUser();
        String playerCode = payload.get("playerCode");
        try {
            ParentChildLink link = userService.linkChildToParent(parent.getId(), playerCode);
            return ResponseEntity.ok(Map.of("message", "Child player linked successfully!", "linkId", link.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/children")
    public ResponseEntity<?> getLinkedChildren() {
        User parent = getAuthenticatedUser();
        List<ParentChildLink> links = parentChildLinkRepository.findByParentId(parent.getId());
        Set<Long> profileIds = new HashSet<>();
        for (ParentChildLink link : links) {
            profileIds.add(link.getChildProfileId());
        }
        childProfileRepository.findByParentId(parent.getId()).forEach(p -> profileIds.add(p.getId()));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Long profileId : profileIds) {
            childProfileRepository.findById(profileId).ifPresent(profile -> {
                Map<String, Object> childMap = new HashMap<>();
                childMap.put("profileId", profile.getId());
                childMap.put("userId", profile.getUserId());
                childMap.put("nickname", profile.getNickname());
                childMap.put("avatar", profile.getAvatar());
                childMap.put("ageGroup", profile.getAgeGroup());
                childMap.put("playerCode", profile.getPlayerCode());
                childMap.put("points", profile.getPoints());
                childMap.put("level", profile.getLevel());
                childMap.put("interests", profile.getInterests());
                result.add(childMap);
            });
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/children/{childId}/activity")
    public ResponseEntity<?> getChildActivity(@PathVariable Long childId) {
        ChildProfile profile = childProfileRepository.findById(childId)
                .or(() -> childProfileRepository.findByUserId(childId))
                .orElseThrow(() -> new RuntimeException("Child profile not found"));

        List<GameRecord> games = gameRecordRepository.findByChildProfileId(profile.getId());
        List<GameLevelProgress> levelProgresses = gameLevelProgressRepository.findByChildProfileId(profile.getId());

        Map<String, Object> result = new HashMap<>();
        result.put("games", games);
        result.put("levelProgresses", levelProgresses);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/children/{childId}/insights")
    public ResponseEntity<?> getChildInsights(@PathVariable Long childId) {
        ChildProfile profile = childProfileRepository.findById(childId)
                .or(() -> childProfileRepository.findByUserId(childId))
                .orElseThrow(() -> new RuntimeException("Child profile not found"));

        List<GameRecord> games = gameRecordRepository.findByChildProfileId(profile.getId());
        List<GameLevelProgress> levelProgresses = gameLevelProgressRepository.findByChildProfileId(profile.getId());

        String[] categories = {
            "Communication & Language",
            "Technology & Logic",
            "Science & Exploration",
            "Creativity & Design",
            "Nature & Environment",
            "Social & Helping",
            "Business & Leadership"
        };

        Map<String, Double> interestScores = new HashMap<>();
        Map<String, Double> skillScores = new HashMap<>();
        Map<String, Integer> playCounts = new HashMap<>();
        Map<String, String> levelIndicators = new HashMap<>();

        for (String cat : categories) {
            interestScores.put(cat, 10.0);
            skillScores.put(cat, 50.0);
            playCounts.put(cat, 0);
            levelIndicators.put(cat, "Preferred Level: Easy | Highest Tried: Easy");
        }

        for (GameRecord game : games) {
            String cat = game.getGameCategory() != null ? game.getGameCategory() : "Communication & Language";
            playCounts.put(cat, playCounts.getOrDefault(cat, 0) + 1);

            double replayFactor = game.getReplayCount() > 0 ? game.getReplayCount() : 1.0;
            interestScores.put(cat, Math.min(100.0, interestScores.getOrDefault(cat, 10.0) + 25.0 * replayFactor));
            skillScores.put(cat, Math.min(100.0, (skillScores.getOrDefault(cat, 50.0) + game.getScore()) / 2.0));
            levelIndicators.put(cat, "Preferred Level: " + game.getDifficulty() + " | Highest Tried: " + game.getDifficulty());
        }

        Map<String, String> interestLevels = new HashMap<>();
        Map<String, String> skillLevels = new HashMap<>();
        for (String cat : categories) {
            double iScore = interestScores.get(cat);
            interestLevels.put(cat, iScore >= 60 ? "High Interest 🌟" : (iScore >= 30 ? "Medium Interest ✨" : "Exploring 🌱"));

            double sScore = skillScores.get(cat);
            skillLevels.put(cat, sScore >= 75 ? "Strong Skill ⭐" : (sScore >= 50 ? "Developing Well 📈" : "Emerging Skill 💡"));
        }

        List<String> insightsList = new ArrayList<>();
        insightsList.add("Your child chooses activities freely and explores preferred difficulty levels naturally.");
        insightsList.add("Vocabulary, storytelling, and logical problem solving are developing well through self-directed practice.");

        Map<String, Object> result = new HashMap<>();
        result.put("categories", categories);
        result.put("interestScores", interestScores);
        result.put("skillScores", skillScores);
        result.put("interestLevels", interestLevels);
        result.put("skillLevels", skillLevels);
        result.put("playCounts", playCounts);
        result.put("levelIndicators", levelIndicators);
        result.put("parentInsights", insightsList);

        return ResponseEntity.ok(result);
    }
}
