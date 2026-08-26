package com.careerquest.backend.controller;

import com.careerquest.backend.dto.ChatRequest;
import com.careerquest.backend.dto.ChatResponse;
import com.careerquest.backend.model.ChildProfile;
import com.careerquest.backend.model.GameRecord;
import com.careerquest.backend.model.User;
import com.careerquest.backend.repository.ChildProfileRepository;
import com.careerquest.backend.repository.GameRecordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class ChatController {

    private final ChildProfileRepository childProfileRepository;
    private final GameRecordRepository gameRecordRepository;

    public ChatController(
            ChildProfileRepository childProfileRepository,
            GameRecordRepository gameRecordRepository) {
        this.childProfileRepository = childProfileRepository;
        this.gameRecordRepository = gameRecordRepository;
    }

    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping("/chat")
    public ResponseEntity<?> askChatbot(@RequestBody ChatRequest request) {
        User user = getAuthenticatedUser();
        String message = request.getMessage().toLowerCase();
        
        // Gather context
        String interests = "";
        int level = 1;
        int businessScore = 0;
        int photoScore = 0;
        int codingScore = 0;

        if ("CHILD".equalsIgnoreCase(user.getRole())) {
            ChildProfile profile = childProfileRepository.findByUserId(user.getId()).orElse(null);
            if (profile != null) {
                interests = profile.getInterests() != null ? profile.getInterests().toLowerCase() : "";
                level = profile.getLevel();
                
                List<GameRecord> games = gameRecordRepository.findByChildProfileId(profile.getId());
                for (GameRecord g : games) {
                    if ("business".equalsIgnoreCase(g.getGameType())) {
                        businessScore = Math.max(businessScore, g.getScore());
                    }
                    if ("photography".equalsIgnoreCase(g.getGameType())) {
                        photoScore = Math.max(photoScore, g.getScore());
                    }
                    if ("coding".equalsIgnoreCase(g.getGameType())) {
                        codingScore = Math.max(codingScore, g.getScore());
                    }
                }
            }
        }

        String reply;
        
        // Conversational branches based on query and context
        if (message.contains("hello") || message.contains("hi") || message.contains("hey")) {
            reply = "Hello there " + user.getUsername() + "! I'm your CareerQuest AI Assistant. I can suggest careers, explain education roadmaps, or give you advice based on your interests. What would you like to explore today?";
        } else if (message.contains("animal") || message.contains("photo") || message.contains("camera") || message.contains("wildlife") || message.contains("nature")) {
            reply = "I see you're interested in photography or wildlife! If you love animals and want to capture them on camera, you should check out **Wildlife Photography**. You can start by developing observation skills and learning basic camera handling. A great roadmap for this is available in our Career Library!";
        } else if (message.contains("business") || message.contains("lemon") || message.contains("money") || message.contains("startup") || message.contains("sell") || message.contains("shop")) {
            reply = "Fascinating! Running a business is all about entrepreneurship. You need to manage supply budgets, set appropriate prices, and invest in marketing. If you enjoyed the Business simulation game, you might excel as a **Business Consultant, Marketing Manager, or Startup Founder**!";
        } else if (message.contains("code") || message.contains("program") || message.contains("computer") || message.contains("software") || message.contains("coding")) {
            reply = "Coding is a superpower! By writing code, you can build games, websites, or AI systems. Software Engineers learn logical block reasoning and master programming languages like Python or JavaScript. Check out the **Software Engineer** roadmap in our library.";
        } else if (message.contains("recommend") || message.contains("career") || message.contains("choice") || message.contains("suggest")) {
            if (photoScore > 75 || interests.contains("wildlife") || interests.contains("photo")) {
                reply = "Based on your scores and interests, you show high potential in **Wildlife Photography and Environmental Science**. You have excellent observation skills!";
            } else if (businessScore > 75 || interests.contains("business")) {
                reply = "Based on your business acumen in the simulation, you should explore **Business and Entrepreneurship**. You make very smart budget decisions!";
            } else if (codingScore > 75 || interests.contains("tech")) {
                reply = "With your logical thinking, **Software Engineering or AI Development** would be a fantastic match for you. You solve programming blocks efficiently!";
            } else {
                reply = "Since you are early in your journey, I recommend trying the **Business simulation** or the **Wildlife photography challenge**, and filling out your interests checklist so I can give you custom predictions!";
            }
        } else {
            reply = "That's a great question! In CareerQuest, you can explore fields like Wildlife conservation, medicine, software, teaching, and entrepreneurship. If you want to learn more, ask me: 'What does a Wildlife Photographer do?' or 'How can I become a coder?'";
        }

        return ResponseEntity.ok(new ChatResponse(reply));
    }
}
