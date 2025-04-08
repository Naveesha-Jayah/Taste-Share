package backend.Controller;

import backend.Model.RecipeAddModel;
import backend.Repository.RecipeAddRepository;
import backend.Exception.RecipeNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/recipes")
public class RecipeAddController {

    @Autowired
    private RecipeAddRepository recipeRepository;

    @PostMapping
    public RecipeAddModel createRecipe(@RequestBody RecipeAddModel recipe) {
        validateMediaCount(recipe);
        return recipeRepository.save(recipe);
    }

    @GetMapping
    public List<RecipeAddModel> getAllRecipes() {
        return recipeRepository.findAll();
    }

    @GetMapping("/{id}")
    public RecipeAddModel getRecipeById(@PathVariable Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));
    }

    @PutMapping("/{id}")
    public RecipeAddModel updateRecipe(@RequestBody RecipeAddModel newRecipe, @PathVariable Long id) {
        return recipeRepository.findById(id)
                .map(recipe -> {
                    recipe.setTitle(newRecipe.getTitle());
                    recipe.setDescription(newRecipe.getDescription());
                    validateMediaCount(newRecipe);
                    recipe.setMedia(newRecipe.getMedia());
                    recipe.setPrepTime(newRecipe.getPrepTime());
                    recipe.setCookTime(newRecipe.getCookTime());
                    recipe.setSavings(newRecipe.getSavings());
                    recipe.setDifficulty(newRecipe.getDifficulty());
                    recipe.setIngredients(newRecipe.getIngredients());
                    recipe.setInstructions(newRecipe.getInstructions());
                    return recipeRepository.save(recipe);
                })
                .orElseThrow(() -> new RecipeNotFoundException(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id) {
        if (!recipeRepository.existsById(id)) {
            throw new RecipeNotFoundException(id);
        }
        recipeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/media")
    public RecipeAddModel addMedia(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        RecipeAddModel recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));

        validateMediaCount(recipe);
        validateMediaFile(file);

        RecipeAddModel.Media media = new RecipeAddModel.Media();
        media.setUrl("http://example.com/media/" + file.getOriginalFilename());
        media.setType(file.getContentType().startsWith("video") ?
                RecipeAddModel.Media.MediaType.VIDEO : RecipeAddModel.Media.MediaType.IMAGE);
        media.setSize(file.getSize());

        recipe.getMedia().add(media);
        return recipeRepository.save(recipe);
    }

    @DeleteMapping("/{recipeId}/media/{mediaIndex}")
    public RecipeAddModel removeMedia(
            @PathVariable Long recipeId,
            @PathVariable int mediaIndex) {

        RecipeAddModel recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException(recipeId));

        if (mediaIndex < 0 || mediaIndex >= recipe.getMedia().size()) {
            throw new RecipeNotFoundException("Invalid media index");
        }

        recipe.getMedia().remove(mediaIndex);
        return recipeRepository.save(recipe);
    }

    private void validateMediaCount(RecipeAddModel recipe) {
        if (recipe.getMedia() != null && recipe.getMedia().size() > 3) {
            throw new RecipeNotFoundException("Maximum 3 media files allowed per recipe");
        }
    }

    private void validateMediaFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RecipeNotFoundException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                (!contentType.startsWith("image/") && !contentType.startsWith("video/"))) {
            throw new RecipeNotFoundException("Only images and videos are allowed");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RecipeNotFoundException("File size exceeds 10MB limit");
        }
    }
}