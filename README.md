# CareerQuest AI 🚀
### Interactive Children's Interest Discovery & Skill Analysis Platform

**CareerQuest AI** is an AI-powered interactive game platform designed for children to explore their strengths and natural interests through 20 specialized mini-games across 7 core skill domains. Parents can view detailed behavioral insights, interest tracking, and progress metrics without restricting their child's independent play.

---

## ✨ Key System Features

### 1. Child-Centric & Parent-Independent Play
- **Zero Permission Gates**: Children register with a simple player nickname and avatar, generating a unique Player Code (`CQ-XXXXX`).
- **Instant Game Access**: No parent OTP, consent screens, or approval blockers in the child's flow.

### 2. 100% Free Difficulty Selection (No Level Locking)
- **Always Playable**: 🟢 **Easy**, 🟡 **Moderate**, 🟠 **Medium**, 🔴 **Hard** levels are 100% unlocked for all 20 mini-games from day one.
- **Voluntary Choice Analysis**: System tracks voluntary difficulty selection (`preferredDifficulty`, `highestDifficultyTried`) to distinguish **Interest** from **Skill**.

### 3. 7 Core Skill & Interest Domains
1. 🗣️ **Communication & Language** (*Spell Quest, Listen & Spell, Speak & Shine, Read Aloud, Describe the Picture, Story Builder, Sentence Builder, Rapid Word Challenge, News Reporter*)
2. 💻 **Technology & Logic** (*Code the Robot, Puzzle Laboratory, Math Treasure Hunt, Cyber Detective*)
3. 🔬 **Science & Exploration** (*Space Scientist, Archaeologist*)
4. 🎨 **Creativity & Design** (*Dream Designer, Story Builder*)
5. 🌱 **Nature & Environment** (*Wildlife Photographer, Eco Rescue*)
6. 🤝 **Social & Helping** (*Emergency Doctor*)
7. 💼 **Business & Leadership** (*Mini Entrepreneur, News Reporter*)

### 4. Specialized Mini-Game Interaction Engines
- 🤖 **Code the Robot**: Visual 4x4 grid canvas with Robot 🤖, obstacles ⬛, star target ⭐, and interactive command builder (`➡️ Right`, `⬇️ Down`, `🔄 Reset`) with step-by-step movement animation.
- 🔤 **Spell Quest**: Letter typing input with `_ _ _ _ _` letter feedback and 🔊 pronunciation.
- 🎧 **Listen & Spell**: Audio headphone hub, 🔊 **Play Word** button (Web Speech API TTS), hidden target word until answered, 💡 Hint toggle.
- 🎙️ **Speak & Shine & Read Aloud**: 🎤 Microphone trigger, Web Speech API speech-to-text recognition, transcript preview, positive AI reinforcement.
- 📚 **Story Builder**: Prominent visual image sequence builder (`🐶 → 🌧️ → 🏠 → 😊`), 🎤 **Tell My Story** or ⌨️ **Write My Story** modes.
- 📰 **News Reporter**: Fictional Event News Card (`📰 SCHOOL NEWS: 🌳 100 Trees Planted by 50 Students on Friday`), 🎤 **You're the Reporter!** spoken broadcast.
- ⚡ **Rapid Word Challenge**: 30-second rapid word recall (e.g. 🐾 *Animals*), live word chip stream (`Dog ✓`, `Tiger ✓`), 🎤 Speak or ⌨️ Type.
- 🧩 **Puzzle Laboratory**: Shape series (`▲ ● ▲ ● ▲ ?`), number series, odd-one-out (`🐶 🐱 🐯 🚗`), visual matching.
- 🗺️ **Math Treasure Hunt**: Treasure map riddles (`"24 coins into 6 chests. Coins per chest?"`), coin calculations, chest unlocking ✨.
- 🎨 **Dream Designer**: Choice-based room/poster builder (Cosmic, Nature, Pastel themes, furniture). NO correct/incorrect answers! Records creative preferences.
- 🌱 **Eco Rescue**: Waste sorting into `♻️ Recycling`, `🌱 Compost`, `🗑️ Trash`.
- 🍋 **Mini Entrepreneur**: Lemonade stand simulation (₹500 budget, pricing slider ₹10–₹50, sales outcome calculation: 20 customers, ₹700 revenue, ₹200 profit).

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Vanilla CSS design tokens, Lucide React icons, Web Speech API (TTS & STT).
- **Backend**: Java 17, Spring Boot 3, Spring Security, JWT Authentication, JPA / Hibernate, H2 Database / PostgreSQL.
- **AI Analytics**: Python / Spring AI behavioral telemetry processor.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Java JDK 17+
- Maven 3.8+

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs on `http://localhost:8080`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 📈 Repository Link
GitHub: [https://github.com/basigirisaisindhu011/careerquest-backend](https://github.com/basigirisaisindhu011/careerquest-backend)
