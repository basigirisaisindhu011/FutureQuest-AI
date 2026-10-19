package com.careerquest.backend.controller;

import com.careerquest.backend.model.*;
import com.careerquest.backend.repository.*;
import com.careerquest.backend.service.UserService;
import com.careerquest.backend.dto.ChildProfileRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.*;
import java.time.LocalDateTime;

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

    private ChildProfile requireAuthorizedChildForParent(User parent, Long childId) {
        ChildProfile profile = childProfileRepository.findById(childId)
                .orElseThrow(() -> new IllegalArgumentException("Child profile not found"));

        boolean authorized = Objects.equals(profile.getParentId(), parent.getId())
                || parentChildLinkRepository.existsByParentIdAndChildProfileId(parent.getId(), profile.getId());

        if (!authorized) {
            throw new AccessDeniedException("You are not authorized to view this child's information.");
        }

        return profile;
    }

    @PostMapping("/link-child")
    public ResponseEntity<?> linkChildByCode(@RequestBody Map<String, String> payload) {
        User parent = getAuthenticatedUser();
        String playerCode = payload.get("playerCode");
        try {
            ParentChildLink link = userService.linkChildToParent(parent.getId(), playerCode, payload.get("pin"));
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
        User parent = getAuthenticatedUser();
        ChildProfile profile = requireAuthorizedChildForParent(parent, childId);

        List<GameRecord> games = gameRecordRepository.findByChildProfileId(profile.getId());
        List<GameLevelProgress> levelProgresses = gameLevelProgressRepository.findByChildProfileId(profile.getId());

        Map<String, Object> result = new HashMap<>();
        result.put("games", games);
        result.put("levelProgresses", levelProgresses);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/children/{childId}/insights")
    public ResponseEntity<?> getChildInsights(@PathVariable Long childId) {
        User parent = getAuthenticatedUser();
        ChildProfile profile = requireAuthorizedChildForParent(parent, childId);

        List<GameRecord> games = gameRecordRepository.findByChildProfileId(profile.getId());
        List<GameLevelProgress> levelProgresses = gameLevelProgressRepository.findByChildProfileId(profile.getId());

        String[] categories = {
            "Communication & Language",
            "Technology & Logic",
            "Engineering & Making",
            "Science & Research",
            "Communication & Media",
            "Creativity & Design",
            "Nature & Environment",
            "Social & Helping",
            "Business & Leadership"
        };

        Map<String, Double> interestScores = new HashMap<>();
        Map<String, Double> skillScores = new HashMap<>();
        Map<String, Integer> playCounts = new HashMap<>();
        Map<String, Integer> scoredPlayCounts = new HashMap<>();
        Map<String, String> levelIndicators = new HashMap<>();
        Map<String, Double> scoreTotals = new HashMap<>();
        Map<String, Map<String, Integer>> difficultyCounts = new HashMap<>();

        for (String cat : categories) {
            interestScores.put(cat, 0.0);
            skillScores.put(cat, null);
            scoreTotals.put(cat, 0.0);
            difficultyCounts.put(cat, new HashMap<>());
            playCounts.put(cat, 0);
            scoredPlayCounts.put(cat, 0);
            levelIndicators.put(cat, "Preferred Level: Not enough evidence | Highest Tried: None");
        }

        for (GameRecord game : games) {
            String domains = game.getCareerDomains() == null || game.getCareerDomains().isBlank()
                    ? game.getGameCategory() : game.getCareerDomains();
            for (String domain : domains.split(",")) {
                String cat = domain.trim();
                if (!interestScores.containsKey(cat)) continue;
                playCounts.put(cat, playCounts.getOrDefault(cat, 0) + 1);
                // Activity counts are evidence, not calibrated interest percentages.
                interestScores.put(cat, interestScores.get(cat) + 1.0);
                if (game.getScore() != null) {
                    scoreTotals.put(cat, scoreTotals.get(cat) + game.getScore());
                    scoredPlayCounts.put(cat, scoredPlayCounts.get(cat) + 1);
                }
                difficultyCounts.get(cat).merge(game.getDifficulty().toUpperCase(Locale.ROOT), 1, Integer::sum);
            }
        }

        Map<String, String> interestLevels = new HashMap<>();
        Map<String, String> skillLevels = new HashMap<>();
        for (String cat : categories) {
            List<String> ranks = List.of("EASY", "MODERATE", "MEDIUM", "HARD");
            Map<String, Integer> counts = difficultyCounts.get(cat);
            if (!counts.isEmpty()) {
                int maxCount = Collections.max(counts.values());
                String preferred = ranks.stream().filter(l -> counts.getOrDefault(l, 0) == maxCount).collect(java.util.stream.Collectors.joining(" / "));
                String highest = ranks.stream().filter(counts::containsKey).reduce((a, b) -> b).orElse("None");
                levelIndicators.put(cat, "Preferred Level: " + preferred + " | Highest Tried: " + highest);
            }
            interestLevels.put(cat, playCounts.get(cat) == 0 ? "Ready to Explore" : "Recorded exploration");
            if (scoredPlayCounts.get(cat) > 0) skillScores.put(cat, scoreTotals.get(cat) / scoredPlayCounts.get(cat));
            double sScore = skillScores.get(cat) == null ? 0 : skillScores.get(cat);
            skillLevels.put(cat, scoredPlayCounts.get(cat) == 0
                    ? "Not enough evidence yet"
                    : (sScore >= 75 ? "Strong Skill ⭐" : (sScore >= 50 ? "Developing Well 📈" : "Emerging Skill 💡")));
        }

        List<String> insightsList = new ArrayList<>();
        if (games.isEmpty()) {
            insightsList.add("There is not enough activity yet to identify patterns. Explore a few activities to begin building an evidence-based progress view.");
        } else {
            long scoredActivities = games.stream().filter(game -> game.getScore() != null).count();
            insightsList.add("The activity record contains " + games.size() + " completed sessions across "
                    + playCounts.values().stream().filter(count -> count > 0).count() + " exploration areas.");
            insightsList.add(scoredActivities == 0
                    ? "These sessions contain open-ended choices, not scored skill results."
                    : scoredActivities + " sessions include scored results; open-ended choices are treated as exploration, not skill scores.");
        }

        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);
        Map<String, String> interestStability = new HashMap<>();
        Map<String, String> evidenceConfidence = new HashMap<>();
        List<String> recentChanges = new ArrayList<>();
        for (String cat : categories) {
            long total = games.stream().filter(game -> domainsFor(game).contains(cat)).count();
            long recent = games.stream().filter(game -> domainsFor(game).contains(cat) && game.getDatePlay().isAfter(monthAgo)).count();
            long older = total - recent;
            long days = games.stream().filter(game -> Arrays.stream(domainsFor(game).split(",")).map(String::trim).anyMatch(cat::equals))
                    .map(game -> game.getDatePlay().toLocalDate()).distinct().count();
            interestStability.put(cat, days >= 3 ? "Returned on multiple days" : (total > 0 ? "Exploring; longer history needed" : "Ready to Explore"));
            evidenceConfidence.put(cat, days >= 3 ? "Growing Evidence" : (total >= 1 ? "Limited Evidence" : "Not Enough Evidence Yet"));
        }

        Map<String, String> careerClusters = new LinkedHashMap<>();
        careerClusters.put("Tech Builder", clusterEvidence(interestScores, playCounts, "Technology & Logic", "Engineering & Making"));
        careerClusters.put("Creative Maker", clusterEvidence(interestScores, playCounts, "Creativity & Design", "Communication & Media"));
        careerClusters.put("Curious Investigator", clusterEvidence(interestScores, playCounts, "Science & Research", "Technology & Logic"));
        careerClusters.put("Communicator", clusterEvidence(interestScores, playCounts, "Communication & Language", "Communication & Media"));
        careerClusters.put("People Helper", clusterEvidence(interestScores, playCounts, "Social & Helping", "Communication & Language"));
        careerClusters.put("Business Creator", clusterEvidence(interestScores, playCounts, "Business & Leadership", "Technology & Logic"));
        careerClusters.put("Nature Explorer", clusterEvidence(interestScores, playCounts, "Nature & Environment", "Science & Research"));
        if (recentChanges.isEmpty()) recentChanges.add("A longer comparable activity history is needed to describe changes over time.");

        Map<String, Object> result = new HashMap<>();
        result.put("categories", categories);
        result.put("interestScores", interestScores);
        result.put("interestScoreMeaning", "Completed session counts, not interest percentages or a validated assessment");
        result.put("skillScores", skillScores);
        result.put("interestLevels", interestLevels);
        result.put("skillLevels", skillLevels);
        result.put("playCounts", playCounts);
        result.put("levelIndicators", levelIndicators);
        result.put("parentInsights", insightsList);
        result.put("interestStability", interestStability);
        result.put("evidenceConfidence", evidenceConfidence);
        result.put("whatChanged", recentChanges);
        result.put("careerClusters", careerClusters);

        return ResponseEntity.ok(result);
    }

    private String domainsFor(GameRecord game) {
        String domains = game.getCareerDomains() == null || game.getCareerDomains().isBlank() ? game.getGameCategory() : game.getCareerDomains();
        return domains == null ? "" : domains;
    }

    private String clusterEvidence(Map<String, Double> interestScores, Map<String, Integer> playCounts, String first, String second) {
        int evidence = playCounts.getOrDefault(first, 0) + playCounts.getOrDefault(second, 0);
        if (playCounts.getOrDefault(first, 0) > 0 && playCounts.getOrDefault(second, 0) > 0)
            return "Recorded exploration across " + first + " and " + second + "; not a career prediction";
        return "Exploring: try more activities in this cluster";
    }
}
