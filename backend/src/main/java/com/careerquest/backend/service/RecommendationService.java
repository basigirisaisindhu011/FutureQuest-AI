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
        
        // Exploration domains are evidence pools, not direct career predictions.
        Map<String, Double> domainScores = new HashMap<>();
        String[] domains = {
            "Communication & Language", "Technology & Logic", "Engineering & Making",
            "Science & Research", "Creativity & Design", "Communication & Media",
            "Social & Helping", "Business & Leadership", "Nature & Environment"
        };
        for (String d : domains) domainScores.put(d, 0.0);

        for (GameRecord game : games) {
            String[] gameDomains = game.getCareerDomains() == null || game.getCareerDomains().isBlank() ? new String[0] : game.getCareerDomains().split(",");
            if (gameDomains.length == 0 && game.getGameCategory() != null) {
                gameDomains = new String[] { game.getGameCategory() };
            }
            for (String domain : gameDomains) {
                String cleanDomain = domain.trim();
                if (domainScores.containsKey(cleanDomain)) {
                    domainScores.put(cleanDomain, domainScores.get(cleanDomain) + 1.0);
                }
            }
        }

        List<String> top3 = domainScores.entrySet().stream()
            .filter(entry -> entry.getValue() > 0)
            .sorted(Comparator.comparing(Map.Entry<String, Double>::getValue, Comparator.reverseOrder())
                .thenComparing(Map.Entry::getKey))
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        String explanation = top3.isEmpty()
            ? "There is not enough activity yet to suggest exploration areas. Try a few activities first."
            : "These are areas your child may enjoy exploring, based on recorded activity choices and replays: " + String.join(", ", top3) + ".";

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
