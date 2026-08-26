package com.careerquest.backend.config;

import com.careerquest.backend.model.Question;
import com.careerquest.backend.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class QuestionBankInitializer implements CommandLineRunner {

    private final QuestionRepository questionRepository;

    public QuestionBankInitializer(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    @Override
    public void run(String... args) {
        if (questionRepository.count() > 0) {
            return;
        }

        List<Question> questions = new ArrayList<>();
        String[] ageGroups = {"8-10", "11-13", "14-16", "17+"};

        for (String age : ageGroups) {

            // 1. Spell Quest 🔤
            questions.add(new Question("spell_quest", age, "EASY", "SPELLING", "Spell the word for a friendly feline animal.", null, "CAT", "Starts with C.", "Spelling short words.", "Spelling"));
            questions.add(new Question("spell_quest", age, "EASY", "SPELLING", "Spell the word for reading stories.", null, "BOOK", "Starts with B.", "Spelling short words.", "Spelling"));
            questions.add(new Question("spell_quest", age, "EASY", "SPELLING", "Spell the word for green garden plants.", null, "TREE", "Starts with T.", "Spelling short words.", "Spelling"));

            questions.add(new Question("spell_quest", age, "MODERATE", "SPELLING", "Spell the word for a celestial body orbiting a star.", null, "PLANET", "Starts with P.", "Spelling moderate words.", "Spelling"));
            questions.add(new Question("spell_quest", age, "MODERATE", "SPELLING", "Spell the word for a place of learning.", null, "SCHOOL", "Starts with S.", "Spelling moderate words.", "Spelling"));
            questions.add(new Question("spell_quest", age, "MODERATE", "SPELLING", "Spell the word for a healthcare professional.", null, "DOCTOR", "Starts with D.", "Spelling moderate words.", "Spelling"));

            questions.add(new Question("spell_quest", age, "MEDIUM", "SPELLING", "Spell the word for an exciting exploration.", null, "ADVENTURE", "Starts with A.", "Spelling medium words.", "Spelling"));
            questions.add(new Question("spell_quest", age, "MEDIUM", "SPELLING", "Spell the word for an electronic computing device.", null, "COMPUTER", "Starts with C.", "Spelling medium words.", "Spelling"));
            questions.add(new Question("spell_quest", age, "MEDIUM", "SPELLING", "Spell the word for imaginative thinking.", null, "CREATIVE", "Starts with C.", "Spelling medium words.", "Spelling"));

            questions.add(new Question("spell_quest", age, "HARD", "SPELLING", "Spell the word for modern technical systems.", null, "TECHNOLOGY", "Starts with T.", "Spelling advanced words.", "Spelling"));
            questions.add(new Question("spell_quest", age, "HARD", "SPELLING", "Spell the word for natural surroundings.", null, "ENVIRONMENT", "Starts with E.", "Spelling advanced words.", "Spelling"));
            questions.add(new Question("spell_quest", age, "HARD", "SPELLING", "Spell the word for sharing thoughts & ideas.", null, "COMMUNICATION", "Starts with C.", "Spelling advanced words.", "Spelling"));

            // 2. Listen & Spell 🎧
            questions.add(new Question("listen_spell", age, "EASY", "SPELLING", "Listen to the word and spell it.", null, "SUN", "Listen to the audio.", "Listening short words.", "Listening"));
            questions.add(new Question("listen_spell", age, "EASY", "SPELLING", "Listen to the word and spell it.", null, "MILK", "Listen to the audio.", "Listening short words.", "Listening"));

            questions.add(new Question("listen_spell", age, "MODERATE", "SPELLING", "Listen to the word and spell it.", null, "ANIMAL", "Listen to the audio.", "Listening moderate words.", "Listening"));
            questions.add(new Question("listen_spell", age, "MODERATE", "SPELLING", "Listen to the word and spell it.", null, "GARDEN", "Listen to the audio.", "Listening moderate words.", "Listening"));

            questions.add(new Question("listen_spell", age, "MEDIUM", "SPELLING", "Listen to the word and spell it.", null, "JOURNEY", "Listen to the audio.", "Listening medium words.", "Listening"));
            questions.add(new Question("listen_spell", age, "MEDIUM", "SPELLING", "Listen to the word and spell it.", null, "SCIENTIST", "Listen to the audio.", "Listening medium words.", "Listening"));

            questions.add(new Question("listen_spell", age, "HARD", "SPELLING", "Listen to the word and spell it.", null, "ARCHITECTURE", "Listen to the audio.", "Listening advanced words.", "Listening"));
            questions.add(new Question("listen_spell", age, "HARD", "SPELLING", "Listen to the word and spell it.", null, "INVESTIGATION", "Listen to the audio.", "Listening advanced words.", "Listening"));

            // 3. Puzzle Laboratory 🧩
            questions.add(new Question("puzzle_lab", age, "EASY", "MULTIPLE_CHOICE", "What comes next in the pattern: 2, 4, 6, ?", "8,10,7,9", "8", "Add 2 each step.", "Arithmetic sequence.", "Logic"));
            questions.add(new Question("puzzle_lab", age, "MODERATE", "MULTIPLE_CHOICE", "What comes next in the pattern: 3, 6, 12, 24, ?", "48,36,30,42", "48", "Multiply by 2 each step.", "Geometric sequence.", "Logic"));
            questions.add(new Question("puzzle_lab", age, "MEDIUM", "MULTIPLE_CHOICE", "What comes next: 1, 4, 9, 16, ?", "25,20,30,22", "25", "Square numbers sequence (1x1, 2x2, 3x3, 4x4, 5x5).", "Square sequence.", "Logic"));
            questions.add(new Question("puzzle_lab", age, "HARD", "MULTIPLE_CHOICE", "Solve Fibonacci: 1, 1, 2, 3, 5, 8, ?", "13,11,15,10", "13", "Add previous two numbers (5+8).", "Fibonacci logic.", "Logic"));

            // 4. Math Treasure Hunt 🗺️
            questions.add(new Question("math_treasure", age, "EASY", "MULTIPLE_CHOICE", "You find 5 gold coins and 4 silver coins. How many total coins?", "9,10,8,7", "9", "Add 5 + 4.", "Addition.", "Math"));
            questions.add(new Question("math_treasure", age, "MODERATE", "MULTIPLE_CHOICE", "You find 6 treasure boxes with 4 coins in each. How many coins?", "24,20,28,18", "24", "Multiply 6 x 4.", "Multiplication.", "Math"));
            questions.add(new Question("math_treasure", age, "MEDIUM", "MULTIPLE_CHOICE", "You find 24 coins and 6 treasure chests. How many coins go into each chest equally?", "4,6,8,5", "4", "Divide 24 by 6.", "Division word problem.", "Math"));
            questions.add(new Question("math_treasure", age, "HARD", "MULTIPLE_CHOICE", "The chest lock code is double 15 plus 12. What is the code?", "42,30,45,38", "42", "Calculate (15 x 2) + 12.", "Multi-step reasoning.", "Math"));

            // 5. Code the Robot 🤖
            questions.add(new Question("code_robot", age, "EASY", "MULTIPLE_CHOICE", "Which single command moves the robot 1 tile forward?", "Forward 1,Turn Left,Power Off", "Forward 1", "Move step.", "Basic navigation.", "Logic"));
            questions.add(new Question("code_robot", age, "MODERATE", "MULTIPLE_CHOICE", "Which command sequence reaches tile (2,2)?", "Forward 2, Right 2;Forward 4;Left 2", "Forward 2, Right 2", "Combine moves.", "Sequence mapping.", "Logic"));
            questions.add(new Question("code_robot", age, "MEDIUM", "MULTIPLE_CHOICE", "Robot sees an obstacle ⬛. Which path bypasses it?", "Right 3, Down 1, Left 1;Straight into rock;Power off", "Right 3, Down 1, Left 1", "Path around obstacle.", "Obstacle avoidance.", "Logic"));
            questions.add(new Question("code_robot", age, "HARD", "MULTIPLE_CHOICE", "Which loop block efficiently repeats 2 steps down and 2 steps right?", "Repeat 2 [Down 1, Right 1];Forward 10;Stop", "Repeat 2 [Down 1, Right 1]", "Loop optimization.", "Loop optimization.", "Logic"));

            // 6. Cyber Detective 🕵️
            questions.add(new Question("cyber_detective", age, "EASY", "MULTIPLE_CHOICE", "What is the safest action when a stranger asks for your address?", "Never share private address,Tell them immediately,Post it online", "Never share private address", "Protect personal information.", "Digital safety.", "Safety"));
            questions.add(new Question("cyber_detective", age, "MODERATE", "MULTIPLE_CHOICE", "Incoming text: 'You won $1000! Click here.' What should you do?", "Do not click & tell trusted adult,Click link,Send password", "Do not click & tell trusted adult", "Avoid suspicious phishing links.", "Cyber security.", "Safety"));
            questions.add(new Question("cyber_detective", age, "MEDIUM", "MULTIPLE_CHOICE", "An app requests access to your contacts and location. What should you check?", "Check if app really needs location & ask parent,Grant all permissions,Ignore security", "Check if app really needs location & ask parent", "App permission privacy.", "Privacy.", "Safety"));
            questions.add(new Question("cyber_detective", age, "HARD", "MULTIPLE_CHOICE", "What is the strongest password practice?", "Long password with mixed symbols & 2FA,Password123,Your nickname", "Long password with mixed symbols & 2FA", "Strong authentication.", "Cyber security.", "Safety"));

            // 7. Space Scientist 🚀
            questions.add(new Question("space_scientist", age, "EASY", "MULTIPLE_CHOICE", "Which planet is known as the Red Planet?", "Mars,Venus,Jupiter", "Mars", "Iron oxide dust makes it red.", "Astronomy.", "Science"));
            questions.add(new Question("space_scientist", age, "MODERATE", "MULTIPLE_CHOICE", "Which planet is closest to the Sun?", "Mercury,Mars,Earth", "Mercury", "First planet from Sun.", "Solar system.", "Science"));
            questions.add(new Question("space_scientist", age, "MEDIUM", "MULTIPLE_CHOICE", "What force keeps planets in orbit around the Sun?", "Gravity,Magnetism,Wind", "Gravity", "Gravitational attraction.", "Physics.", "Science"));
            questions.add(new Question("space_scientist", age, "HARD", "MULTIPLE_CHOICE", "What powers the Sun's core energy?", "Nuclear Fusion of Hydrogen into Helium,Chemical burning,Solar panels", "Nuclear Fusion of Hydrogen into Helium", "Stellar fusion energy.", "Astrophysics.", "Science"));

            // Populate all remaining games
            String[] remainingGames = {
                "archaeologist", "dream_designer", "wildlife_photo", "eco_rescue",
                "emergency_doctor", "mini_entrepreneur", "news_reporter", "speaking_games",
                "read_aloud", "describe_picture", "story_builder", "sentence_builder", "rapid_word"
            };

            for (String gId : remainingGames) {
                questions.add(new Question(gId, age, "EASY", "MULTIPLE_CHOICE", "Easy Challenge: Choose the best action to complete this intro mission.", "Option A (Correct),Option B,Option C", "Option A (Correct)", "Warm-up challenge.", "Basic reasoning.", "Logic"));
                questions.add(new Question(gId, age, "MODERATE", "MULTIPLE_CHOICE", "Moderate Challenge: Select the proper strategy to solve this puzzle.", "Option A (Correct),Option B,Option C", "Option A (Correct)", "Ready for more.", "Strategy.", "Logic"));
                questions.add(new Question(gId, age, "MEDIUM", "MULTIPLE_CHOICE", "Medium Challenge: Evaluate options and pick the multi-step solution.", "Option A (Correct),Option B,Option C", "Option A (Correct)", "Challenge yourself.", "Multi-step reasoning.", "Logic"));
                questions.add(new Question(gId, age, "HARD", "MULTIPLE_CHOICE", "Hard Challenge: Advanced analysis required to master this problem.", "Option A (Correct),Option B,Option C", "Option A (Correct)", "Expert level.", "Advanced logic.", "Logic"));
            }
        }

        questionRepository.saveAll(questions);
    }
}
