package backend.Controller;

import backend.Model.ChallengeModel;
import backend.Exception.ChallengeNotFoundException;
import backend.Repository.ChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/challenges")
public class ChallengeController {

    @Autowired
    private ChallengeRepository challengeRepository;

    // Create a new challenge
    @PostMapping
    public ChallengeModel newChallenge(@RequestBody ChallengeModel newChallenge) {
        return challengeRepository.save(newChallenge);
    }

    // Get all challenges
    @GetMapping
    public List<ChallengeModel> getAllChallenges() {
        return challengeRepository.findAll();
    }

    // Get a single challenge by ID
    @GetMapping("/{id}")
    public ChallengeModel getChallengeById(@PathVariable Long id) {
        return challengeRepository.findById(id)
                .orElseThrow(() -> new ChallengeNotFoundException(id));
    }

    // Update a challenge by ID
    @PutMapping("/{id}")
    public ChallengeModel updateChallenge(@RequestBody ChallengeModel updatedChallenge, @PathVariable Long id) {
        return challengeRepository.findById(id)
                .map(challenge -> {
                    challenge.setChallengeTitle(updatedChallenge.getChallengeTitle());
                    challenge.setChallengeDescription(updatedChallenge.getChallengeDescription());
                    challenge.setCategory(updatedChallenge.getCategory());
                    challenge.setDifficulty(updatedChallenge.getDifficulty());
                    challenge.setStartDate(updatedChallenge.getStartDate());
                    challenge.setEndDate(updatedChallenge.getEndDate());
                    return challengeRepository.save(challenge);
                }).orElseThrow(() -> new ChallengeNotFoundException(id));
    }

    // Delete a challenge by ID
    @DeleteMapping("/{id}")
    public String deleteChallenge(@PathVariable Long id) {
        if (!challengeRepository.existsById(id)) {
            throw new ChallengeNotFoundException(id);
        }
        challengeRepository.deleteById(id);
        return "Challenge with id " + id + " has been deleted successfully.";
    }
}