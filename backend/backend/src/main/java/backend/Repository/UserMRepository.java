package backend.Repository;

import backend.Model.UserMModel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserMRepository extends JpaRepository<UserMModel, Long> {
    Optional<UserMModel> findByEmailAddress(String emailAddress);
    Optional<UserMModel> findByProviderAndProviderId(String provider, String providerId);
}