package backend.Exception;

public class PlanNotFoundException extends RuntimeException {
    public PlanNotFoundException(Long id) {
        super("Meal plan not found with id: " + id);
    }
}
