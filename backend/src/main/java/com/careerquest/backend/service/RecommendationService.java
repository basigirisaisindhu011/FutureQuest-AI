package com.careerquest.backend.service;

import com.careerquest.backend.model.*;
import com.careerquest.backend.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ChildProfileRepository childProfileRepository;
    private final GameRecordRepository gameRecordRepository;
    private final RecommendationRepository recommendationRepository;

    public RecommendationService(
            ChildProfileRepository childProfileRepository,
            GameRecordRepository gameRecordRepository,
            RecommendationRepository recommendationRepository) {
        this.childProfileRepository = childProfileRepository;
        this.gameRecordRepository = gameRecordRepository;
        this.recommendationRepository = recommendationRepository;
    }

    public Recommendation generateRecommendation(Long childProfileId) {
        ChildProfile childProfile = childProfileRepository.findById(childProfileId)
                .orElseThrow(() -> new RuntimeException("Child profile not found"));

        List<GameRecord> games = gameRecordRepository.findByChildProfileId(childProfileId);
        
        // 7 Core Categories Scoring
        Map<String, Double> domainScores = new HashMap<>();
        String[] domains = {
            "Communication & Language", "Technology & Logic", "Science & Exploration",
            "Creativity & Design", "Nature & Environment", "Social & Helping", "Business & Leadership"
        };
        for (String d : domains) domainScores.put(d, 0.0);

        for (GameRecord game : games) {
            String cat = game.getGameCategory();
            if (cat != null && domainScores.containsKey(cat)) {
                domainScores.put(cat, domainScores.get(cat) + 5.0 + (game.getScore() / 10.0));
            } else {
                domainScores.put("Communication & Language", domainScores.get("Communication & Language") + 5.0);
            }
        }

        List<String> top3 = domainScores.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        String explanation = "Based on activity choices, your child demonstrates high interest in " + String.join(", ", top3) + ".";

        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonDomains = mapper.writeValueAsString(top3);
            Recommendation recommendation = new Recommendation(childProfileId, jsonDomains, explanation);
            return recommendationRepository.save(recommendation);
        } catch (Exception e) {
            throw new RuntimeException("Error generating recommendation", e);
        }
    }
}
