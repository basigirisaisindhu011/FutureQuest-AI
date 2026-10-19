package com.careerquest.backend;

import com.careerquest.backend.repository.GameRecordRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:qa-tests;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
@Transactional
class KnownFailureRegressionTests {
    @Autowired MockMvc http;
    @Autowired ObjectMapper json;
    @Autowired GameRecordRepository games;

    private JsonNode child() throws Exception {
        String body = http.perform(post("/api/auth/child/register").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("nickname", "Regression Explorer", "avatar", "rocket", "ageGroup", "11-13", "pin", "2468"))))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        return json.readTree(body);
    }

    @Test void publicSignupCannotCreatePrivilegedOrUnsupportedRoles() throws Exception {
        for (String role : new String[]{"ADMIN", "ROLE_ADMIN", "CHILD", "unknown"}) {
            String name = "regression" + UUID.randomUUID().toString().replace("-", "");
            http.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                    .content(json.writeValueAsString(Map.of("username", name, "email", name + "@example.test", "password", java.util.UUID.randomUUID().toString(), "role", role))))
                    .andExpect(status().isBadRequest());
        }
    }

    @Test void chatRejectsMissingBlankAndNullMessages() throws Exception {
        String token = child().get("token").asText();
        for (String body : new String[]{"{}", "{\"message\":null}", "{\"message\":\" \"}"}) {
            http.perform(post("/api/ai/chat").header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isBadRequest());
        }
    }

    @Test void invalidCompletionsCannotCreateRecordsOrRewards() throws Exception {
        JsonNode user = child();
        String token = user.get("token").asText();
        for (String body : new String[]{
                "{\"gameId\":\"puzzle_lab\",\"level\":\"IMPOSSIBLE\"}",
                "{\"gameId\":\"puzzle_lab\",\"accuracy\":999}",
                "{\"gameId\":\"puzzle_lab\",\"score\":-1}",
                "{\"gameId\":\"puzzle_lab\",\"score\":80.5}",
                "{\"gameId\":\"puzzle_lab\",\"accuracy\":\"80\"}",
                "{\"gameId\":\"puzzle_lab\",\"duration\":-1}",
                "{\"gameId\":\"puzzle_lab\",\"gameName\":{}}",
                "{\"gameId\":\"unknown\"}", "{}"}) {
            http.perform(post("/api/child/games/level-complete").header("Authorization", "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isBadRequest());
        }
        assertTrue(games.findByChildProfileId(user.get("childId").asLong()).isEmpty());
        String profile = http.perform(get("/api/child/profile").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        assertEquals(0, json.readTree(profile).get("points").asInt());
    }

    @Test void allDifficultyChoicesStillSaveValidBoundaryScores() throws Exception {
        JsonNode user = child();
        for (String level : new String[]{"EASY", "MODERATE", "MEDIUM", "HARD"}) {
            http.perform(post("/api/child/games/level-complete").header("Authorization", "Bearer " + user.get("token").asText())
                    .contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(Map.of("gameId", "puzzle_lab", "level", level, "score", 100))))
                    .andExpect(status().isOk());
        }
        assertEquals(4, games.findByChildProfileId(user.get("childId").asLong()).size());
    }

    @Test void quizzesValidatePersistAndStayScopedToTheChild() throws Exception {
        JsonNode first = child();
        String header = "Bearer " + first.get("token").asText();
        http.perform(post("/api/child/quizzes").header("Authorization", header).contentType(MediaType.APPLICATION_JSON)
                .content("{\"quizType\":\"personality\",\"score\":5}" )).andExpect(status().isBadRequest());
        http.perform(post("/api/child/quizzes").header("Authorization", header).contentType(MediaType.APPLICATION_JSON)
                .content("{\"quizType\":\"personality\",\"score\":11,\"responses\":\"{}\"}" )).andExpect(status().isBadRequest());
        http.perform(post("/api/child/quizzes").header("Authorization", header).contentType(MediaType.APPLICATION_JSON)
                .content("{\"quizType\":\"personality\",\"score\":5,\"responses\":\"{}\"}" )).andExpect(status().isCreated());
        String own = http.perform(get("/api/child/quizzes").header("Authorization", header)).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        assertEquals(1, json.readTree(own).size());
        JsonNode second = child();
        String other = http.perform(get("/api/child/quizzes").header("Authorization", "Bearer " + second.get("token").asText()))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        assertTrue(json.readTree(other).isEmpty());
    }

    private JsonNode parent() throws Exception {
        String name = "qa" + UUID.randomUUID().toString().replace("-", "");
        return json.readTree(http.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("username", name, "email", name + "@example.test", "password", java.util.UUID.randomUUID().toString(), "role", "PARENT"))))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
    }

    @Test void parentLinkRequiresCorrectPinAndPublicSearchOmitsCodes() throws Exception {
        JsonNode c = child(), p = parent();
        String header = "Bearer " + p.get("token").asText();
        for (String pin : new String[]{"", "9999"}) {
            http.perform(post("/api/parent/link-child").header("Authorization", header).contentType(MediaType.APPLICATION_JSON)
                    .content(json.writeValueAsString(Map.of("playerCode", c.get("playerCode").asText(), "pin", pin))))
                    .andExpect(status().isBadRequest());
        }
        http.perform(get("/api/parent/children/" + c.get("childId").asLong() + "/activity").header("Authorization", header))
                .andExpect(status().isForbidden());
        http.perform(post("/api/parent/link-child").header("Authorization", header).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("playerCode", c.get("playerCode").asText(), "pin", "2468"))))
                .andExpect(status().isOk());
        String players = http.perform(get("/api/auth/players")).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        assertFalse(players.contains("playerCode"));
        assertFalse(players.contains("profileId"));
    }

    @Test void duplicateSessionDoesNotAwardTwiceAndForeignFeedbackFails() throws Exception {
        JsonNode c = child(); String header = "Bearer " + c.get("token").asText();
        String payload = json.writeValueAsString(Map.of("gameId", "dream_designer", "level", "HARD", "sessionId", UUID.randomUUID().toString()));
        JsonNode first = json.readTree(http.perform(post("/api/child/games/level-complete").header("Authorization", header)
                .contentType(MediaType.APPLICATION_JSON).content(payload)).andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
        JsonNode second = json.readTree(http.perform(post("/api/child/games/level-complete").header("Authorization", header)
                .contentType(MediaType.APPLICATION_JSON).content(payload)).andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
        assertEquals(first.get("recordId"), second.get("recordId"));
        assertEquals(1, games.findByChildProfileId(c.get("childId").asLong()).size());
        JsonNode other = child();
        http.perform(post("/api/feedback").header("Authorization", "Bearer " + other.get("token").asText())
                .contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(Map.of("activityType", "game", "activityId", first.get("recordId").asLong(), "rating", 5))))
                .andExpect(status().isBadRequest());
        String feedback = json.writeValueAsString(Map.of("activityType", "game", "activityId", first.get("recordId").asLong(), "rating", 5));
        for (int i = 0; i < 2; i++) http.perform(post("/api/feedback").header("Authorization", header).contentType(MediaType.APPLICATION_JSON)
                .content(feedback)).andExpect(status().isOk());
        JsonNode profile = json.readTree(http.perform(get("/api/child/profile").header("Authorization", header))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
        assertEquals(50, profile.get("points").asInt());
    }

    @Test void discoveryCreditsOnlySelectedDomainsAndRetainsExperimentEvidence() throws Exception {
        JsonNode c = child();
        String header = "Bearer " + c.get("token").asText();
        Map<String, Object> payload = Map.of("gameId", "interest_battle", "level", "EASY",
                "careerDomains", "Technology & Logic,Creativity & Design", "choicesMade", java.util.List.of(Map.of("selected", "CREATIVITY_DESIGN")));
        http.perform(post("/api/child/games/level-complete").header("Authorization", header).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(payload))).andExpect(status().isOk());
        var discovery = games.findByChildProfileId(c.get("childId").asLong()).get(0);
        assertEquals("Creativity & Design", discovery.getCareerDomains());
        http.perform(post("/api/child/games/level-complete").header("Authorization", header).contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("gameId", "science_lab", "predictions", "Longer shadow", "observations", "15 cm", "experiment", Map.of("measurement", 15)))))
                .andExpect(status().isOk());
        var science = games.findByChildProfileId(c.get("childId").asLong()).stream().filter(record -> record.getGameType().equals("science_lab")).findFirst().orElseThrow();
        assertEquals("Longer shadow", science.getPredictions());
        assertEquals("15 cm", science.getObservations());
        assertEquals(1, science.getEvidence().get("schemaVersion"));
        http.perform(post("/api/child/games/level-complete").header("Authorization", header).contentType(MediaType.APPLICATION_JSON)
                .content("{\"gameId\":\"interest_battle\",\"choicesMade\":[{}]}" )).andExpect(status().isBadRequest());
        assertEquals(2, games.findByChildProfileId(c.get("childId").asLong()).size());
    }
}
