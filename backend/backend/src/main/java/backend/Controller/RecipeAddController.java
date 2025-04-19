package backend.Controller;

import backend.Exception.RecipeNotFoundException;
import backend.Model.RecipeAddModel;
import backend.Repository.RecipeAddRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/recipes")
public class RecipeAddController {

    @Autowired
    private RecipeAddRepository recipeAddRepository;

    private final String UPLOAD_DIR = "src/main/resources/static/uploads/";

    @PostMapping
    public RecipeAddModel newRecipe(@RequestBody RecipeAddModel newRecipe) {
        return recipeAddRepository.save(newRecipe);
    }

    @PostMapping("/recipeImg")
    public String recipeImage(@RequestParam("file") MultipartFile file) {
        String fileName = file.getOriginalFilename();
        File uploadDir = new File(UPLOAD_DIR);

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        try {
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            file.transferTo(filePath);
            return "{\"filename\": \"" + fileName + "\"}";
        } catch (IOException e) {
            e.printStackTrace();
            return "{\"error\": \"Error uploading file\"}";
        }
    }

    @GetMapping
    public List<RecipeAddModel> getAllRecipes() {
        return recipeAddRepository.findAll();
    }

    @GetMapping("/{id}")
    public RecipeAddModel getRecipeById(@PathVariable Long id) {
        return recipeAddRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));
    }

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<FileSystemResource> getImage(@PathVariable String filename) {
        File file = new File(UPLOAD_DIR + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new FileSystemResource(file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        if (recipeAddRepository.existsById(id)) {
            recipeAddRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeAddModel> updateRecipe(
            @PathVariable Long id,
            @RequestBody RecipeAddModel updatedRecipe) {
        return recipeAddRepository.findById(id)
                .map(recipe -> {
                    recipe.setTitle(updatedRecipe.getTitle());
                    recipe.setDescription(updatedRecipe.getDescription());
                    recipe.setPrepTime(updatedRecipe.getPrepTime());
                    recipe.setCookTime(updatedRecipe.getCookTime());
                    recipe.setDifficulty(updatedRecipe.getDifficulty());
                    recipe.setIngredients(updatedRecipe.getIngredients());
                    recipe.setInstructions(updatedRecipe.getInstructions());
                    recipe.setRecipeImage(updatedRecipe.getRecipeImage());
                    return ResponseEntity.ok(recipeAddRepository.save(recipe));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}