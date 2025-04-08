package backend.Model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class RecipeAddModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "recipe_media", joinColumns = @JoinColumn(name = "recipe_id"))
    private List<Media> media = new ArrayList<>();

    private int prepTime;
    private int cookTime;
    private String savings;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @ElementCollection
    @CollectionTable(name = "recipe_ingredients", joinColumns = @JoinColumn(name = "recipe_id"))
    private List<Ingredient> ingredients = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "recipe_instructions", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "instruction", columnDefinition = "TEXT")
    private List<String> instructions = new ArrayList<>();

    @Embeddable
    public static class Ingredient {
        private String amount;
        private String name;

        public String getAmount() { return amount; }
        public void setAmount(String amount) { this.amount = amount; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    @Embeddable
    public static class Media {
        private String url;
        private MediaType type;
        private long size;
        private Double duration;

        public enum MediaType {
            IMAGE, VIDEO
        }

        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        public MediaType getType() { return type; }
        public void setType(MediaType type) { this.type = type; }
        public long getSize() { return size; }
        public void setSize(long size) { this.size = size; }
        public Double getDuration() { return duration; }
        public void setDuration(Double duration) { this.duration = duration; }
    }

    public enum Difficulty {
        EASY, MEDIUM, HARD
    }

    public RecipeAddModel() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<Media> getMedia() { return media; }
    public void setMedia(List<Media> media) { this.media = media; }
    public int getPrepTime() { return prepTime; }
    public void setPrepTime(int prepTime) { this.prepTime = prepTime; }
    public int getCookTime() { return cookTime; }
    public void setCookTime(int cookTime) { this.cookTime = cookTime; }
    public String getSavings() { return savings; }
    public void setSavings(String savings) { this.savings = savings; }
    public Difficulty getDifficulty() { return difficulty; }
    public void setDifficulty(Difficulty difficulty) { this.difficulty = difficulty; }
    public List<Ingredient> getIngredients() { return ingredients; }
    public void setIngredients(List<Ingredient> ingredients) { this.ingredients = ingredients; }
    public List<String> getInstructions() { return instructions; }
    public void setInstructions(List<String> instructions) { this.instructions = instructions; }
}