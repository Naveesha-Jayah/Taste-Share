package backend.Repository;

import backend.Model.challengeModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface challengeRepository extends JpaRepository<challengeModel,Long> {
}
