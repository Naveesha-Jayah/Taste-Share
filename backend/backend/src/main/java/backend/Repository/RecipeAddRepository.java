package backend.Repository;



import backend.Model.RecipeAddModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecipeAddRepository extends JpaRepository<RecipeAddModel, Long> {
}