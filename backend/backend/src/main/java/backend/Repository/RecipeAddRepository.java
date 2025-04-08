package backend.Repository;

import backend.Model.RecipeAddModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeAddRepository extends JpaRepository<RecipeAddModel, Long> {
    // Basic CRUD operations are provided by JpaRepository
    // You can add custom query methods here if needed
}