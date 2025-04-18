package backend.Repository;


import backend.Model.CreateCookingPlanModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreateCookingPlanRepository extends JpaRepository<CreateCookingPlanModel, Long> {
}
