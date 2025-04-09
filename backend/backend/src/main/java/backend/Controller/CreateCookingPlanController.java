package backend.Controller;

import backend.Exception.PlanNotFoundException;
import backend.Model.CreateCookingPlanModel;
import backend.Repository.CreateCookingPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
public class CreateCookingPlanController {

    @Autowired
    private CreateCookingPlanRepository planRepository;

    // Create a new plan
    @PostMapping("/plans")
    public CreateCookingPlanModel createPlan(@RequestBody CreateCookingPlanModel planModel) {
        return planRepository.save(planModel);
    }

    // Get all plans
    @GetMapping("/plans")
    public List<CreateCookingPlanModel> getAllPlans() {
        return planRepository.findAll();
    }

    // Get plan by ID
    @GetMapping("/plans/{id}")
    public CreateCookingPlanModel getPlanById(@PathVariable Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new PlanNotFoundException(id));
    }

    // Delete plan by ID
    @DeleteMapping("/plans/{id}")
    public String deletePlan(@PathVariable Long id) {
        if (!planRepository.existsById(id)) {
            throw new PlanNotFoundException(id);
        }
        planRepository.deleteById(id);
        return "Meal Plan with id " + id + " has been deleted.";
    }

    // Update plan
    @PutMapping("/plans/{id}")
    public CreateCookingPlanModel updatePlan(@RequestBody CreateCookingPlanModel newPlan, @PathVariable Long id) {
        return planRepository.findById(id)
                .map(plan -> {
                    plan.setTitle(newPlan.getTitle());
                    plan.setDescription(newPlan.getDescription());
                    plan.setDuration(newPlan.getDuration());
                    plan.setPublic(newPlan.isPublic());
                    plan.setMeals(newPlan.getMeals());
                    return planRepository.save(plan);
                })
                .orElseThrow(() -> new PlanNotFoundException(id));
    }
}
