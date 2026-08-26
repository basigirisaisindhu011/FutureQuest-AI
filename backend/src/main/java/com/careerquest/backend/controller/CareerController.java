package com.careerquest.backend.controller;

import com.careerquest.backend.model.CareerInfo;
import com.careerquest.backend.model.CareerRoadmap;
import com.careerquest.backend.model.LearningResource;
import com.careerquest.backend.repository.CareerInfoRepository;
import com.careerquest.backend.repository.CareerRoadmapRepository;
import com.careerquest.backend.repository.LearningResourceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/careers")
public class CareerController {

    private final CareerInfoRepository careerInfoRepository;
    private final CareerRoadmapRepository careerRoadmapRepository;
    private final LearningResourceRepository learningResourceRepository;

    public CareerController(
            CareerInfoRepository careerInfoRepository,
            CareerRoadmapRepository careerRoadmapRepository,
            LearningResourceRepository learningResourceRepository) {
        this.careerInfoRepository = careerInfoRepository;
        this.careerRoadmapRepository = careerRoadmapRepository;
        this.learningResourceRepository = learningResourceRepository;
    }

    @GetMapping
    public ResponseEntity<List<CareerInfo>> getAllCareers() {
        seedInitialCareersIfEmpty();
        return ResponseEntity.ok(careerInfoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCareerById(@PathVariable Long id) {
        Optional<CareerInfo> career = careerInfoRepository.findById(id);
        if (career.isPresent()) {
            return ResponseEntity.ok(career.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/roadmap")
    public ResponseEntity<List<CareerRoadmap>> getRoadmapByCareerId(@PathVariable Long id) {
        seedRoadmapsIfEmpty(id);
        return ResponseEntity.ok(careerRoadmapRepository.findByCareerId(id));
    }

    @GetMapping("/{id}/resources")
    public ResponseEntity<List<LearningResource>> getResourcesByCareerId(@PathVariable Long id) {
        seedResourcesIfEmpty(id);
        return ResponseEntity.ok(learningResourceRepository.findByCareerId(id));
    }

    private void seedInitialCareersIfEmpty() {
        if (careerInfoRepository.count() == 0) {
            careerInfoRepository.save(new CareerInfo("Software Engineer", "Technology and Software", "Develop applications, websites, and system architectures using code."));
            careerInfoRepository.save(new CareerInfo("Wildlife Photographer", "Photography and Creative Media", "Capture rare and beautiful animal moments in wilderness regions."));
            careerInfoRepository.save(new CareerInfo("Environmental Scientist", "Wildlife and Environmental Science", "Study ecosystem trends and help save biodiversity."));
            careerInfoRepository.save(new CareerInfo("Entrepreneur", "Business and Entrepreneurship", "Create, structure, and scale virtual or physical startup companies."));
            careerInfoRepository.save(new CareerInfo("Pediatrician", "Medicine and Healthcare", "Perform diagnostic tests and provide care/treatment plans for young children."));
            careerInfoRepository.save(new CareerInfo("Graphic Designer", "Design and Innovation", "Create brand assets, logos, and UI interfaces to convey meaningful visuals."));
            careerInfoRepository.save(new CareerInfo("Aerospace Researcher", "Research and Science", "Study mechanics and innovations of flight and space exploration systems."));
            careerInfoRepository.save(new CareerInfo("AI Specialist", "Future and Emerging Careers", "Code intelligent models and explore deep learning algorithms."));
        }
    }

    private void seedRoadmapsIfEmpty(Long careerId) {
        if (careerRoadmapRepository.findByCareerId(careerId).isEmpty()) {
            Optional<CareerInfo> careerOpt = careerInfoRepository.findById(careerId);
            if (careerOpt.isPresent()) {
                String name = careerOpt.get().getName();
                if ("Wildlife Photographer".equals(name)) {
                    careerRoadmapRepository.save(new CareerRoadmap(
                            careerId,
                            "School Level",
                            "Observation, Basic Camera skills",
                            "Nature Appreciation, Elementary Photography",
                            "School photographer, nature journal contributor",
                            "Focus on developing observation speed, camera angles, and composition basics."
                    ));
                    careerRoadmapRepository.save(new CareerRoadmap(
                            careerId,
                            "Higher Education",
                            "Editing tools, Wildlife Conservation expertise",
                            "B.A. in Photography, Wildlife Conservation course",
                            "Wildlife documentary photographer, nature blogger",
                            "Pursue advanced zoom captures and work with outdoor agencies."
                    ));
                } else if ("Software Engineer".equals(name)) {
                    careerRoadmapRepository.save(new CareerRoadmap(
                            careerId,
                            "School Level",
                            "Logical thinking, algorithmic thinking",
                            "Python basics, Scratch programming",
                            "Coding competition participant, school tech club coordinator",
                            "Focus on variables, conditionals, loops, and clean code principles."
                    ));
                    careerRoadmapRepository.save(new CareerRoadmap(
                            careerId,
                            "Higher Education",
                            "System design, database architecture",
                            "B.S. in Computer Science, Fullstack Certification",
                            "Junior Frontend Developer, Backend Engineer, App developer",
                            "Master full stack architectures and contribute to open source codebases."
                    ));
                } else {
                    // Default generic seed
                    careerRoadmapRepository.save(new CareerRoadmap(
                            careerId,
                            "School Level",
                            "Curiosity, problem solving",
                            "Introductory foundation subjects",
                            "Project participant",
                            "Begin with conceptual understanding."
                    ));
                }
            }
        }
    }

    private void seedResourcesIfEmpty(Long careerId) {
        if (learningResourceRepository.findByCareerId(careerId).isEmpty()) {
            Optional<CareerInfo> careerOpt = careerInfoRepository.findById(careerId);
            if (careerOpt.isPresent()) {
                String name = careerOpt.get().getName();
                if ("Wildlife Photographer".equals(name)) {
                    learningResourceRepository.save(new LearningResource(careerId, "Photography Basics", "Learn lens types, exposure, and aperture details.", "Beginner", "article", "https://example.com/photo-basics"));
                    learningResourceRepository.save(new LearningResource(careerId, "Wilderness Tracking", "Learn safe wildlife observation methods.", "Intermediate", "video", "https://example.com/wild-track"));
                    learningResourceRepository.save(new LearningResource(careerId, "Landscape Capture Challenge", "Submit 3 outdoor composition photos.", "Advanced", "challenge", "https://example.com/landscape-challenge"));
                } else {
                    learningResourceRepository.save(new LearningResource(careerId, "Starter Guide", "General guidelines to learn this industry.", "Beginner", "article", "https://example.com/starter-guide"));
                    learningResourceRepository.save(new LearningResource(careerId, "Interactive Workshop", "Watch pros explain their standard routines.", "Intermediate", "video", "https://example.com/workshop"));
                }
            }
        }
    }
}
