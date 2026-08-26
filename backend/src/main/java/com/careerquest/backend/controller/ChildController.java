package com.careerquest.backend.controller;

import com.careerquest.backend.dto.GameRecordRequest;
import com.careerquest.backend.model.*;
import com.careerquest.backend.repository.*;
import com.careerquest.backend.service.NotificationService;
import com.careerquest.backend.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/child")
public class ChildController {

    private final ChildProfileRepository childProfileRepository;
    private final GameRecordRepository gameRecordRepository;
    private final QuizRecordRepository quizRecordRepository;
    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final RecommendationRepository recommendationRepository;
    private final RecommendationService recommendationService;
    private final NotificationService notificationService;
    private final MistakeRecordRepository mistakeRecordRepository;
    private final QuestionRepository questionRepository;
    private final GameLevelProgressRepository gameLevelProgressRepository;

    public ChildController(
            ChildProfileRepository childProfileRepository,
            GameRecordRepository gameRecordRepository,
            QuizRecordRepository quizRecordRepository,
            AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository,
            RecommendationRepository recommendationRepository,
            RecommendationService recommendationService,
            NotificationService notificationService,
            MistakeRecordRepository mistakeRecordRepository,
            QuestionRepository questionRepository,
            GameLevelProgressRepository gameLevelProgressRepository) {
        this.childProfileRepository = childProfileRepository;
        this.gameRecordRepository = gameRecordRepository;
        this.quizRecordRepository = quizRecordRepository;
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
        this.recommendationRepository = recommendationRepository;
        this.recommendationService = recommendationService;
        this.notificationService = notificationService;
        this.mistakeRecordRepository = mistakeRecordRepository;
        this.questionRepository = questionRepository;
        this.gameLevelProgressRepository = gameLevelProgressRepository;
    }

    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private String normalizeGameId(String gameId) {
        if (gameId == null) return "code_robot";
        String normalized = gameId.toLowerCase().replace("-", "_");
        if ("code_the_robot".equals(normalized)) return "code_robot";
        if ("puzzle_laboratory".equals(normalized)) return "puzzle_lab";
        if ("math_treasure_hunt".equals(normalized)) return "math_treasure";
        if ("wildlife_photographer".equals(normalized)) return "wildlife_photo";
        if ("speak_and_shine".equals(normalized) || "speak_the_word".equals(normalized)) return "speaking_games";
        return normalized;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        User user = getAuthenticatedUser();
        ChildProfile profile = childProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/games/{gameId}/levels")
    public ResponseEntity<?> getGameLevelProgress(@PathVariable String gameId) {
        User user = getAuthenticatedUser();
        ChildProfile profile = childProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        String cleanGameId = normalizeGameId(gameId);
        List<GameLevelProgress> existing = gameLevelProgressRepository.findByChildProfileIdAndGameId(profile.getId(), cleanGameId);
        
        String[] levels = {"EASY", "MODERATE", "MEDIUM", "HARD"};
        Map<String, GameLevelProgress> map = new HashMap<>();
        for (GameLevelProgress p : existing) {
            map.put(p.getLevel(), p);
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (int i = 0; i < levels.length; i++) {
            String lvl = levels[i];
            GameLevelProgress p = map.get(lvl);
            
            boolean completed = false;
            int stars = 0;
            int xp = 0;
            int replayCount = 0;

            if (p != null) {
                completed = p.isCompleted();
                stars = p.getStarsEarned();
                xp = p.getXpEarned();
                replayCount = p.getReplayCount();
            }

            Map<String, Object> lvlMap = new HashMap<>();
            lvlMap.put("level", lvl);
            lvlMap.put("unlocked", true); // ALL LEVELS ARE ALWAYS 100% UNLOCKED AND PLAYABLE!
            lvlMap.put("completed", completed);
            lvlMap.put("starsEarned", stars);
            lvlMap.put("xpEarned", xp);
            lvlMap.put("replayCount", replayCount);
            lvlMap.put("targetCount", i == 0 ? 5 : (i == 1 ? 5 : (i == 2 ? 6 : 7)));
            result.add(lvlMap);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/games/{gameId}/questions")
    public ResponseEntity<?> getGameQuestions(
            @PathVariable String gameId,
            @RequestParam(defaultValue = "EASY") String level) {
        User user = getAuthenticatedUser();
        ChildProfile profile = childProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        String cleanGameId = normalizeGameId(gameId);
        String ageGroup = profile.getAgeGroup() != null ? profile.getAgeGroup() : "11-13";
        String cleanLevel = level.toUpperCase();

        List<Question> questions = questionRepository.findByGameIdAndDifficultyAndAgeGroupAndActiveTrue(cleanGameId, cleanLevel, ageGroup);
        if (questions.isEmpty()) {
            questions = questionRepository.findByGameIdAndDifficultyAndActiveTrue(cleanGameId, cleanLevel);
        }
        if (questions.isEmpty()) {
            questions = questionRepository.findByGameIdAndActiveTrue(cleanGameId);
        }

        if (questions.isEmpty()) {
            Question fallback = new Question(
                cleanGameId, ageGroup, cleanLevel, "MULTIPLE_CHOICE",
                "Mission Challenge (" + cleanLevel + "): Choose the correct action to complete this mission.",
                "Option A (Correct),Option B,Option C",
                "Option A (Correct)",
                "Think carefully.",
                "Basic problem solving step.",
                "Logic"
            );
            questions = List.of(fallback);
        }

        List<Question> shuffled = new ArrayList<>(questions);
        Collections.shuffle(shuffled);
        int targetCount = "EASY".equalsIgnoreCase(cleanLevel) ? 5 : ("MODERATE".equalsIgnoreCase(cleanLevel) ? 5 : ("MEDIUM".equalsIgnoreCase(cleanLevel) ? 6 : 7));
        List<Question> sliced = shuffled.stream().limit(targetCount).toList();

        return ResponseEntity.ok(sliced);
    }

    @PostMapping("/games/level-complete")
    public ResponseEntity<?> submitLevelComplete(@RequestBody Map<String, Object> payload) {
        User user = getAuthenticatedUser();
        ChildProfile profile = childProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        String gameId = normalizeGameId((String) payload.get("gameId"));
        String level = ((String) payload.getOrDefault("level", "EASY")).toUpperCase();
        int score = ((Number) payload.getOrDefault("score", 100)).intValue();
        int starsEarned = score >= 90 ? 3 : (score >= 60 ? 2 : 1);
        int xpEarned = starsEarned * 40;

        GameLevelProgress progress = gameLevelProgressRepository
                .findByChildProfileIdAndGameIdAndLevel(profile.getId(), gameId, level)
                .orElse(new GameLevelProgress(profile.getId(), gameId, level, true));

        progress.setUnlocked(true);
        progress.setCompleted(true);
        progress.setStarsEarned(Math.max(progress.getStarsEarned(), starsEarned));
        progress.setXpEarned(progress.getXpEarned() + xpEarned);
        progress.setReplayCount(progress.getReplayCount() + 1);
        progress.setUpdatedAt(LocalDateTime.now());
        gameLevelProgressRepository.save(progress);

        GameRecord record = new GameRecord();
        record.setChildProfileId(profile.getId());
        record.setGameType(gameId);
        record.setGameName((String) payload.getOrDefault("gameName", gameId));
        record.setGameCategory((String) payload.getOrDefault("gameCategory", "Communication & Language"));
        record.setScore(score);
        record.setPointsEarned(xpEarned);
        record.setDifficulty(level);
        record.setReplayCount(progress.getReplayCount());
        record.setCompletionStatus("COMPLETED");
        gameRecordRepository.save(record);

        profile.setPoints(profile.getPoints() + xpEarned);
        int newLevel = (profile.getPoints() / 150) + 1;
        profile.setLevel(newLevel);
        childProfileRepository.save(profile);

        Map<String, Object> result = new HashMap<>();
        result.put("gameId", gameId);
        result.put("level", level);
        result.put("nextLevel", getNextLevel(level));
        result.put("completed", true);
        result.put("starsEarned", starsEarned);
        result.put("xpEarned", xpEarned);
        result.put("totalPoints", profile.getPoints());

        return ResponseEntity.ok(result);
    }

    private String getNextLevel(String currentLevel) {
        switch (currentLevel.toUpperCase()) {
            case "EASY": return "MODERATE";
            case "MODERATE": return "MEDIUM";
            case "MEDIUM": return "HARD";
            default: return null;
        }
    }

    @GetMapping("/analysis")
    public ResponseEntity<?> getChildAnalysis() {
        User user = getAuthenticatedUser();
        ChildProfile profile = childProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        List<GameRecord> games = gameRecordRepository.findByChildProfileId(profile.getId());

        Map<String, Integer> categoryCounts = new HashMap<>();
        for (GameRecord g : games) {
            String cat = g.getGameCategory() != null ? g.getGameCategory() : "Communication & Language";
            categoryCounts.put(cat, categoryCounts.getOrDefault(cat, 0) + 1);
        }

        List<String> topInterests = new ArrayList<>();
        categoryCounts.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(3)
                .forEach(e -> topInterests.add(e.getKey()));

        if (topInterests.isEmpty()) {
            topInterests.add("Communication & Language");
            topInterests.add("Technology & Logic");
            topInterests.add("Creativity & Design");
        }

        List<String> strengths = new ArrayList<>();
        strengths.add("⭐ Vocabulary & Language Accuracy");
        strengths.add("⭐ Logical Thinking");
        strengths.add("⭐ Observation & Curiosity");

        Map<String, Object> result = new HashMap<>();
        result.put("title", "You're a Curious Explorer 🔍");
        result.put("topInterests", topInterests);
        result.put("strengths", strengths);
        result.put("encouragement", "Keep Exploring! 🚀");
        result.put("totalGamesPlayed", games.size());
        result.put("level", profile.getLevel());
        result.put("points", profile.getPoints());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/timeline")
    public ResponseEntity<?> getTimeline() {
        User user = getAuthenticatedUser();
        ChildProfile profile = childProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        List<GameRecord> games = gameRecordRepository.findByChildProfileId(profile.getId());
        List<Map<String, Object>> timeline = new ArrayList<>();

        for (GameRecord g : games) {
            Map<String, Object> map = new HashMap<>();
            map.put("timestamp", g.getDatePlay());
            map.put("type", "game");
            map.put("title", "Played: " + (g.getGameName() != null ? g.getGameName() : g.getGameType()));
            map.put("detail", "Level: " + g.getDifficulty() + ". Category: " + g.getGameCategory() + ". +" + g.getPointsEarned() + " XP.");
            timeline.add(map);
        }

        timeline.sort((a, b) -> ((LocalDateTime) b.get("timestamp")).compareTo((LocalDateTime) a.get("timestamp")));
        return ResponseEntity.ok(timeline);
    }
}
