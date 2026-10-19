package com.careerquest.backend.controller;

import com.careerquest.backend.dto.GameRecordRequest;
import com.careerquest.backend.dto.QuizRecordRequest;
import org.springframework.transaction.annotation.Transactional;
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
            return ResponseEntity.status(404).body(Map.of(
                    "message", "No verified challenges are available for this age group, game, and difficulty.",
                    "gameId", cleanGameId,
                    "ageGroup", ageGroup,
                    "difficulty", cleanLevel));
        }

        List<Question> shuffled = new ArrayList<>(questions);
        Collections.shuffle(shuffled);
        int targetCount = "EASY".equalsIgnoreCase(cleanLevel) ? 5 : ("MODERATE".equalsIgnoreCase(cleanLevel) ? 5 : ("MEDIUM".equalsIgnoreCase(cleanLevel) ? 6 : 7));
        List<Question> sliced = shuffled.stream().limit(targetCount).toList();

        return ResponseEntity.ok(sliced);
    }

    @PostMapping("/quizzes")
    public ResponseEntity<?> submitQuiz(@Valid @RequestBody QuizRecordRequest request) {
        User user = getAuthenticatedUser();
        ChildProfile profile = childProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
        QuizRecord record = quizRecordRepository.save(new QuizRecord(
                profile.getId(), request.getQuizType(), request.getScore(), request.getResponses()));
        return ResponseEntity.status(201).body(record);
    }

    @GetMapping("/quizzes")
    public ResponseEntity<?> getQuizzes() {
        User user = getAuthenticatedUser();
        ChildProfile profile = childProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
        return ResponseEntity.ok(quizRecordRepository.findByChildProfileId(profile.getId()));
    }

    @Transactional
    @PostMapping("/games/level-complete")
    public ResponseEntity<?> submitLevelComplete(@RequestBody Map<String, Object> payload) {
        validateCompletion(payload);
        User user = getAuthenticatedUser();
        ChildProfile profile = childProfileRepository.findLockedByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        String sessionId = (String) payload.get("sessionId");
        if (sessionId != null) {
            Optional<GameRecord> saved = gameRecordRepository.findByChildProfileIdAndSessionId(profile.getId(), sessionId);
            if (saved.isPresent()) {
                GameRecord previous = saved.get();
                if (!previous.getGameType().equals(normalizeGameId((String) payload.get("gameId")))
                        || !previous.getDifficulty().equalsIgnoreCase((String) payload.getOrDefault("level", "EASY"))) {
                    throw new IllegalArgumentException("Session already belongs to another game or difficulty");
                }
                int stars = previous.getPointsEarned() / 40;
                return ResponseEntity.ok(Map.of("gameId", previous.getGameType(), "level", previous.getDifficulty(),
                        "completed", true, "recordId", previous.getId(), "xpEarned", previous.getPointsEarned(),
                        "starsEarned", stars, "totalPoints", profile.getPoints()));
            }
        }

        String gameId = normalizeGameId((String) payload.get("gameId"));
        String level = ((String) payload.getOrDefault("level", "EASY")).toUpperCase(Locale.ROOT);
        Integer score = payload.get("score") instanceof Number ? ((Number) payload.get("score")).intValue() : null;
        Double accuracy = payload.get("accuracy") instanceof Number ? ((Number) payload.get("accuracy")).doubleValue() : null;
        if (score == null && accuracy != null) score = (int) Math.round(accuracy);
        int starsEarned = score == null ? 1 : (score >= 90 ? 3 : (score >= 60 ? 2 : 1));
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
        record.setSessionId(sessionId);
        record.setChildProfileId(profile.getId());
        record.setGameType(gameId);
        record.setGameName((String) payload.getOrDefault("gameName", gameId));
        record.setGameCategory((String) payload.getOrDefault("gameCategory", "Communication & Language"));
        record.setCareerDomains(payloadValue(payload.get("careerDomains")));
        if (Set.of("interest_battle", "curiosity_trail").contains(gameId))
            record.setCareerDomains(selectedDiscoveryDomains(payload.get("choicesMade")));
        Map<String, Object> evidence = new LinkedHashMap<>();
        evidence.put("schemaVersion", 1);
        for (String field : List.of("predictions", "observations", "experiment", "experimentRetries", "reasoning",
                "pairwisePreferences", "curiosityPath", "enjoyedChallenge", "invention", "iteration", "featureChoices",
                "planningChoices", "layout", "spatialChoices", "allocation", "adaptationChoices", "compositionChoices",
                "styleChoices", "narrativeChoices", "ingredientChoices", "createdPattern", "instrument", "creativePreferences",
                "transcriptAnalysis", "commandsUsed", "retries", "constraintsMet", "resourcesUsed", "resourceLimit",
                "revenue", "profit", "customers", "price", "cost", "simulation")) {
            if (payload.containsKey(field)) evidence.put(field, payload.get(field));
        }
        try {
            if (new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(evidence).length() > 32768)
                throw new IllegalArgumentException("Activity evidence exceeds the supported size");
        } catch (com.fasterxml.jackson.core.JsonProcessingException error) {
            throw new IllegalArgumentException("Activity evidence must be valid JSON");
        }
        record.setEvidence(evidence);
        record.setScore(score);
        record.setPointsEarned(xpEarned);
        record.setDifficulty(level);
        record.setCompletionTime(numberValue(payload.get("duration"), 0));
        record.setAccuracy(accuracy);
        record.setAttempts(numberValue(payload.get("attempts"), 1));
        record.setHintsUsed(numberValue(payload.get("hintsUsed"), 0));
        record.setReplayCount(progress.getReplayCount());
        record.setCompletionStatus("COMPLETED");
        record.setChoicesMade(payloadValue(payload.get("choicesMade")));
        record.setWordsAttempted(numberValue(payload.get("wordsAttempted"), 0));
        record.setWordsCorrect(numberValue(payload.get("wordsCorrect"), 0));
        record.setStoryLength(numberValue(payload.get("storyLength"), 0));
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
        result.put("recordId", record.getId());

        return ResponseEntity.ok(result);
    }

    private static final Set<String> GAME_IDS = Set.of(
            "code_robot", "puzzle_lab", "spell_quest", "speaking_games", "story_builder",
            "dream_designer", "eco_rescue", "mini_entrepreneur", "career_role_challenge",
            "build_the_city", "science_lab", "data_detective", "design_an_app", "invent_something",
            "team_leader", "money_manager", "interest_battle", "curiosity_trail", "photo_mission",
            "fashion_studio", "directors_cut", "music_maker", "junior_chef", "interior_designer");

    private String selectedDiscoveryDomains(Object choices) {
        Map<String, String> names = Map.of(
                "CREATIVITY_DESIGN", "Creativity & Design", "TECHNOLOGY_LOGIC", "Technology & Logic",
                "SCIENCE_RESEARCH", "Science & Research", "COMMUNICATION_MEDIA", "Communication & Media",
                "ENGINEERING_MAKING", "Engineering & Making", "SOCIAL_HELPING", "Social & Helping",
                "BUSINESS_LEADERSHIP", "Business & Leadership", "NATURE_ENVIRONMENT", "Nature & Environment");
        if (!(choices instanceof List<?> selections) || selections.isEmpty() || selections.size() > 32)
            throw new IllegalArgumentException("Discovery needs recorded activity choices");
        Set<String> selected = new LinkedHashSet<>();
        for (Object choice : selections) {
            Object code = choice instanceof Map<?, ?> map ? map.get("selected") : choice;
            String domain = code instanceof String text ? names.get(text) : null;
            if (domain == null) throw new IllegalArgumentException("Unknown selected discovery domain");
            selected.add(domain);
        }
        return String.join(",", selected);
    }

    private void validateCompletion(Map<String, Object> payload) {
        if (payload.containsKey("sessionId") && (!(payload.get("sessionId") instanceof String id)
                || id.isBlank() || id.length() > 100)) {
            throw new IllegalArgumentException("sessionId must be nonempty text up to 100 characters");
        }
        if (!(payload.get("gameId") instanceof String gameId) || !GAME_IDS.contains(normalizeGameId(gameId))) {
            throw new IllegalArgumentException("Choose a valid game");
        }
        Object level = payload.getOrDefault("level", "EASY");
        if (!(level instanceof String) || !Set.of("EASY", "MODERATE", "MEDIUM", "HARD")
                .contains(((String) level).toUpperCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Choose a valid difficulty");
        }
        for (String field : List.of("score", "accuracy")) {
            if (payload.get(field) == null) continue;
            if (!(payload.get(field) instanceof Number number) || !Double.isFinite(number.doubleValue())
                    || number.doubleValue() < 0 || number.doubleValue() > 100
                    || ("score".equals(field) && number.doubleValue() != Math.rint(number.doubleValue()))) {
                throw new IllegalArgumentException(field + " must be a number between 0 and 100");
            }
        }
        for (String field : List.of("duration", "attempts", "hintsUsed", "wordsAttempted", "wordsCorrect", "storyLength")) {
            if (!payload.containsKey(field)) continue;
            if (!(payload.get(field) instanceof Number number) || !Double.isFinite(number.doubleValue())
                    || number.doubleValue() < 0 || number.doubleValue() > Integer.MAX_VALUE
                    || number.doubleValue() != Math.rint(number.doubleValue())) {
                throw new IllegalArgumentException(field + " must be a nonnegative whole number");
            }
        }
        for (String field : List.of("gameName", "gameCategory")) {
            if (payload.containsKey(field) && !(payload.get(field) instanceof String)) {
                throw new IllegalArgumentException(field + " must be text");
            }
        }
    }

    private int numberValue(Object value, int defaultValue) {
        return value instanceof Number ? ((Number) value).intValue() : defaultValue;
    }

    private double decimalValue(Object value, double defaultValue) {
        return value instanceof Number ? ((Number) value).doubleValue() : defaultValue;
    }

    private String payloadValue(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private String getNextLevel(String currentLevel) {
        switch (currentLevel.toUpperCase()) {
            case "EASY": return "MODERATE";
            case "MODERATE": return "MEDIUM";
            case "MEDIUM": return "HARD";
            default: return null;
        }
    }

    @GetMapping("/achievements")
    public ResponseEntity<?> getAchievements() {
        User user = getAuthenticatedUser();
        ChildProfile profile = childProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        List<Map<String, Object>> achievements = new ArrayList<>();
        List<String> badges = List.of("🏁", "🌟", "🤖", "🎨", "💡");
        List<String> names = List.of("First Adventure", "Curious Explorer", "Robot Ranger", "Creative Spark", "Future Builder");
        List<String> descriptions = List.of(
                "You completed your first challenge.",
                "You are exploring your interests with confidence.",
                "You enjoy solving tech and logic tasks.",
                "You love creativity and design choices.",
                "You are building skills for a bright future."
        );

        for (int i = 0; i < names.size(); i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", i + 1L);
            item.put("name", names.get(i));
            item.put("description", descriptions.get(i));
            item.put("badgeImage", badges.get(i));
            item.put("earned", i < Math.max(1, Math.min(3, profile.getLevel())));
            achievements.add(item);
        }

        return ResponseEntity.ok(achievements);
    }

    @GetMapping("/analysis")
    public ResponseEntity<?> getChildAnalysis() {
        User user = getAuthenticatedUser();
        ChildProfile profile = childProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        List<GameRecord> games = gameRecordRepository.findByChildProfileId(profile.getId());

        Map<String, Integer> categoryCounts = new HashMap<>();
        for (GameRecord g : games) {
            String domains = g.getCareerDomains() == null || g.getCareerDomains().isBlank() ? g.getGameCategory() : g.getCareerDomains();
            if (domains == null) continue;
            for (String cat : new LinkedHashSet<>(Arrays.asList(domains.split(","))))
                if (!cat.isBlank()) categoryCounts.merge(cat.trim(), 1, Integer::sum);
        }

        List<String> topInterests = new ArrayList<>();
        categoryCounts.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(3)
                .forEach(e -> topInterests.add(e.getKey()));

        List<String> strengths = new ArrayList<>();

        int meaningfulActivities = games.stream().mapToInt(game -> {
            String choices = game.getChoicesMade();
            return choices == null || choices.isBlank() ? 1 : Math.max(1, choices.split(",").length);
        }).sum();

        Map<String, Object> result = new HashMap<>();
        result.put("title", "You're a Curious Explorer 🔍");
        result.put("topInterests", topInterests);
        result.put("strengths", strengths);
        result.put("encouragement", "Keep Exploring! 🚀");
        result.put("totalGamesPlayed", games.size());
        result.put("totalMeaningfulActivities", meaningfulActivities);
        result.put("enoughEvidence", games.size() >= 3 && meaningfulActivities >= 10);
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
