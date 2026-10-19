package com.careerquest.backend;

import com.careerquest.backend.controller.ParentController;
import com.careerquest.backend.controller.ChildController;
import com.careerquest.backend.dto.ChildRegistrationRequest;
import com.careerquest.backend.dto.RegisterRequest;
import com.careerquest.backend.model.ChildProfile;
import com.careerquest.backend.model.GameRecord;
import com.careerquest.backend.model.ParentChildLink;
import com.careerquest.backend.model.Recommendation;
import com.careerquest.backend.model.User;
import com.careerquest.backend.repository.*;
import com.careerquest.backend.service.UserService;
import com.careerquest.backend.service.RecommendationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:qa-tests;DB_CLOSE_DELAY=-1")
@Transactional
public class ConsentAndFeedbackTests {

    @Autowired
    private UserService userService;

    @Autowired
    private ChildController childController;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChildProfileRepository childProfileRepository;

    @Autowired
    private ParentChildLinkRepository parentChildLinkRepository;

    @Autowired
    private GameRecordRepository gameRecordRepository;

    @Autowired
    private GameLevelProgressRepository gameLevelProgressRepository;

    @Test
    public void testChildDirectRegistrationAndParentLinking() {
        // 1. Child registers independently (No parent permission required)
        ChildRegistrationRequest childReq = new ChildRegistrationRequest();
        childReq.setNickname("Alex");
        childReq.setAvatar("rocket");
        childReq.setAgeGroup("11-13");
        childReq.setPin("1234");

        ChildProfile childProfile = userService.registerChild(childReq);

        assertNotNull(childProfile.getId());
        assertNotNull(childProfile.getPlayerCode());
        assertTrue(childProfile.getPlayerCode().startsWith("CQ"));
        assertEquals("Alex", childProfile.getNickname());

        User childUser = userRepository.findById(childProfile.getUserId()).orElse(null);
        assertNotNull(childUser);
        // Verify child is ACTIVE immediately without parent approval
        assertEquals("ACTIVE", childUser.getAccountStatus());

        // 2. Parent registers separately
        RegisterRequest parentReq = new RegisterRequest();
        parentReq.setUsername("testparent");
        parentReq.setEmail("parent@test.com");
        parentReq.setPassword(java.util.UUID.randomUUID().toString());
        parentReq.setRole("PARENT");
        User parent = userService.registerUser(parentReq);

        assertNotNull(parent.getId());
        assertEquals("ACTIVE", parent.getAccountStatus());

        // 3. Parent links to child using Child Player Code
        ParentChildLink link = userService.linkChildToParent(parent.getId(), childProfile.getPlayerCode());
        assertNotNull(link);
        assertEquals(parent.getId(), link.getParentId());
        assertEquals(childProfile.getId(), link.getChildProfileId());

        assertTrue(parentChildLinkRepository.existsByParentIdAndChildProfileId(parent.getId(), childProfile.getId()));
    }

    @Test
    public void testParentCannotReadUnlinkedChildActivityOrInsights() {
        ChildRegistrationRequest childReq = new ChildRegistrationRequest();
        childReq.setNickname("Jordan");
        childReq.setAvatar("star");
        childReq.setAgeGroup("8-10");
        childReq.setPin("4321");
        ChildProfile childProfile = userService.registerChild(childReq);

        RegisterRequest parentAReq = new RegisterRequest();
        parentAReq.setUsername("linkedparent");
        parentAReq.setEmail("linkedparent@test.com");
        parentAReq.setPassword(java.util.UUID.randomUUID().toString());
        parentAReq.setRole("PARENT");
        User parentA = userService.registerUser(parentAReq);
        userService.linkChildToParent(parentA.getId(), childProfile.getPlayerCode());

        RegisterRequest parentBReq = new RegisterRequest();
        parentBReq.setUsername("unlinkedparent");
        parentBReq.setEmail("unlinkedparent@test.com");
        parentBReq.setPassword(java.util.UUID.randomUUID().toString());
        parentBReq.setRole("PARENT");
        User parentB = userService.registerUser(parentBReq);

        ParentController controller = new ParentController(
                userService,
                childProfileRepository,
                parentChildLinkRepository,
                gameRecordRepository,
                gameLevelProgressRepository
        );

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(parentB, null, List.of(new SimpleGrantedAuthority("ROLE_PARENT")))
        );

        assertThrows(AccessDeniedException.class, () -> controller.getChildActivity(childProfile.getId()));
        assertThrows(AccessDeniedException.class, () -> controller.getChildInsights(childProfile.getId()));

        SecurityContextHolder.clearContext();
    }

    @Test
    public void testExploratoryCompletionDoesNotInventScoreEvidence() {
        ChildRegistrationRequest childReq = new ChildRegistrationRequest();
        childReq.setNickname("Casey");
        childReq.setAvatar("star");
        childReq.setAgeGroup("11-13");
        childReq.setPin("2468");
        ChildProfile profile = userService.registerChild(childReq);
        User child = userRepository.findById(profile.getUserId()).orElseThrow();
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(child, null, List.of(new SimpleGrantedAuthority("ROLE_CHILD")))
        );

        try {
            childController.submitLevelComplete(Map.of(
                    "gameId", "invent_something",
                    "level", "EASY",
                    "gameCategory", "Engineering & Making"
            ));
            GameRecord exploratoryRecord = gameRecordRepository.findByChildProfileId(profile.getId()).get(0);
            assertNull(exploratoryRecord.getScore());
            assertNull(exploratoryRecord.getAccuracy());

            childController.submitLevelComplete(Map.of(
                    "gameId", "data_detective",
                    "level", "EASY",
                    "gameCategory", "Technology & Logic",
                    "accuracy", 25
            ));
            GameRecord scoredRecord = gameRecordRepository.findByChildProfileId(profile.getId()).stream()
                    .filter(record -> "data_detective".equals(record.getGameType()))
                    .findFirst()
                    .orElseThrow();
            assertEquals(25, scoredRecord.getScore());
            assertEquals(25.0, scoredRecord.getAccuracy());
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    @Test
    public void testEmptyActivityDoesNotProduceUnsupportedParentInsightsOrRecommendations() {
        ChildRegistrationRequest childReq = new ChildRegistrationRequest();
        childReq.setNickname("Taylor");
        childReq.setAvatar("planet");
        childReq.setAgeGroup("11-13");
        childReq.setPin("1357");
        ChildProfile profile = userService.registerChild(childReq);

        RegisterRequest parentReq = new RegisterRequest();
        parentReq.setUsername("evidenceparent");
        parentReq.setEmail("evidenceparent@test.com");
        parentReq.setPassword(java.util.UUID.randomUUID().toString());
        parentReq.setRole("PARENT");
        User parent = userService.registerUser(parentReq);
        userService.linkChildToParent(parent.getId(), profile.getPlayerCode());

        ParentController controller = new ParentController(
                userService,
                childProfileRepository,
                parentChildLinkRepository,
                gameRecordRepository,
                gameLevelProgressRepository
        );
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(parent, null, List.of(new SimpleGrantedAuthority("ROLE_PARENT")))
        );

        try {
            Map<String, Object> insights = (Map<String, Object>) controller.getChildInsights(profile.getId()).getBody();
            Map<String, String> skillLevels = (Map<String, String>) insights.get("skillLevels");
            List<String> parentInsights = (List<String>) insights.get("parentInsights");
            assertEquals("Not enough evidence yet", skillLevels.get("Science & Research"));
            assertTrue(parentInsights.get(0).contains("not enough activity"));

            Recommendation recommendation = recommendationService.generateRecommendation(profile.getId());
            assertEquals("[]", recommendation.getRecommendedDomains());
            assertTrue(recommendation.getExplanation().contains("not enough activity"));
        } finally {
            SecurityContextHolder.clearContext();
        }
    }
}
