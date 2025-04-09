package backend.Model;

import jakarta.persistence.*;
import java.util.Map;

@Entity
public class CreateCookingPlanModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private int duration;
    private boolean isPublic;

    @ElementCollection
    @CollectionTable(name = "plan_meals", joinColumns = @JoinColumn(name = "plan_id"))
    @MapKeyColumn(name = "day_meal_key")
    @Column(name = "recipe_title")
    private Map<String, String> meals;

    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public int getDuration() { return duration; }

    public void setDuration(int duration) { this.duration = duration; }

    public boolean isPublic() { return isPublic; }

    public void setPublic(boolean aPublic) { isPublic = aPublic; }

    public Map<String, String> getMeals() { return meals; }

    public void setMeals(Map<String, String> meals) { this.meals = meals; }
}
